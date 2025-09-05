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
  const leftDistances = useRef([]);
  const rightDistances = useRef([]);
  const initialLeftDistRef = useRef(null);
  const initialRightDistRef = useRef(null);

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
  const DOWN_RATIO = 2 / 3;
  const UP_RATIO = 0.9;
  const DELTA = 0.07;
  const COUNT_COOLDOWN = 600;
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
    leftDistances.current = [];
    rightDistances.current = [];
    initialLeftDistRef.current = null;
    initialRightDistRef.current = null;
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
      setStarted(!started);
      if (
        net &&
        videoRef.current &&
        videoRef.current.readyState >= 2 &&
        calibrating
      ) {
        const video = videoRef.current;
        const pose = await net.estimateSinglePose(video, { flipHorizontal: true });

        // Collect shoulder-wrist distances for calibration
        const kp = pose.keypoints.reduce((acc, k) => { acc[k.part] = k; return acc; }, {});
        const leftShoulder = kp.leftShoulder?.position;
        const leftWrist = kp.leftWrist?.position;
        const rightShoulder = kp.rightShoulder?.position;
        const rightWrist = kp.rightWrist?.position;
        function dist(a, b) {
          if (!a || !b) return 0;
          return Math.hypot(a.x - b.x, a.y - b.y);
        }

        if (
          kp.leftShoulder?.score > 0.7 && kp.leftWrist?.score > 0.7 &&
          kp.rightShoulder?.score > 0.7 && kp.rightWrist?.score > 0.7
        ) {
          leftDistances.current.push(dist(leftShoulder, leftWrist));
          rightDistances.current.push(dist(rightShoulder, rightWrist));
        }

        // Stillness check: ensure user is not moving
        const leftMotion = leftDistances.current.length > 1
          ? Math.abs(leftDistances.current[leftDistances.current.length - 1] - leftDistances.current[leftDistances.current.length - 2])
          : 0;
        const rightMotion = rightDistances.current.length > 1
          ? Math.abs(rightDistances.current[rightDistances.current.length - 1] - rightDistances.current[rightDistances.current.length - 2])
          : 0;
        const stillEnough = leftMotion < CALIBRATION_MOTION_MAX && rightMotion < CALIBRATION_MOTION_MAX;

        // If enough frames and still, finish calibration and start tracking
        if (
          leftDistances.current.length >= CALIBRATION_FRAMES &&
          rightDistances.current.length >= CALIBRATION_FRAMES &&
          stillEnough
        ) {
          initialLeftDistRef.current = movingAverage(leftDistances.current, SMOOTH_WINDOW);
          initialRightDistRef.current = movingAverage(rightDistances.current, SMOOTH_WINDOW);
          
          setCalibrating(false);
          toast.success("Calibration complete! Start your pushups.", { icon: "🏁", id: "initial" });
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
    let lastAvgDist = null;
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

        // Draw keypoints and skeleton
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          pose.keypoints.forEach((kp) => {
            if (kp.score > 0.7) {
              ctx.beginPath();
              ctx.arc(kp.position.x, kp.position.y, 8, 0, 2 * Math.PI);
              ctx.fillStyle = "#00ff00";
              ctx.fill();
              ctx.font = "12px Arial";
              ctx.fillStyle = "#000";
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
        }

        // --- KEYPOINTS ---
        const kp = pose.keypoints.reduce((acc, k) => { acc[k.part] = k; return acc; }, {});
        const leftShoulder = kp.leftShoulder?.position;
        const leftWrist = kp.leftWrist?.position;
        const rightShoulder = kp.rightShoulder?.position;
        const rightWrist = kp.rightWrist?.position;
        function dist(a, b) {
          if (!a || !b) return 0;
          return Math.hypot(a.x - b.x, a.y - b.y);
        }

        if (
          kp.leftShoulder?.score > 0.7 && kp.leftWrist?.score > 0.7 &&
          kp.rightShoulder?.score > 0.7 && kp.rightWrist?.score > 0.7 &&
          initialLeftDistRef.current && initialRightDistRef.current
        ) {
          const leftDist = dist(leftShoulder, leftWrist);
          const rightDist = dist(rightShoulder, rightWrist);

          const avgDist = (leftDist + rightDist) / 2;
          const initialAvgDist = (initialLeftDistRef.current + initialRightDistRef.current) / 2;

          // -- DEBUG LOG --
          // Uncomment to see live values
          // console.log("AvgDist", avgDist, "InitialAvgDist", initialAvgDist, "Ratio", avgDist / initialAvgDist);

          // Motion detection
          let motion = 0;
          if (lastAvgDist !== null) {
            motion = Math.abs(avgDist - lastAvgDist);
          }
          lastAvgDist = avgDist;
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
              toast("Resumed pushup detection.", { icon: "🔄", id: "resume" });
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
          const ratio = avgDist / initialAvgDist;
          // DOWN: ratio < threshold, UP: ratio > threshold
          if (ratio < DOWN_RATIO + DELTA && !down) {
            setDown(true);
            toast("Down position detected.", { icon: "⬇️", id: "down" });
            lastActiveDownRef.current = true;
          }
          // UP: ratio > threshold, and previously was down
          if (ratio > UP_RATIO - DELTA && down && lastActiveDownRef.current) {
            const now = Date.now();
            if (now - lastCountTimeRef.current > COUNT_COOLDOWN) {
              setCount((c) => c + 1);
              setDown(false);
              toast(`Pushup counted! Total: ${count + 1}`, { icon: "💪", id: `pushup-${count + 1}` });
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
      marginTop: 4,
      color: "#000",
      fontFamily: "system-ui, Arial, sans-serif"
    }}>
      <ol className="exercise-cam">
      <li >
        <div style={{display:"grid",gridArea:"repeat(2, 1fr)", }}>
        <div style={{ fontSize: "1.2rem", marginBottom: 5, color: "#000",gridArea:"1/1" }}>
          {status}
        </div>
        <div style={{ fontSize: "2rem", marginBottom: 8, color: "#000",gridArea:"3/1" }}>
          Pushups: {count}
        </div>
        <button
              style={{
                padding: "1px",
                borderRadius: 8,
                fontWeight: "bold",
                fontSize: "1.5rem",
                background: !started?"rgba(141, 240, 117, 1)":"rgba(235, 129, 129, 1)",
                color: "#ffffffff",
                border: "2px solid #333",
                cursor: "pointer",
                gridArea:"1/2/span 3",
                transform:"translate(-20%,-8%)"
              }}
              onClick={() => {
                if (started) {
                    console.log("Sent pushup count for user:");
                    // Get username from API before sending pushup count
                     fetch('/api/auth/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'value' }) // Adjust the body as needed
            })
                    .then(res => res.json())
                    .then(data => {
                      console.log("hey"+JSON.stringify(data)+"ooi")
                      const username = data.user.username || "anonymous";
                      //console.log(username);
                      
                      fetch("/api/stats/pushups", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        user: username,
                        pushups: count
                      })
                        
                      
                      }).then(async () => {
                        const type = "deposit";
                        const remarks = `completed ${count} pushups`;
                        try {
                          const res = await fetch('/api/transaction', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ user:username, amount: count, type, remarks }),
                          });
                          const result = await res.json();
                          if (res.ok) {
                            toast.success(`${count} coin gained!`);
                          } else {
                            toast.error('oopsie');
                            console.log(result);
                          }
                        } catch (err) {
                          toast.error('Big oopsie');
                          console.error(err);
                        }
                      //window.location.reload();
                      setCount(0);
                      setCalibrating(false);
                      })
                      
                    });
                    
                }
                setCalibrating(true);
                leftDistances.current = [];
                rightDistances.current = [];
                initialLeftDistRef.current = null;
                initialRightDistRef.current = null;
                toast("Hold plank/up position for calibration...", { icon: "⏳", id: "calib" });
              }}
            >
              {started ? "Stop" : "Start"}
            </button>
          </div>
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
            className="translate-y-[-60px]"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
            }}
          />
        </div>
        <div style={{ marginTop: 10, fontSize: "1.1rem" }}>
              After pressing Start, hold the plank/up position for a few seconds!
            </div>
        </li>
        <li>
          {!started && !calibrating && net &&
          <div style={{ margin: "22px 0 10px 0" }}>
            
            
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
              Hold plank/up position and keep still
            </div>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", margin: "18px 0" }}>
          {/*
            Store pathname in state after mount to avoid SSR window error
          */}
          {(() => {
            const [pathname, setPathname] = useState("");
            useEffect(() => {
              if (typeof window !== "undefined") {
                setPathname(window.location.pathname);
              }
            }, []);
            return (
              <>
                <a
                  href="/app/exercise"
                  style={{
                    padding: "10px 28px",
                    borderRadius: 8,
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    background: "rgb(88, 92, 218)",
                    color: "#fff",
                    border: "2px solid #222",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    opacity: 1,
                    transition: "background 0.2s",
                    ...(pathname === "/app/exercise" ? { background: "rgba(44, 50, 202, 1)" } : {})
                  }}
                >
                  Pushup
                </a>
                <a
                  href="/app/squat"
                  style={{
                    padding: "10px 28px",
                    borderRadius: 8,
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    background: "rgb(88, 92, 218)",
                    color: "#fff",
                    border: "2px solid #222",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    opacity: 1,
                    transition: "background 0.2s",
                    ...(pathname === "/app/squat" ? { background: "rgba(44, 50, 202, 1)" } : {})
                  }}
                >
                  Squat
                </a>
              </>
            );
          })()}
        </div>
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
            <li>Press <b>Start</b>, then <b>hold the plank/up position</b> for calibration.</li>
            <li>After you see "Calibration complete", begin your pushups!</li>
            <li>Each up-down (arms extended to arms bent and back) counts as one pushup.</li>
            <li>Move smoothly, avoid pausing mid-rep or moving too fast.</li>
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
        </li>
        </ol>
      </div>
  );
}