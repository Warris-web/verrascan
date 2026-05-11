import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const RISK_COLOR = { HIGH: "#E53935", MEDIUM: "#F5A623", LOW: "#43A047" };

export default function NafdacPortal() {
  const { user }      = useAuth();
  const navigate      = useNavigate();
  const [stats,       setStats]   = useState(null);
  const [loading,     setLoading] = useState(true);
  const [activeAlert, setActiveAlert] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/dashboard/stats`)
      .then(r => setStats(r.data.stats))
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40, color: "#555", textAlign: "center" }}>Loading intelligence data...</div>;
  if (!stats)  return null;

  const maxCount = Math.max(...stats.heatmap.map(h => h.count));

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: "#F5A623", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>NAFDAC Intelligence Dashboard</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>Welcome, {user?.name}</div>
          <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>Real-time counterfeit intelligence · Nigeria-wide</div>
        </div>
        <div style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)", borderRadius: 8, padding: "8px 16px", textAlign: "right" }}>
          <div style={{ fontSize: 10, color: "#F5A623", marginBottom: 2 }}>ACCESS LEVEL</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>NAFDAC Officer · Full Access</div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total scans",           value: stats.total_scans.toLocaleString(),           color: "#00C9A7", sub: "All time" },
          { label: "Counterfeits detected", value: stats.counterfeits_detected.toLocaleString(), color: "#E53935", sub: "Flagged products" },
          { label: "Detection rate",        value: `${stats.detection_rate}%`,                   color: "#F5A623", sub: "Of all scans" },
        ].map((m, i) => (
          <div key={i} style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 10, padding: "18px 20px" }}>
            <div style={{ fontSize: 11, color: "#555", marginBottom: 8 }}>{m.label}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: 11, color: "#444", marginTop: 4 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Active alert */}
      {activeAlert && (
        <div style={{ background: "rgba(229,57,53,0.05)", border: "1px solid rgba(229,57,53,0.25)", borderRadius: 10, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#E53935", marginBottom: 4 }}>⚠ Active Alert — Kano North</div>
            <div style={{ fontSize: 11, color: "#666" }}>34 fake Coartem scans this week. Concentration rising. Recommend immediate field deployment.</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0, marginLeft: 16 }}>
            <button onClick={() => setActiveAlert(false)} style={{ background: "#E53935", color: "#fff", border: "none", borderRadius: 7, padding: "8px 16px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
              Deploy Team →
            </button>
            <button onClick={() => setActiveAlert(false)} style={{ background: "transparent", color: "#555", border: "1px solid #2A2A2A", borderRadius: 7, padding: "8px 12px", fontSize: 11, cursor: "pointer" }}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Heatmap */}
      <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Counterfeit Concentration — Regional Heatmap</div>
          <div style={{ fontSize: 10, color: "#555", background: "#111", border: "1px solid #2A2A2A", borderRadius: 4, padding: "3px 8px" }}>Live · updates every scan</div>
        </div>
        <div style={{ fontSize: 11, color: "#555", marginBottom: 20 }}>Geographic intelligence across all active scan regions</div>

        {stats.heatmap.map((row, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{ width: 120, fontSize: 12, color: "#999", flexShrink: 0 }}>{row.region}</div>
            <div style={{ flex: 1, background: "#111", borderRadius: 4, height: 10, overflow: "hidden" }}>
              <div style={{ width: `${(row.count / maxCount) * 100}%`, height: "100%", background: RISK_COLOR[row.risk], borderRadius: 4, transition: "width 1s ease" }} />
            </div>
            <div style={{ width: 32, fontSize: 13, fontWeight: 600, color: "#fff", textAlign: "right", flexShrink: 0 }}>{row.count}</div>
            <div style={{ width: 65, fontSize: 10, fontWeight: 700, color: RISK_COLOR[row.risk], textAlign: "center", background: `${RISK_COLOR[row.risk]}15`, border: `1px solid ${RISK_COLOR[row.risk]}`, borderRadius: 4, padding: "2px 6px", flexShrink: 0 }}>{row.risk}</div>
            <div style={{ width: 110, fontSize: 11, color: "#555", flexShrink: 0 }}>{row.product}</div>
          </div>
        ))}
      </div>

      {/* Recent scans table */}
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
            {[
              { product: "Coartem 20/120mg",     region: "Kano North",    verdict: "COUNTERFEIT", confidence: 91, time: "2m ago" },
              { product: "Vaseline 250ml",        region: "Lagos Island",  verdict: "GENUINE",     confidence: 96, time: "5m ago" },
              { product: "Coartem 20/120mg",      region: "Kano North",   verdict: "COUNTERFEIT", confidence: 88, time: "11m ago" },
              { product: "Paracetamol 500mg",     region: "Onitsha",      verdict: "SUSPICIOUS",  confidence: 62, time: "18m ago" },
              { product: "Brake Pad — Toyota",    region: "Lagos Island", verdict: "COUNTERFEIT", confidence: 94, time: "24m ago" },
            ].map((row, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #1A1A1A" }}>
                <td style={{ padding: "10px 10px", fontSize: 12, color: "#fff" }}>{row.product}</td>
                <td style={{ padding: "10px 10px", fontSize: 12, color: "#666" }}>{row.region}</td>
                <td style={{ padding: "10px 10px" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: row.verdict === "GENUINE" ? "#43A047" : row.verdict === "COUNTERFEIT" ? "#E53935" : "#F5A623", background: row.verdict === "GENUINE" ? "rgba(67,160,71,0.1)" : row.verdict === "COUNTERFEIT" ? "rgba(229,57,53,0.1)" : "rgba(245,166,35,0.1)", padding: "3px 8px", borderRadius: 4 }}>
                    {row.verdict}
                  </span>
                </td>
                <td style={{ padding: "10px 10px", fontSize: 12, color: "#666" }}>{row.confidence}%</td>
                <td style={{ padding: "10px 10px", fontSize: 11, color: "#444" }}>{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}