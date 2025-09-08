const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const saltRounds = parseInt(process.env.BCRYPT_SALT) || 12;
            user.password = await bcrypt.hash(user.password, saltRounds);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('password')) {
            const saltRounds = parseInt(process.env.BCRYPT_SALT) || 12;
            user.password = await bcrypt.hash(user.password, saltRounds);
          }
        },
      },
    }
  );

  // Method to validate password
  User.prototype.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  return User;
};
