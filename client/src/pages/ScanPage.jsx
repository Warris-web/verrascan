// import { useState, useRef, useCallback } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";


// const API = import.meta.env.VITE_API_URL;

// const PRODUCTS = [
//   { id: "coartem",  label: "Coartem",  category: "pharma" },
//   { id: "vaseline", label: "Vaseline", category: "cosmetics" },
//   { id: "custom",   label: "Other",    category: "general" },
// ];

// const STATUS_COLOR  = { PASS: "#43A047", FAIL: "#E53935", WARN: "#F5A623" };
// const VERDICT_COLOR = { GENUINE: "#43A047", COUNTERFEIT: "#E53935", SUSPICIOUS: "#F5A623" };

// const SIGNALS = [
//   "NAFDAC Number Validation",
//   "Typography Forensics",
//   "Colour Profile Analysis",
//   "Geometric Ratio Analysis",
//   "Print Quality & Halftone",
//   "OCR Batch Code Check",
// ];

// export default function ScanPage() {
//     const navigate = useNavigate();
//   const videoRef  = useRef(null);
//   const canvasRef = useRef(null);
//   const streamRef = useRef(null);

//   const [phase,    setPhase]    = useState("idle");
//   const [product,  setProduct]  = useState(PRODUCTS[0]);
//   const [result,   setResult]   = useState(null);
//   const [error,    setError]    = useState(null);
//   const [progress, setProgress] = useState(0);
//   const [activeSig,setActiveSig]= useState(-1);
//   const [cameraOn, setCameraOn] = useState(false);

//   const startCamera = useCallback(async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: "environment" },
//       });
//       streamRef.current = stream;
//       if (videoRef.current) videoRef.current.srcObject = stream;
//       setCameraOn(true);
//       setError(null);
//     } catch {
//       setError("Camera access denied. Allow camera permission and try again.");
//     }
//   }, []);

//   const stopCamera = useCallback(() => {
//     streamRef.current?.getTracks().forEach(t => t.stop());
//     setCameraOn(false);
//   }, []);

//   const captureAndScan = useCallback(async () => {
//     setPhase("scanning");
//     setProgress(0);
//     setActiveSig(0);
//     setResult(null);
//     setError(null);

//     let sig = 0;
//     const sigTimer  = setInterval(() => { sig = Math.min(sig + 1, SIGNALS.length - 1); setActiveSig(sig); }, 600);
//     let p = 0;
//     const progTimer = setInterval(() => { p = Math.min(p + 2.5, 95); setProgress(p); }, 100);

//     try {
//       let imageBase64 = "demo_image";
//       if (cameraOn && videoRef.current && canvasRef.current) {
//         const video  = videoRef.current;
//         const canvas = canvasRef.current;
//         canvas.width  = video.videoWidth  || 640;
//         canvas.height = video.videoHeight || 480;
//         canvas.getContext("2d").drawImage(video, 0, 0);
//         imageBase64 = canvas.toDataURL("image/jpeg", 0.8).split(",")[1];
//       }

//       const { data } = await axios.post(`${API}/api/scan`, {
//         image:            imageBase64,
//         product_name:     product.label,
//         product_category: product.category,
//         region:           "Lagos",
//       });

//       clearInterval(sigTimer);
//       clearInterval(progTimer);
//       setProgress(100);
//       setActiveSig(SIGNALS.length);
//       setTimeout(() => { setResult(data); setPhase("result"); }, 400);
//     } catch {
//       clearInterval(sigTimer);
//       clearInterval(progTimer);
//       setError("Scan failed. Check server connection.");
//       setPhase("idle");
//     }
//   }, [cameraOn, product]);

//   const reset = () => {
//     setPhase("idle"); setResult(null);
//     setError(null);   setProgress(0); setActiveSig(-1);
//   };

//   const verdictColor = result ? VERDICT_COLOR[result.verdict] || "#999" : "#999";

//   return (
//     <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
//       {/* Product selector */}
//       <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
//         <span style={{ fontSize: 12, color: "#555", marginRight: 4 }}>Product:</span>
//         {PRODUCTS.map(p => (
//           <button key={p.id} onClick={() => { reset(); setProduct(p); }}
//             style={{ border: `1px solid ${product.id === p.id ? "#00C9A7" : "#2A2A2A"}`, background: product.id === p.id ? "rgba(0,201,167,0.08)" : "#141414", color: product.id === p.id ? "#00C9A7" : "#666", borderRadius: 7, padding: "6px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
//             {p.label}
//           </button>
//         ))}
//         <span style={{ marginLeft: "auto", fontSize: 11, color: "rgb(0, 201, 167)" }}>
//           {cameraOn ? "📷 Camera live" : "Camera off"}
//         </span>
//       </div>

//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//         {/* Camera panel */}
//         <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, overflow: "hidden" }}>
//           <div style={{ background: "#000", height: 280, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
//             <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", display: cameraOn ? "block" : "none" }} />
//             <canvas ref={canvasRef} style={{ display: "none" }} />

//             {!cameraOn && phase === "idle" && (
//               <div style={{ width: 130, height: 130, border: "2px solid #00C9A7", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
//                 <div style={{ fontSize: 36 }}>📷</div>
//                 <div style={{ fontSize: 10, color: "#555", textAlign: "center", lineHeight: 1.5 }}>Enable camera or<br/>run demo scan</div>
//               </div>
//             )}

//             {phase === "scanning" && (
//                 <>
//                     {/* Scanning beam */}
//                     <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#00C9A7,transparent)", animation: "sweep 1.2s ease-in-out infinite", zIndex: 2 }} />

//                     {/* Corner brackets */}
//                     {[{top:16,left:16},{top:16,right:16},{bottom:16,left:16},{bottom:16,right:16}].map((pos,i) => (
//                     <div key={i} style={{ position: "absolute", width: 20, height: 20, ...pos,
//                         borderTop:    pos.top    !== undefined ? "2px solid #00C9A7" : "none",
//                         borderBottom: pos.bottom !== undefined ? "2px solid #00C9A7" : "none",
//                         borderLeft:   pos.left   !== undefined ? "2px solid #00C9A7" : "none",
//                         borderRight:  pos.right  !== undefined ? "2px solid #00C9A7" : "none",
//                         zIndex: 2 }} />
//                     ))}

//                     {/* Signal list */}
//                     <div style={{ textAlign: "center", zIndex: 3, padding: "0 20px" }}>
//                     <div style={{ marginBottom: 14 }}>
//                         {SIGNALS.map((sig, i) => (
//                         <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0", justifyContent: "center" }}>
//                             <div style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
//                             background: i < activeSig ? "#43A047" : i === activeSig ? "#00C9A7" : "#333",
//                             boxShadow: i === activeSig ? "0 0 6px #00C9A7" : "none",
//                             transition: "all 0.3s"
//                             }} />
//                             <div style={{ fontSize: 10.5, color: i < activeSig ? "#43A047" : i === activeSig ? "#00C9A7" : "#444", transition: "color 0.3s", whiteSpace: "nowrap" }}>
//                             {sig}
//                             </div>
//                             {i < activeSig && <span style={{ fontSize: 10, color: "#43A047" }}>✓</span>}
//                             {i === activeSig && <span style={{ fontSize: 9, color: "#00C9A7", animation: "blink 0.8s infinite" }}>●</span>}
//                         </div>
//                         ))}
//                     </div>

//                     {/* Progress bar */}
//                     <div style={{ width: 180, background: "#1a1a1a", borderRadius: 3, height: 4, overflow: "hidden", margin: "0 auto 6px" }}>
//                         <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #009B82, #00C9A7)", transition: "width 0.15s", borderRadius: 3 }} />
//                     </div>
//                     <div style={{ fontSize: 10, color: "#555" }}>{Math.round(progress)}% · {Math.ceil(((100 - progress) / 100) * 3.5)}s remaining</div>
//                     </div>
//                 </>
//             )}

//             {phase === "result" && result && (
//               <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
//                 <div style={{ width: 72, height: 72, borderRadius: "50%", background: `${verdictColor}18`, border: `2px solid ${verdictColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>
//                   {result.verdict === "GENUINE" ? "✓" : result.verdict === "COUNTERFEIT" ? "✗" : "⚠"}
//                 </div>
//                 <div style={{ fontSize: 24, fontWeight: 700, color: verdictColor }}>{result.verdict}</div>
//                 <div style={{ fontSize: 14, color: "#999" }}>{result.confidence}% confidence</div>
//                 {result.mock && <div style={{ fontSize: 10, color: "#444", marginTop: 4 }}>Demo mode · AI service offline</div>}
//               </div>
//             )}

//             {cameraOn && <div style={{ position: "absolute", top: 10, left: 10, fontSize: 10, color: "#00C9A7", background: "rgba(0,201,167,0.1)", padding: "3px 8px", borderRadius: 4, border: "1px solid rgba(0,201,167,0.2)" }}>● LIVE</div>}
//           </div>

