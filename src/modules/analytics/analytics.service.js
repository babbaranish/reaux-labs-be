import { User } from '../user/user.model.js';
import { Post } from '../post/post.model.js';
import { Order } from '../order/order.model.js';
import { Product } from '../product/product.model.js';
import { Challenge } from '../challenge/challenge.model.js';

export const getStats = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [totalUsers, totalPosts, totalOrders, totalProducts, totalChallenges, recentUsers] =
    await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments(),
      Challenge.countDocuments(),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    ]);

  return {
    totalUsers,
    totalPosts,
    totalOrders,
    totalProducts,
    totalChallenges,
    recentUsers,
  };
};

export const getSalesReport = async () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [overallStats, monthlyStats, topProducts] = await Promise.all([
    Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$finalAmount' },
          orderCount: { $sum: 1 },
          averageOrderValue: { $avg: '$finalAmount' },
        },
      },
    ]),

    Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$finalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
    ]),

    Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
    ]),
  ]);

  const overall = overallStats[0] || {
    totalRevenue: 0,
    orderCount: 0,
    averageOrderValue: 0,
  };

  return {
    totalRevenue: overall.totalRevenue,
    orderCount: overall.orderCount,
    averageOrderValue: overall.averageOrderValue,
    monthlyStats,
    topProducts,
  };
};
