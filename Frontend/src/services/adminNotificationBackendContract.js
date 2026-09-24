/*
Expected backend contract.

GET /api/admin/notifications?page=1&limit=10&type=System&search=
  -> { success, data: [...], pagination }

POST /api/admin/notifications
Body:
{
  title: string,
  message: string,
  type: "Booking" | "Payment" | "Complaint" | "Review" | "System",
  userId?: string
}

DELETE /api/admin/notifications/:id

Backend requirements:
- Enforce admin role on every endpoint.
- Validate notification type/title/message.
- If userId is omitted, define broadcast behavior explicitly.
- Prefer the existing createNotification() utility for generated booking/payment/
  complaint/review notifications instead of duplicating notification logic.
*/