//           <div style={{ padding: "14px 18px" }}>
//             <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{product.label}</div>
//             <div style={{ fontSize: 11, color: "#555", marginBottom: 14 }}>{product.category}</div>
//             {error && <div style={{ fontSize: 11, color: "#E53935", marginBottom: 10, padding: "8px 10px", background: "rgba(229,57,53,0.08)", borderRadius: 6 }}>{error}</div>}
//             <div style={{ display: "flex", gap: 8 }}>
//               {!cameraOn
//                 ? <button onClick={startCamera} style={{ flex: 1, background: "#1A1A1A", color: "#999", border: "1px solid #2A2A2A", borderRadius: 8, padding: 10, fontSize: 12, cursor: "pointer" }}>Enable Camera</button>
//                 : <button onClick={stopCamera}  style={{ background: "#1A1A1A", color: "#666", border: "1px solid #2A2A2A", borderRadius: 8, padding: "10px 14px", fontSize: 12, cursor: "pointer" }}>✕</button>
//               }
//               {phase === "idle"     && <button onClick={captureAndScan} style={{ flex: 1, background: "#00C9A7", color: "#000", border: "none", borderRadius: 8, padding: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{cameraOn ? "Scan Product" : "Demo Scan"}</button>}
//               {phase === "scanning" && <button disabled style={{ flex: 1, background: "#0D2E24", color: "#00C9A7", border: "1px solid #009B82", borderRadius: 8, padding: 10, fontSize: 13 }}>Analysing...</button>}
//               {phase === "result"   && <button onClick={reset} style={{ flex: 1, background: "#1A1A1A", color: "#666", border: "1px solid #2A2A2A", borderRadius: 8, padding: 10, fontSize: 13, cursor: "pointer" }}>Scan Again</button>}
//             </div>
//           </div>
//         </div>

//         {/* Signals panel */}
//         <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "16px 18px" }}>
//           <div style={{ fontSize: 11, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>
//             {phase === "result" ? "Forensic Breakdown" : "Six Forensic Signals"}
//           </div>
//           {(result?.signals || SIGNALS.map(name => ({ name, status: null }))).map((sig, i) => {
//             const isActive = phase === "scanning" && i === activeSig;
//             const isDone   = phase === "result";
//             return (
//               <div key={i} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: "1px solid #1A1A1A", opacity: phase === "idle" ? 0.45 : 1 }}>
//                 <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, marginTop: 5, background: isDone ? (STATUS_COLOR[sig.status] || "#555") : isActive ? "#00C9A7" : "#333", transition: "background 0.3s" }} />
//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontSize: 12, fontWeight: 500, color: isDone || isActive ? "#fff" : "#666" }}>{sig.name}</div>
//                   {isDone && sig.detail && <div style={{ fontSize: 10.5, color: "#666", marginTop: 3, lineHeight: 1.5 }}>{sig.detail}</div>}
//                   {isActive && <div style={{ fontSize: 10, color: "#00C9A7", marginTop: 2 }}>Running analysis...</div>}
//                 </div>
//                 {isDone && sig.status && <div style={{ fontSize: 11, fontWeight: 700, color: STATUS_COLOR[sig.status] || "#555", flexShrink: 0 }}>{sig.status}</div>}
//               </div>
//             );
//           })}

//           {phase === "result" && result?.verdict === "COUNTERFEIT" && (
//             <div style={{ marginTop: 14, background: "rgba(0,201,167,0.06)", border: "1px solid rgba(0,201,167,0.15)", borderRadius: 8, padding: "12px 14px" }}>
//               <div style={{ fontSize: 11, fontWeight: 600, color: "#00C9A7", marginBottom: 4 }}>Verified Vendors Nearby</div>
//               <div style={{ fontSize: 11, color: "#666", lineHeight: 1.6 }}>3 pharmacies within 1.2km carry genuine {product.label}. Payment via Squad-powered vendor links.</div>
//               {/* <button style={{ marginTop: 8, background: "#00C9A7", color: "#000", border: "none", borderRadius: 6, padding: "7px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Find Verified Vendor →</button> */}
//               <button
//                     onClick={() => navigate(`/vendor/locator?product=${product.label}&city=Lagos`)}
//                     style={{ marginTop: 8, background: "#00C9A7", color: "#000", border: "none", borderRadius: 6, padding: "7px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
//                     Find Verified Vendor →
//                </button>
//             </div>
//           )}
//           {phase === "result" && result?.verdict === "GENUINE" && (
//             <div style={{ marginTop: 14, background: "rgba(67,160,71,0.06)", border: "1px solid rgba(67,160,71,0.15)", borderRadius: 8, padding: "12px 14px" }}>
//               <div style={{ fontSize: 11, fontWeight: 600, color: "#43A047", marginBottom: 4 }}>✓ Product Authenticated</div>
//               <div style={{ fontSize: 11, color: "#666" }}>This product matches all six forensic reference signals. Safe to purchase.</div>
//             </div>
//           )}
//         </div>
//       </div>
//       <style>{`
//             @keyframes sweep {
//                 0%   { transform: translateY(0);     opacity: 1;   }
//                 50%  { transform: translateY(274px); opacity: 0.6; }
//                 100% { transform: translateY(0);     opacity: 1;   }
//             }
//             @keyframes blink {
//                 0%, 100% { opacity: 1; }
//                 50%       { opacity: 0; }
//             }
//             `}
//         </style>
//     </div>
//   );
// }


// import { useState, useRef, useCallback } from "react";
// import { useNavigate } from "react-router-dom";

// const VERA = import.meta.env.VITE_VERASCANN_URL || "https://Oriadee-verascann-api.hf.space";

// const PRODUCTS = [
//   { id: "coartem",  label: "Coartem",  category: "pharma" },
//   { id: "vaseline", label: "Vaseline", category: "cosmetics" },
//   { id: "custom",   label: "Other",    category: "general" },
// ];

// const STATUS_COLOR  = { PASS: "#43A047", FAIL: "#E53935", WARN: "#F5A623" };
// const VERDICT_COLOR = { GENUINE: "#43A047", COUNTERFEIT: "#E53935", SUSPICIOUS: "#F5A623" };

// const SIGNALS = [
//   "NAFDAC Number Validation",
//   "Typography Forensics",
//   "Colour Profile Analysis",
//   "Geometric Ratio Analysis",
//   "Print Quality & Halftone",
//   "OCR Batch Code Check",
// ];

// // Map VeraScann forensic_signals strings → our 6 signal slots
// function mapSignals(forensicSignals = [], verdict) {
//   return SIGNALS.map((name) => {
//     const hit = forensicSignals.find(s =>
//       s.toLowerCase().includes(name.split(" ")[0].toLowerCase()) ||
//       name.toLowerCase().includes(s.split(" ")[0].toLowerCase())
//     );
//     const status = hit
//       ? (verdict === "GENUINE" ? "PASS" : "FAIL")
//       : "PASS";
//     return { name, status, detail: hit || null };
//   });
// }

// export default function ScanPage() {
//   const navigate  = useNavigate();
//   const videoRef  = useRef(null);
//   const canvasRef = useRef(null);
//   const streamRef = useRef(null);
//   const fileRef   = useRef(null);

//   const [phase,     setPhase]     = useState("idle");
//   const [product,   setProduct]   = useState(PRODUCTS[0]);
//   const [result,    setResult]    = useState(null);
//   const [error,     setError]     = useState(null);
//   const [progress,  setProgress]  = useState(0);
//   const [activeSig, setActiveSig] = useState(-1);
//   const [cameraOn,  setCameraOn]  = useState(false);
//   const [preview,   setPreview]   = useState(null); // blob URL for captured frame

//   // ── Camera ────────────────────────────────────────────────────────────────
//   const startCamera = useCallback(async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
//       streamRef.current = stream;
//       if (videoRef.current) videoRef.current.srcObject = stream;
//       setCameraOn(true);
//       setError(null);
//     } catch {
//       setError("Camera access denied. Allow camera permission and try again.");
//     }
//   }, []);

//   const stopCamera = useCallback(() => {
//     streamRef.current?.getTracks().forEach(t => t.stop());
//     setCameraOn(false);
//   }, []);

//   // ── File upload pick ───────────────────────────────────────────────────────
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     runScan(file);
//   };

//   // ── Core scan: accepts a Blob/File ─────────────────────────────────────────
//   const runScan = useCallback(async (blob) => {
//     setPhase("scanning");
//     setProgress(0);
//     setActiveSig(0);
//     setResult(null);
//     setError(null);

//     // Show preview
//     const objUrl = URL.createObjectURL(blob);
//     setPreview(objUrl);

//     // Animate signals + progress
//     let sig = 0;
//     const sigTimer  = setInterval(() => { sig = Math.min(sig + 1, SIGNALS.length - 1); setActiveSig(sig); }, 600);
//     let p = 0;
//     const progTimer = setInterval(() => { p = Math.min(p + 2.5, 95); setProgress(p); }, 100);

//     try {
//       const fd = new FormData();
//       fd.append("file", blob, "scan.jpg");

//       const resp = await fetch(`${VERA}/verify`, { method: "POST", body: fd });

//       if (!resp.ok) {
//         const txt = await resp.text();
//         throw new Error(txt || `HTTP ${resp.status}`);
//       }

//       const data = await resp.json();

//       clearInterval(sigTimer);
//       clearInterval(progTimer);
//       setProgress(100);
//       setActiveSig(SIGNALS.length);

//       // Normalise VeraScann response → internal shape
//       const verdict = data.verdict === "SUSPICIOUS" ? "SUSPICIOUS"
//                     : data.verdict === "GENUINE"    ? "GENUINE"
//                     : "COUNTERFEIT";

//       const mapped = mapSignals(data.forensic_signals || [], verdict);

//       setTimeout(() => {
//         setResult({
//           verdict,
//           confidence:      Math.round(data.confidence ?? data.fake_probability ?? 0),
//           genuine_prob:    data.genuine_probability,
//           fake_prob:       data.fake_probability,
//           product_name:    data.product || product.label,
//           recommendation:  data.recommendation,
//           forensic_signals: data.forensic_signals || [],
//           signals:         mapped,
//         });
//         setPhase("result");
//       }, 400);

