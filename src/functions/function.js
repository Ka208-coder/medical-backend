import User from "../models/User.js";
import Asset from "../models/Asset.js";

export const getDashboardStats = async () => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const userStats = await User.aggregate([
      {
        $facet: {
          totalUsers: [{ $count: "count" }],
          todayUsers: [
            {
              $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } },
            },
            { $count: "count" },
          ],
        },
      },
      {
        $project: {
          totalUsers: { $ifNull: [{ $arrayElemAt: ["$totalUsers.count", 0] }, 0] },
          todayUsers: { $ifNull: [{ $arrayElemAt: ["$todayUsers.count", 0] }, 0] },
        },
      },
    ]);

   
    const assetStats = await Asset.aggregate([
      {
        $facet: {
          totalAssets: [{ $count: "count" }],
          todayAssets: [
            {
              $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } },
            },
            { $count: "count" },
          ],
        },
      },
      {
        $project: {
          totalAssets: { $ifNull: [{ $arrayElemAt: ["$totalAssets.count", 0] }, 0] },
          todayAssets: { $ifNull: [{ $arrayElemAt: ["$todayAssets.count", 0] }, 0] },
        },
      },
    ]);

   
    return {
      todayUsers: userStats[0].todayUsers,
      totalUsers: userStats[0].totalUsers,
      todayAssets: assetStats[0].todayAssets,
      totalAssets: assetStats[0].totalAssets,
    };
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    throw error;
  }
};
