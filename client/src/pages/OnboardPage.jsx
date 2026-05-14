// import { useState } from "react";
// import axios from "axios";

// const API = import.meta.env.VITE_API_URL;
// const STEPS = ["Company Details", "Product Specs", "Squad Payment", "Active"];

// export default function OnboardPage() {
//   const [step,    setStep]    = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error,   setError]   = useState(null);

//   const [form, setForm] = useState({
//     company_name: "", product_name: "", nafdac_number: "",
//     pantone_code: "", batch_format: "", contact_email: "",
//   });

//   const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

//   const submit = async () => {
//     setLoading(true); setError(null);
//     try {
//       const { data } = await axios.post(`${API}/api/brands/register`, form);
//       if (data.payment_url) window.open(data.payment_url, "_blank");
//       setStep(3);
//     } catch (err) {
//       setError(err.response?.data?.error || "Registration failed. Check server.");
//     } finally { setLoading(false); }
//   };

//   const inp = { width: "100%", background: "#111", border: "1px solid #2A2A2A", borderRadius: 7, padding: "10px 13px", fontSize: 13, color: "#fff", outline: "none", fontFamily: "inherit" };
//   const lbl = { fontSize: 11, color: "#666", marginBottom: 5, display: "block" };
//   const btn = { background: "#00C9A7", color: "#000", border: "none", borderRadius: 8, padding: "11px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" };
//   const sec = { background: "transparent", color: "#666", border: "1px solid #2A2A2A", borderRadius: 8, padding: "11px 20px", fontSize: 13, cursor: "pointer" };

//   return (
//     <div style={{ padding: 24, maxWidth: 640, margin: "0 auto" }}>
//       <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Brand Onboarding</div>
//       <div style={{ fontSize: 12, color: "#555", marginBottom: 24 }}>Register your product. Protect it from counterfeits. Powered by Squad API.</div>

//       {/* Stepper */}
//       <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
//         {STEPS.map((label, i) => (
//           <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : 0 }}>
//             <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//               <div style={{ width: 28, height: 28, borderRadius: "50%", background: step > i ? "#00C9A7" : i === step ? "rgba(0,201,167,0.15)" : "#1A1A1A", border: `1px solid ${step >= i ? "#00C9A7" : "#2A2A2A"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: step > i ? "#000" : i === step ? "#00C9A7" : "#555", marginBottom: 5 }}>
//                 {step > i ? "✓" : i + 1}
//               </div>
//               <div style={{ fontSize: 9.5, color: step >= i ? "#00C9A7" : "#444", whiteSpace: "nowrap" }}>{label}</div>
//             </div>
//             {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: step > i ? "#00C9A7" : "#2A2A2A", margin: "0 6px", marginBottom: 18 }} />}
//           </div>
//         ))}
//       </div>

//       <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "24px 26px" }}>

//         {step === 0 && (
//           <div>
//             <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 18 }}>Company Details</div>
//             {[["Company Name", "company_name", "e.g. Roche Nigeria Ltd"], ["Contact Email", "contact_email", "brand@company.com"]].map(([label, key, ph]) => (
//               <div key={key} style={{ marginBottom: 14 }}>
//                 <label style={lbl}>{label}</label>
//                 <input placeholder={ph} value={form[key]} onChange={e => set(key, e.target.value)} style={inp} />
//               </div>
//             ))}
//             <button onClick={() => setStep(1)} disabled={!form.company_name || !form.contact_email} style={{ ...btn, opacity: !form.company_name || !form.contact_email ? 0.5 : 1, marginTop: 6 }}>
//               Continue →
//             </button>
//           </div>
//         )}

//         {step === 1 && (
//           <div>
//             <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 18 }}>Product Security Specifications</div>
//             {[
//               ["Product Name",        "product_name",  "e.g. Coartem 20/120mg"],
//               ["NAFDAC Reg. Number",  "nafdac_number", "e.g. A4-1234"],
//               ["Pantone Colour Code", "pantone_code",  "e.g. 186C"],
//               ["Batch Code Format",   "batch_format",  "e.g. MM-YYYY-XXXX"],
//             ].map(([label, key, ph]) => (
//               <div key={key} style={{ marginBottom: 14 }}>
//                 <label style={lbl}>{label}</label>
//                 <input placeholder={ph} value={form[key]} onChange={e => set(key, e.target.value)} style={inp} />
//               </div>
//             ))}
//             <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
//               <button onClick={() => setStep(0)} style={sec}>Back</button>
//               <button onClick={() => setStep(2)} disabled={!form.product_name || !form.nafdac_number} style={{ ...btn, opacity: !form.product_name || !form.nafdac_number ? 0.5 : 1 }}>Continue →</button>
//             </div>
//           </div>
//         )}

