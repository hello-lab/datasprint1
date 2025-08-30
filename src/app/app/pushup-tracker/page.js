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
  const detectedPartsRef = useRef({});
  const lastCountTimeRef = useRef(0);
  const lastMotionTimeRef = useRef(Date.now());
  const leftAngles = useRef([]);
  const rightAngles = useRef([]);
  const SMOOTH_WINDOW = 6;
  const DOWN_THRESHOLD = 90;
  const UP_THRESHOLD = 165;
  const COUNT_COOLDOWN = 600; // ms
  const MOTION_THRESHOLD = 8; // degrees, min change in angle to consider as motion
  const DORMANT_TIME = 4000; // ms, time of no motion to enter dormant mode

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

  // Show degrees and up/down status
  useEffect(() => {
    const interval = setInterval(() => {
      const left = leftAngles.current.length
        ? movingAverage(leftAngles.current, SMOOTH_WINDOW).toFixed(1)
        : "--";
      const right = rightAngles.current.length
        ? movingAverage(rightAngles.current, SMOOTH_WINDOW).toFixed(1)
        : "--";
      const avg =
        left !== "--" && right !== "--"
          ? ((parseFloat(left) + parseFloat(right)) / 2).toFixed(1)
          : "--";
      const statusText =
        avg !== "--"
          ? avg < DOWN_THRESHOLD
            ? "Down"
            : avg > UP_THRESHOLD
            ? "Up"
            : "Moving"
          : "";
      const el = document.getElementById("angle-status");
      if (el) {
        el.textContent = `Left: ${left}°, Right: ${right}°, Avg: ${avg}° — ${statusText}`;
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Pose detection, drawing, counting, dormant logic
  useEffect(() => {
    let animationId;
    let lastAvgAngle = null;
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
            toast.success(`Detected: ${kp.part}`);
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
        if (kp.leftShoulder && kp.leftElbow && kp.leftShoulder.score > 0.7 && kp.leftElbow.score > 0.7) {
          drawLine(kp.leftShoulder.position, kp.leftElbow.position);
        }
        if (kp.leftElbow && kp.leftWrist && kp.leftElbow.score > 0.7 && kp.leftWrist.score > 0.7) {
          drawLine(kp.leftElbow.position, kp.leftWrist.position);
        }
        if (kp.rightShoulder && kp.rightElbow && kp.rightShoulder.score > 0.7 && kp.rightElbow.score > 0.7) {
          drawLine(kp.rightShoulder.position, kp.rightElbow.position);
        }
        if (kp.rightElbow && kp.rightWrist && kp.rightElbow.score > 0.7 && kp.rightWrist.score > 0.7) {
          drawLine(kp.rightElbow.position, kp.rightWrist.position);
        }

        // Pushup counting logic with smoothing, hysteresis, cooldown, and dormant mode
        const leftShoulder = kp.leftShoulder?.position;
        const leftElbow = kp.leftElbow?.position;
        const leftWrist = kp.leftWrist?.position;
        const rightShoulder = kp.rightShoulder?.position;
        const rightElbow = kp.rightElbow?.position;
        const rightWrist = kp.rightWrist?.position;

        function angle(a, b, c) {
          if (!a || !b || !c) return 180;
          const ab = { x: a.x - b.x, y: a.y - b.y };
          const cb = { x: c.x - b.x, y: c.y - b.y };
          const dot = ab.x * cb.x + ab.y * cb.y;
          const magAB = Math.hypot(ab.x, ab.y);
          const magCB = Math.hypot(cb.x, cb.y);
          return (Math.acos(dot / (magAB * magCB)) * 180) / Math.PI;
        }

        if (
          kp.leftShoulder?.score > 0.7 && kp.leftElbow?.score > 0.7 && kp.leftWrist?.score > 0.7 &&
          kp.rightShoulder?.score > 0.7 && kp.rightElbow?.score > 0.7 && kp.rightWrist?.score > 0.7
        ) {
          const leftAngle = angle(leftShoulder, leftElbow, leftWrist);
          const rightAngle = angle(rightShoulder, rightElbow, rightWrist);
          leftAngles.current.push(leftAngle);
          rightAngles.current.push(rightAngle);

          // Smoothing
          const smoothLeftAngle = movingAverage(leftAngles.current, SMOOTH_WINDOW);
          const smoothRightAngle = movingAverage(rightAngles.current, SMOOTH_WINDOW);
          const avgAngle = (smoothLeftAngle + smoothRightAngle) / 2;

          // Dormant mode logic: detect lack of movement
          if (lastAvgAngle !== null && Math.abs(avgAngle - lastAvgAngle) > MOTION_THRESHOLD) {
            lastMotionTimeRef.current = Date.now();
            if (dormant) {
              setDormant(false);
              toast("Resumed pushup detection.", { icon: "🔄" });
            }
          }
          lastAvgAngle = avgAngle;
          if (!dormant && Date.now() - lastMotionTimeRef.current > DORMANT_TIME) {
            setDormant(true);
            toast("No motion detected. Entered dormant mode.", { icon: "😴" });
          }

          // Only count pushups when not dormant
          if (!dormant) {
            // Hysteresis
            if (avgAngle < DOWN_THRESHOLD && !down) {
              setDown(true);
            }
            if (avgAngle > UP_THRESHOLD && down) {
              const now = Date.now();
              if (now - lastCountTimeRef.current > COUNT_COOLDOWN) {
                setCount((c) => c + 1);
                setDown(false);
                lastCountTimeRef.current = now;
                toast(`Pushup counted! Total: ${count + 1}`, { icon: "💪" });
              }
            }
          }
        }
      }
      animationId = requestAnimationFrame(detectPose);
    }
    detectPose();
    return () => cancelAnimationFrame(animationId);
  }, [net, down, count, dormant]);

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
        color: "#000" // Set all font to black
      }}>
        <b>How to use:</b>
        <ul>
          <li>Make sure your whole body, especially arms, is visible in the webcam frame, viewed from the side.</li>
          <li>Start in a plank position, arms fully extended.</li>
          <li>Lower your body until elbows are bent (90° or less).</li>
          <li>Push back up until arms are straight. Each full up-down counts as one pushup.</li>
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