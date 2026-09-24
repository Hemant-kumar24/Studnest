const styles = {
  Successful: "bg-green-100 text-green-700",
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Failed: "bg-red-100 text-red-700",
  Refunded: "bg-purple-100 text-purple-700",
  Created: "bg-blue-100 text-blue-700",
};

export default function PaymentStatusBadge({ status }) {
  const value = status || "Unknown";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[value] || "bg-gray-100 text-gray-700"}`}>
      {value}
    </span>
  );
}
