// import { useState, useEffect } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import axios from "axios";

// const API = import.meta.env.VITE_API_URL;

// export default function VendorLocatorPage() {
//   const [searchParams] = useSearchParams();
//   const navigate       = useNavigate();
//   const product        = searchParams.get("product") || "Coartem";
//   const city           = searchParams.get("city")    || "Lagos";

//   const [vendors,  setVendors]  = useState([]);
//   const [loading,  setLoading]  = useState(true);
//   const [selected, setSelected] = useState(null);

//   useEffect(() => {
//     axios.get(`${API}/api/vendors/nearby`, { params: { city, product } })
//       .then(r => setVendors(r.data.vendors))
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, [city, product]);

//   return (
//     <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
//       {/* Header */}
//       <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
//         <button onClick={() => navigate(-1)} style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 7, padding: "8px 14px", fontSize: 12, color: "#666", cursor: "pointer", fontFamily: "inherit" }}>
//           ← Back
//         </button>
//         <div>
//           <div style={{ fontSize: 11, color: "#E53935", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 }}>Counterfeit Detected</div>
//           <div style={{ fontSize: 18, fontWeight: 700 }}>Verified Vendors — Genuine {product}</div>
//           <div style={{ fontSize: 12, color: "#555" }}>These pharmacies are VeraScann-verified and stock genuine {product} near {city}</div>
//         </div>
//       </div>

//       {/* Alert banner */}
//       <div style={{ background: "rgba(229,57,53,0.05)", border: "1px solid rgba(229,57,53,0.2)", borderRadius: 10, padding: "12px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
//         <div style={{ fontSize: 20 }}>⚠</div>
//         <div style={{ fontSize: 12, color: "#999" }}>
//           The {product} you scanned was flagged as <strong style={{ color: "#E53935" }}>COUNTERFEIT</strong>. Do not use it. Purchase from a verified vendor below.
//         </div>
//       </div>

//       {loading ? (
//         <div style={{ padding: 40, color: "#555", textAlign: "center" }}>Finding verified vendors near you...</div>
//       ) : (
//         <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1fr" : "1fr", gap: 14 }}>
//           {/* Vendor list */}
//           <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//             {vendors.map((vendor, i) => (
//               <div key={i}
//                 onClick={() => setSelected(vendor)}
//                 style={{ background: selected?._id === vendor._id ? "rgba(0,201,167,0.05)" : "#141414", border: `1px solid ${selected?._id === vendor._id ? "#00C9A7" : "#2A2A2A"}`, borderRadius: 12, padding: "18px 20px", cursor: "pointer", transition: "all 0.2s" }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
//                   <div>
//                     <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
//                       <div style={{ fontSize: 15, fontWeight: 600 }}>{vendor.pharmacy_name}</div>
//                       <span style={{ fontSize: 9, fontWeight: 700, color: "#00C9A7", background: "rgba(0,201,167,0.1)", border: "1px solid rgba(0,201,167,0.2)", borderRadius: 4, padding: "2px 6px" }}>VERIFIED</span>
//                     </div>
//                     <div style={{ fontSize: 12, color: "#666" }}>{vendor.address}</div>
//                   </div>
//                   <div style={{ fontSize: 12, color: "#00C9A7", fontWeight: 600, flexShrink: 0, marginLeft: 12 }}>
//                     {vendor.distance || `${(Math.random() * 2 + 0.5).toFixed(1)}km`}
//                   </div>
//                 </div>

//                 <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
//                   {(vendor.products || []).map((p, j) => {
//                     const label = String(p ?? ""); // ← safely convert anything to string
//                     return (
//                       <span key={j} style={{
//                         fontSize: 10,
//                         color:      label.toLowerCase().includes(product.toLowerCase()) ? "#00C9A7" : "#555",
//                         background: label.toLowerCase().includes(product.toLowerCase()) ? "rgba(0,201,167,0.08)" : "#111",
//                         border:    `1px solid ${label.toLowerCase().includes(product.toLowerCase()) ? "rgba(0,201,167,0.2)" : "#222"}`,
//                         borderRadius: 4,
//                         padding: "2px 8px"
//                       }}>
//                         {label}
//                       </span>
//                     );
//                   })}
//                 </div>

