export default function StatCard({ title, value, hint }) {
  return (
    <article className="admin-stat-card">
      <span>{title}</span>
      <strong>{value}</strong>
      {hint && <small>{hint}</small>}
    </article>
  );
}
