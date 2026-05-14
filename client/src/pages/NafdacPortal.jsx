// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import axios from "axios";

// const API = import.meta.env.VITE_API_URL;
// const RISK_COLOR = { HIGH: "#E53935", MEDIUM: "#F5A623", LOW: "#43A047" };

// export default function NafdacPortal() {
//   const { user }      = useAuth();
//   const navigate      = useNavigate();
//   const [stats,       setStats]   = useState(null);
//   const [loading,     setLoading] = useState(true);
//   const [activeAlert, setActiveAlert] = useState(true);

//   useEffect(() => {
//     axios.get(`${API}/api/dashboard/stats`)
//       .then(r => setStats(r.data.stats))
//       .catch(() => navigate("/login"))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <div style={{ padding: 40, color: "#555", textAlign: "center" }}>Loading intelligence data...</div>;
//   if (!stats)  return null;

//   const maxCount = Math.max(...stats.heatmap.map(h => h.count));

//   return (
//     <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
//       {/* Header */}
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
//         <div>
//           <div style={{ fontSize: 11, color: "#F5A623", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>NAFDAC Intelligence Dashboard</div>
//           <div style={{ fontSize: 22, fontWeight: 700 }}>Welcome, {user?.name}</div>
//           <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>Real-time counterfeit intelligence · Nigeria-wide</div>
//         </div>
//         <div style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)", borderRadius: 8, padding: "8px 16px", textAlign: "right" }}>
//           <div style={{ fontSize: 10, color: "#F5A623", marginBottom: 2 }}>ACCESS LEVEL</div>
//           <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>NAFDAC Officer · Full Access</div>
//         </div>
//       </div>

//       {/* Stat cards */}
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
//         {[
//           { label: "Total scans",           value: stats.total_scans.toLocaleString(),           color: "#00C9A7", sub: "All time" },
//           { label: "Counterfeits detected", value: stats.counterfeits_detected.toLocaleString(), color: "#E53935", sub: "Flagged products" },
//           { label: "Detection rate",        value: `${stats.detection_rate}%`,                   color: "#F5A623", sub: "Of all scans" },
//         ].map((m, i) => (
//           <div key={i} style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 10, padding: "18px 20px" }}>
//             <div style={{ fontSize: 11, color: "#555", marginBottom: 8 }}>{m.label}</div>
//             <div style={{ fontSize: 32, fontWeight: 700, color: m.color }}>{m.value}</div>
//             <div style={{ fontSize: 11, color: "#444", marginTop: 4 }}>{m.sub}</div>
//           </div>
//         ))}
//       </div>

//       {/* Active alert */}
//       {activeAlert && (
//         <div style={{ background: "rgba(229,57,53,0.05)", border: "1px solid rgba(229,57,53,0.25)", borderRadius: 10, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
//           <div>
//             <div style={{ fontSize: 12, fontWeight: 700, color: "#E53935", marginBottom: 4 }}>⚠ Active Alert — Kano North</div>
//             <div style={{ fontSize: 11, color: "#666" }}>34 fake Coartem scans this week. Concentration rising. Recommend immediate field deployment.</div>
//           </div>
//           <div style={{ display: "flex", gap: 8, flexShrink: 0, marginLeft: 16 }}>
//             <button onClick={() => setActiveAlert(false)} style={{ background: "#E53935", color: "#fff", border: "none", borderRadius: 7, padding: "8px 16px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
//               Deploy Team →
//             </button>
//             <button onClick={() => setActiveAlert(false)} style={{ background: "transparent", color: "#555", border: "1px solid #2A2A2A", borderRadius: 7, padding: "8px 12px", fontSize: 11, cursor: "pointer" }}>
//               Dismiss
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Heatmap */}
//       <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
//           <div style={{ fontSize: 14, fontWeight: 600 }}>Counterfeit Concentration — Regional Heatmap</div>
//           <div style={{ fontSize: 10, color: "#555", background: "#111", border: "1px solid #2A2A2A", borderRadius: 4, padding: "3px 8px" }}>Live · updates every scan</div>
//         </div>
//         <div style={{ fontSize: 11, color: "#555", marginBottom: 20 }}>Geographic intelligence across all active scan regions</div>

