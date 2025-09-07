// controllers/analyticsController.js
import Order from '../models/order.model.js';
import productModel from '../models/product.model.js';
import User from '../models/user.model.js';

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
export const getDashboardAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    
    // Total counts
    const totalUsers = await User.countDocuments();
    const totalProducts = await productModel.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Recent orders
    const recentOrders = await Order.countDocuments({
      createdAt: { $gte: startDate }
    });
    
    // Revenue calculation
    const revenueData = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: { $ne: 'cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);
    
    const totalRevenue = revenueData[0]?.totalRevenue || 0;
    
    // Top selling products
    const topProducts = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $unwind: '$orderItems' },
      { $group: { 
          _id: '$orderItems.product', 
          totalSold: { $sum: '$orderItems.quantity' },
          revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' }
    ]);
    
    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalProducts,
          totalOrders,
          recentOrders,
          totalRevenue
        },
        topProducts,
        period: `${period} days`
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics'
    });
  }
};