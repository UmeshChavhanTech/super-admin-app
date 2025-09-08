require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const bcrypt = require('bcrypt');

// Resolve DB path from .env (relative to where you run node), fallback to backend/database.sqlite
const DB_PATH = process.env.DB_STORAGE
  ? path.resolve(process.cwd(), process.env.DB_STORAGE)
  : path.resolve(__dirname, '..', 'database.sqlite');

console.log('🗃  Using SQLite file:', DB_PATH);

// Create database connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: DB_PATH,
  logging: console.log
});

// ====================== MODELS ======================

// User
const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    lastLogin: { type: DataTypes.DATE, allowNull: true }
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
      beforeBulkCreate: async (users) => {
        for (const user of users) {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 12);
          }
        }
      }
    }
  }
);

// Role
const Role = sequelize.define('Role', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  permissions: { type: DataTypes.JSON, allowNull: false, defaultValue: [] }
});

// AuditLog
const AuditLog = sequelize.define('AuditLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  action: { type: DataTypes.STRING, allowNull: false },
  targetType: { type: DataTypes.STRING, allowNull: false },
  targetId: { type: DataTypes.INTEGER, allowNull: true },
  details: { type: DataTypes.JSON, allowNull: true },
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  actorUserId: { type: DataTypes.INTEGER, allowNull: false }
});

// ====================== RELATIONSHIPS ======================

// Explicit join table definition
const UserRoles = sequelize.define('UserRoles', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

// Many-to-Many between User and Role
User.belongsToMany(Role, { through: UserRoles, foreignKey: 'userId' });
Role.belongsToMany(User, { through: UserRoles, foreignKey: 'roleId' });

// AuditLog → User (actor)
AuditLog.belongsTo(User, { as: 'actor', foreignKey: 'actorUserId' });

// ====================== SEEDING ======================

const seedDatabase = async () => {
  try {
    console.log('🔄 Starting database seeding...');
    await sequelize.sync({ force: true }); // Drop & recreate all tables
    console.log('✅ Database synced');

    // Create roles
    const superAdminRole = await Role.create({ name: 'superadmin', permissions: ['all'] });
    const adminRole = await Role.create({
      name: 'admin',
      permissions: ['users.read', 'users.write', 'roles.read']
    });
    const userRole = await Role.create({
      name: 'user',
      permissions: ['profile.read', 'profile.write']
    });

    // Super Admin
    const superAdminUser = await User.create({
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password: 'Test1234!' // hashed via hook
    });
    await superAdminUser.addRole(superAdminRole);

    // Test Users
    const testUsers = [
      { name: 'Admin User', email: 'admin@example.com', password: 'Password123!' },
      { name: 'Regular User', email: 'user@example.com', password: 'Password123!' },
      { name: 'John Doe', email: 'john@example.com', password: 'Password123!' }
    ];

    const createdUsers = await User.bulkCreate(testUsers, { individualHooks: true });

    for (const user of createdUsers) {
      if (user.email === 'admin@example.com') {
        await user.addRole(adminRole);
      } else {
        await user.addRole(userRole);
      }
    }

    console.log('🎉 Database seeded successfully');
    console.log('================================');
    console.log('Super Admin credentials:');
    console.log('Email: superadmin@example.com');
    console.log('Password: Test1234!');
    console.log('================================');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
