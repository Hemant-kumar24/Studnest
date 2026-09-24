// Backward-compatible wrapper.
// New code should use authMiddleware + roleMiddleware('admin').
const authMiddleware = require('./authMiddleware');
const allowRoles = require('./roleMiddleware');

module.exports = [authMiddleware, allowRoles('admin')];
