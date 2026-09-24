// Backward-compatible wrapper.
// New code should use authMiddleware + roleMiddleware('student').
const authMiddleware = require('./authMiddleware');
const allowRoles = require('./roleMiddleware');

module.exports = [authMiddleware, allowRoles('student')];
