const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const bcrypt = require('bcrypt');

// Create SQLite database connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_STORAGE || path.join(__dirname, '..', 'database.sqlite'),
  logging: console.log, // Enable logging to see database operations
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Import models
const User = require('./User')(sequelize, DataTypes);
const Role = require('./Role')(sequelize, DataTypes);
const AuditLog = require('./AuditLog')(sequelize, DataTypes);

// Define associations
User.belongsToMany(Role, { 
  through: 'UserRoles',
  foreignKey: 'userId',
  otherKey: 'roleId'
});

Role.belongsToMany(User, { 
  through: 'UserRoles',
  foreignKey: 'roleId',
  otherKey: 'userId'
});

AuditLog.belongsTo(User, { 
  as: 'actor', 
  foreignKey: 'actorUserId'
});

// Test connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');

    // Sync database and seed Super Admin
    return sequelize.sync({ alter: true });
  })
  .then(async () => {
    console.log('All models were synchronized successfully.');

    // Check if Super Admin role exists
    let superAdminRole = await Role.findOne({ where: { name: 'Super Admin' } });
    if (!superAdminRole) {
      superAdminRole = await Role.create({ name: 'Super Admin' });
      console.log('Super Admin role created.');
    }

    // Check if Super Admin user exists
    let superAdmin = await User.findOne({ where: { email: 'superadmin@example.com' } });
    if (!superAdmin) {
      const hashedPassword = await bcrypt.hash('Test1234!', 10);
      superAdmin = await User.create({
        name: 'Super Admin',
        email: 'superadmin@example.com',
        password: hashedPassword,
        isActive: true
      });

      // Assign role to user
      await superAdmin.addRole(superAdminRole);
      console.log('Super Admin user created with credentials:');
      console.log('Email: superadmin@example.com');
      console.log('Password: Test1234!');
    } else {
      console.log('Super Admin already exists.');
    }
  })
  .catch(err => {
    console.error('Unable to connect or sync the database:', err);
  });

module.exports = {
  sequelize,
  User,
  Role,
  AuditLog
};
