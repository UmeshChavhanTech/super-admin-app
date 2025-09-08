const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
  try {
    console.log('==================== LOGIN ATTEMPT ====================');
    console.log('Request body:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    console.log('🔍 Looking for user with email:', email);
    const user = await User.findOne({
      where: { email },
      include: [{
        model: Role,
        attributes: ['id', 'name']
      }]
    });

    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('✅ User found:', user.toJSON());
    console.log('Attached Roles:', user.Roles);

    console.log('🔐 Validating password...');
    let isValidPassword = false;
    if (typeof user.validatePassword === 'function') {
      isValidPassword = await user.validatePassword(password);
    } else {
      // fallback if instance method not defined
      console.warn('⚠️ validatePassword method missing, using bcrypt.compare fallback');
      isValidPassword = await bcrypt.compare(password, user.password);
    }

    console.log('Password valid?', isValidPassword);

    if (!isValidPassword) {
      console.log('❌ Invalid password for user:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('✅ Password correct. Updating lastLogin...');
    user.lastLogin = new Date();
    await user.save();

    console.log('🔑 Generating JWT token...');
    if (!process.env.JWT_SECRET) {
      console.error("❌ Missing JWT_SECRET in .env");
      return res.status(500).json({ error: 'Server misconfigured: missing JWT_SECRET' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ JWT generated successfully');
    console.log('==================== LOGIN SUCCESS ====================');

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.Roles ? user.Roles.map(role => role.name) : []
      }
    });
  } catch (error) {
    console.error('❌ Login error details:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong!',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

module.exports = { login };
