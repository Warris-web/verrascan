import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function BrandPortal() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [brands,   setBrands]  = useState([]);
  const [loading,  setLoading] = useState(true);
  const [tab,      setTab]     = useState("products");

  useEffect(() => {
    axios.get(`${API}/api/brands/mine`)
      .then(r => setBrands(r.data.brands))
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40, color: "#555", textAlign: "center" }}>Loading brand data...</div>;

  const STATUS_COLOR = { active: "#43A047", pending: "#F5A623" };

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: "#00C9A7", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Brand Management Portal</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>Welcome, {user?.name}</div>
          <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>Manage your registered products and protection status</div>
        </div>
        <button onClick={() => navigate("/onboard")} style={{ background: "#00C9A7", color: "#000", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          + Register New Product
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid #2A2A2A", paddingBottom: 0 }}>
        {["products", "scans", "alerts"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background: "transparent", border: "none", borderBottom: `2px solid ${tab === t ? "#00C9A7" : "transparent"}`, color: tab === t ? "#00C9A7" : "#555", padding: "10px 18px", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize", marginBottom: -1 }}>
            {t}
          </button>
        ))}
      </div>

      {/* Products tab */}
      {tab === "products" && (
        <div>
          {brands.length === 0 ? (
            <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "48px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📦</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>No products registered yet</div>
              <div style={{ fontSize: 12, color: "#555", marginBottom: 20 }}>Register your first product to start protecting it from counterfeits</div>
              <button onClick={() => navigate("/onboard")} style={{ background: "#00C9A7", color: "#000", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                Register Product →
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
              {brands.map((brand, i) => (
                <div key={i} style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>{brand.product_name}</div>
                      <div style={{ fontSize: 11, color: "#555" }}>{brand.company_name}</div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: STATUS_COLOR[brand.status] || "#555", background: `${STATUS_COLOR[brand.status] || "#555"}15`, border: `1px solid ${STATUS_COLOR[brand.status] || "#555"}`, borderRadius: 4, padding: "3px 8px", textTransform: "uppercase" }}>
                      {brand.status}
                    </span>
                  </div>
                  {[
                    ["NAFDAC No.", brand.nafdac_number],
                    ["Pantone",    brand.pantone_code || "—"],
                    ["Batch Format", brand.batch_format || "—"],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12 }}>
                      <span style={{ color: "#555" }}>{k}</span>
                      <span style={{ color: "#999", fontFamily: "monospace" }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: "1px solid #222", paddingTop: 12, marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "#444" }}>{new Date(brand.created_at).toLocaleDateString()}</span>
                    {brand.status === "pending" && (
                      <span style={{ fontSize: 10, color: "#F5A623" }}>Awaiting Squad payment confirmation</span>
                    )}
                    {brand.status === "active" && (
                      <span style={{ fontSize: 10, color: "#43A047" }}>✓ Protected by VeraScann</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Scans tab */}
      {tab === "scans" && (
        <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "20px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Scan Activity — Your Products</div>
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
                { product: "Coartem 20/120mg", region: "Kano North",   verdict: "COUNTERFEIT", confidence: 91, time: "2m ago"  },
                { product: "Coartem 20/120mg", region: "Abuja Central",verdict: "GENUINE",     confidence: 97, time: "14m ago" },
                { product: "Coartem 20/120mg", region: "Lagos Island", verdict: "COUNTERFEIT", confidence: 88, time: "1h ago"  },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #1A1A1A" }}>
                  <td style={{ padding: "10px", fontSize: 12, color: "#fff" }}>{row.product}</td>
                  <td style={{ padding: "10px", fontSize: 12, color: "#666" }}>{row.region}</td>
                  <td style={{ padding: "10px" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: row.verdict === "GENUINE" ? "#43A047" : "#E53935", background: row.verdict === "GENUINE" ? "rgba(67,160,71,0.1)" : "rgba(229,57,53,0.1)", padding: "3px 8px", borderRadius: 4 }}>
                      {row.verdict}
                    </span>
                  </td>
                  <td style={{ padding: "10px", fontSize: 12, color: "#666" }}>{row.confidence}%</td>
                  <td style={{ padding: "10px", fontSize: 11, color: "#444" }}>{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Alerts tab */}
      {tab === "alerts" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { title: "Counterfeit detected — Kano North", body: "A fake Coartem pack was scanned in Kano North market. 91% confidence. NAFDAC has been notified.", color: "#E53935", time: "2 minutes ago" },
            { title: "Counterfeit detected — Lagos Island", body: "Another fake Coartem detected. This is the 3rd detection this week in Lagos Island.", color: "#E53935", time: "1 hour ago" },
            { title: "Product registered successfully", body: "Coartem 20/120mg has been added to the VeraScann verification pipeline.", color: "#43A047", time: "2 days ago" },
          ].map((alert, i) => (
            <div key={i} style={{ background: "#141414", border: `1px solid ${alert.color}30`, borderLeft: `3px solid ${alert.color}`, borderRadius: 10, padding: "14px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: alert.color, marginBottom: 4 }}>{alert.title}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{alert.body}</div>
                </div>
                <div style={{ fontSize: 11, color: "#444", flexShrink: 0, marginLeft: 16 }}>{alert.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}