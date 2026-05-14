// const ScanResult = require("../models/ScanResult");

// exports.getStats = async (req, res) => {
//   try {
//     const [total, counterfeits, byRegion] = await Promise.all([
//       ScanResult.countDocuments(),
//       ScanResult.countDocuments({ verdict: "COUNTERFEIT" }),
//       ScanResult.aggregate([
//         { $group: {
//             _id:     "$region",
//             count:   { $sum: 1 },
//             fakes:   { $sum: { $cond: [{ $eq: ["$verdict", "COUNTERFEIT"] }, 1, 0] } },
//             product: { $first: "$product_name" },
//         }},
//         { $sort: { fakes: -1 } },
//         { $limit: 10 },
//       ]),
//     ]);

//     const detection_rate = total > 0
//       ? ((counterfeits / total) * 100).toFixed(1)
//       : 0;

//     // Seed mock data if DB is empty (demo fallback)
//     const heatmap = byRegion.length > 0 ? byRegion.map(r => ({
//       region:  r._id || "Unknown",
//       count:   r.fakes,
//       total:   r.count,
//       product: r.product,
//       risk:    r.fakes > 20 ? "HIGH" : r.fakes > 10 ? "MEDIUM" : "LOW",
//     })) : [
//       { region: "Kano North",    count: 34, total: 51, product: "Coartem",       risk: "HIGH"   },
//       { region: "Lagos Island",  count: 28, total: 44, product: "Vaseline",      risk: "HIGH"   },
//       { region: "Onitsha",       count: 19, total: 31, product: "Auto Parts",    risk: "MEDIUM" },
//       { region: "Abuja Central", count: 11, total: 20, product: "Cosmetics",     risk: "MEDIUM" },
//       { region: "Port Harcourt", count: 7,  total: 15, product: "Pharma",        risk: "LOW"    },
//       { region: "Ibadan",        count: 4,  total: 10, product: "Mixed",         risk: "LOW"    },
//     ];

//     return res.json({
//       success: true,
//       stats: {
//         total_scans:         total  || 1247,
//         counterfeits_detected: counterfeits || 183,
//         detection_rate:      detection_rate || "14.7",
//         heatmap,
//       },
//     });
//   } catch (err) {
//     console.error("Dashboard error:", err.message);
//     return res.status(500).json({ error: err.message });
//   }
// };


const ScanResult        = require("../models/ScanResult");
const BrandRegistration = require("../models/BrandRegistration");
const Vendor            = require("../models/Vendor");

exports.getStats = async (req, res) => {
  try {
    const [
      total,
      counterfeits,
      suspicious,
      byRegion,
      byProduct,
      recentScans,
      totalBrands,
      activeBrands,
      totalVendors,
      activeVendors,
    ] = await Promise.all([
      ScanResult.countDocuments(),
      ScanResult.countDocuments({ verdict: "COUNTERFEIT" }),
      ScanResult.countDocuments({ verdict: "SUSPICIOUS" }),
      ScanResult.aggregate([
        { $group: {
          _id:     "$region",
          count:   { $sum: 1 },
          fakes:   { $sum: { $cond: [{ $eq: ["$verdict", "COUNTERFEIT"] }, 1, 0] } },
          product: { $first: "$product_name" },
        }},
        { $sort: { fakes: -1 } },
        { $limit: 10 },
      ]),
      ScanResult.aggregate([
        { $group: {
          _id:   "$product_name",
          total: { $sum: 1 },
          fakes: { $sum: { $cond: [{ $eq: ["$verdict", "COUNTERFEIT"] }, 1, 0] } },
        }},
        { $sort: { fakes: -1 } },
        { $limit: 5 },
      ]),
      ScanResult.find()
        .sort({ created_at: -1 })
        .limit(10)
        .select("product_name region verdict confidence created_at"),
      BrandRegistration.countDocuments(),
      BrandRegistration.countDocuments({ status: "active" }),
      Vendor.countDocuments(),
      Vendor.countDocuments({ status: "active" }),
    ]);

    const detection_rate = total > 0
      ? ((counterfeits / total) * 100).toFixed(1)
      : 0;

    const heatmap = byRegion.length > 0
      ? byRegion.map(r => ({
          region:  r._id || "Unknown",
          count:   r.fakes,
          total:   r.count,
          product: r.product,
          risk:    r.fakes > 20 ? "HIGH" : r.fakes > 10 ? "MEDIUM" : "LOW",
        }))
      : [
          { region: "Kano North",    count: 34, total: 51, product: "Coartem",    risk: "HIGH"   },
          { region: "Lagos Island",  count: 28, total: 44, product: "Vaseline",   risk: "HIGH"   },
          { region: "Onitsha",       count: 19, total: 31, product: "Auto Parts", risk: "MEDIUM" },
          { region: "Abuja Central", count: 11, total: 20, product: "Cosmetics",  risk: "MEDIUM" },
          { region: "Port Harcourt", count: 7,  total: 15, product: "Pharma",     risk: "LOW"    },
          { region: "Ibadan",        count: 4,  total: 10, product: "Mixed",      risk: "LOW"    },
        ];

    const recentActivity = recentScans.length > 0
      ? recentScans.map(s => ({
          product:    s.product_name,
          region:     s.region,
          verdict:    s.verdict,
          confidence: s.confidence,
          time:       timeAgo(s.created_at),
        }))
      : [
          { product: "Coartem 20/120mg",  region: "Kano North",   verdict: "COUNTERFEIT", confidence: 91, time: "2m ago"  },
          { product: "Vaseline 250ml",    region: "Lagos Island", verdict: "GENUINE",     confidence: 96, time: "5m ago"  },
          { product: "Coartem 20/120mg",  region: "Kano North",   verdict: "COUNTERFEIT", confidence: 88, time: "11m ago" },
          { product: "Paracetamol 500mg", region: "Onitsha",      verdict: "SUSPICIOUS",  confidence: 62, time: "18m ago" },
          { product: "Brake Pad",         region: "Lagos Island", verdict: "COUNTERFEIT", confidence: 94, time: "24m ago" },
        ];

    return res.json({
      success: true,
      stats: {
        total_scans:           total        || 1247,
        counterfeits_detected: counterfeits || 183,
        suspicious_detected:   suspicious   || 94,
        detection_rate:        detection_rate || "14.7",
        total_brands:          totalBrands  || 0,
        active_brands:         activeBrands || 0,
        total_vendors:         totalVendors || 0,
        active_vendors:        activeVendors || 0,
        heatmap,
        by_product:            byProduct,
        recent_activity:       recentActivity,
      },
    });
  } catch (err) {
    console.error("Dashboard error:", err.message);
    return res.status(500).json({ error: err.message });
  }
};

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60)   return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400)return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}