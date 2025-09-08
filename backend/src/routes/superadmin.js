const express = require('express');
const { body } = require('express-validator');
const { requireSuperAdmin } = require('../middleware/auth');
const auditLog = require('../middleware/audit');

// Controllers
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users');

const {
  getRoles,
  createRole,
  updateRole,
  assignRole
} = require('../controllers/roles');

const { getAuditLogs } = require('../controllers/audit');
const { getSummary } = require('../controllers/analytics');

const router = express.Router();

// Users routes
router.get('/users', requireSuperAdmin, getUsers);
router.get('/users/:id', requireSuperAdmin, getUser);
router.post('/users', [
  requireSuperAdmin,
  body('name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], auditLog('CREATE_USER', 'User'), createUser);
router.put('/users/:id', [
  requireSuperAdmin,
  body('name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail()
], auditLog('UPDATE_USER', 'User', null, (req) => ({ userId: req.params.id })), updateUser);
router.delete('/users/:id', requireSuperAdmin, auditLog('DELETE_USER', 'User', null, (req) => ({ userId: req.params.id })), deleteUser);

// Roles routes
router.get('/roles', requireSuperAdmin, getRoles);
router.post('/roles', [
  requireSuperAdmin,
  body('name').notEmpty().trim(),
  body('permissions').isArray()
], auditLog('CREATE_ROLE', 'Role'), createRole);
router.put('/roles/:id', [
  requireSuperAdmin,
  body('name').notEmpty().trim(),
  body('permissions').isArray()
], auditLog('UPDATE_ROLE', 'Role', null, (req) => ({ roleId: req.params.id })), updateRole);
router.post('/assign-role', [
  requireSuperAdmin,
  body('userId').isInt(),
  body('roleId').isInt()
], auditLog('ASSIGN_ROLE', 'User', null, (req) => ({ userId: req.body.userId, roleId: req.body.roleId })), assignRole);

// Audit logs route
router.get('/audit-logs', requireSuperAdmin, getAuditLogs);

// Analytics route
router.get('/analytics/summary', requireSuperAdmin, getSummary);

module.exports = router;