export default function StatCard({
  label,
  value,
  icon: Icon,
  iconColor = "text-indigo-500",
  iconBg = "bg-indigo-50",
}) {
  return (
    <div className="bg-white shadow-sm rounded-xl flex justify-between items-center py-4 px-5 border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="space-y-1">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{label}</p>
        <p className="text-2xl font-bold text-gray-900">
          {value == null ? (
            <span className="text-gray-300">—</span>
          ) : (
            value.toLocaleString()
          )}
        </p>
      </div>
      <div className={`p-3 rounded-xl ${iconBg} ${iconColor} shrink-0`}>
        <Icon className="w-7 h-7" />
      </div>
    </div>
  );
}
