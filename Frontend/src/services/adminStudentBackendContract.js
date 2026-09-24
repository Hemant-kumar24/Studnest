/*
Expected backend contract.

GET /api/admin/students?page=1&limit=10&search=&status=Active
  -> { success, data: [...], pagination }

GET /api/admin/students/:id
  -> { success, data: {
       student/profile fields,
       bookings: [...],
       complaints: [...],
       reviews: [...]
     } }

Backend must enforce admin role.
Frontend guards are not a security boundary.

If your User model uses `status` instead of `isActive`, map it in
StudentStatusBadge.jsx and AdminStudents.jsx.
*/