//     } catch (err) {
//       clearInterval(sigTimer);
//       clearInterval(progTimer);
//       setError(`Scan failed: ${err.message}`);
//       setPhase("idle");
//       setPreview(null);
//     }
//   }, [product]);

//   // ── Capture from camera then scan ─────────────────────────────────────────
//   const captureAndScan = useCallback(async () => {
//     if (cameraOn && videoRef.current && canvasRef.current) {
//       const video  = videoRef.current;
//       const canvas = canvasRef.current;
//       canvas.width  = video.videoWidth  || 640;
//       canvas.height = video.videoHeight || 480;
//       canvas.getContext("2d").drawImage(video, 0, 0);
//       canvas.toBlob(blob => { if (blob) runScan(blob); }, "image/jpeg", 0.88);
//     } else {
//       // No camera — open file picker
//       fileRef.current?.click();
//     }
//   }, [cameraOn, runScan]);

//   const reset = () => {
//     setPhase("idle"); setResult(null); setError(null);
//     setProgress(0);   setActiveSig(-1); setPreview(null);
//     if (fileRef.current) fileRef.current.value = "";
//   };

//   const verdictColor = result ? (VERDICT_COLOR[result.verdict] || "#999") : "#999";

//   return (
//     <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>

//       {/* Hidden file input */}
//       <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />

//       {/* Product selector */}
//       <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
//         <span style={{ fontSize: 12, color: "#555", marginRight: 4 }}>Product:</span>
//         {PRODUCTS.map(p => (
//           <button key={p.id} onClick={() => { reset(); setProduct(p); }}
//             style={{ border: `1px solid ${product.id === p.id ? "#00C9A7" : "#2A2A2A"}`, background: product.id === p.id ? "rgba(0,201,167,0.08)" : "#141414", color: product.id === p.id ? "#00C9A7" : "#666", borderRadius: 7, padding: "6px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
//             {p.label}
//           </button>
//         ))}
//         <span style={{ marginLeft: "auto", fontSize: 11, color: "rgb(0,201,167)" }}>
//           {cameraOn ? "📷 Camera live" : "Camera off"}
//         </span>
//       </div>

//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

//         {/* ── Camera / Preview panel ── */}
//         <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, overflow: "hidden" }}>
//           <div style={{ background: "#000", height: 280, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>

//             {/* Live camera */}
//             <video ref={videoRef} autoPlay playsInline muted
//               style={{ width: "100%", height: "100%", objectFit: "cover", display: cameraOn && phase === "idle" ? "block" : "none" }} />
//             <canvas ref={canvasRef} style={{ display: "none" }} />

//             {/* Uploaded / captured preview */}
//             {preview && phase !== "idle" && (
//               <img src={preview} alt="scan preview"
//                 style={{ width: "100%", height: "100%", objectFit: "contain", opacity: phase === "scanning" ? 0.35 : 1, transition: "opacity 0.3s" }} />
//             )}

//             {/* Idle — no camera, no preview */}
//             {!cameraOn && phase === "idle" && (
//               <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
//                 <div style={{ width: 130, height: 130, border: "2px solid #00C9A7", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}
//                   onClick={() => fileRef.current?.click()}>
//                   <div style={{ fontSize: 36 }}>📷</div>
//                   <div style={{ fontSize: 10, color: "#555", textAlign: "center", lineHeight: 1.5 }}>Tap to upload<br/>a product image</div>
//                 </div>
//                 <div style={{ fontSize: 10, color: "#333" }}>— or enable camera below —</div>
//               </div>
//             )}

//             {/* Scanning overlay */}
//             {phase === "scanning" && (
//               <>
//                 <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#00C9A7,transparent)", animation: "sweep 1.2s ease-in-out infinite", zIndex: 2 }} />
//                 {[{top:16,left:16},{top:16,right:16},{bottom:16,left:16},{bottom:16,right:16}].map((pos,i) => (
//                   <div key={i} style={{ position: "absolute", width: 20, height: 20, ...pos,
//                     borderTop:    pos.top    !== undefined ? "2px solid #00C9A7" : "none",
//                     borderBottom: pos.bottom !== undefined ? "2px solid #00C9A7" : "none",
//                     borderLeft:   pos.left   !== undefined ? "2px solid #00C9A7" : "none",
//                     borderRight:  pos.right  !== undefined ? "2px solid #00C9A7" : "none",
//                     zIndex: 2 }} />
//                 ))}
//                 <div style={{ textAlign: "center", zIndex: 3, padding: "0 20px", position: "absolute" }}>
//                   <div style={{ marginBottom: 14 }}>
//                     {SIGNALS.map((sig, i) => (
//                       <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0", justifyContent: "center" }}>
//                         <div style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
//                           background: i < activeSig ? "#43A047" : i === activeSig ? "#00C9A7" : "#333",
//                           boxShadow: i === activeSig ? "0 0 6px #00C9A7" : "none", transition: "all 0.3s" }} />
//                         <div style={{ fontSize: 10.5, color: i < activeSig ? "#43A047" : i === activeSig ? "#00C9A7" : "#444", transition: "color 0.3s", whiteSpace: "nowrap" }}>
//                           {sig}
//                         </div>
//                         {i < activeSig  && <span style={{ fontSize: 10, color: "#43A047" }}>✓</span>}
//                         {i === activeSig && <span style={{ fontSize: 9, color: "#00C9A7", animation: "blink 0.8s infinite" }}>●</span>}
//                       </div>
//                     ))}
//                   </div>
//                   <div style={{ width: 180, background: "#1a1a1a", borderRadius: 3, height: 4, overflow: "hidden", margin: "0 auto 6px" }}>
//                     <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg,#009B82,#00C9A7)", transition: "width 0.15s", borderRadius: 3 }} />
//                   </div>
//                   <div style={{ fontSize: 10, color: "#555" }}>{Math.round(progress)}% · {Math.ceil(((100 - progress) / 100) * 3.5)}s remaining</div>
//                 </div>
//               </>
//             )}

//             {/* Result overlay */}
//             {phase === "result" && result && (
//               <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.72)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
//                 <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${verdictColor}18`, border: `2px solid ${verdictColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
//                   {result.verdict === "GENUINE" ? "✓" : result.verdict === "COUNTERFEIT" ? "✗" : "⚠"}
//                 </div>
//                 <div>
//                   <div style={{ fontSize: 16, fontWeight: 700, color: verdictColor }}>{result.verdict}</div>
//                   <div style={{ fontSize: 11, color: "#888" }}>{result.product_name} · {result.confidence}% confidence</div>
//                 </div>
//               </div>
//             )}

//             {cameraOn && phase === "idle" && (
//               <div style={{ position: "absolute", top: 10, left: 10, fontSize: 10, color: "#00C9A7", background: "rgba(0,201,167,0.1)", padding: "3px 8px", borderRadius: 4, border: "1px solid rgba(0,201,167,0.2)" }}>● LIVE</div>
//             )}
//           </div>

//           {/* Controls */}
//           <div style={{ padding: "14px 18px" }}>
//             <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{product.label}</div>
//             <div style={{ fontSize: 11, color: "#555", marginBottom: 14 }}>{product.category}</div>
//             {error && (
//               <div style={{ fontSize: 11, color: "#E53935", marginBottom: 10, padding: "8px 10px", background: "rgba(229,57,53,0.08)", borderRadius: 6 }}>{error}</div>
//             )}
//             <div style={{ display: "flex", gap: 8 }}>
//               {!cameraOn
//                 ? <button onClick={startCamera} style={{ flex: 1, background: "#1A1A1A", color: "#999", border: "1px solid #2A2A2A", borderRadius: 8, padding: 10, fontSize: 12, cursor: "pointer" }}>Enable Camera</button>
//                 : <button onClick={stopCamera}  style={{ background: "#1A1A1A", color: "#666", border: "1px solid #2A2A2A", borderRadius: 8, padding: "10px 14px", fontSize: 12, cursor: "pointer" }}>✕</button>
//               }
//               {phase === "idle"     && (
//                 <button onClick={captureAndScan}
//                   style={{ flex: 1, background: "#00C9A7", color: "#000", border: "none", borderRadius: 8, padding: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
//                   {cameraOn ? "Capture & Scan" : "📂 Upload & Scan"}
//                 </button>
//               )}
//               {phase === "scanning" && <button disabled style={{ flex: 1, background: "#0D2E24", color: "#00C9A7", border: "1px solid #009B82", borderRadius: 8, padding: 10, fontSize: 13 }}>Analysing...</button>}
//               {phase === "result"   && <button onClick={reset} style={{ flex: 1, background: "#1A1A1A", color: "#666", border: "1px solid #2A2A2A", borderRadius: 8, padding: 10, fontSize: 13, cursor: "pointer" }}>Scan Again</button>}
//             </div>

//             {/* Drag-and-drop zone (idle only, no camera) */}
//             {phase === "idle" && !cameraOn && (
//               <div
//                 onDragOver={e => e.preventDefault()}
//                 onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) runScan(f); }}
//                 style={{ marginTop: 12, border: "1px dashed #2A2A2A", borderRadius: 8, padding: "10px", textAlign: "center", fontSize: 10, color: "#444", cursor: "pointer" }}
//                 onClick={() => fileRef.current?.click()}
//               >
//                 or drag & drop an image here
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ── Signals panel ── */}
//         <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "16px 18px" }}>
//           <div style={{ fontSize: 11, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>
//             {phase === "result" ? "Forensic Breakdown" : "Six Forensic Signals"}
//           </div>

