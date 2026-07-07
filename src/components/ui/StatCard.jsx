export default function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-white shadow rounded-md flex justify-between items-center py-3.5 px-3.5">
      <div className="space-y-2">
        <p className="text-xs text-gray-600 uppercase font-semibold">{label}</p>
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold">
            {value == null ? "—" : value}
          </h1>
        </div>
      </div>
      <Icon className="w-12 h-12 text-gray-300" />
    </div>
  );
}
