const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    targetType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    targetId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  return AuditLog;
};