//         {step === 2 && (
//           <div>
//             <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Squad Payment</div>
//             <div style={{ fontSize: 11, color: "#555", marginBottom: 18 }}>Powered by Squad Checkout API · GTBank SquadCo</div>
//             <div style={{ background: "#111", border: "1px solid #2A2A2A", borderRadius: 10, padding: "16px 18px", marginBottom: 18 }}>
//               {[["Product", form.product_name], ["Company", form.company_name], ["NAFDAC No.", form.nafdac_number], ["Monthly Fee", "₦50,000"]].map(([k, v]) => (
//                 <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 12 }}>
//                   <span style={{ color: "#666" }}>{k}</span>
//                   <span style={{ color: k === "Monthly Fee" ? "#00C9A7" : "#fff", fontWeight: k === "Monthly Fee" ? 700 : 400 }}>{v}</span>
//                 </div>
//               ))}
//               <div style={{ borderTop: "1px solid #2A2A2A", paddingTop: 10, display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700 }}>
//                 <span>Total Due</span><span style={{ color: "#00C9A7" }}>₦50,000/mo</span>
//               </div>
//             </div>
//             {error && <div style={{ fontSize: 11, color: "#E53935", marginBottom: 12, padding: "8px 10px", background: "rgba(229,57,53,0.08)", borderRadius: 6 }}>{error}</div>}
//             <div style={{ display: "flex", gap: 10 }}>
//               <button onClick={() => setStep(1)} style={sec}>Back</button>
//               <button onClick={submit} disabled={loading} style={{ ...btn, flex: 1, opacity: loading ? 0.7 : 1 }}>
//                 {loading ? "Processing..." : "Pay ₦50,000 via Squad →"}
//               </button>
//             </div>
//           </div>
//         )}

//        {step === 3 && (
//           <div style={{ textAlign: "center", padding: "20px 0" }}>
//             <div style={{ width: 68, height: 68, borderRadius: "50%", background: "rgba(0,201,167,0.1)", border: "2px solid #00C9A7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, margin: "0 auto 16px" }}>✓</div>
//             <div style={{ fontSize: 18, fontWeight: 700, color: "#00C9A7", marginBottom: 8 }}>Registration Submitted</div>
//             <div style={{ fontSize: 12, color: "#666", marginBottom: 20 }}>Squad webhook will confirm payment and activate your protection pipeline.</div>

//             <div style={{ background: "#0D2E24", border: "1px solid #009B82", borderRadius: 8, padding: "14px 16px", textAlign: "left", marginBottom: 14 }}>
//               <div style={{ fontSize: 11, fontWeight: 600, color: "#00C9A7", marginBottom: 8 }}>What happens next</div>
//               {[
//                 "Squad payment confirmed via webhook",
//                 "Product specs ingested into verification database",
//                 "EfficientNet model fine-tuning initiated",
//                 "VeraScann protection active within 24 hours",
//               ].map((item, i) => (
//                 <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
//                   <span style={{ color: "#00C9A7", fontSize: 11 }}>✓</span>
//                   <span style={{ fontSize: 11, color: "#666" }}>{item}</span>
//                 </div>
//               ))}
//             </div>

//             <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 8, padding: "14px 16px", textAlign: "left", marginBottom: 16 }}>
//               <div style={{ fontSize: 11, fontWeight: 600, color: "#fff", marginBottom: 8 }}>🔐 Your Brand Portal Access</div>
//               <div style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>
//                 Your login credentials have been sent to <strong style={{ color: "#fff" }}>{form.contact_email}</strong>
//               </div>
//               <div style={{ display: "flex", gap: 10 }}>
//                 <button
//                   onClick={() => navigate("/login")}
//                   style={{ flex: 1, background: "#00C9A7", color: "#000", border: "none", borderRadius: 8, padding: "11px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
//                   Login to Brand Portal →
//                 </button>
//               </div>
//             </div>

//             <button
//               onClick={() => {
//                 setStep(0);
//                 setForm({ company_name: "", product_name: "", nafdac_number: "", pantone_code: "", batch_format: "", contact_email: "" });
//               }}
//               style={{ background: "transparent", color: "#555", border: "1px solid #2A2A2A", borderRadius: 8, padding: "10px 20px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
//               Register Another Product
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios                 from "axios";



const API   = import.meta.env.VITE_API_URL;
const STEPS = ["Company Details", "Squad Payment", "Done"];

