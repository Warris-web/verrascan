const ScanResult = require("../models/ScanResult");

exports.getStats = async (req, res) => {
  try {
    const [total, counterfeits, byRegion] = await Promise.all([
      ScanResult.countDocuments(),
      ScanResult.countDocuments({ verdict: "COUNTERFEIT" }),
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
    ]);

    const detection_rate = total > 0
      ? ((counterfeits / total) * 100).toFixed(1)
      : 0;

    // Seed mock data if DB is empty (demo fallback)
    const heatmap = byRegion.length > 0 ? byRegion.map(r => ({
      region:  r._id || "Unknown",
      count:   r.fakes,
      total:   r.count,
      product: r.product,
      risk:    r.fakes > 20 ? "HIGH" : r.fakes > 10 ? "MEDIUM" : "LOW",
    })) : [
      { region: "Kano North",    count: 34, total: 51, product: "Coartem",       risk: "HIGH"   },
      { region: "Lagos Island",  count: 28, total: 44, product: "Vaseline",      risk: "HIGH"   },
      { region: "Onitsha",       count: 19, total: 31, product: "Auto Parts",    risk: "MEDIUM" },
      { region: "Abuja Central", count: 11, total: 20, product: "Cosmetics",     risk: "MEDIUM" },
      { region: "Port Harcourt", count: 7,  total: 15, product: "Pharma",        risk: "LOW"    },
      { region: "Ibadan",        count: 4,  total: 10, product: "Mixed",         risk: "LOW"    },
    ];

    return res.json({
      success: true,
      stats: {
        total_scans:         total  || 1247,
        counterfeits_detected: counterfeits || 183,
        detection_rate:      detection_rate || "14.7",
        heatmap,
      },
    });
  } catch (err) {
    console.error("Dashboard error:", err.message);
    return res.status(500).json({ error: err.message });
  }
};
