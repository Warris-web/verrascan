// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";
// import Topbar          from "./components/Topbar";
// import ScanPage        from "./pages/ScanPage";
// import DashboardPage   from "./pages/DashboardPage";
// import OnboardPage     from "./pages/OnboardPage";
// import LoginPage       from "./pages/LoginPage";
// import BrandPortal     from "./pages/BrandPortal";
// import NafdacPortal    from "./pages/NafdacPortal";
// import "./App.css";

// function Protected({ role, children }) {
//   const { user, loading } = useAuth();
//   if (loading) return <div style={{ padding: 40, color: "#555", textAlign: "center" }}>Loading...</div>;
//   if (!user)   return <Navigate to="/login" replace />;
//   if (role && user.role !== role) return <Navigate to="/login" replace />;
//   return children;
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Topbar />
//       <Routes>
//         <Route path="/"       element={<ScanPage />} />
//         <Route path="/onboard" element={<OnboardPage />} />
//         <Route path="/login"  element={<LoginPage />} />

//         {/* Protected — NAFDAC only */}
//         <Route path="/dashboard" element={
//           <Protected role="nafdac"><NafdacPortal /></Protected>
//         } />

//         {/* Protected — Brand only */}
//         <Route path="/brand" element={
//           <Protected role="brand"><BrandPortal /></Protected>
//         } />
//       </Routes>
//     </BrowserRouter>
//   );
// }


// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useAuth }         from "./context/AuthContext";
// import Topbar              from "./components/Topbar";
// import ScanPage            from "./pages/ScanPage";
// import OnboardPage         from "./pages/OnboardPage";
// import LoginPage           from "./pages/LoginPage";
// import BrandPortal         from "./pages/BrandPortal";
// import NafdacPortal        from "./pages/NafdacPortal";
// import VendorRegisterPage  from "./pages/VendorRegisterPage";
// import VendorLocatorPage   from "./pages/VendorLocatorPage";
// import VendorPortal       from "./pages/VendorPortal";
// import "./App.css";

// function Protected({ role, children }) {
//   const { user, loading } = useAuth();
//   if (loading) return <div style={{ padding: 40, color: "#555", textAlign: "center" }}>Loading...</div>;
//   if (!user)   return <Navigate to="/login" replace />;
//   if (role && user.role !== role) return <Navigate to="/login" replace />;
//   return children;
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Topbar />
//       <Routes>
//         <Route path="/"                element={<ScanPage />} />
//         <Route path="/onboard"         element={<OnboardPage />} />
//         <Route path="/login"           element={<LoginPage />} />
//         <Route path="/vendor/register" element={<VendorRegisterPage />} />
//         <Route path="/vendor/locator"  element={<VendorLocatorPage />} />

//         <Route path="/dashboard" element={
//           <Protected role="nafdac"><NafdacPortal /></Protected>
//         } />
//         <Route path="/brand" element={
//           <Protected role="brand"><BrandPortal /></Protected>
//         } />
//         <Route path="/vendor/portal" element={
//           <Protected role="vendor"><VendorPortal /></Protected>
//         } />
//       </Routes>
//     </BrowserRouter>
//   );
// }

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth }         from "./context/AuthContext";
import Topbar              from "./components/Topbar";
import ScanPage            from "./pages/ScanPage";
import OnboardPage         from "./pages/OnboardPage";
import LoginPage           from "./pages/LoginPage";
import BrandPortal         from "./pages/BrandPortal";
import NafdacPortal        from "./pages/NafdacPortal";
import VendorPortal        from "./pages/VendorPortal";
import VendorRegisterPage  from "./pages/VendorRegisterPage";
import VendorLocatorPage   from "./pages/VendorLocatorPage";
import "./App.css";

function Protected({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 40, color: "#555", textAlign: "center" }}>Loading...</div>;
  if (!user)   return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Topbar />
      <Routes>
        <Route path="/"                element={<ScanPage />} />
        <Route path="/onboard"         element={<OnboardPage />} />
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/vendor/register" element={<VendorRegisterPage />} />
        <Route path="/vendor/locator"  element={<VendorLocatorPage />} />

        <Route path="/dashboard" element={
          <Protected role="nafdac"><NafdacPortal /></Protected>
        } />
        <Route path="/brand" element={
          <Protected role="brand"><BrandPortal /></Protected>
        } />
        <Route path="/vendor/portal" element={
          <Protected role="vendor"><VendorPortal /></Protected>
        } />
      </Routes>
    </BrowserRouter>
  );
}
