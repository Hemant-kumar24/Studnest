/*
Expected backend contract for this frontend module.

GET    /api/admin/payments
Query: page, limit, status, search, bookingId, userId
Response:
{
  success: true,
  data: [...],
  pagination: { page, limit, total, pages }
}

GET    /api/admin/payments/:id
Response: { success: true, data: payment }

GET    /api/admin/payments/revenue-summary
Response:
{
  success: true,
  data: {
    totalTransactions,
    totalRevenue,
    successfulRevenue,
    pendingTransactions,
    failedTransactions,
    refundedAmount
  }
}

Recommended admin-only statuses:
Successful/Paid, Pending/Created, Failed, Refunded.

IMPORTANT:
- Backend must enforce admin role.
- Revenue should be calculated from verified successful payments only.
- Never expose Razorpay secret/signature secrets to frontend.
- If your Payment model uses a different status vocabulary, map it in PaymentStatusBadge.jsx.
*/