//           {(result?.signals || SIGNALS.map(name => ({ name, status: null }))).map((sig, i) => {
//             const isActive = phase === "scanning" && i === activeSig;
//             const isDone   = phase === "result";
//             return (
//               <div key={i} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: "1px solid #1A1A1A", opacity: phase === "idle" ? 0.45 : 1 }}>
//                 <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, marginTop: 5, background: isDone ? (STATUS_COLOR[sig.status] || "#555") : isActive ? "#00C9A7" : "#333", transition: "background 0.3s" }} />
//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontSize: 12, fontWeight: 500, color: isDone || isActive ? "#fff" : "#666" }}>{sig.name}</div>
//                   {isDone && sig.detail && <div style={{ fontSize: 10.5, color: "#666", marginTop: 3, lineHeight: 1.5 }}>{sig.detail}</div>}
//                   {isActive && <div style={{ fontSize: 10, color: "#00C9A7", marginTop: 2 }}>Running analysis...</div>}
//                 </div>
//                 {isDone && sig.status && <div style={{ fontSize: 11, fontWeight: 700, color: STATUS_COLOR[sig.status] || "#555", flexShrink: 0 }}>{sig.status}</div>}
//               </div>
//             );
//           })}

//           {/* Probability bars — shown after result */}
//           {phase === "result" && result && (
//             <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
//               {[["Genuine", result.genuine_prob, "#43A047"], ["Fake", result.fake_prob, "#E53935"]].map(([label, val, color]) => (
//                 <div key={label} style={{ flex: 1, background: "#111", border: "1px solid #1A1A1A", borderRadius: 8, padding: "10px 12px" }}>
//                   <div style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>{label}</div>
//                   <div style={{ fontSize: 15, fontWeight: 700, color }}>{val?.toFixed(1)}%</div>
//                   <div style={{ height: 3, background: "#1A1A1A", borderRadius: 2, marginTop: 6 }}>
//                     <div style={{ height: 3, width: `${val}%`, background: color, borderRadius: 2, transition: "width 0.6s ease" }} />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Raw VeraScann forensic signals */}
//           {phase === "result" && result?.forensic_signals?.length > 0 && (
//             <div style={{ marginTop: 14, background: "#111", border: "1px solid #1A1A1A", borderRadius: 8, padding: "12px 14px" }}>
//               <div style={{ fontSize: 11, fontWeight: 600, color: "#fff", marginBottom: 8 }}>AI Forensic Signals</div>
//               {result.forensic_signals.map((s, i) => (
//                 <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
//                   <span style={{ color: verdictColor, fontSize: 11 }}>⚑</span>
//                   <span style={{ fontSize: 11, color: "#888" }}>{s}</span>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Recommendation */}
//           {phase === "result" && result?.recommendation && (
//             <div style={{ marginTop: 10, background: "rgba(0,201,167,0.05)", border: "1px solid rgba(0,201,167,0.15)", borderRadius: 8, padding: "10px 14px" }}>
//               <span style={{ fontSize: 11, color: "#00C9A7", fontWeight: 600 }}>Recommendation: </span>
//               <span style={{ fontSize: 11, color: "#888" }}>{result.recommendation}</span>
//             </div>
//           )}

//           {phase === "result" && result?.verdict === "COUNTERFEIT" && (
//             <div style={{ marginTop: 14, background: "rgba(0,201,167,0.06)", border: "1px solid rgba(0,201,167,0.15)", borderRadius: 8, padding: "12px 14px" }}>
//               <div style={{ fontSize: 11, fontWeight: 600, color: "#00C9A7", marginBottom: 4 }}>Verified Vendors Nearby</div>
//               <div style={{ fontSize: 11, color: "#666", lineHeight: 1.6 }}>3 pharmacies within 1.2km carry genuine {product.label}. Payment via Squad-powered vendor links.</div>
//               <button
//                 onClick={() => navigate(`/vendor/locator?product=${product.label}&city=Lagos`)}
//                 style={{ marginTop: 8, background: "#00C9A7", color: "#000", border: "none", borderRadius: 6, padding: "7px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
//                 Find Verified Vendor →
//               </button>
//             </div>
//           )}
//           {phase === "result" && result?.verdict === "GENUINE" && (
//             <div style={{ marginTop: 14, background: "rgba(67,160,71,0.06)", border: "1px solid rgba(67,160,71,0.15)", borderRadius: 8, padding: "12px 14px" }}>
//               <div style={{ fontSize: 11, fontWeight: 600, color: "#43A047", marginBottom: 4 }}>✓ Product Authenticated</div>
//               <div style={{ fontSize: 11, color: "#666" }}>This product matches all six forensic reference signals. Safe to purchase.</div>
//             </div>
//           )}
//           {phase === "result" && result?.verdict === "SUSPICIOUS" && (
//             <div style={{ marginTop: 14, background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.2)", borderRadius: 8, padding: "12px 14px" }}>
//               <div style={{ fontSize: 11, fontWeight: 600, color: "#F5A623", marginBottom: 4 }}>⚠ Proceed with Caution</div>
//               <div style={{ fontSize: 11, color: "#666" }}>Anomalies detected. Purchase only from a verified vendor to be safe.</div>
//               <button
//                 onClick={() => navigate(`/vendor/locator?product=${product.label}&city=Lagos`)}
//                 style={{ marginTop: 8, background: "#F5A623", color: "#000", border: "none", borderRadius: 6, padding: "7px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
//                 Find Verified Vendor →
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       <style>{`
//         @keyframes sweep {
//           0%   { transform: translateY(0);     opacity: 1;   }
//           50%  { transform: translateY(274px); opacity: 0.6; }
//           100% { transform: translateY(0);     opacity: 1;   }
//         }
//         @keyframes blink {
//           0%, 100% { opacity: 1; }
//           50%       { opacity: 0; }
//         }
//       `}</style>
//     </div>
//   );
// }

import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const VERA = import.meta.env.VITE_VERASCANN_URL || "https://Oriadee-verascann-api.hf.space";

const PRODUCTS = [
  { id: "biore uv",  label: "Biore uv",  category: "cosmetics" },
  { id: "coartem",  label: "Coartem",  category: "pharma" },
  { id: "vaseline", label: "Vaseline", category: "cosmetics" },
  { id: "custom",   label: "Other",    category: "general" },
];

const STATUS_COLOR  = { PASS: "#43A047", FAIL: "#E53935", WARN: "#F5A623" };
const VERDICT_COLOR = { GENUINE: "#43A047", COUNTERFEIT: "#E53935", SUSPICIOUS: "#F5A623" };

const SIGNALS = [
  "NAFDAC Number Validation",
  "Typography Forensics",
  "Colour Profile Analysis",
  "Geometric Ratio Analysis",
  "Print Quality & Halftone",
  "OCR Batch Code Check",
];

function mapSignals(forensicSignals = [], verdict) {
  return SIGNALS.map((name) => {
    const hit = forensicSignals.find(s =>
      s.toLowerCase().includes(name.split(" ")[0].toLowerCase()) ||
      name.toLowerCase().includes(s.split(" ")[0].toLowerCase())
    );
    const status = hit
      ? (verdict === "GENUINE" ? "PASS" : "FAIL")
      : "PASS";
    return { name, status, detail: hit || null };
  });
}

