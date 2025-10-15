import User from "../models/User.js";
import Asset from "../models/Asset.js";

export const getDashboardStats = async () => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayUsers = await User.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const totalUsers = await User.countDocuments();

    const todayAssets = await Asset.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });
    const totalAssets = await Asset.countDocuments();

    return {
      todayUsers,
      totalUsers,
      todayAssets,
      totalAssets,
    };
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    throw error;
  }
};