//                 <div style={{ display: "flex", gap: 8 }}>
//                   <a href={`tel:${vendor.phone}`} style={{ flex: 1, background: "#1A1A1A", color: "#999", border: "1px solid #2A2A2A", borderRadius: 7, padding: "8px", fontSize: 12, textAlign: "center", textDecoration: "none", fontFamily: "inherit" }}>
//                     📞 Call
//                   </a>
//                   <button
//                     onClick={(e) => { e.stopPropagation(); setSelected(vendor); }}
//                     style={{ flex: 2, background: "#00C9A7", color: "#000", border: "none", borderRadius: 7, padding: "8px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
//                     Pay via Squad →
//                   </button>
//                 </div>
//               </div>
//             ))}

//             {vendors.length === 0 && (
//               <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: 40, textAlign: "center" }}>
//                 <div style={{ fontSize: 32, marginBottom: 12 }}>🏥</div>
//                 <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>No verified vendors in {city} yet</div>
//                 <div style={{ fontSize: 12, color: "#555", marginBottom: 16 }}>Know a pharmacy that sells genuine products? Help build the network.</div>
//                 <button onClick={() => navigate("/vendor/register")} style={{ background: "#00C9A7", color: "#000", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
//                   Refer a Pharmacy →
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Payment panel */}
//           {selected && (
//             <div style={{ background: "#141414", border: "1px solid #00C9A7", borderRadius: 12, padding: "20px", position: "sticky", top: 70, alignSelf: "flex-start" }}>
//               <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Buy from {selected.pharmacy_name}</div>
//               <div style={{ fontSize: 11, color: "#555", marginBottom: 18 }}>Squad-secured payment · Verified vendor</div>

//               <div style={{ background: "#111", border: "1px solid #2A2A2A", borderRadius: 8, padding: "14px", marginBottom: 16 }}>
//                 {[
//                   ["Product",  `Genuine ${product}`],
//                   ["Vendor",   selected.pharmacy_name],
//                   ["Location", selected.address],
//                   ["Contact",  selected.phone],
//                 ].map(([k, v]) => (
//                   <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12 }}>
//                     <span style={{ color: "#555" }}>{k}</span>
//                     <span style={{ color: "#999", textAlign: "right", maxWidth: "55%" }}>{v}</span>
//                   </div>
//                 ))}
//               </div>

//               <div style={{ background: "rgba(0,201,167,0.06)", border: "1px solid rgba(0,201,167,0.15)", borderRadius: 8, padding: "10px 12px", marginBottom: 16 }}>
//                 <div style={{ fontSize: 10, color: "#00C9A7", fontWeight: 600, marginBottom: 4 }}>✓ VeraScann Guaranteed</div>
//                 <div style={{ fontSize: 11, color: "#555", lineHeight: 1.6 }}>This vendor is verified by VeraScann. They stock genuine {product} from authorised distributors.</div>
//               </div>

//               <a href={`tel:${selected.phone}`} style={{ display: "block", width: "100%", background: "#1A1A1A", color: "#999", border: "1px solid #2A2A2A", borderRadius: 8, padding: "11px", fontSize: 13, textAlign: "center", textDecoration: "none", marginBottom: 10, fontFamily: "inherit" }}>
//                 📞 Call to order — {selected.phone}
//               </a>
//               <button style={{ width: "100%", background: "#00C9A7", color: "#000", border: "none", borderRadius: 8, padding: "11px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
//                 Pay via Squad Payment Link →
//               </button>

