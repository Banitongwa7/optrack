"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaMapMarkedAlt, FaGlobeAfrica } from "react-icons/fa";
import { ChartCard, ChartSkeleton } from "@/components/ui/ChartCard";
import GoogleOpportunityMap from "@/components/map/GoogleOpportunityMap";
import WorldChoropleth from "@/components/map/WorldChoropleth";

const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const selectClass =
  "border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-dark-purple/40 disabled:bg-gray-100 disabled:text-gray-400";

function ViewToggle({ view, setView }) {
  const tabs = [
    { id: "google", label: "Google Maps", icon: <FaMapMarkedAlt />, disabled: !GOOGLE_MAPS_KEY },
    { id: "world", label: "World view", icon: <FaGlobeAfrica />, disabled: false },
  ];
  return (
    <div className="inline-flex rounded-md border border-gray-300 bg-white p-0.5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setView(tab.id)}
          disabled={tab.disabled}
          title={tab.disabled ? "Requires a Google Maps API key (see README)" : undefined}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded ${
            view === tab.id
              ? "bg-dark-purple text-white"
              : "text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
          }`}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </div>
  );
}

export default function MapPageClient() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [view, setView] = useState(GOOGLE_MAPS_KEY ? "google" : "world");

  useEffect(() => {
    const params = new URLSearchParams();
    if (year) params.set("year", year);
    if (year && month) params.set("month", month);

    fetch(`/api/stats?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error(`API error (${res.status})`);
        return res.json();
      })
      .then(setStats)
      .catch((err) => setError(err.message));
  }, [year, month]);

  const goToCountry = (country) =>
    router.push(`/explore?country=${encodeURIComponent(country)}`);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-4 mt-6">
        Unable to load statistics: {error}. Check the database connection.
      </div>
    );
  }

  const maxCount = Math.max(1, ...(stats?.byCountry.map((c) => c.count) ?? [1]));
  const periodLabel = year ? `${month ? MONTHS[month - 1] + " " : ""}${year}` : "all time";

  return (
    <div className="py-6">
      {!GOOGLE_MAPS_KEY && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md px-4 py-3 text-sm mb-4">
          The Google Maps view is disabled: set <code className="font-mono bg-blue-100 px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in
          your environment to enable it (see README). Showing the built-in world view instead.
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <ViewToggle view={view} setView={setView} />

        <div className="flex items-center gap-2 ml-auto">
          <select
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              if (!e.target.value) setMonth("");
            }}
            className={selectClass}
            aria-label="Filter by year"
          >
            <option value="">All years</option>
            {(stats?.years ?? []).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            disabled={!year}
            className={selectClass}
            aria-label="Filter by month"
            title={!year ? "Select a year first" : undefined}
          >
            <option value="">All months</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
          {(year || month) && (
            <button
              onClick={() => { setYear(""); setMonth(""); }}
              className="text-sm text-gray-500 hover:text-gray-800 underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <ChartCard title={`Opportunities by country — ${periodLabel}`} className="lg:col-span-3">
          {stats ? (
            stats.totals.opportunities === 0 ? (
              <div className="h-96 flex items-center justify-center text-gray-400">
                No opportunities for this period.
              </div>
            ) : view === "google" && GOOGLE_MAPS_KEY ? (
              <GoogleOpportunityMap
                apiKey={GOOGLE_MAPS_KEY}
                byCountry={stats.byCountry}
                onCountryClick={goToCountry}
              />
            ) : (
              <WorldChoropleth
                byCountry={stats.byCountry}
                onCountryClick={goToCountry}
              />
            )
          ) : (
            <ChartSkeleton height="h-96" />
          )}
        </ChartCard>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white shadow rounded-md p-4 text-center">
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.totals.opportunities ?? "—"}
              </p>
              <p className="text-xs text-gray-500 uppercase font-semibold mt-1">
                Opportunities
              </p>
            </div>
            <div className="bg-white shadow rounded-md p-4 text-center">
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.totals.countries ?? "—"}
              </p>
              <p className="text-xs text-gray-500 uppercase font-semibold mt-1">
                Countries
              </p>
            </div>
          </div>

          <ChartCard title="Ranking">
            {stats ? (
              stats.byCountry.length === 0 ? (
                <p className="text-sm text-gray-400">No data for this period.</p>
              ) : (
                <ol className="space-y-1 max-h-96 overflow-y-auto pr-1">
                  {stats.byCountry.map((c, i) => (
                    <li key={c.label}>
                      <button
                        onClick={() => goToCountry(c.label)}
                        className="w-full text-sm py-1.5 px-2 rounded hover:bg-gray-100 text-left"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-gray-400 w-6 shrink-0 tabular-nums">{i + 1}.</span>
                          <span className="text-gray-700 flex-1 truncate">{c.label}</span>
                          <span className="font-semibold text-gray-900 tabular-nums">{c.count}</span>
                        </span>
                        <span className="block ml-8 mt-1 h-1 rounded bg-gray-100">
                          <span
                            className="block h-1 rounded bg-dark-purple/70"
                            style={{ width: `${(c.count / maxCount) * 100}%` }}
                          />
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              )
            ) : (
              <ChartSkeleton height="h-96" />
            )}
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
