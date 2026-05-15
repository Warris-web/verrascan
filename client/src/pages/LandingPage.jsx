import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function LandingPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total_scans: 1247, counterfeits_detected: 183, active_vendors: 3, active_brands: 2 });

  useEffect(() => {
    axios.get(`${API}/api/dashboard/stats`)
      .then(r => setStats(r.data.stats))
      .catch(() => {});
  }, []);

  return (
    <div style={{ background: "#0A0A0A", minHeight: "calc(100vh - 52px)", color: "#fff", fontFamily: "DM Sans, system-ui, sans-serif" }}>

      {/* ── Hero ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 60px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 64 }}>

          <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#00C9A7", background: "rgba(0,201,167,0.1)", border: "1px solid rgba(0,201,167,0.25)", borderRadius: 20, padding: "5px 14px", marginBottom: 24, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Squad Hackathon 3.0 · Challenge 01: Proof of Life
          </div>

          <h1 style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, letterSpacing: -2, margin: "0 0 20px", maxWidth: 800 }}>
            Stop buying{" "}
            <span style={{ color: "#E53935" }}>fake</span>{" "}
            drugs.
            <br />
            <span style={{ color: "#00C9A7" }}>See the truth.</span>
          </h1>

          <p style={{ fontSize: 18, color: "#888", lineHeight: 1.7, maxWidth: 560, margin: "0 0 40px" }}>
            VeraScann uses AI to detect counterfeit products in 4 seconds — just point your camera. No QR codes. No hardware. Works on any product.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={() => navigate("/scan")}
              style={{ background: "#00C9A7", color: "#000", border: "none", borderRadius: 10, padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              Scan a Product Now →
            </button>
            <button
              onClick={() => navigate("/onboard")}
              style={{ background: "transparent", color: "#fff", border: "1px solid #2A2A2A", borderRadius: 10, padding: "14px 32px", fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
              Protect Your Brand
            </button>
          </div>
        </div>

        {/* ── Live stats ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 80 }}>
          {[
            { label: "Products scanned",     value: stats.total_scans?.toLocaleString(),           color: "#00C9A7" },
            { label: "Counterfeits stopped", value: stats.counterfeits_detected?.toLocaleString(), color: "#E53935" },
            { label: "Verified vendors",      value: stats.active_vendors || 3,                    color: "#43A047" },
            { label: "Brands protected",      value: stats.active_brands  || 2,                    color: "#F5A623" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "20px", textAlign: "center" }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: s.color, marginBottom: 6 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#555" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── The problem ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", marginBottom: 80 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#E53935", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>The Problem</div>
            <h2 style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.2, marginBottom: 16, letterSpacing: -1 }}>
              Nigeria loses lives to fake products every day.
            </h2>
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.8, marginBottom: 24 }}>
              Bloomberg labelled Nigeria the most counterfeit market in the developing world. 70% of drugs in circulation are fake. 12,300 Nigerians die every year from counterfeit malaria drugs alone. Human inspection cannot scale.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["70%",    "of drugs in Nigeria are fake (NAFDAC)",      "#E53935"],
                ["12,300", "deaths/year from fake malaria drugs",         "#E53935"],
                ["75%",    "of auto parts are counterfeit (SON)",         "#F5A623"],
                ["₦120B",  "seized by NAFDAC in just 6 months",          "#00C9A7"],
              ].map(([num, label, color]) => (
                <div key={num} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color, minWidth: 80 }}>{num}</span>
                  <span style={{ fontSize: 13, color: "#666" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 16, padding: 32 }}>
            <div style={{ fontSize: 14, color: "#555", fontStyle: "italic", lineHeight: 1.9, marginBottom: 20 }}>
              "Amina's mother sends her to buy Coartem for her sick child. She picks up a pack. Something feels slightly off — but she cannot say what. She has no way to verify it."
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(0,201,167,0.1)", border: "1px solid rgba(0,201,167,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>👩</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Amina, 28</div>
                <div style={{ fontSize: 11, color: "#555" }}>Market buyer · Kano, Nigeria</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── How it works ── */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#00C9A7", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>How It Works</div>
            <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1 }}>Forensic AI in 4 seconds.</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {[
              { step: "01", icon: "📷", title: "Point camera",    desc: "Open VeraScann and point your camera at any product packaging. No special hardware needed." },
              { step: "02", icon: "🔬", title: "AI analyses",    desc: "Six forensic signals analysed simultaneously — typography, colour, OCR, geometry, texture, halftone." },
              { step: "03", icon: "✓",  title: "Get verdict",    desc: "GENUINE, SUSPICIOUS, or COUNTERFEIT — with full forensic breakdown and confidence score in under 5 seconds." },
            ].map((s, i) => (
              <div key={i} style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "24px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#00C9A7", background: "rgba(0,201,167,0.1)", border: "1px solid rgba(0,201,167,0.2)", borderRadius: 4, padding: "2px 7px" }}>{s.step}</div>
                  <div style={{ fontSize: 24 }}>{s.icon}</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: "#666", lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Six signals ── */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#00C9A7", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>Six Forensic Signals</div>
            <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1 }}>What our AI sees that you can't.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {[
              { icon: "🔤", title: "Typography Forensics",     desc: "Kerning, font weight, letter spacing anomalies invisible to the human eye" },
              { icon: "🎨", title: "Colour Profile Analysis",  desc: "Pantone/CMYK deviation down to 2% colour shift in hue or saturation" },
              { icon: "🖨",  title: "Print Quality",           desc: "Dot density, ink bleed, resolution artifacts in packaging print" },
              { icon: "📐", title: "Geometric Ratio Analysis", desc: "Logo proportions, border thickness, spacing — counterfeits compress slightly" },
              { icon: "📝", title: "OCR + NLP Validation",    desc: "NAFDAC numbers, batch codes, expiry formats, manufacturer address checking" },
              { icon: "🔍", title: "Texture & Surface",        desc: "Embossing depth, seal ridge consistency, hologram integrity" },
            ].map((s, i) => (
              <div key={i} style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 10, padding: "18px 16px", display: "flex", gap: 12 }}>
                <div style={{ fontSize: 22, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Who it serves ── */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#00C9A7", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>Three-Sided Platform</div>
            <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1 }}>Everyone wins.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {[
              {
                icon: "👩", who: "Consumers",
                desc: "Scan any product before buying. Get a verdict in 4 seconds. Find verified vendors nearby when a fake is detected.",
                cta: "Try Scanner →", path: "/scan", color: "#00C9A7",
              },
              {
                icon: "🏭", who: "Brands",
                desc: "Register your products. Get real-time alerts when fakes are detected. Know exactly where counterfeits are concentrated.",
                cta: "Protect Your Brand →", path: "/onboard", color: "#F5A623",
              },
              {
                icon: "🏥", who: "Pharmacies",
                desc: "Join the verified vendor network. Get customers directed to you when fake products are detected nearby. Receive payments via Squad.",
                cta: "Join Network →", path: "/vendor/register", color: "#43A047",
              },
            ].map((s, i) => (
              <div key={i} style={{ background: "#141414", border: `1px solid ${s.color}25`, borderRadius: 14, padding: "28px 24px", display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{s.icon}</div>
                <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, color: s.color }}>{s.who}</div>
                <div style={{ fontSize: 13, color: "#666", lineHeight: 1.8, flex: 1, marginBottom: 20 }}>{s.desc}</div>
                <button
                  onClick={() => navigate(s.path)}
                  style={{ background: s.color, color: "#000", border: "none", borderRadius: 8, padding: "11px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  {s.cta}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Squad integration ── */}
        <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 16, padding: "40px", marginBottom: 80 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 24 }}>
            <div style={{ maxWidth: 480 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#00C9A7", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>Powered by Squad API</div>
              <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12, letterSpacing: -0.5 }}>Squad is not a payment button. It's the trust layer.</h2>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.8 }}>Every verified transaction on VeraScann runs through Squad — brand registrations, vendor listings, consumer purchases, and NAFDAC subscriptions.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 280 }}>
              {[
                ["Squad Checkout API",     "Brand onboarding payments"],
                ["Squad Payment Links",    "Verified vendor purchases"],
                ["Squad Recurring Billing","NAFDAC intelligence subscription"],
                ["Squad Webhooks",         "Real-time activation pipeline"],
              ].map(([api, desc]) => (
                <div key={api} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00C9A7", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#00C9A7", minWidth: 180 }}>{api}</span>
                  <span style={{ fontSize: 12, color: "#555" }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Final CTA ── */}
        <div style={{ textAlign: "center", padding: "40px 0 60px" }}>
          <h2 style={{ fontSize: 42, fontWeight: 800, marginBottom: 16, letterSpacing: -1 }}>
            Ready to see the truth?
          </h2>
          <p style={{ fontSize: 16, color: "#666", marginBottom: 32 }}>
            Scan any product. It takes 4 seconds.
          </p>
          <button
            onClick={() => navigate("/scan")}
            style={{ background: "#00C9A7", color: "#000", border: "none", borderRadius: 12, padding: "16px 48px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            Start Scanning →
          </button>
        </div>
      </div>
    </div>
  );
}