//               <button onClick={() => setSelected(null)} style={{ width: "100%", background: "transparent", color: "#444", border: "none", padding: "10px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", marginTop: 8 }}>
//                 ← Choose different vendor
//               </button>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Register your pharmacy CTA */}
//       <div style={{ marginTop: 24, background: "#141414", border: "1px solid #2A2A2A", borderRadius: 10, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <div>
//           <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>Are you a pharmacy owner?</div>
//           <div style={{ fontSize: 11, color: "#555" }}>Join the VeraScann verified network. Get customers directed to you when fakes are detected nearby.</div>
//         </div>
//         <button onClick={() => navigate("/vendor/register")} style={{ background: "transparent", color: "#00C9A7", border: "1px solid rgba(0,201,167,0.3)", borderRadius: 8, padding: "10px 18px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", flexShrink: 0, marginLeft: 16 }}>
//           Join Network →
//         </button>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function VendorLocatorPage() {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const product        = searchParams.get("product") || "Coartem";
  const city           = searchParams.get("city")    || "Lagos";

  const [vendors,  setVendors]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);
  const [selProd,  setSelProd]  = useState(null);
  const [receipt,  setReceipt]  = useState(null);
  const [paying,   setPaying]   = useState(false);

  useEffect(() => {
    axios.get(`${API}/api/vendors/nearby`, { params: { city, product } })
      .then(r => setVendors(r.data.vendors))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const initiatePayment = async (vendor, prod) => {
    setPaying(true);
    try {
      const { data } = await axios.post(`${API}/api/vendors/pay`, {
        vendor_id:    vendor._id,
        product_name: prod.name,
        amount:       prod.price,
        customer_email: "customer@verascann.com", // in prod — collect from user
      });

      if (data.payment_url) {
        window.open(data.payment_url, "_blank");
        // Show pending receipt
        setReceipt({
          code:         data.receipt_code,
          vendor:       vendor.pharmacy_name,
          address:      vendor.address,
          phone:        vendor.phone,
          product:      prod.name,
          price:        prod.price,
          status:       "pending",
          generated_at: new Date().toLocaleString("en-NG"),
        });
      }
    } catch (err) {
      alert("Payment failed. Please try again.");
    } finally { setPaying(false); }
  };

  return (
    <div style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <button onClick={() => navigate(-1)} style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 7, padding: "8px 14px", fontSize: 12, color: "#666", cursor: "pointer", fontFamily: "inherit" }}>← Back</button>
        <div>
          <div style={{ fontSize: 11, color: "#E53935", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 }}>Counterfeit Detected</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Buy Genuine {product} Near You</div>
          <div style={{ fontSize: 12, color: "#555" }}>VeraScann-verified pharmacies in {city}</div>
        </div>
      </div>

      {/* Alert */}
      <div style={{ background: "rgba(229,57,53,0.05)", border: "1px solid rgba(229,57,53,0.2)", borderRadius: 10, padding: "12px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 20 }}>⚠</div>
        <div style={{ fontSize: 12, color: "#999" }}>
          The <strong style={{ color: "#fff" }}>{product}</strong> you scanned was flagged as <strong style={{ color: "#E53935" }}>COUNTERFEIT</strong>. Purchase from a verified vendor below. Pay via Squad and get a receipt to show at the pharmacy.
        </div>
      </div>

      {/* Receipt modal */}
      {receipt && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 24 }}>
          <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 14, padding: 28, width: "100%", maxWidth: 420 }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🧾</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#00C9A7", marginBottom: 4 }}>Payment Receipt</div>
              <div style={{ fontSize: 11, color: "#555" }}>Show this at the pharmacy to collect your product</div>
            </div>

            {/* Receipt code */}
            <div style={{ background: "#0A0A0A", border: "2px dashed #00C9A7", borderRadius: 10, padding: "16px", textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: "#555", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.07em" }}>Receipt Code</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#00C9A7", fontFamily: "monospace", letterSpacing: 4 }}>{receipt.code}</div>
            </div>

            {/* Receipt details */}
            <div style={{ background: "#111", border: "1px solid #2A2A2A", borderRadius: 8, padding: "14px", marginBottom: 16 }}>
              {[
                ["Pharmacy",   receipt.vendor],
                ["Address",    receipt.address],
                ["Phone",      receipt.phone],
                ["Product",    receipt.product],
                ["Amount Paid",`₦${receipt.price?.toLocaleString()}`],
                ["Date",       receipt.generated_at],
                ["Status",     receipt.status === "pending" ? "⏳ Payment Processing" : "✓ Confirmed"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12 }}>
                  <span style={{ color: "#555" }}>{k}</span>
                  <span style={{ color: k === "Amount Paid" ? "#00C9A7" : k === "Status" ? "#F5A623" : "#fff", fontWeight: k === "Amount Paid" ? 700 : 400, textAlign: "right", maxWidth: "55%" }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(0,201,167,0.05)", border: "1px solid rgba(0,201,167,0.15)", borderRadius: 8, padding: "10px 12px", marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#00C9A7", fontWeight: 600, marginBottom: 3 }}>How to use this receipt</div>
              <div style={{ fontSize: 11, color: "#666", lineHeight: 1.6 }}>
                1. Complete payment in the Squad tab that opened<br/>
                2. Show this receipt code at <strong style={{ color: "#fff" }}>{receipt.vendor}</strong><br/>
                3. They will verify the code and give you genuine {receipt.product}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => {
                  const text = `VeraScann Receipt\nCode: ${receipt.code}\nPharmacy: ${receipt.vendor}\nAddress: ${receipt.address}\nProduct: ${receipt.product}\nAmount: ₦${receipt.price?.toLocaleString()}\nDate: ${receipt.generated_at}`;
                  navigator.clipboard?.writeText(text);
                  alert("Receipt copied to clipboard");
                }}
                style={{ flex: 1, background: "#1A1A1A", color: "#666", border: "1px solid #2A2A2A", borderRadius: 8, padding: "11px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                Copy Receipt
              </button>
              <button onClick={() => setReceipt(null)} style={{ flex: 1, background: "#00C9A7", color: "#000", border: "none", borderRadius: 8, padding: "11px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                Done ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ padding: 40, color: "#555", textAlign: "center" }}>Finding verified vendors...</div>
      ) : vendors.length === 0 ? (
        <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🏥</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>No verified vendors in {city} yet</div>
          <div style={{ fontSize: 12, color: "#555", marginBottom: 16 }}>Know a pharmacy? Help build the network.</div>
          <button onClick={() => navigate("/vendor/register")} style={{ background: "#00C9A7", color: "#000", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            Refer a Pharmacy →
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {vendors.map((vendor, i) => (
            <div key={i} style={{ background: "#141414", border: `1px solid ${selected?._id === vendor._id ? "#00C9A7" : "#2A2A2A"}`, borderRadius: 12, padding: "20px", transition: "border-color 0.2s" }}>
              {/* Vendor header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{vendor.pharmacy_name}</div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#00C9A7", background: "rgba(0,201,167,0.1)", border: "1px solid rgba(0,201,167,0.2)", borderRadius: 4, padding: "2px 6px" }}>VERIFIED</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#666" }}>{vendor.address}</div>
                  <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>📞 {vendor.phone}</div>
                </div>
                <div style={{ fontSize: 13, color: "#00C9A7", fontWeight: 600 }}>
                  {vendor.distance || `${(Math.random() * 2 + 0.5).toFixed(1)}km away`}
                </div>
              </div>

              {/* Products grid */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                  Available Products
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
                  {(vendor.products || []).map((p, j) => {
                    const isTarget  = p.name?.toLowerCase().includes(product.toLowerCase());
                    const isSelected = selected?._id === vendor._id && selProd?.name === p.name;
                    return (
                      <div key={j}
                        onClick={() => p.in_stock !== false ? (setSelected(vendor), setSelProd(p)) : null}
                        style={{ background: isSelected ? "rgba(0,201,167,0.08)" : "#111", border: `1px solid ${isSelected ? "#00C9A7" : isTarget ? "rgba(0,201,167,0.3)" : "#222"}`, borderRadius: 8, padding: "12px 14px", cursor: p.in_stock !== false ? "pointer" : "default", opacity: p.in_stock === false ? 0.5 : 1, transition: "all 0.2s" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: isTarget ? "#00C9A7" : "#fff" }}>{p.name}</div>
                          {isTarget && <span style={{ fontSize: 9, color: "#00C9A7", background: "rgba(0,201,167,0.1)", border: "1px solid rgba(0,201,167,0.2)", borderRadius: 3, padding: "1px 5px", flexShrink: 0, marginLeft: 6 }}>Match</span>}
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#00C9A7", marginBottom: 4 }}>
                          ₦{(p.price || 0).toLocaleString()}
                        </div>
                        <div style={{ fontSize: 10, color: p.in_stock !== false ? "#43A047" : "#E53935", fontWeight: 600 }}>
                          {p.in_stock !== false ? "✓ In Stock" : "Out of Stock"}
                        </div>
                        {isSelected && (
                          <div style={{ marginTop: 8, fontSize: 10, color: "#00C9A7" }}>✓ Selected</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pay button — shows when product selected from this vendor */}
              {selected?._id === vendor._id && selProd && (
                <div style={{ background: "rgba(0,201,167,0.05)", border: "1px solid rgba(0,201,167,0.2)", borderRadius: 10, padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>Pay for {selProd.name}</div>
                      <div style={{ fontSize: 11, color: "#555" }}>at {vendor.pharmacy_name} · Squad payment</div>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#00C9A7" }}>₦{selProd.price?.toLocaleString()}</div>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => { setSelected(null); setSelProd(null); }} style={{ background: "transparent", color: "#555", border: "1px solid #2A2A2A", borderRadius: 8, padding: "10px 16px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                      Cancel
                    </button>
                    <button
                      onClick={() => initiatePayment(vendor, selProd)}
                      disabled={paying}
                      style={{ flex: 1, background: "#00C9A7", color: "#000", border: "none", borderRadius: 8, padding: "11px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: paying ? 0.7 : 1 }}>
                      {paying ? "Opening Squad..." : `Pay ₦${selProd.price?.toLocaleString()} via Squad →`}
                    </button>
                  </div>
                </div>
              )}

              {/* Call button always visible */}
              {!(selected?._id === vendor._id && selProd) && (
                <div style={{ display: "flex", gap: 10 }}>
                  <a href={`tel:${vendor.phone}`} style={{ flex: 1, background: "#1A1A1A", color: "#666", border: "1px solid #2A2A2A", borderRadius: 8, padding: "10px", fontSize: 12, textAlign: "center", textDecoration: "none", fontFamily: "inherit" }}>
                    📞 Call Pharmacy
                  </a>
                  <div style={{ flex: 2, fontSize: 11, color: "#444", display: "flex", alignItems: "center", paddingLeft: 8 }}>
                    ← Tap a product to pay via Squad
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Vendor CTA */}
      <div style={{ marginTop: 24, background: "#141414", border: "1px solid #2A2A2A", borderRadius: 10, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>Are you a pharmacy owner?</div>
          <div style={{ fontSize: 11, color: "#555" }}>Join the VeraScann network. Get customers directed to you when fakes are detected nearby.</div>
        </div>
        <button onClick={() => navigate("/vendor/register")} style={{ background: "transparent", color: "#00C9A7", border: "1px solid rgba(0,201,167,0.3)", borderRadius: 8, padding: "10px 18px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", flexShrink: 0, marginLeft: 16 }}>
          Join Network →
        </button>
      </div>
    </div>
  );
}