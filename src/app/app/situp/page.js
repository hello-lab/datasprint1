"use client";
import React, { useRef, useState, useEffect } from "react";
import * as posenet from "@tensorflow-models/posenet";
import "@tensorflow/tfjs-backend-webgl";
import toast, { Toaster } from "react-hot-toast";

// Helper: moving average for smoothing
function movingAverage(arr, windowSize) {
  if (arr.length < windowSize) return arr[arr.length - 1];
  const window = arr.slice(-windowSize);
  return window.reduce((a, b) => a + b, 0) / window.length;
}

export default function SitupTrackerFrontView() {
  const VIDEO_W = 480;
  const VIDEO_H = 360;

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [net, setNet] = useState(null);
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState("Loading model...");
  const [down, setDown] = useState(false);
  const [started, setStarted] = useState(false);
  const [calibrating, setCalibrating] = useState(false);

  const detectedPartsRef = useRef({});
  const lastCountTimeRef = useRef(0);

  // Calibration buffer
  const distBuffer = useRef([]);
  const initialDistRef = useRef(null);

  // Dormant/alert logic
  const dormantToastRef = useRef(false);
  const resumeToastRef = useRef(false);
  const downToastRef = useRef(false);
  const upToastRef = useRef(false);
  const lastActiveDownRef = useRef(false);
  const motionBufferRef = useRef([]);
  const lastMotionTimeRef = useRef(Date.now());
  const [dormant, setDormant] = useState(false);

  // Configs
  const SMOOTH_WINDOW = 6;
  const CALIBRATION_FRAMES = 24;
  const CALIBRATION_MOTION_MAX = 3; // px, ensure stillness
  const UP_RATIO = 1.1;    // sitting up: close to initial distance
  const DOWN_RATIO = 2.5;  // lying down: nose much further from hips
  const DELTA = 0.08;
  const COUNT_COOLDOWN = 700;
  const MOTION_THRESHOLD = 8;
  const MOTION_FRAME_WINDOW = 8;
  const MOTION_MIN_FRAMES = 3;
  const DORMANT_TIME = 4000;

  // Reset state when mounting
  useEffect(() => {
    setCount(0);
    setDown(false);
    setDormant(false);
    setStarted(false);
    setCalibrating(false);
    distBuffer.current = [];
    initialDistRef.current = null;
    motionBufferRef.current = [];
    dormantToastRef.current = false;
    resumeToastRef.current = false;
    downToastRef.current = false;
    upToastRef.current = false;
    lastActiveDownRef.current = false;
    lastMotionTimeRef.current = Date.now();
  }, []);

  // Load PoseNet
  useEffect(() => {
    let cancelled = false;
    async function loadModel() {
      setStatus("Loading model...");
      try {
        const model = await posenet.load();
        if (!cancelled) {
          setNet(model);
          setStatus("Model is ready!");
        }
      } catch (err) {
        setStatus("Model failed to load");
      }
    }
    loadModel();
    return () => { cancelled = true; };
  }, []);

  // Webcam setup
  useEffect(() => {
    let stream;
    async function setupCamera() {
      try {
        if (!videoRef.current) return;
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: VIDEO_W, height: VIDEO_H, facingMode: "user" },
          audio: false,
        });
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
      } catch (err) {
        setStatus("Could not access webcam");
      }
    }
    setupCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Keep canvas synced with video
  useEffect(() => {
    function resizeCanvas() {
      if (videoRef.current && canvasRef.current) {
        canvasRef.current.width = VIDEO_W;
        canvasRef.current.height = VIDEO_H;
      }
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // Calibration logic
  useEffect(() => {
    let animationId;

    async function calibratePose() {
      if (
        net &&
        videoRef.current &&
        videoRef.current.readyState >= 2 &&
        calibrating
      ) {
        const video = videoRef.current;
        const pose = await net.estimateSinglePose(video, { flipHorizontal: true });

        // Collect nose-hips vertical distance for calibration (sitting up)
        const kp = pose.keypoints.reduce((acc, k) => { acc[k.part] = k; return acc; }, {});
        const nose = kp.nose?.position;
        const leftHip = kp.leftHip?.position;
        const rightHip = kp.rightHip?.position;
        function avg(a, b) {
          if (!a || !b) return null;
          return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        }
        function verticalDist(a, b) {
          if (!a || !b) return 0;
          return Math.abs(a.y - b.y);
        }

        const avgHip = avg(leftHip, rightHip);

        if (
          kp.nose?.score > 0.7 &&
          kp.leftHip?.score > 0.7 &&
          kp.rightHip?.score > 0.7
        ) {
          distBuffer.current.push(verticalDist(nose, avgHip));
        }

        // Stillness check: ensure user is not moving
        const motion = distBuffer.current.length > 1
          ? Math.abs(distBuffer.current[distBuffer.current.length - 1] - distBuffer.current[distBuffer.current.length - 2])
          : 0;
        const stillEnough = motion < CALIBRATION_MOTION_MAX;

        // If enough frames and still, finish calibration and start tracking
        if (
          distBuffer.current.length >= CALIBRATION_FRAMES &&
          stillEnough
        ) {
          initialDistRef.current = movingAverage(distBuffer.current, SMOOTH_WINDOW);
          setStarted(true);
          setCalibrating(false);
          toast.success("Calibration complete! Begin your situps.", { icon: "🏁", id: "initial" });
        } else {
          animationId = requestAnimationFrame(calibratePose);
        }
      }
    }
    if (calibrating) calibratePose();
    return () => cancelAnimationFrame(animationId);
  }, [net, calibrating]);

  // Main detection and logic
  useEffect(() => {
    let animationId;
    let lastDist = null;
    if (!started) return;

    async function detectPose() {
      if (
        net &&
        videoRef.current &&
        videoRef.current.readyState >= 2
      ) {
        const video = videoRef.current;
        const pose = await net.estimateSinglePose(video, { flipHorizontal: true });

        // Toasts for detected parts (once per session)
        pose.keypoints.forEach((kp) => {
          if (kp.score > 0.7 && !detectedPartsRef.current[kp.part]) {
            detectedPartsRef.current[kp.part] = true;
            toast.success(`Detected: ${kp.part}`, { id: `kp-${kp.part}` });
          }
        });

        // Draw keypoints and skeleton (mirrored)
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          pose.keypoints.forEach((kp) => {
            if (kp.score > 0.7) {
              ctx.beginPath();
              ctx.arc(VIDEO_W - kp.position.x, kp.position.y, 8, 0, 2 * Math.PI);
              ctx.fillStyle = "#00ff00";
              ctx.fill();
              ctx.font = "12px Arial";
              ctx.fillStyle = "#000";
              ctx.fillText(kp.part, VIDEO_W - kp.position.x + 10, kp.position.y - 10);
            }
          });
          function drawLine(a, b) {
            ctx.beginPath();
            ctx.moveTo(VIDEO_W - a.x, a.y);
            ctx.lineTo(VIDEO_W - b.x, b.y);
            ctx.strokeStyle = "#00bfff";
            ctx.lineWidth = 3;
            ctx.stroke();
          }
          const kp = pose.keypoints.reduce((acc, k) => { acc[k.part] = k; return acc; }, {});
          if (kp.nose && kp.leftHip && kp.nose.score > 0.7 && kp.leftHip.score > 0.7) {
            drawLine(kp.nose.position, kp.leftHip.position);
          }
          if (kp.nose && kp.rightHip && kp.nose.score > 0.7 && kp.rightHip.score > 0.7) {
            drawLine(kp.nose.position, kp.rightHip.position);
          }
        }

        // --- KEYPOINTS ---
        const kp = pose.keypoints.reduce((acc, k) => { acc[k.part] = k; return acc; }, {});
        const nose = kp.nose?.position;
        const leftHip = kp.leftHip?.position;
        const rightHip = kp.rightHip?.position;
        function avg(a, b) {
          if (!a || !b) return null;
          return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        }
        function verticalDist(a, b) {
          if (!a || !b) return 0;
          return Math.abs(a.y - b.y);
        }
        const avgHip = avg(leftHip, rightHip);

        if (
          kp.nose?.score > 0.7 &&
          kp.leftHip?.score > 0.7 &&
          kp.rightHip?.score > 0.7 &&
          initialDistRef.current
        ) {
          const dist = verticalDist(nose, avgHip);
          const initialDist = initialDistRef.current;

          // Motion detection
          let motion = 0;
          if (lastDist !== null) {
            motion = Math.abs(dist - lastDist);
          }
          lastDist = dist;
          const buffer = motionBufferRef.current;
          buffer.push(motion > MOTION_THRESHOLD);
          if (buffer.length > MOTION_FRAME_WINDOW) buffer.shift();
          const activeFrames = buffer.filter(Boolean).length;
          const isActive = activeFrames >= MOTION_MIN_FRAMES;

          // Dormant logic
          if (isActive) {
            lastMotionTimeRef.current = Date.now();
            if (dormant && !resumeToastRef.current) {
              setDormant(false);
              resumeToastRef.current = true;
              dormantToastRef.current = false;
              toast("Resumed situp detection.", { icon: "🔄", id: "resume" });
            }
          }
          if (!dormant && Date.now() - lastMotionTimeRef.current > DORMANT_TIME) {
            setDormant(true);
            if (!dormantToastRef.current) {
              dormantToastRef.current = true;
              resumeToastRef.current = false;
              toast("No motion detected. Entered dormant mode.", { icon: "😴", id: "dormant" });
            }
          }

          // --- STATE LOGIC ---
          // DOWN: dist > initialDist * DOWN_RATIO, UP: dist < initialDist * UP_RATIO
          if (dist > initialDist * DOWN_RATIO - DELTA && !down) {
            setDown(true);
            toast("Down position detected.", { icon: "⬇️", id: "down" });
            lastActiveDownRef.current = true;
          }
          if (dist < initialDist * UP_RATIO + DELTA && down && lastActiveDownRef.current) {
            const now = Date.now();
            if (now - lastCountTimeRef.current > COUNT_COOLDOWN) {
              setCount((c) => c + 1);
              setDown(false);
              toast(`Situp counted! Total: ${count + 1}`, { icon: "🧑‍🎓", id: `situp-${count + 1}` });
              toast("Up position detected.", { icon: "⬆️", id: "up" });
              lastCountTimeRef.current = now;
              lastActiveDownRef.current = false;
            }
          }
        }
      }
      animationId = requestAnimationFrame(detectPose);
    }
    if (started) detectPose();
    return () => cancelAnimationFrame(animationId);
  }, [net, down, count, dormant, started]);

  // --- UI ---
  return (
    <div style={{
      textAlign: "center",
      marginTop: 40,
      color: "#000",
      fontFamily: "system-ui, Arial, sans-serif"
    }}>
      <Toaster position="top-right" />
      <div style={{ fontSize: "1.2rem", marginBottom: 5, color: "#000" }}>
        {status}
      </div>
      <h2 style={{ fontSize: "2.5rem", marginBottom: 8, color: "#000" }}>
        Situps: {count}
      </h2>
      <div style={{ position: "relative", display: "inline-block" }}>
        <video
          ref={videoRef}
          width={VIDEO_W}
          height={VIDEO_H}
          autoPlay
          playsInline
          muted
          style={{
            border: "2px solid #333",
            borderRadius: 8,
            transform: "scaleX(-1)",
            margin: "0 auto",
            display: "block",
            background: "#222"
          }}
        />
        <canvas
          ref={canvasRef}
          width={VIDEO_W}
          height={VIDEO_H}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        />
      </div>
      {!started && !calibrating && net &&
        <div style={{ margin: "22px 0 10px 0" }}>
          <button
            style={{
              padding: "16px 32px",
              borderRadius: 8,
              fontWeight: "bold",
              fontSize: "1.5rem",
              background: "#aae",
              color: "#000",
              border: "2px solid #333",
              cursor: "pointer",
            }}
            onClick={() => {
              setCalibrating(true);
              distBuffer.current = [];
              initialDistRef.current = null;
              toast("Sit up straight for calibration, keep still...", { icon: "⏳", id: "calib" });
            }}
          >
            Start
          </button>
          <div style={{ marginTop: 10, fontSize: "1.1rem" }}>
            After pressing Start, sit up straight and keep still for a few seconds!
          </div>
        </div>
      }
      {calibrating && (
        <div style={{
          margin: "22px 0 10px 0",
          fontSize: "2rem",
          fontWeight: "bold",
          color: "#000"
        }}>
          Calibrating...
          <div style={{ fontSize: "1.1rem", marginTop: 8 }}>
            Sit up and keep still
          </div>
        </div>
      )}
      <div style={{
        maxWidth: 480,
        margin: "12px auto 24px auto",
        textAlign: "left",
        background: "#f6f8fa",
        borderRadius: 8,
        padding: 16,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        fontSize: "1rem",
        color: "#000"
      }}>
        <b>How to use:</b>
        <ul>
          <li>Wait until the <b>Model is ready</b> message appears.</li>
          <li>Press <b>Start</b>, then <b>sit up straight and keep still</b> for calibration.</li>
          <li>After you see "Calibration complete", begin your situps!</li>
          <li>Each full situp (lying back and returning to sitting up) counts as one rep.</li>
          <li>Move smoothly, avoid pausing mid-rep or moving too fast.</li>
          <li>Green dots and lines show detected body parts and skeleton. Toasts confirm each detected part and every situp counted.</li>
          <li>If you stay still for a few seconds, the app will enter dormant mode to prevent false counts. Move again to resume!</li>
          <li>For best results, use good lighting and avoid cluttered backgrounds.</li>
        </ul>
        <b>Tip:</b> If counts jump, adjust camera angle, lighting, or slow your movement.
      </div>
      {dormant && (
        <div style={{
          color: "#000",
          marginTop: 20,
          fontWeight: "bold",
          fontSize: "1.1rem"
        }}>
          Dormant mode: No motion detected. Move to resume situp detection.
        </div>
      )}
    </div>
  );
}