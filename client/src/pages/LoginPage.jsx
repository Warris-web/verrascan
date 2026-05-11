import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const [tab,        setTab]     = useState("nafdac");
  const [email,      setEmail]   = useState("");
  const [password,   setPassword]= useState("");
  const [loading,    setLoading] = useState(false);
  const [error,      setError]   = useState(null);

  const PRESETS = {
    nafdac: { email: "ngozi@nafdac.gov.ng", password: "nafdac123" },
    brand:  { email: "brand@roche.com",     password: "roche123"  },
  };

  const fillPreset = (role) => {
    setTab(role);
    setEmail(PRESETS[role].email);
    setPassword(PRESETS[role].password);
    setError(null);
  };

  const handleLogin = async () => {
    setLoading(true); setError(null);
    try {
      const user = await login(email, password);
      navigate(user.role === "nafdac" ? "/dashboard" : "/brand");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally { setLoading(false); }
  };

  const inp = { width: "100%", background: "#111", border: "1px solid #2A2A2A", borderRadius: 7, padding: "11px 13px", fontSize: 13, color: "#fff", outline: "none", fontFamily: "inherit", marginTop: 5 };

  return (
    <div style={{ minHeight: "calc(100vh - 52px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
            Vera<span style={{ color: "#00C9A7" }}>Scann</span> Portal
          </div>
          <div style={{ fontSize: 12, color: "#555" }}>Secure access for authorized users</div>
        </div>

        {/* Role tabs */}
        <div style={{ display: "flex", background: "#141414", border: "1px solid #2A2A2A", borderRadius: 10, padding: 4, marginBottom: 20, gap: 4 }}>
          {["nafdac", "brand"].map(role => (
            <button key={role} onClick={() => fillPreset(role)} style={{ flex: 1, background: tab === role ? "#00C9A7" : "transparent", color: tab === role ? "#000" : "#666", border: "none", borderRadius: 7, padding: "8px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {role === "nafdac" ? "NAFDAC Officer" : "Brand Portal"}
            </button>
          ))}
        </div>

        <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "24px 24px" }}>
          {/* Role badge */}
          <div style={{ display: "inline-block", fontSize: 10, fontWeight: 700, color: tab === "nafdac" ? "#F5A623" : "#00C9A7", background: tab === "nafdac" ? "rgba(245,166,35,0.1)" : "rgba(0,201,167,0.1)", border: `1px solid ${tab === "nafdac" ? "rgba(245,166,35,0.3)" : "rgba(0,201,167,0.3)"}`, borderRadius: 4, padding: "3px 8px", marginBottom: 18, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {tab === "nafdac" ? "NAFDAC Intelligence Access" : "Brand Management Portal"}
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: "#666" }}>Email Address</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" style={inp} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, color: "#666" }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" style={inp}
              onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>

          {error && (
            <div style={{ fontSize: 11, color: "#E53935", marginBottom: 14, padding: "8px 10px", background: "rgba(229,57,53,0.08)", borderRadius: 6, border: "1px solid rgba(229,57,53,0.2)" }}>
              {error}
            </div>
          )}

          <button onClick={handleLogin} disabled={loading || !email || !password} style={{ width: "100%", background: "#00C9A7", color: "#000", border: "none", borderRadius: 8, padding: 12, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: loading || !email || !password ? 0.6 : 1 }}>
            {loading ? "Signing in..." : `Sign in as ${tab === "nafdac" ? "NAFDAC Officer" : "Brand"}`}
          </button>

          {/* Demo hint */}
          <div style={{ marginTop: 16, padding: "10px 12px", background: "#111", borderRadius: 7, border: "1px solid #222" }}>
            <div style={{ fontSize: 10, color: "#444", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Demo credentials</div>
            <div style={{ fontSize: 11, color: "#555" }}>
              NAFDAC: ngozi@nafdac.gov.ng / nafdac123<br />
              Brand: brand@roche.com / roche123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}