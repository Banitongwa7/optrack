export function ChartCard({ title, children, className = "" }) {
  return (
    <div className={`bg-white shadow rounded-md p-5 ${className}`}>
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

// HTML legend with visible values — identity is never carried by color
// alone, and low-contrast fills stay readable (palette relief rule).
export function ChartLegend({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2 text-sm">
          <span
            className="w-3 h-3 rounded-sm shrink-0"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-gray-700 flex-1 truncate">{item.label}</span>
          <span className="text-gray-900 font-semibold tabular-nums">
            {item.value}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function ChartSkeleton({ height = "h-64" }) {
  return <div className={`${height} bg-gray-100 rounded animate-pulse`} />;
}
