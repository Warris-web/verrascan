import { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const RISK_COLOR = { HIGH: "#E53935", MEDIUM: "#F5A623", LOW: "#43A047" };

export default function DashboardPage() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/dashboard/stats`)
      .then(r => setStats(r.data.stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40, color: "#555", textAlign: "center" }}>Loading intelligence data...</div>;
  if (!stats)  return <div style={{ padding: 40, color: "#E53935", textAlign: "center" }}>Failed to load dashboard.</div>;

  const maxCount = Math.max(...stats.heatmap.map(h => h.count));

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total scans",           value: stats.total_scans.toLocaleString(),           color: "#00C9A7" },
          { label: "Counterfeits detected", value: stats.counterfeits_detected.toLocaleString(), color: "#E53935" },
          { label: "Detection rate",        value: `${stats.detection_rate}%`,                   color: "#F5A623" },
        ].map((m, i) => (
          <div key={i} style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 10, padding: "18px 20px" }}>
            <div style={{ fontSize: 11, color: "#555", marginBottom: 8 }}>{m.label}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Counterfeit Concentration — Regional Heatmap</div>
        <div style={{ fontSize: 11, color: "#555", marginBottom: 20 }}>Real-time geographic intelligence · NAFDAC dashboard</div>
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

      <div style={{ background: "rgba(229,57,53,0.05)", border: "1px solid rgba(229,57,53,0.2)", borderRadius: 10, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#E53935", marginBottom: 4 }}>⚠ Active Alert — Kano North</div>
          <div style={{ fontSize: 11, color: "#666" }}>34 fake Coartem scans this week. Recommend deploying inspection team. Field officer auto-notified.</div>
        </div>
        <button style={{ background: "#E53935", color: "#fff", border: "none", borderRadius: 7, padding: "8px 16px", fontSize: 11, fontWeight: 700, cursor: "pointer", flexShrink: 0, marginLeft: 16 }}>
          Deploy Team →
        </button>
      </div>
    </div>
  );
}