//         {stats.heatmap.map((row, i) => (
//           <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
//             <div style={{ width: 120, fontSize: 12, color: "#999", flexShrink: 0 }}>{row.region}</div>
//             <div style={{ flex: 1, background: "#111", borderRadius: 4, height: 10, overflow: "hidden" }}>
//               <div style={{ width: `${(row.count / maxCount) * 100}%`, height: "100%", background: RISK_COLOR[row.risk], borderRadius: 4, transition: "width 1s ease" }} />
//             </div>
//             <div style={{ width: 32, fontSize: 13, fontWeight: 600, color: "#fff", textAlign: "right", flexShrink: 0 }}>{row.count}</div>
//             <div style={{ width: 65, fontSize: 10, fontWeight: 700, color: RISK_COLOR[row.risk], textAlign: "center", background: `${RISK_COLOR[row.risk]}15`, border: `1px solid ${RISK_COLOR[row.risk]}`, borderRadius: 4, padding: "2px 6px", flexShrink: 0 }}>{row.risk}</div>
//             <div style={{ width: 110, fontSize: 11, color: "#555", flexShrink: 0 }}>{row.product}</div>
//           </div>
//         ))}
//       </div>

//       {/* Recent scans table */}
//       <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "20px 24px" }}>
//         <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Recent Scan Activity</div>
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr>
//               {["Product", "Region", "Verdict", "Confidence", "Time"].map(h => (
//                 <th key={h} style={{ fontSize: 10, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.07em", padding: "6px 10px", textAlign: "left", borderBottom: "1px solid #222" }}>{h}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {[
//               { product: "Coartem 20/120mg",     region: "Kano North",    verdict: "COUNTERFEIT", confidence: 91, time: "2m ago" },
//               { product: "Vaseline 250ml",        region: "Lagos Island",  verdict: "GENUINE",     confidence: 96, time: "5m ago" },
//               { product: "Coartem 20/120mg",      region: "Kano North",   verdict: "COUNTERFEIT", confidence: 88, time: "11m ago" },
//               { product: "Paracetamol 500mg",     region: "Onitsha",      verdict: "SUSPICIOUS",  confidence: 62, time: "18m ago" },
//               { product: "Brake Pad — Toyota",    region: "Lagos Island", verdict: "COUNTERFEIT", confidence: 94, time: "24m ago" },
//             ].map((row, i) => (
//               <tr key={i} style={{ borderBottom: "1px solid #1A1A1A" }}>
//                 <td style={{ padding: "10px 10px", fontSize: 12, color: "#fff" }}>{row.product}</td>
//                 <td style={{ padding: "10px 10px", fontSize: 12, color: "#666" }}>{row.region}</td>
//                 <td style={{ padding: "10px 10px" }}>
//                   <span style={{ fontSize: 10, fontWeight: 700, color: row.verdict === "GENUINE" ? "#43A047" : row.verdict === "COUNTERFEIT" ? "#E53935" : "#F5A623", background: row.verdict === "GENUINE" ? "rgba(67,160,71,0.1)" : row.verdict === "COUNTERFEIT" ? "rgba(229,57,53,0.1)" : "rgba(245,166,35,0.1)", padding: "3px 8px", borderRadius: 4 }}>
//                     {row.verdict}
//                   </span>
//                 </td>
//                 <td style={{ padding: "10px 10px", fontSize: 12, color: "#666" }}>{row.confidence}%</td>
//                 <td style={{ padding: "10px 10px", fontSize: 11, color: "#444" }}>{row.time}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { useNavigate }         from "react-router-dom";
import { useAuth }             from "../context/AuthContext";
import axios                   from "axios";

const API        = import.meta.env.VITE_API_URL;
const RISK_COLOR = { HIGH: "#E53935", MEDIUM: "#F5A623", LOW: "#43A047" };
const V_COLOR    = { GENUINE: "#43A047", COUNTERFEIT: "#E53935", SUSPICIOUS: "#F5A623" };

