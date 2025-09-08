const jwt = require('jsonwebtoken');
const { User } = require('../models');

const requireAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'Token is not valid.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid.' });
  }
};

const requireSuperAdmin = async (req, res, next) => {
  try {
    await requireAuth(req, res, () => {});
    
    const userRoles = await req.user.getRoles();
    const isSuperAdmin = userRoles.some(role => role.name === 'superadmin');
    
    if (!isSuperAdmin) {
      return res.status(403).json({ error: 'Access denied. Super admin role required.' });
    }
    
    next();
  } catch (error) {
    res.status(403).json({ error: 'Access denied. Super admin role required.' });
  }
};

module.exports = { requireAuth, requireSuperAdmin };