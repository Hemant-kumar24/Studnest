import StudentStatusBadge from "./StudentStatusBadge";

export default function StudentCard({ student, onView }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{student.name || "Unnamed Student"}</h3>
          <p className="text-sm text-gray-500">{student.email || "—"}</p>
        </div>
        <StudentStatusBadge active={student.isActive !== false} />
      </div>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div><span className="text-gray-500">Phone</span><p>{student.phone || "—"}</p></div>
        <div><span className="text-gray-500">College</span><p>{student.college || "—"}</p></div>
        <div><span className="text-gray-500">City</span><p>{student.city || student.location?.city || "—"}</p></div>
        <div><span className="text-gray-500">Joined</span><p>{student.createdAt ? new Date(student.createdAt).toLocaleDateString("en-IN") : "—"}</p></div>
      </div>

      <button
        onClick={() => onView(student._id)}
        className="mt-4 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
      >
        View Student
      </button>
    </div>
  );
}