export default function NafdacPortal() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [tab,      setTab]     = useState("overview");
  const [stats,    setStats]   = useState(null);
  const [vendors,  setVendors] = useState([]);
  const [brands,   setBrands]  = useState([]);
  const [loading,  setLoading] = useState(true);
  const [alert,    setAlert]   = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("vs_token");
    Promise.all([
      axios.get(`${API}/api/dashboard/stats`),
      axios.get(`${API}/api/vendors/`,   { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${API}/api/brands/`,    { headers: { Authorization: `Bearer ${token}` } }),
    ])
      .then(([s, v, b]) => {
        setStats(s.data.stats);
        setVendors(v.data.vendors);
        setBrands(b.data.brands);
      })
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, []);

  const activateVendor = async (id) => {
    const token = localStorage.getItem("vs_token");
    await axios.post(`${API}/api/vendors/activate`,
      { vendor_id: id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setVendors(v => v.map(x => x._id === id ? { ...x, status: "active" } : x));
  };

  const activateBrand = async (id) => {
    const token = localStorage.getItem("vs_token");
    await axios.patch(`${API}/api/brands/${id}/activate`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setBrands(b => b.map(x => x._id === id ? { ...x, status: "active" } : x));
  };

  if (loading) return <div style={{ padding: 40, color: "#555", textAlign: "center" }}>Loading intelligence data...</div>;
  if (!stats)  return null;

  const maxCount = Math.max(...(stats.heatmap?.map(h => h.count) || [1]));

  const TABS = ["overview", "scans", "vendors", "brands"];

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: "#F5A623", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>NAFDAC Intelligence Dashboard</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>Welcome, {user?.name}</div>
          <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>Full administrative access · Nigeria-wide intelligence</div>
        </div>
        <div style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)", borderRadius: 8, padding: "10px 16px", textAlign: "right" }}>
          <div style={{ fontSize: 10, color: "#F5A623", marginBottom: 2 }}>ACCESS LEVEL</div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>NAFDAC Officer · Full Admin</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid #2A2A2A", marginBottom: 20 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background: "transparent", border: "none", borderBottom: `2px solid ${tab === t ? "#F5A623" : "transparent"}`, color: tab === t ? "#F5A623" : "#555", padding: "10px 18px", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize", marginBottom: -1 }}>
            {t}
            {t === "vendors" && <span style={{ marginLeft: 6, fontSize: 10, background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: 10, padding: "1px 6px", color: "#666" }}>{vendors.length}</span>}
            {t === "brands"  && <span style={{ marginLeft: 6, fontSize: 10, background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: 10, padding: "1px 6px", color: "#666" }}>{brands.length}</span>}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === "overview" && (
        <div>
          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
            {[
              { label: "Total scans",     value: stats.total_scans.toLocaleString(),           color: "#00C9A7" },
              { label: "Counterfeits",    value: stats.counterfeits_detected.toLocaleString(), color: "#E53935" },
              { label: "Active brands",   value: `${stats.active_brands}/${stats.total_brands}`, color: "#F5A623" },
              { label: "Active vendors",  value: `${stats.active_vendors}/${stats.total_vendors}`, color: "#60A5FA" },
            ].map((m, i) => (
              <div key={i} style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 10, padding: "16px 18px" }}>
                <div style={{ fontSize: 11, color: "#555", marginBottom: 8 }}>{m.label}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Alert */}
          {alert && (
            <div style={{ background: "rgba(229,57,53,0.05)", border: "1px solid rgba(229,57,53,0.25)", borderRadius: 10, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#E53935", marginBottom: 4 }}>⚠ Active Alert — Kano North</div>
                <div style={{ fontSize: 11, color: "#666" }}>34 fake Coartem scans this week. Concentration rising. Recommend immediate field deployment.</div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0, marginLeft: 16 }}>
                <button onClick={() => setAlert(false)} style={{ background: "#E53935", color: "#fff", border: "none", borderRadius: 7, padding: "8px 16px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Deploy Team →</button>
                <button onClick={() => setAlert(false)} style={{ background: "transparent", color: "#555", border: "1px solid #2A2A2A", borderRadius: 7, padding: "8px 12px", fontSize: 11, cursor: "pointer" }}>Dismiss</button>
              </div>
            </div>
          )}

          {/* Heatmap */}
          <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Counterfeit Concentration Heatmap</div>
            <div style={{ fontSize: 11, color: "#555", marginBottom: 20 }}>Real-time geographic intelligence</div>
            {stats.heatmap.map((row, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <div style={{ width: 120, fontSize: 12, color: "#999", flexShrink: 0 }}>{row.region}</div>
                <div style={{ flex: 1, background: "#111", borderRadius: 4, height: 10, overflow: "hidden" }}>
                  <div style={{ width: `${(row.count / maxCount) * 100}%`, height: "100%", background: RISK_COLOR[row.risk], borderRadius: 4, transition: "width 1s" }} />
                </div>
                <div style={{ width: 32, fontSize: 13, fontWeight: 600, color: "#fff", textAlign: "right", flexShrink: 0 }}>{row.count}</div>
                <div style={{ width: 65, fontSize: 10, fontWeight: 700, color: RISK_COLOR[row.risk], textAlign: "center", background: `${RISK_COLOR[row.risk]}15`, border: `1px solid ${RISK_COLOR[row.risk]}`, borderRadius: 4, padding: "2px 6px", flexShrink: 0 }}>{row.risk}</div>
                <div style={{ width: 110, fontSize: 11, color: "#555", flexShrink: 0 }}>{row.product}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SCANS ── */}
      {tab === "scans" && (
        <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "20px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Recent Scan Activity</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Product", "Region", "Verdict", "Confidence", "Time"].map(h => (
                  <th key={h} style={{ fontSize: 10, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.07em", padding: "6px 10px", textAlign: "left", borderBottom: "1px solid #222" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recent_activity.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #1A1A1A" }}>
                  <td style={{ padding: "10px", fontSize: 12, color: "#fff" }}>{row.product}</td>
                  <td style={{ padding: "10px", fontSize: 12, color: "#666" }}>{row.region}</td>
                  <td style={{ padding: "10px" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: V_COLOR[row.verdict], background: `${V_COLOR[row.verdict]}18`, padding: "3px 8px", borderRadius: 4 }}>{row.verdict}</span>
                  </td>
                  <td style={{ padding: "10px", fontSize: 12, color: "#666" }}>{row.confidence}%</td>
                  <td style={{ padding: "10px", fontSize: 11, color: "#444" }}>{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── VENDORS ── */}
      {tab === "vendors" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Vendor Network Management</div>
            <div style={{ fontSize: 12, color: "#555" }}>{vendors.filter(v => v.status === "active").length} active · {vendors.filter(v => v.status === "pending").length} pending approval</div>
          </div>
          {vendors.length === 0 ? (
            <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: 40, textAlign: "center", color: "#555" }}>No vendors registered yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {vendors.map((v, i) => (
                <div key={i} style={{ background: "#141414", border: `1px solid ${v.status === "active" ? "rgba(67,160,71,0.2)" : "#2A2A2A"}`, borderRadius: 10, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{v.pharmacy_name}</div>
                      <span style={{ fontSize: 9, fontWeight: 700, color: v.status === "active" ? "#43A047" : "#F5A623", background: v.status === "active" ? "rgba(67,160,71,0.1)" : "rgba(245,166,35,0.1)", border: `1px solid ${v.status === "active" ? "#43A047" : "#F5A623"}`, borderRadius: 4, padding: "2px 6px", textTransform: "uppercase" }}>{v.status}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>{v.address}, {v.city}, {v.state}</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {(v.products || []).map((p, j) => (
                        <span key={j} style={{ fontSize: 10, color: "#555", background: "#111", border: "1px solid #222", borderRadius: 4, padding: "2px 6px" }}>{p}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0, marginLeft: 16 }}>
                    <a href={`tel:${v.phone}`} style={{ background: "#1A1A1A", color: "#666", border: "1px solid #2A2A2A", borderRadius: 7, padding: "8px 12px", fontSize: 11, textDecoration: "none" }}>📞</a>
                    {v.status === "pending" && (
                      <button onClick={() => activateVendor(v._id)} style={{ background: "#43A047", color: "#fff", border: "none", borderRadius: 7, padding: "8px 16px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                        Activate →
                      </button>
                    )}
                    {v.status === "active" && (
                      <span style={{ fontSize: 11, color: "#43A047", padding: "8px 12px" }}>✓ Active</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── BRANDS ── */}
      {tab === "brands" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Brand Registration Management</div>
            <div style={{ fontSize: 12, color: "#555" }}>{brands.filter(b => b.status === "active").length} active · {brands.filter(b => b.status === "pending").length} pending</div>
          </div>
          {brands.length === 0 ? (
            <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: 40, textAlign: "center", color: "#555" }}>No brands registered yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {brands.map((b, i) => (
                <div key={i} style={{ background: "#141414", border: `1px solid ${b.status === "active" ? "rgba(0,201,167,0.2)" : "#2A2A2A"}`, borderRadius: 10, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{b.product_name}</div>
                      <span style={{ fontSize: 9, fontWeight: 700, color: b.status === "active" ? "#00C9A7" : "#F5A623", background: b.status === "active" ? "rgba(0,201,167,0.1)" : "rgba(245,166,35,0.1)", border: `1px solid ${b.status === "active" ? "#00C9A7" : "#F5A623"}`, borderRadius: 4, padding: "2px 6px", textTransform: "uppercase" }}>{b.status}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>{b.company_name} · {b.contact_email}</div>
                    <div style={{ fontSize: 11, color: "#444", fontFamily: "monospace" }}>NAFDAC: {b.nafdac_number}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0, marginLeft: 16 }}>
                    {b.status === "pending" && (
                      <button onClick={() => activateBrand(b._id)} style={{ background: "#00C9A7", color: "#000", border: "none", borderRadius: 7, padding: "8px 16px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                        Activate →
                      </button>
                    )}
                    {b.status === "active" && (
                      <span style={{ fontSize: 11, color: "#00C9A7", padding: "8px 12px" }}>✓ Protected</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}