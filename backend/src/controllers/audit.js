const { AuditLog, User } = require('../models');
const { Op } = require('sequelize');

const getAuditLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    let whereClause = {};
    
    // Filter by user
    if (req.query.userId) {
      whereClause.actorUserId = req.query.userId;
    }
    
    // Filter by action
    if (req.query.action) {
      whereClause.action = req.query.action;
    }
    
    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      whereClause.timestamp = {
        [Op.between]: [new Date(req.query.startDate), new Date(req.query.endDate)]
      };
    } else if (req.query.startDate) {
      whereClause.timestamp = {
        [Op.gte]: new Date(req.query.startDate)
      };
    } else if (req.query.endDate) {
      whereClause.timestamp = {
        [Op.lte]: new Date(req.query.endDate)
      };
    }
    
    const { count, rows: auditLogs } = await AuditLog.findAndCountAll({
      where: whereClause,
      include: [
        { 
          model: User, 
          as: 'actor', 
          attributes: ['id', 'name', 'email'] 
        }
      ],
      limit,
      offset,
      order: [['timestamp', 'DESC']]
    });
    
    res.json({
      auditLogs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalLogs: count
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getAuditLogs };