/*
Expected backend contract.

GET  /api/admin/settings
PUT  /api/admin/settings

GET  /api/admin/profile
PUT  /api/admin/profile
PUT  /api/admin/profile/password

System settings suggested:
maintenanceMode
allowNewRegistrations
allowNewBookings
enableNotifications
enableReviews

SECURITY:
- Every endpoint must enforce admin authentication + role.
- Maintenance mode must be enforced by backend middleware, not just frontend.
- Password change must verify the current password and hash the new password.
- Do not allow an admin to change their role from the profile endpoint.
- Do not expose password hashes or sensitive secrets in API responses.
- For production, consider audit logs for system-setting changes.
*/
