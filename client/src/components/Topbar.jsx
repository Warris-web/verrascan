import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const { pathname }   = useLocation();
  const { user, logout } = useAuth();
  const navigate       = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

//   const links = [
//     { label: "Scanner",  path: "/",        always: true },
//     { label: "Onboard",  path: "/onboard", always: true },
//     { label: "NAFDAC",   path: "/dashboard", role: "nafdac" },
//     { label: "My Brands", path: "/brand",   role: "brand" },
//   ].filter(l => l.always || (user && user.role === l.role));

  // const links = [
  //   { label: "Scanner",          path: "/",                always: true },
  //   { label: "Onboard",          path: "/onboard",         always: true },
  //   { label: "Vendor Network",   path: "/vendor/register", always: true },
  //   { label: "NAFDAC",           path: "/dashboard",       role: "nafdac" },
  //   { label: "My Brands",        path: "/brand",           role: "brand" },
  // ].filter(l => l.always || (user && user.role === l.role));

  const links = [
  { label: "Scanner", path: "/scan", always: true },
  { label: "Onboard",       path: "/onboard",         always: true  },
  { label: "Vendor Network",path: "/vendor/register", always: true  },
  { label: "NAFDAC",        path: "/dashboard",       role: "nafdac"},
  { label: "My Brands",     path: "/brand",           role: "brand" },
  { label: "Vendor Portal",   path: "/vendor/portal",   role: "vendor"},

].filter(l => l.always || (user && user.role === l.role));

  return (
    <nav style={{ background: "#141414", borderBottom: "1px solid #2A2A2A", padding: "0 28px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: -0.5 }}>
        Flux<span style={{ color: "#00C9A7" }}>Squad</span>
        <span style={{ fontSize: 10, color: "#555", fontWeight: 400, marginLeft: 10 }}></span>
      </div>

      <div style={{ display: "flex", gap: 4 }}>
        {links.map(({ label, path }) => (
          <Link key={path} to={path} style={{ fontSize: 12, fontWeight: 500, color: pathname === path ? "#00C9A7" : "#666", padding: "6px 14px", borderRadius: 6, background: pathname === path ? "rgba(0,201,167,0.08)" : "transparent", border: `1px solid ${pathname === path ? "rgba(0,201,167,0.2)" : "transparent"}` }}>
            {label}
          </Link>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {user ? (
          <>
            <div style={{ fontSize: 11, color: "#666" }}>
              {user.name} · <span style={{ color: user.role === "nafdac" ? "#F5A623" : "#00C9A7", textTransform: "uppercase", fontSize: 10 }}>{user.role}</span>
            </div>
            <button onClick={handleLogout} style={{ background: "transparent", color: "#555", border: "1px solid #2A2A2A", borderRadius: 6, padding: "5px 12px", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={{ fontSize: 12, color: "#00C9A7", border: "1px solid rgba(0,201,167,0.3)", borderRadius: 6, padding: "5px 12px" }}>
            Login
          </Link>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#00C9A7" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00C9A7", animation: "pulse 2s infinite" }} />
          Live
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </nav>
  );
}