export default function OnboardPage() {
  // Auto-activate when Squad redirects back
useEffect(() => {
  if (searchParams.get("status") === "success" && form.contact_email) {
    axios.post(`${API}/api/brands/activate-by-email`, {
      contact_email: form.contact_email,
    }).catch(() => {});
  }
}, []);
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();
  const [step,    setStep]    = useState(
    searchParams.get("status") === "success" ? 2 : 0
  );
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  // const [form,    setForm]    = useState({
  //   company_name: "", contact_email: "",
  // });

  const [form, setForm] = useState({
      company_name: "", contact_email: "", password: "", confirm_password: "",
    });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // const submit = async () => {
  //   setLoading(true); setError(null);
  //   try {
  //     const { data } = await axios.post(`${API}/api/brands/register`, form);
  //     if (data.payment_url) window.open(data.payment_url, "_blank");
  //     setStep(2);
  //   } catch (err) {
  //     setError(err.response?.data?.error || "Registration failed");
  //   } finally { setLoading(false); }
  // };

//   const submit = async () => {
//   setLoading(true); setError(null);
//   try {
//     const { data } = await axios.post(`${API}/api/brands/register`, {
//       company_name:  form.company_name,
//       contact_email: form.contact_email,
//       password:      form.password,
//     });
//     if (data.payment_url) window.open(data.payment_url, "_blank");
//     setStep(2);
//   } catch (err) {
//     setError(err.response?.data?.error || "Registration failed");
//   } finally { setLoading(false); }
// };

const submit = async () => {
  setLoading(true); setError(null);
  try {
    const { data } = await axios.post(`${API}/api/brands/register`, {
      company_name:  form.company_name,
      contact_email: form.contact_email,
      password:      form.password,
    });
    if (data.payment_url) {
      // Open Squad payment in same tab so redirect works
      window.location.href = data.payment_url;
    } else {
      // Mock/dev mode — no Squad keys
      setStep(2);
    }
  } catch (err) {
    setError(err.response?.data?.error || "Registration failed");
  } finally { setLoading(false); }
};
  const inp = { width: "100%", background: "#111", border: "1px solid #2A2A2A", borderRadius: 7, padding: "11px 13px", fontSize: 13, color: "#fff", outline: "none", fontFamily: "inherit" };
  const lbl = { fontSize: 11, color: "#666", marginBottom: 5, display: "block" };
  const btn = { background: "#00C9A7", color: "#000", border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" };
  const sec = { background: "transparent", color: "#666", border: "1px solid #2A2A2A", borderRadius: 8, padding: "12px 20px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" };

  return (
    <div style={{ padding: 24, maxWidth: 520, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: "#00C9A7", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Brand Onboarding</div>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Register your company</div>
        <div style={{ fontSize: 12, color: "#555" }}>
          Pay once — ₦50,000/mo. Then add unlimited products from your brand portal.
        </div>
      </div>

      {/* Stepper */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
        {STEPS.map((label, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: step > i ? "#00C9A7" : i === step ? "rgba(0,201,167,0.15)" : "#1A1A1A", border: `1px solid ${step >= i ? "#00C9A7" : "#2A2A2A"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: step > i ? "#000" : i === step ? "#00C9A7" : "#555", marginBottom: 5 }}>
                {step > i ? "✓" : i + 1}
              </div>
              <div style={{ fontSize: 9.5, color: step >= i ? "#00C9A7" : "#444", whiteSpace: "nowrap" }}>{label}</div>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: step > i ? "#00C9A7" : "#2A2A2A", margin: "0 8px", marginBottom: 18 }} />}
          </div>
        ))}
      </div>

      <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "24px" }}>

        {/* Step 0 — Company details */}
        {/* {step === 0 && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Company Details</div>
            <div style={{ fontSize: 11, color: "#555", marginBottom: 18 }}>
              One account. Unlimited products. One monthly fee.
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={lbl}>Company Name</label>
              <input placeholder="e.g. Roche Nigeria Ltd" value={form.company_name} onChange={e => set("company_name", e.target.value)} style={inp} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={lbl}>Contact Email</label>
              <input placeholder="brand@company.com" value={form.contact_email} onChange={e => set("contact_email", e.target.value)} style={inp} />
              <div style={{ fontSize: 10, color: "#555", marginTop: 5 }}>
                Your login credentials will be sent to this email after payment.
              </div>
            </div>
            <button
              onClick={() => setStep(1)}
              disabled={!form.company_name || !form.contact_email}
              style={{ ...btn, opacity: !form.company_name || !form.contact_email ? 0.5 : 1 }}>
              Continue →
            </button>
          </div>
        )} */}
        {step === 0 && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Create Your Account</div>
            <div style={{ fontSize: 11, color: "#555", marginBottom: 18 }}>
              One account. Unlimited products. One monthly fee.
            </div>
            {[
              ["Company Name", "company_name",   "e.g. Roche Nigeria Ltd", "text"],
              ["Email Address","contact_email",  "brand@company.com",      "email"],
              ["Password",     "password",       "Choose a strong password","password"],
              ["Confirm Password","confirm_password","Re-enter password",  "password"],
            ].map(([label, key, ph, type]) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={lbl}>{label}</label>
                <input
                  type={type}
                  placeholder={ph}
                  value={form[key] || ""}
                  onChange={e => set(key, e.target.value)}
                  style={inp} />
              </div>
            ))}
            {form.password && form.confirm_password && form.password !== form.confirm_password && (
              <div style={{ fontSize: 11, color: "#E53935", marginBottom: 10 }}>Passwords do not match</div>
            )}
            <button
              onClick={() => setStep(1)}
              disabled={!form.company_name || !form.contact_email || !form.password || form.password !== form.confirm_password || form.password.length < 6}
              style={{ ...btn, opacity: !form.company_name || !form.contact_email || !form.password || form.password !== form.confirm_password || form.password.length < 6 ? 0.5 : 1, marginTop: 6 }}>
              Continue →
            </button>
          </div>
        )}

        {/* Step 1 — Payment */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Squad Payment</div>
            <div style={{ fontSize: 11, color: "#555", marginBottom: 18 }}>Powered by Squad Checkout API · GTBank SquadCo</div>

            <div style={{ background: "#111", border: "1px solid #2A2A2A", borderRadius: 10, padding: "16px 18px", marginBottom: 16 }}>
              {[
                ["Company",     form.company_name],
                ["Email",       form.contact_email],
                ["Plan",        "Brand Protection — Unlimited Products"],
                ["Monthly Fee", "₦50,000"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 12 }}>
                  <span style={{ color: "#666" }}>{k}</span>
                  <span style={{ color: k === "Monthly Fee" ? "#00C9A7" : "#fff", fontWeight: k === "Monthly Fee" ? 700 : 400 }}>{v}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid #2A2A2A", paddingTop: 10, display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700 }}>
                <span>Total Due</span>
                <span style={{ color: "#00C9A7" }}>₦50,000/mo</span>
              </div>
            </div>

            {/* What you get */}
            <div style={{ background: "rgba(0,201,167,0.05)", border: "1px solid rgba(0,201,167,0.15)", borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#00C9A7", marginBottom: 8 }}>What you get</div>
              {[
                "Unlimited product registrations",
                "Real-time counterfeit detection alerts",
                "NAFDAC intelligence reports",
                "Brand portal dashboard",
                "Login credentials via email",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                  <span style={{ color: "#00C9A7", fontSize: 11 }}>✓</span>
                  <span style={{ fontSize: 11, color: "#666" }}>{item}</span>
                </div>
              ))}
            </div>

            {error && (
              <div style={{ fontSize: 11, color: "#E53935", marginBottom: 12, padding: "8px 10px", background: "rgba(229,57,53,0.08)", borderRadius: 6 }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(0)} style={sec}>Back</button>
              <button onClick={submit} disabled={loading} style={{ ...btn, flex: 1, opacity: loading ? 0.7 : 1 }}>
                {loading ? "Processing..." : "Pay ₦50,000 via Squad →"}
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Success */}
        {step === 2 && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 68, height: 68, borderRadius: "50%", background: "rgba(0,201,167,0.1)", border: "2px solid #00C9A7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, margin: "0 auto 16px" }}>✓</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#00C9A7", marginBottom: 8 }}>You're on the network!</div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 20 }}>
              Your brand account has been created. Check <strong style={{ color: "#fff" }}>{form.contact_email || "your email"}</strong> for your login credentials.
            </div>

            <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 8, padding: "14px 16px", textAlign: "left", marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#fff", marginBottom: 10 }}>Next steps</div>
              {[
                "Check your email for login credentials",
                "Log in to your brand portal",
                "Add your first product — takes 30 seconds",
                "Add unlimited more products anytime",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(0,201,167,0.15)", border: "1px solid #00C9A7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#00C9A7", flexShrink: 0 }}>{i + 1}</div>
                  <span style={{ fontSize: 11, color: "#666", paddingTop: 2 }}>{item}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/login")}
              style={{ ...btn, width: "100%", marginBottom: 10 }}>
              Login to Brand Portal →
            </button>
            <button
              onClick={() => { setStep(0); setForm({ company_name: "", contact_email: "" }); }}
              style={{ ...sec, width: "100%" }}>
              Register Another Company
            </button>
          </div>
        )}
      </div>
    </div>
  );
}