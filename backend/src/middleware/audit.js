const { AuditLog } = require('../models');

const auditLog = (action, targetType, targetId = null, details = null) => {
  return async (req, res, next) => {
    // Store the original send function
    const originalSend = res.send;
    
    // Override the send function
    res.send = function(body) {
      // After the response is sent, log the action
      if (res.statusCode < 400) { // Only log successful actions
        AuditLog.create({
          actorUserId: req.user.id,
          action,
          targetType,
          targetId,
          details,
          timestamp: new Date()
        }).catch(err => {
          console.error('Failed to create audit log:', err);
        });
      }
      
      // Call the original send function
      return originalSend.call(this, body);
    };
    
    next();
  };
};

module.exports = auditLog;