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

export default function PushupPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [net, setNet] = useState(null);
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState("Loading model...");
  const [down, setDown] = useState(false);
  const [dormant, setDormant] = useState(false); // Dormant mode
  const [started, setStarted] = useState(false); // Registered initial length
  const detectedPartsRef = useRef({});
  const lastCountTimeRef = useRef(0);
  const lastMotionTimeRef = useRef(Date.now());
  const leftDistances = useRef([]);
  const rightDistances = useRef([]);
  const initialLeftDistRef = useRef(null);
  const initialRightDistRef = useRef(null);

  // --- CONFIGURABLES ---
  const SMOOTH_WINDOW = 6;
  const DOWN_RATIO = 2 / 3; // Down is when wrist-shoulder is 2/3 of initial
  const UP_RATIO = 0.9;     // Up is when wrist-shoulder returns to near initial
  const DELTA = 0.07;       // Generous delta for thresholds (7%)
  const COUNT_COOLDOWN = 600; // ms
  const MOTION_THRESHOLD = 8; // px, min change in distance to consider as motion
  const MOTION_FRAME_WINDOW = 8; // frames for motion
  const MOTION_MIN_FRAMES = 4; // minimum number of moving frames in window to be considered "active"
  const DORMANT_TIME = 4000; // ms, time of no motion to enter dormant mode

  // Toast flags
  const dormantToastRef = useRef(false);
  const resumeToastRef = useRef(false);
  const downToastRef = useRef(false);
  const upToastRef = useRef(false);
  const initialToastRef = useRef(false);

  // Used to prevent counting when in dormant mode or when there's no motion
  const lastActiveDownRef = useRef(false);

  // Motion buffer to track recent activity (for anti-stillness detection)
  const motionBufferRef = useRef([]);

  // Load PoseNet
  useEffect(() => {
    async function loadModel() {
      setStatus("Loading model...");
      const model = await posenet.load();
      setNet(model);
      setStatus("Model ready!");
    }
    loadModel();
  }, []);

  // Webcam setup
  useEffect(() => {
    async function setupCamera() {
      if (!videoRef.current) return;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      videoRef.current.srcObject = stream;
    }
    setupCamera();
  }, []);

  useEffect(() => {
    let animationId;
    let lastAvgDist = null;
    let lastSignificantMotion = Date.now();

    async function detectPose() {
      if (
        net &&
        videoRef.current &&
        videoRef.current.readyState === 4
      ) {
        const video = videoRef.current;
        const pose = await net.estimateSinglePose(video, {
          flipHorizontal: true,
        });

        // Toasts for detected parts (once per session)
        pose.keypoints.forEach((kp) => {
          if (kp.score > 0.7 && !detectedPartsRef.current[kp.part]) {
            detectedPartsRef.current[kp.part] = true;
            toast.success(`Detected: ${kp.part}`, { id: `kp-${kp.part}` });
          }
        });

        // Draw keypoints and skeleton
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        pose.keypoints.forEach((kp) => {
          if (kp.score > 0.7) {
            ctx.beginPath();
            ctx.arc(kp.position.x, kp.position.y, 8, 0, 2 * Math.PI);
            ctx.fillStyle = "#00ff00";
            ctx.fill();
            ctx.font = "12px Arial";
            ctx.fillStyle = "#000"; // Set all font to black
            ctx.fillText(kp.part, kp.position.x + 10, kp.position.y - 10);
          }
        });
        function drawLine(a, b) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = "#00bfff";
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        const kp = pose.keypoints.reduce((acc, k) => { acc[k.part] = k; return acc; }, {});
        if (kp.leftShoulder && kp.leftWrist && kp.leftShoulder.score > 0.7 && kp.leftWrist.score > 0.7) {
          drawLine(kp.leftShoulder.position, kp.leftWrist.position);
        }
        if (kp.rightShoulder && kp.rightWrist && kp.rightShoulder.score > 0.7 && kp.rightWrist.score > 0.7) {
          drawLine(kp.rightShoulder.position, kp.rightWrist.position);
        }

        // Pushup counting logic using shoulder-wrist distance
        const leftShoulder = kp.leftShoulder?.position;
        const leftWrist = kp.leftWrist?.position;
        const rightShoulder = kp.rightShoulder?.position;
        const rightWrist = kp.rightWrist?.position;

        function dist(a, b) {
          if (!a || !b) return 0;
          return Math.hypot(a.x - b.x, a.y - b.y);
        }

        // Only use distances if all keypoints are high confidence
        if (
          kp.leftShoulder?.score > 0.7 && kp.leftWrist?.score > 0.7 &&
          kp.rightShoulder?.score > 0.7 && kp.rightWrist?.score > 0.7
        ) {
          const leftDist = dist(leftShoulder, leftWrist);
          const rightDist = dist(rightShoulder, rightWrist);
          leftDistances.current.push(leftDist);
          rightDistances.current.push(rightDist);

          // On first detection, set the initial distances
          if (initialLeftDistRef.current === null && leftDistances.current.length > SMOOTH_WINDOW) {
            initialLeftDistRef.current = movingAverage(leftDistances.current, SMOOTH_WINDOW);
          }
          if (initialRightDistRef.current === null && rightDistances.current.length > SMOOTH_WINDOW) {
            initialRightDistRef.current = movingAverage(rightDistances.current, SMOOTH_WINDOW);
          }

          // Display "START" when both initial distances are registered and only once
          if (
            initialLeftDistRef.current !== null &&
            initialRightDistRef.current !== null &&
            !started
          ) {
            setStarted(true);
            if (!initialToastRef.current) {
              toast.success('Initial position registered! Start your pushups.', { icon: "🏁", id: "initial" });
              initialToastRef.current = true;
            }
          }

          // Smoothing
          const smoothLeftDist = movingAverage(leftDistances.current, SMOOTH_WINDOW);
          const smoothRightDist = movingAverage(rightDistances.current, SMOOTH_WINDOW);

          // Use average of both arms
          const avgDist = (smoothLeftDist + smoothRightDist) / 2;
          const initialAvgDist = (
            (initialLeftDistRef.current ?? smoothLeftDist) +
            (initialRightDistRef.current ?? smoothRightDist)
          ) / 2;

          // --- MOTION DETECTION: Fill buffer with recent frame motions ---
          let motion = 0;
          if (lastAvgDist !== null) {
            motion = Math.abs(avgDist - lastAvgDist);
          }
          lastAvgDist = avgDist;
          // Update buffer (fixed size)
          const buffer = motionBufferRef.current;
          buffer.push(motion > MOTION_THRESHOLD);
          if (buffer.length > MOTION_FRAME_WINDOW) buffer.shift();

          // Count "active" frames in buffer
          const activeFrames = buffer.filter(Boolean).length;
          const isActive = activeFrames >= MOTION_MIN_FRAMES;

          // Dormant mode logic: detect lack of movement
          if (isActive) {
            lastMotionTimeRef.current = Date.now();
            // Only show resume toast once per dormant period
            if (dormant && !resumeToastRef.current) {
              setDormant(false);
              resumeToastRef.current = true;
              dormantToastRef.current = false; // reset dormant toast for next cycle
              toast("Resumed pushup detection.", { icon: "🔄", id: "resume" });
            }
          }
          if (!dormant && Date.now() - lastMotionTimeRef.current > DORMANT_TIME) {
            setDormant(true);
            if (!dormantToastRef.current) {
              dormantToastRef.current = true;
              resumeToastRef.current = false; // reset resume toast for next cycle
              toast("No motion detected. Entered dormant mode.", { icon: "😴", id: "dormant" });
            }
          }

          // Only count pushups when not dormant, initial distance is set, user has started, and active motion detected
          const canCountPushups =
            !dormant &&
            initialLeftDistRef.current &&
            initialRightDistRef.current &&
            started &&
            isActive;

          if (canCountPushups) {
            // Down: wrist-shoulder distance reduced to 2/3 (+/- delta)
            if ((avgDist / initialAvgDist) < DOWN_RATIO + DELTA && !down) {
              setDown(true);
              if (!downToastRef.current) {
                toast("Down position detected.", { icon: "⬇️", id: "down" });
                downToastRef.current = true;
                upToastRef.current = false;
              }
              lastActiveDownRef.current = true;
            }
            // Up: wrist-shoulder distance returns to near starting (+/- delta)
            if ((avgDist / initialAvgDist) > UP_RATIO - DELTA && down && lastActiveDownRef.current) {
              const now = Date.now();
              if (now - lastCountTimeRef.current > COUNT_COOLDOWN) {
                setCount((c) => c + 1);
                setDown(false);
                toast(`Pushup counted! Total: ${count + 1}`, { icon: "💪", id: `pushup-${count + 1}` });
                if (!upToastRef.current) {
                  toast("Up position detected.", { icon: "⬆️", id: "up" });
                  upToastRef.current = true;
                  downToastRef.current = false;
                }
                lastCountTimeRef.current = now;
                lastActiveDownRef.current = false;
              }
            }
          } else {
            // If in dormant mode or not enough motion, reset lastActiveDownRef so counter can't progress
            lastActiveDownRef.current = false;
            // Reset state change toasts to allow retrigger on next genuine rep
            downToastRef.current = false;
            upToastRef.current = false;
          }
        }
      }
      animationId = requestAnimationFrame(detectPose);
    }
    detectPose();
    return () => cancelAnimationFrame(animationId);
  }, [net, down, count, dormant, started]);

  // Resize canvas to match video
  useEffect(() => {
    function resizeCanvas() {
      if (videoRef.current && canvasRef.current) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
      }
    }
    if (videoRef.current) {
      videoRef.current.onloadedmetadata = resizeCanvas;
    }
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div style={{
      textAlign: "center",
      marginTop: 40,
      color: "#000", // Set all font to black
      fontFamily: "system-ui, Arial, sans-serif"
    }}>
      <Toaster position="top-center" />
      <h1 style={{ color: "#000" }}>Pushup AI Tracker (PoseNet)</h1>
      <p style={{ color: "#000" }}>{status}</p>
      <div style={{ position: "relative", display: "inline-block" }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          width={480}
          height={360}
          style={{
            border: "2px solid #333",
            borderRadius: 8,
            transform: "scaleX(-1)",
            margin: "0 auto",
            display: "block",
          }}
        />
        <canvas
          ref={canvasRef}
          width={480}
          height={360}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        />
        {/* Display "START" overlay when initial posture is registered */}
        {started && (
          <div style={{
            position: "absolute",
            top: 20,
            left: 0,
            width: "100%",
            color: "#000",
            fontWeight: "bold",
            fontSize: "2.2rem",
            textAlign: "center",
            pointerEvents: "none",
            textShadow: "0 1px 6px #fff"
          }}>
            START
          </div>
        )}
      </div>
      <h2 style={{ fontSize: "2rem", marginTop: 20, color: "#000" }}>
        Pushups: {count}
      </h2>
      <div style={{
        maxWidth: 480,
        margin: "24px auto",
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
          <li>Make sure your whole body, especially arms, is visible in the webcam frame, viewed from the side.</li>
          <li>
            <b>Hold the up/plank position for a second until you see <span style={{color: "#000", fontWeight: "bold"}}>START</span> appear, before beginning your pushups.</b>
          </li>
          <li>Start in a plank position, arms fully extended.</li>
          <li>Lower your body until your shoulders approach your wrists (distance between shoulder and wrist becomes about 2/3 of the starting position).</li>
          <li>Push back up until arms are straight (shoulder-wrist distance returns to normal). Each full up-down counts as one pushup.</li>
          <li>Move smoothly. Avoid pausing mid-rep or moving too fast.</li>
          <li>Green dots and lines show detected body parts and skeleton. Toasts confirm each new detected part and every pushup counted.</li>
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
          Dormant mode: No motion detected. Move to resume pushup detection.
        </div>
      )}
    </div>
  );
}