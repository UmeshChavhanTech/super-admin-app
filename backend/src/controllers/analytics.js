const { User, AuditLog } = require('../models');
const { Op } = require('sequelize');

const getSummary = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalRoles = await require('../models').Role.count();
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentLogins = await AuditLog.count({
      where: {
        action: 'LOGIN',
        timestamp: {
          [Op.gte]: sevenDaysAgo
        }
      }
    });
    
    res.json({
      totalUsers,
      totalRoles,
      recentLogins
    });
  } catch (error) {
    console.error('Get analytics summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getSummary };