import { Link } from "react-router-dom";

export default function QuickAction({
  icon,
  title,
  description,
  to,
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      {/* Icon */}
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg text-slate-700 transition-colors duration-200 group-hover:bg-slate-900 group-hover:text-white">
        {icon}
      </span>

      {/* Content */}
      <span className="min-w-0 flex-1">
        <strong className="block text-sm font-bold text-slate-900">
          {title}
        </strong>

        <small className="mt-1 block text-xs leading-5 text-slate-500">
          {description}
        </small>
      </span>

      {/* Arrow */}
      <span className="text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-slate-700">
        →
      </span>
    </Link>
  );
}