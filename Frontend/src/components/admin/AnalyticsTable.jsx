import React from "react";

export default function AnalyticsTable({ title, columns = [], rows = [] }) {
  return (
    <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900">
      <div className="border-b border-slate-200 px-4 py-4 sm:px-6 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl dark:text-slate-100">
          {title}
        </h2>
      </div>

      {rows.length === 0 ? (
        <div className="flex min-h-36 items-center justify-center px-4 py-10 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No data available.
          </p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/80">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="whitespace-nowrap border-b border-slate-200 px-4 py-3 font-semibold text-slate-600 sm:px-6 dark:border-slate-700 dark:text-slate-300"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {rows.map((row, index) => (
                <tr
                  key={row._id || row.id || index}
                  className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-4 py-3.5 align-top text-slate-700 sm:px-6 dark:text-slate-200"
                    >
                      {column.render
                        ? column.render(row)
                        : row[column.key] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
