const { Role, User } = require('../models');
const { validationResult } = require('express-validator');

const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createRole = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, permissions } = req.body;
    
    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      return res.status(400).json({ error: 'Role with this name already exists' });
    }
    
    const role = await Role.create({ name, permissions });
    
    res.status(201).json(role);
  } catch (error) {
    console.error('Create role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateRole = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const role = await Role.findByPk(req.params.id);
    
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    
    const { name, permissions } = req.body;
    
    await role.update({ name, permissions });
    
    res.json(role);
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const assignRole = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, roleId } = req.body;
    
    const user = await User.findByPk(userId);
    const role = await Role.findByPk(roleId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    
    await user.addRole(role);
    
    res.json({ message: 'Role assigned successfully' });
  } catch (error) {
    console.error('Assign role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getRoles,
  createRole,
  updateRole,
  assignRole
};