export default function ScanPage() {
  const navigate  = useNavigate();
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileRef   = useRef(null);

  const [phase,     setPhase]     = useState("idle");
  const [product,   setProduct]   = useState(PRODUCTS[0]);
  const [result,    setResult]    = useState(null);
  const [error,     setError]     = useState(null);
  const [progress,  setProgress]  = useState(0);
  const [activeSig, setActiveSig] = useState(-1);
  const [cameraOn,  setCameraOn]  = useState(false);
  const [preview,   setPreview]   = useState(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOn(true);
      setError(null);
    } catch {
      setError("Camera access denied. Allow camera permission and try again.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setCameraOn(false);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    runScan(file);
  };

  const runScan = useCallback(async (blob) => {
    setPhase("scanning");
    setProgress(0);
    setActiveSig(0);
    setResult(null);
    setError(null);

    const objUrl = URL.createObjectURL(blob);
    setPreview(objUrl);

    let sig = 0;
    const sigTimer  = setInterval(() => { sig = Math.min(sig + 1, SIGNALS.length - 1); setActiveSig(sig); }, 600);
    let p = 0;
    const progTimer = setInterval(() => { p = Math.min(p + 2.5, 95); setProgress(p); }, 100);

    try {
      const fd = new FormData();
      fd.append("file", blob, "scan.jpg");

      const resp = await fetch(`${VERA}/verify`, { method: "POST", body: fd });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || `HTTP ${resp.status}`);
      }

      const data = await resp.json();

      clearInterval(sigTimer);
      clearInterval(progTimer);
      setProgress(100);
      setActiveSig(SIGNALS.length);

      const verdict = data.verdict === "SUSPICIOUS" ? "SUSPICIOUS"
                    : data.verdict === "GENUINE"    ? "GENUINE"
                    : "COUNTERFEIT";

      const mapped = mapSignals(data.forensic_signals || [], verdict);

      setTimeout(() => {
        setResult({
          verdict,
          confidence:      Math.round(data.confidence ?? data.fake_probability ?? 0),
          genuine_prob:    data.genuine_probability,
          fake_prob:       data.fake_probability,
          product_name:    data.product || product.label,
          recommendation:  data.recommendation,
          forensic_signals: data.forensic_signals || [],
          signals:         mapped,
        });
        setPhase("result");
      }, 400);

    } catch (err) {
      clearInterval(sigTimer);
      clearInterval(progTimer);
      setError(`Scan failed: ${err.message}`);
      setPhase("idle");
      setPreview(null);
    }
  }, [product]);

  const captureAndScan = useCallback(async () => {
    if (cameraOn && videoRef.current && canvasRef.current) {
      const video  = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width  = video.videoWidth  || 640;
      canvas.height = video.videoHeight || 480;
      canvas.getContext("2d").drawImage(video, 0, 0);
      canvas.toBlob(blob => { if (blob) runScan(blob); }, "image/jpeg", 0.88);
    } else {
      fileRef.current?.click();
    }
  }, [cameraOn, runScan]);

  const reset = () => {
    setPhase("idle"); setResult(null); setError(null);
    setProgress(0);   setActiveSig(-1); setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const verdictColor = result ? (VERDICT_COLOR[result.verdict] || "#999") : "#999";

  return (
    <div className="scan-root">

      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />

      {/* Product selector */}
      <div className="product-bar">
        <span className="product-label">Product:</span>
        <div className="product-pills">
          {PRODUCTS.map(p => (
            <button
              key={p.id}
              onClick={() => { reset(); setProduct(p); }}
              className={`product-pill${product.id === p.id ? " active" : ""}`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <span className="camera-status">
          {cameraOn ? "📷 Camera live" : "Camera off"}
        </span>
      </div>

      <div className="scan-grid">

        {/* ── Camera / Preview panel ── */}
        <div className="panel">
          <div className="viewport">

            <video
              ref={videoRef}
              autoPlay playsInline muted
              className="live-video"
              style={{ display: cameraOn && phase === "idle" ? "block" : "none" }}
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />

            {preview && phase !== "idle" && (
              <img
                src={preview}
                alt="scan preview"
                className="preview-img"
                style={{ opacity: phase === "scanning" ? 0.35 : 1 }}
              />
            )}

            {!cameraOn && phase === "idle" && (
              <div className="idle-placeholder">
                <div className="upload-box" onClick={() => fileRef.current?.click()}>
                  <div style={{ fontSize: 36 }}>📷</div>
                  <div className="upload-hint">Tap to upload<br/>a product image</div>
                </div>
                <div style={{ fontSize: 10, color: "#333" }}>— or enable camera below —</div>
              </div>
            )}

            {phase === "scanning" && (
              <>
                <div className="sweep-line" />
                {[
                  { top: 16, left: 16, borderTop: "2px solid #00C9A7", borderLeft: "2px solid #00C9A7" },
                  { top: 16, right: 16, borderTop: "2px solid #00C9A7", borderRight: "2px solid #00C9A7" },
                  { bottom: 16, left: 16, borderBottom: "2px solid #00C9A7", borderLeft: "2px solid #00C9A7" },
                  { bottom: 16, right: 16, borderBottom: "2px solid #00C9A7", borderRight: "2px solid #00C9A7" },
                ].map((style, i) => (
                  <div key={i} style={{ position: "absolute", width: 20, height: 20, zIndex: 2, ...style }} />
                ))}
                <div className="scanning-overlay">
                  <div style={{ marginBottom: 14 }}>
                    {SIGNALS.map((sig, i) => (
                      <div key={i} className="signal-row">
                        <div className="signal-dot" style={{
                          background: i < activeSig ? "#43A047" : i === activeSig ? "#00C9A7" : "#333",
                          boxShadow: i === activeSig ? "0 0 6px #00C9A7" : "none",
                        }} />
                        <div className="signal-name" style={{
                          color: i < activeSig ? "#43A047" : i === activeSig ? "#00C9A7" : "#444",
                        }}>
                          {sig}
                        </div>
                        {i < activeSig  && <span style={{ fontSize: 10, color: "#43A047" }}>✓</span>}
                        {i === activeSig && <span className="blink" style={{ fontSize: 9, color: "#00C9A7" }}>●</span>}
                      </div>
                    ))}
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <div style={{ fontSize: 10, color: "#555", marginTop: 6 }}>
                    {Math.round(progress)}% · {Math.ceil(((100 - progress) / 100) * 3.5)}s remaining
                  </div>
                </div>
              </>
            )}

            {phase === "result" && result && (
              <div className="result-overlay">
                <div className="verdict-badge" style={{ borderColor: verdictColor, background: `${verdictColor}18` }}>
                  <span style={{ fontSize: 20 }}>
                    {result.verdict === "GENUINE" ? "✓" : result.verdict === "COUNTERFEIT" ? "✗" : "⚠"}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: verdictColor }}>{result.verdict}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{result.product_name} · {result.confidence}% confidence</div>
                </div>
              </div>
            )}

            {cameraOn && phase === "idle" && (
              <div className="live-badge">● LIVE</div>
            )}
          </div>

          {/* Controls */}
          <div className="panel-controls">
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{product.label}</div>
            <div style={{ fontSize: 11, color: "#555", marginBottom: 14 }}>{product.category}</div>
            {error && (
              <div className="error-box">{error}</div>
            )}
            <div className="control-row">
              {!cameraOn
                ? <button onClick={startCamera} className="btn btn-secondary">Enable Camera</button>
                : <button onClick={stopCamera}  className="btn btn-icon">✕</button>
              }
              {phase === "idle"     && (
                <button onClick={captureAndScan} className="btn btn-primary">
                  {cameraOn ? "Capture & Scan" : "📂 Upload & Scan"}
                </button>
              )}
              {phase === "scanning" && (
                <button disabled className="btn btn-scanning">Analysing...</button>
              )}
              {phase === "result"   && (
                <button onClick={reset} className="btn btn-secondary">Scan Again</button>
              )}
            </div>

            {phase === "idle" && !cameraOn && (
              <div
                className="drop-zone"
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) runScan(f); }}
                onClick={() => fileRef.current?.click()}
              >
                or drag &amp; drop an image here
              </div>
            )}
          </div>
        </div>

        {/* ── Signals panel ── */}
        <div className="panel panel-signals">
          <div className="section-title">
            {phase === "result" ? "Forensic Breakdown" : "Six Forensic Signals"}
          </div>

          {(result?.signals || SIGNALS.map(name => ({ name, status: null }))).map((sig, i) => {
            const isActive = phase === "scanning" && i === activeSig;
            const isDone   = phase === "result";
            return (
              <div key={i} className="signal-item" style={{ opacity: phase === "idle" ? 0.45 : 1 }}>
                <div className="signal-item-dot" style={{
                  background: isDone ? (STATUS_COLOR[sig.status] || "#555") : isActive ? "#00C9A7" : "#333",
                }} />
                <div style={{ flex: 1 }}>
                  <div className="signal-item-name" style={{ color: isDone || isActive ? "#fff" : "#666" }}>
                    {sig.name}
                  </div>
                  {isDone && sig.detail && (
                    <div className="signal-detail">{sig.detail}</div>
                  )}
                  {isActive && (
                    <div style={{ fontSize: 10, color: "#00C9A7", marginTop: 2 }}>Running analysis...</div>
                  )}
                </div>
                {isDone && sig.status && (
                  <div style={{ fontSize: 11, fontWeight: 700, color: STATUS_COLOR[sig.status] || "#555", flexShrink: 0 }}>
                    {sig.status}
                  </div>
                )}
              </div>
            );
          })}

          {phase === "result" && result && (
            <div className="prob-row">
              {[["Genuine", result.genuine_prob, "#43A047"], ["Fake", result.fake_prob, "#E53935"]].map(([label, val, color]) => (
                <div key={label} className="prob-card">
                  <div style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color }}>{val?.toFixed(1)}%</div>
                  <div className="prob-track">
                    <div style={{ height: 3, width: `${val}%`, background: color, borderRadius: 2, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {phase === "result" && result?.forensic_signals?.length > 0 && (
            <div className="forensic-box">
              <div style={{ fontSize: 11, fontWeight: 600, color: "#fff", marginBottom: 8 }}>AI Forensic Signals</div>
              {result.forensic_signals.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                  <span style={{ color: verdictColor, fontSize: 11 }}>⚑</span>
                  <span style={{ fontSize: 11, color: "#888" }}>{s}</span>
                </div>
              ))}
            </div>
          )}

          {phase === "result" && result?.recommendation && (
            <div className="recommendation-box">
              <span style={{ fontSize: 11, color: "#00C9A7", fontWeight: 600 }}>Recommendation: </span>
              <span style={{ fontSize: 11, color: "#888" }}>{result.recommendation}</span>
            </div>
          )}

          {phase === "result" && result?.verdict === "COUNTERFEIT" && (
            <div className="verdict-action-box" style={{ background: "rgba(0,201,167,0.06)", borderColor: "rgba(0,201,167,0.15)" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#00C9A7", marginBottom: 4 }}>Verified Vendors Nearby</div>
              <div style={{ fontSize: 11, color: "#666", lineHeight: 1.6 }}>
                3 pharmacies within 1.2km carry genuine {product.label}. Payment via Squad-powered vendor links.
              </div>
              <button
                onClick={() => navigate(`/vendor/locator?product=${product.label}&city=Lagos`)}
                className="action-btn action-btn-teal"
              >
                Find Verified Vendor →
              </button>
            </div>
          )}

          {phase === "result" && result?.verdict === "GENUINE" && (
            <div className="verdict-action-box" style={{ background: "rgba(67,160,71,0.06)", borderColor: "rgba(67,160,71,0.15)" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#43A047", marginBottom: 4 }}>✓ Product Authenticated</div>
              <div style={{ fontSize: 11, color: "#666" }}>
                This product matches all six forensic reference signals. Safe to purchase.
              </div>
            </div>
          )}

          {phase === "result" && result?.verdict === "SUSPICIOUS" && (
            <div className="verdict-action-box" style={{ background: "rgba(245,166,35,0.06)", borderColor: "rgba(245,166,35,0.2)" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#F5A623", marginBottom: 4 }}>⚠ Proceed with Caution</div>
              <div style={{ fontSize: 11, color: "#666" }}>Anomalies detected. Purchase only from a verified vendor to be safe.</div>
              <button
                onClick={() => navigate(`/vendor/locator?product=${product.label}&city=Lagos`)}
                className="action-btn action-btn-yellow"
              >
                Find Verified Vendor →
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        /* ── Base ── */
        .scan-root {
          padding: 16px;
          max-width: 1100px;
          margin: 0 auto;
          box-sizing: border-box;
        }

        /* ── Product bar ── */
        .product-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .product-label {
          font-size: 12px;
          color: #555;
          white-space: nowrap;
        }
        .product-pills {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .product-pill {
          border: 1px solid #2A2A2A;
          background: #141414;
          color: #666;
          border-radius: 7px;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          min-height: 36px;
          white-space: nowrap;
        }
        .product-pill.active {
          border-color: #00C9A7;
          background: rgba(0,201,167,0.08);
          color: #00C9A7;
        }
        .camera-status {
          margin-left: auto;
          font-size: 11px;
          color: rgb(0,201,167);
          white-space: nowrap;
        }

        /* ── Grid ── */
        .scan-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        /* ── Panel ── */
        .panel {
          background: #141414;
          border: 1px solid #2A2A2A;
          border-radius: 12px;
          overflow: hidden;
        }
        .panel-signals {
          padding: 16px 18px;
          overflow: hidden;
        }

        /* ── Viewport ── */
        .viewport {
          background: #000;
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .live-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .preview-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: opacity 0.3s;
        }

        /* ── Idle placeholder ── */
        .idle-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .upload-box {
          width: 130px;
          height: 130px;
          border: 2px solid #00C9A7;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
        }
        .upload-hint {
          font-size: 10px;
          color: #555;
          text-align: center;
          line-height: 1.5;
        }

        /* ── Scanning ── */
        .sweep-line {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00C9A7, transparent);
          animation: sweep 1.2s ease-in-out infinite;
          z-index: 2;
        }
        .scanning-overlay {
          text-align: center;
          z-index: 3;
          padding: 0 20px;
          position: absolute;
        }
        .signal-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 3px 0;
          justify-content: center;
        }
        .signal-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
          transition: all 0.3s;
        }
        .signal-name {
          font-size: 10.5px;
          transition: color 0.3s;
          white-space: nowrap;
        }
        .progress-track {
          width: 180px;
          background: #1a1a1a;
          border-radius: 3px;
          height: 4px;
          overflow: hidden;
          margin: 0 auto;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #009B82, #00C9A7);
          transition: width 0.15s;
          border-radius: 3px;
        }

        /* ── Result overlay ── */
        .result-overlay {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: rgba(0,0,0,0.72);
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .verdict-badge {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .live-badge {
          position: absolute;
          top: 10px; left: 10px;
          font-size: 10px;
          color: #00C9A7;
          background: rgba(0,201,167,0.1);
          padding: 3px 8px;
          border-radius: 4px;
          border: 1px solid rgba(0,201,167,0.2);
        }

        /* ── Controls ── */
        .panel-controls {
          padding: 14px 16px;
        }
        .error-box {
          font-size: 11px;
          color: #E53935;
          margin-bottom: 10px;
          padding: 8px 10px;
          background: rgba(229,57,53,0.08);
          border-radius: 6px;
        }
        .control-row {
          display: flex;
          gap: 8px;
        }
        .btn {
          border-radius: 8px;
          padding: 0 14px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          white-space: nowrap;
        }
        .btn-primary {
          flex: 1;
          background: #00C9A7;
          color: #000;
        }
        .btn-secondary {
          flex: 1;
          background: #1A1A1A;
          color: #999;
          border: 1px solid #2A2A2A;
        }
        .btn-icon {
          background: #1A1A1A;
          color: #666;
          border: 1px solid #2A2A2A;
          padding: 0 16px;
        }
        .btn-scanning {
          flex: 1;
          background: #0D2E24;
          color: #00C9A7;
          border: 1px solid #009B82;
        }
        .drop-zone {
          margin-top: 12px;
          border: 1px dashed #2A2A2A;
          border-radius: 8px;
          padding: 12px;
          text-align: center;
          font-size: 10px;
          color: #444;
          cursor: pointer;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Signals panel ── */
        .section-title {
          font-size: 11px;
          font-weight: 600;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          margin-bottom: 14px;
        }
        .signal-item {
          display: flex;
          gap: 10px;
          padding: 9px 0;
          border-bottom: 1px solid #1A1A1A;
        }
        .signal-item-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 5px;
          transition: background 0.3s;
        }
        .signal-item-name {
          font-size: 12px;
          font-weight: 500;
        }
        .signal-detail {
          font-size: 10.5px;
          color: #666;
          margin-top: 3px;
          line-height: 1.5;
        }

        /* ── Probability ── */
        .prob-row {
          display: flex;
          gap: 10px;
          margin-top: 14px;
        }
        .prob-card {
          flex: 1;
          background: #111;
          border: 1px solid #1A1A1A;
          border-radius: 8px;
          padding: 10px 12px;
        }
        .prob-track {
          height: 3px;
          background: #1A1A1A;
          border-radius: 2px;
          margin-top: 6px;
        }

        /* ── Forensic / action boxes ── */
        .forensic-box {
          margin-top: 14px;
          background: #111;
          border: 1px solid #1A1A1A;
          border-radius: 8px;
          padding: 12px 14px;
        }
        .recommendation-box {
          margin-top: 10px;
          background: rgba(0,201,167,0.05);
          border: 1px solid rgba(0,201,167,0.15);
          border-radius: 8px;
          padding: 10px 14px;
        }
        .verdict-action-box {
          margin-top: 14px;
          border: 1px solid;
          border-radius: 8px;
          padding: 12px 14px;
        }
        .action-btn {
          margin-top: 8px;
          border: none;
          border-radius: 6px;
          padding: 0 14px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          min-height: 36px;
          display: inline-flex;
          align-items: center;
        }
        .action-btn-teal  { background: #00C9A7; color: #000; }
        .action-btn-yellow { background: #F5A623; color: #000; }

        /* ── Animations ── */
        @keyframes sweep {
          0%   { transform: translateY(0);     opacity: 1;   }
          50%  { transform: translateY(274px); opacity: 0.6; }
          100% { transform: translateY(0);     opacity: 1;   }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .blink { animation: blink 0.8s infinite; }

        /* ── MOBILE (≤ 640px) ── */
        @media (max-width: 640px) {
          .scan-root {
            padding: 12px;
          }

          /* Stack grid to single column */
          .scan-grid {
            grid-template-columns: 1fr;
          }

          /* Tighter product bar */
          .product-bar {
            gap: 6px;
            margin-bottom: 12px;
          }
          .camera-status {
            width: 100%;
            margin-left: 0;
            text-align: right;
          }

          /* Shorter viewport on mobile */
          .viewport {
            height: 220px;
          }
          .upload-box {
            width: 110px;
            height: 110px;
          }

          /* Scanning overlay signals — smaller text */
          .signal-name {
            font-size: 9.5px;
          }
          .progress-track {
            width: 140px;
          }

          /* Controls */
          .panel-controls {
            padding: 12px 14px;
          }
          .btn {
            font-size: 12px;
          }

          /* Signals panel loses border-radius top on mobile (seamless stack) */
          .panel-signals {
            padding: 14px 14px;
          }
          .signal-item-name {
            font-size: 11px;
          }

          /* Make action buttons full-width on mobile */
          .action-btn {
            width: 100%;
            justify-content: center;
          }
        }

        /* ── SMALL MOBILE (≤ 380px) ── */
        @media (max-width: 380px) {
          .viewport {
            height: 190px;
          }
          .product-pill {
            padding: 5px 10px;
            font-size: 11px;
          }
          .signal-name {
            font-size: 9px;
          }
        }
      `}</style>
    </div>
  );
}


// import { useState, useRef, useCallback } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const API = import.meta.env.VITE_API_URL;

// const PRODUCTS = [
//   { id: "coartem",  label: "Coartem",  category: "pharma"    },
//   { id: "vaseline", label: "Vaseline", category: "cosmetics" },
//   { id: "custom",   label: "Other",    category: "general"   },
// ];

// const STATUS_COLOR  = { PASS: "#43A047", FAIL: "#E53935", WARN: "#F5A623" };
// const VERDICT_COLOR = { GENUINE: "#43A047", COUNTERFEIT: "#E53935", SUSPICIOUS: "#F5A623" };

// const SIGNALS = [
//   "NAFDAC Number Validation",
//   "Typography Forensics",
//   "Colour Profile Analysis",
//   "Geometric Ratio Analysis",
//   "Print Quality & Halftone",
//   "OCR Batch Code Check",
// ];

// export default function ScanPage() {
//   const navigate   = useNavigate();
//   const videoRef   = useRef(null);
//   const canvasRef  = useRef(null);
//   const streamRef  = useRef(null);
//   const fileRef    = useRef(null);

//   const [phase,      setPhase]      = useState("idle");
//   const [product,    setProduct]    = useState(PRODUCTS[0]);
//   const [result,     setResult]     = useState(null);
//   const [error,      setError]      = useState(null);
//   const [progress,   setProgress]   = useState(0);
//   const [activeSig,  setActiveSig]  = useState(-1);
//   const [cameraOn,   setCameraOn]   = useState(false);
//   const [inputMode,  setInputMode]  = useState("camera"); // "camera" | "upload"
//   const [uploadPreview, setUploadPreview] = useState(null);
//   const [uploadBase64,  setUploadBase64]  = useState(null);

//   // ── Camera ───────────────────────────────────────────────
//   const startCamera = useCallback(async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: "environment" },
//       });
//       streamRef.current = stream;
//       if (videoRef.current) videoRef.current.srcObject = stream;
//       setCameraOn(true);
//       setError(null);
//     } catch {
//       setError("Camera access denied. Allow camera permission and try again.");
//     }
//   }, []);

//   const stopCamera = useCallback(() => {
//     streamRef.current?.getTracks().forEach(t => t.stop());
//     setCameraOn(false);
//   }, []);

//   // ── File upload ──────────────────────────────────────────
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (ev) => {
//       const dataUrl = ev.target.result;
//       setUploadPreview(dataUrl);
//       // Strip the data:image/...;base64, prefix
//       setUploadBase64(dataUrl.split(",")[1]);
//       setError(null);
//     };
//     reader.readAsDataURL(file);
//   };

//   // ── Scan ─────────────────────────────────────────────────
//   const captureAndScan = useCallback(async () => {
//     setPhase("scanning");
//     setProgress(0);
//     setActiveSig(0);
//     setResult(null);
//     setError(null);

//     let sig = 0;
//     const sigTimer  = setInterval(() => { sig = Math.min(sig + 1, SIGNALS.length - 1); setActiveSig(sig); }, 600);
//     let p = 0;
//     const progTimer = setInterval(() => { p = Math.min(p + 2.5, 95); setProgress(p); }, 100);

//     try {
//       let imageBase64 = null;

//       if (inputMode === "upload" && uploadBase64) {
//         // Use uploaded image
//         imageBase64 = uploadBase64;
//       } else if (inputMode === "camera" && cameraOn && videoRef.current && canvasRef.current) {
//         // Capture from camera
//         const video  = videoRef.current;
//         const canvas = canvasRef.current;
//         canvas.width  = video.videoWidth  || 640;
//         canvas.height = video.videoHeight || 480;
//         canvas.getContext("2d").drawImage(video, 0, 0);
//         imageBase64 = canvas.toDataURL("image/jpeg", 0.8).split(",")[1];
//       }

//       const { data } = await axios.post(`${API}/api/scan`, {
//         image:            imageBase64 || "demo_image",
//         product_name:     product.label,
//         product_category: product.category,
//         region:           "Lagos",
//       });

//       clearInterval(sigTimer);
//       clearInterval(progTimer);
//       setProgress(100);
//       setActiveSig(SIGNALS.length);
//       setTimeout(() => { setResult(data); setPhase("result"); }, 400);
//     } catch {
//       clearInterval(sigTimer);
//       clearInterval(progTimer);
//       setError("Scan failed. Check server connection.");
//       setPhase("idle");
//     }
//   }, [cameraOn, product, inputMode, uploadBase64]);

//   const reset = () => {
//     setPhase("idle");
//     setResult(null);
//     setError(null);
//     setProgress(0);
//     setActiveSig(-1);
//     setUploadPreview(null);
//     setUploadBase64(null);
//     if (fileRef.current) fileRef.current.value = "";
//   };

//   const switchMode = (mode) => {
//     if (mode === "camera" && inputMode !== "camera") {
//       setUploadPreview(null);
//       setUploadBase64(null);
//     }
//     if (mode === "upload" && cameraOn) stopCamera();
//     setInputMode(mode);
//     reset();
//   };

//   const verdictColor = result ? VERDICT_COLOR[result.verdict] || "#999" : "#999";
//   const canScan = inputMode === "camera" ? (cameraOn || true) : !!uploadBase64;

//   return (
//     <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>

//       {/* Product selector */}
//       <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
//         <span style={{ fontSize: 12, color: "#555", marginRight: 4 }}>Product:</span>
//         {PRODUCTS.map(p => (
//           <button key={p.id} onClick={() => { reset(); setProduct(p); }}
//             style={{ border: `1px solid ${product.id === p.id ? "#00C9A7" : "#2A2A2A"}`, background: product.id === p.id ? "rgba(0,201,167,0.08)" : "#141414", color: product.id === p.id ? "#00C9A7" : "#666", borderRadius: 7, padding: "6px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
//             {p.label}
//           </button>
//         ))}

//         {/* Input mode toggle */}
//         <div style={{ marginLeft: "auto", display: "flex", background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: 8, padding: 3, gap: 3 }}>
//           {[["camera", "📷 Camera"], ["upload", "📁 Upload"]].map(([mode, label]) => (
//             <button key={mode} onClick={() => switchMode(mode)}
//               style={{ background: inputMode === mode ? "#00C9A7" : "transparent", color: inputMode === mode ? "#000" : "#666", border: "none", borderRadius: 6, padding: "5px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
//               {label}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

//         {/* ── Left panel ── */}
//         <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, overflow: "hidden" }}>

//           {/* Viewport */}
//           <div style={{ background: "#000", height: 280, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
//             {/* Camera stream */}
//             <video ref={videoRef} autoPlay playsInline muted
//               style={{ width: "100%", height: "100%", objectFit: "cover", display: cameraOn && inputMode === "camera" ? "block" : "none" }} />
//             <canvas ref={canvasRef} style={{ display: "none" }} />

//             {/* Upload preview */}
//             {inputMode === "upload" && uploadPreview && phase !== "scanning" && (
//               <img src={uploadPreview} alt="Upload preview"
//                 style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
//             )}

//             {/* Idle — camera mode, no camera */}
//             {phase === "idle" && inputMode === "camera" && !cameraOn && (
//               <div style={{ width: 130, height: 130, border: "2px solid #00C9A7", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
//                 <div style={{ fontSize: 36 }}>📷</div>
//                 <div style={{ fontSize: 10, color: "#555", textAlign: "center", lineHeight: 1.5 }}>Enable camera or<br/>run demo scan</div>
//               </div>
//             )}

//             {/* Idle — upload mode, no file */}
//             {phase === "idle" && inputMode === "upload" && !uploadPreview && (
//               <div
//                 onClick={() => fileRef.current?.click()}
//                 style={{ width: 160, height: 140, border: "2px dashed #2A2A2A", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", transition: "border-color 0.2s" }}
//                 onMouseEnter={e => e.currentTarget.style.borderColor = "#00C9A7"}
//                 onMouseLeave={e => e.currentTarget.style.borderColor = "#2A2A2A"}>
//                 <div style={{ fontSize: 36 }}>📁</div>
//                 <div style={{ fontSize: 10, color: "#555", textAlign: "center", lineHeight: 1.5 }}>Tap to upload<br/>product photo</div>
//               </div>
//             )}

//             {/* Scanning animation */}
//             {phase === "scanning" && (
//               <>
//                 <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#00C9A7,transparent)", animation: "sweep 1.2s ease-in-out infinite", zIndex: 2 }} />
//                 {[{top:16,left:16},{top:16,right:16},{bottom:16,left:16},{bottom:16,right:16}].map((pos, i) => (
//                   <div key={i} style={{ position: "absolute", width: 20, height: 20, ...pos,
//                     borderTop:    pos.top    !== undefined ? "2px solid #00C9A7" : "none",
//                     borderBottom: pos.bottom !== undefined ? "2px solid #00C9A7" : "none",
//                     borderLeft:   pos.left   !== undefined ? "2px solid #00C9A7" : "none",
//                     borderRight:  pos.right  !== undefined ? "2px solid #00C9A7" : "none",
//                     zIndex: 2 }} />
//                 ))}
//                 <div style={{ textAlign: "center", zIndex: 3, padding: "0 20px" }}>
//                   <div style={{ marginBottom: 14 }}>
//                     {SIGNALS.map((sig, i) => (
//                       <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0", justifyContent: "center" }}>
//                         <div style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
//                           background: i < activeSig ? "#43A047" : i === activeSig ? "#00C9A7" : "#333",
//                           boxShadow: i === activeSig ? "0 0 6px #00C9A7" : "none", transition: "all 0.3s" }} />
//                         <div style={{ fontSize: 10.5, color: i < activeSig ? "#43A047" : i === activeSig ? "#00C9A7" : "#444", transition: "color 0.3s", whiteSpace: "nowrap" }}>
//                           {sig}
//                         </div>
//                         {i < activeSig   && <span style={{ fontSize: 10, color: "#43A047" }}>✓</span>}
//                         {i === activeSig && <span style={{ fontSize: 9, color: "#00C9A7", animation: "blink 0.8s infinite" }}>●</span>}
//                       </div>
//                     ))}
//                   </div>
//                   <div style={{ width: 180, background: "#1a1a1a", borderRadius: 3, height: 4, overflow: "hidden", margin: "0 auto 6px" }}>
//                     <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #009B82, #00C9A7)", transition: "width 0.15s", borderRadius: 3 }} />
//                   </div>
//                   <div style={{ fontSize: 10, color: "#555" }}>{Math.round(progress)}% · {Math.ceil(((100 - progress) / 100) * 3.5)}s remaining</div>
//                 </div>
//               </>
//             )}

//             {/* Result */}
//             {phase === "result" && result && (
//               <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
//                 <div style={{ width: 72, height: 72, borderRadius: "50%", background: `${verdictColor}18`, border: `2px solid ${verdictColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>
//                   {result.verdict === "GENUINE" ? "✓" : result.verdict === "COUNTERFEIT" ? "✗" : "⚠"}
//                 </div>
//                 <div style={{ fontSize: 24, fontWeight: 700, color: verdictColor }}>{result.verdict}</div>
//                 <div style={{ fontSize: 14, color: "#999" }}>{result.confidence}% confidence</div>
//                 {result.mock && <div style={{ fontSize: 10, color: "#444", marginTop: 4 }}>Demo mode · AI service offline</div>}
//               </div>
//             )}

//             {/* Camera live badge */}
//             {cameraOn && inputMode === "camera" && (
//               <div style={{ position: "absolute", top: 10, left: 10, fontSize: 10, color: "#00C9A7", background: "rgba(0,201,167,0.1)", padding: "3px 8px", borderRadius: 4, border: "1px solid rgba(0,201,167,0.2)" }}>● LIVE</div>
//             )}

//             {/* Upload ready badge */}
//             {inputMode === "upload" && uploadPreview && phase === "idle" && (
//               <div style={{ position: "absolute", top: 10, left: 10, fontSize: 10, color: "#00C9A7", background: "rgba(0,201,167,0.1)", padding: "3px 8px", borderRadius: 4, border: "1px solid rgba(0,201,167,0.2)" }}>✓ Image ready</div>
//             )}
//           </div>

//           {/* Controls */}
//           <div style={{ padding: "14px 18px" }}>
//             <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{product.label}</div>
//             <div style={{ fontSize: 11, color: "#555", marginBottom: 14 }}>{product.category}</div>

//             {error && (
//               <div style={{ fontSize: 11, color: "#E53935", marginBottom: 10, padding: "8px 10px", background: "rgba(229,57,53,0.08)", borderRadius: 6 }}>
//                 {error}
//               </div>
//             )}

//             {/* Hidden file input */}
//             <input
//               ref={fileRef}
//               type="file"
//               accept="image/*"
//               style={{ display: "none" }}
//               onChange={handleFileChange}
//             />

//             <div style={{ display: "flex", gap: 8 }}>
//               {/* Left button — camera toggle OR upload trigger */}
//               {inputMode === "camera" ? (
//                 !cameraOn
//                   ? <button onClick={startCamera} style={{ flex: 1, background: "#1A1A1A", color: "#999", border: "1px solid #2A2A2A", borderRadius: 8, padding: 10, fontSize: 12, cursor: "pointer" }}>Enable Camera</button>
//                   : <button onClick={stopCamera}  style={{ background: "#1A1A1A", color: "#666", border: "1px solid #2A2A2A", borderRadius: 8, padding: "10px 14px", fontSize: 12, cursor: "pointer" }}>✕</button>
//               ) : (
//                 phase !== "result" && (
//                   <button onClick={() => fileRef.current?.click()} style={{ flex: 1, background: "#1A1A1A", color: "#999", border: "1px solid #2A2A2A", borderRadius: 8, padding: 10, fontSize: 12, cursor: "pointer" }}>
//                     {uploadPreview ? "Change Photo" : "Choose Photo"}
//                   </button>
//                 )
//               )}

//               {/* Right button — action */}
//               {phase === "idle" && (
//                 <button
//                   onClick={captureAndScan}
//                   disabled={inputMode === "upload" && !uploadBase64}
//                   style={{ flex: 1, background: inputMode === "upload" && !uploadBase64 ? "#1A1A1A" : "#00C9A7", color: inputMode === "upload" && !uploadBase64 ? "#444" : "#000", border: inputMode === "upload" && !uploadBase64 ? "1px solid #2A2A2A" : "none", borderRadius: 8, padding: 10, fontSize: 13, fontWeight: 700, cursor: inputMode === "upload" && !uploadBase64 ? "not-allowed" : "pointer" }}>
//                   {inputMode === "upload"
//                     ? (uploadBase64 ? "Analyse Photo →" : "Upload photo first")
//                     : (cameraOn ? "Scan Product" : "Demo Scan")}
//                 </button>
//               )}
//               {phase === "scanning" && (
//                 <button disabled style={{ flex: 1, background: "#0D2E24", color: "#00C9A7", border: "1px solid #009B82", borderRadius: 8, padding: 10, fontSize: 13 }}>
//                   Analysing...
//                 </button>
//               )}
//               {phase === "result" && (
//                 <button onClick={reset} style={{ flex: 1, background: "#1A1A1A", color: "#666", border: "1px solid #2A2A2A", borderRadius: 8, padding: 10, fontSize: 13, cursor: "pointer" }}>
//                   Scan Again
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* ── Signals panel ── */}
//         <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "16px 18px" }}>
//           <div style={{ fontSize: 11, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>
//             {phase === "result" ? "Forensic Breakdown" : "Six Forensic Signals"}
//           </div>

//           {(result?.signals || SIGNALS.map(name => ({ name, status: null }))).map((sig, i) => {
//             const isActive = phase === "scanning" && i === activeSig;
//             const isDone   = phase === "result";
//             return (
//               <div key={i} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: "1px solid #1A1A1A", opacity: phase === "idle" ? 0.45 : 1 }}>
//                 <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, marginTop: 5,
//                   background: isDone ? (STATUS_COLOR[sig.status] || "#555") : isActive ? "#00C9A7" : "#333",
//                   transition: "background 0.3s" }} />
//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontSize: 12, fontWeight: 500, color: isDone || isActive ? "#fff" : "#666" }}>{sig.name}</div>
//                   {isDone && sig.detail && <div style={{ fontSize: 10.5, color: "#666", marginTop: 3, lineHeight: 1.5 }}>{sig.detail}</div>}
//                   {isActive && <div style={{ fontSize: 10, color: "#00C9A7", marginTop: 2 }}>Running analysis...</div>}
//                 </div>
//                 {isDone && sig.status && (
//                   <div style={{ fontSize: 11, fontWeight: 700, color: STATUS_COLOR[sig.status] || "#555", flexShrink: 0 }}>
//                     {sig.status}
//                   </div>
//                 )}
//               </div>
//             );
//           })}

//           {/* Product detected by AI */}
//           {phase === "result" && result?.product && result.product !== product.label && (
//             <div style={{ marginTop: 12, padding: "8px 10px", background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.15)", borderRadius: 6 }}>
//               <div style={{ fontSize: 10, color: "#60A5FA", fontWeight: 600, marginBottom: 2 }}>AI identified product</div>
//               <div style={{ fontSize: 11, color: "#888" }}>{result.product}</div>
//             </div>
//           )}

//           {/* Recommendation */}
//           {phase === "result" && result?.recommendation && (
//             <div style={{ marginTop: 10, padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 6 }}>
//               <div style={{ fontSize: 11, color: "#555", lineHeight: 1.5 }}>{result.recommendation}</div>
//             </div>
//           )}

//           {/* COUNTERFEIT action */}
//           {phase === "result" && result?.verdict === "COUNTERFEIT" && (
//             <div style={{ marginTop: 14, background: "rgba(0,201,167,0.06)", border: "1px solid rgba(0,201,167,0.15)", borderRadius: 8, padding: "12px 14px" }}>
//               <div style={{ fontSize: 11, fontWeight: 600, color: "#00C9A7", marginBottom: 4 }}>Verified Vendors Nearby</div>
//               <div style={{ fontSize: 11, color: "#666", lineHeight: 1.6, marginBottom: 8 }}>Pharmacies within 1.2km carry genuine {product.label}. Pay via Squad, get a receipt code.</div>
//               <button
//                 onClick={() => navigate(`/vendor/locator?product=${product.label}&city=Lagos`)}
//                 style={{ background: "#00C9A7", color: "#000", border: "none", borderRadius: 6, padding: "8px 16px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
//                 Find Verified Vendor →
//               </button>
//             </div>
//           )}

//           {/* GENUINE confirmation */}
//           {phase === "result" && result?.verdict === "GENUINE" && (
//             <div style={{ marginTop: 14, background: "rgba(67,160,71,0.06)", border: "1px solid rgba(67,160,71,0.15)", borderRadius: 8, padding: "12px 14px" }}>
//               <div style={{ fontSize: 11, fontWeight: 600, color: "#43A047", marginBottom: 4 }}>✓ Product Authenticated</div>
//               <div style={{ fontSize: 11, color: "#666" }}>This product passes forensic verification. Safe to purchase.</div>
//             </div>
//           )}
//         </div>
//       </div>

//       <style>{`
//         @keyframes sweep {
//           0%   { transform: translateY(0);     opacity: 1;   }
//           50%  { transform: translateY(274px); opacity: 0.6; }
//           100% { transform: translateY(0);     opacity: 1;   }
//         }
//         @keyframes blink {
//           0%, 100% { opacity: 1; }
//           50%       { opacity: 0; }
//         }
//       `}</style>
//     </div>
//   );
// }