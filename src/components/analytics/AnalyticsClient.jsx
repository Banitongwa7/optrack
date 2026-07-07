"use client";
import { useEffect, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  barOptions,
  lineOptions,
  doughnutOptions,
  BAR_STYLE,
  DOUGHNUT_STYLE,
} from "@/lib/chartjs";
import { SERIES, STATUS, INK } from "@/lib/palette";
import { ChartCard, ChartLegend, ChartSkeleton } from "@/components/ui/ChartCard";

const TOP_COUNTRIES = 10;

export default function AnalyticsClient() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => {
        if (!res.ok) throw new Error(`API error (${res.status})`);
        return res.json();
      })
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-4 mt-6">
        Unable to load statistics: {error}. Check the database connection.
      </div>
    );
  }

  const topCountries = stats?.byCountry.slice(0, TOP_COUNTRIES);
  const countryData = stats && {
    labels: topCountries.map((c) => c.label),
    datasets: [
      {
        label: "Opportunities",
        data: topCountries.map((c) => c.count),
        backgroundColor: SERIES[0],
        ...BAR_STYLE,
      },
    ],
  };

  const domainData = stats && {
    labels: stats.byDomain.map((d) => d.label),
    datasets: [
      {
        data: stats.byDomain.map((d) => d.count),
        backgroundColor: stats.byDomain.map((_, i) => SERIES[i % SERIES.length]),
        ...DOUGHNUT_STYLE,
      },
    ],
  };

  const yearData = stats && {
    labels: stats.byYear.map((y) => y.label),
    datasets: [
      {
        label: "Opportunities",
        data: stats.byYear.map((y) => y.count),
        borderColor: SERIES[0],
        backgroundColor: SERIES[0],
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3,
      },
    ],
  };

  const workModeData = stats && {
    labels: ["Remote", "On-site"],
    datasets: [
      {
        data: [stats.totals.remote, stats.totals.onSite],
        backgroundColor: [SERIES[0], SERIES[1]],
        ...DOUGHNUT_STYLE,
      },
    ],
  };

  const statusData = stats && {
    labels: ["Open", "Closed"],
    datasets: [
      {
        data: [stats.totals.open, stats.totals.closed],
        backgroundColor: [STATUS.good, STATUS.critical],
        ...DOUGHNUT_STYLE,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-6">
      <ChartCard title={`Top ${TOP_COUNTRIES} countries`} className="lg:col-span-2">
        {countryData ? (
          <div className="h-80">
            <Bar data={countryData} options={barOptions({ horizontal: true })} />
          </div>
        ) : (
          <ChartSkeleton height="h-80" />
        )}
      </ChartCard>

      <ChartCard title="Opportunities by domain">
        {domainData ? (
          <div className="flex items-center gap-6">
            <div className="h-72 flex-1 min-w-0">
              <Doughnut data={domainData} options={doughnutOptions()} />
            </div>
            <div className="w-52 shrink-0">
              <ChartLegend
                items={stats.byDomain.map((d, i) => ({
                  label: d.label,
                  value: d.count,
                  color: SERIES[i % SERIES.length],
                }))}
              />
            </div>
          </div>
        ) : (
          <ChartSkeleton height="h-72" />
        )}
      </ChartCard>

      <ChartCard title="Evolution by year">
        {yearData ? (
          <div className="h-72">
            <Line data={yearData} options={lineOptions()} />
          </div>
        ) : (
          <ChartSkeleton height="h-72" />
        )}
      </ChartCard>

      <ChartCard title="Work mode">
        {workModeData ? (
          <div className="flex items-center gap-6">
            <div className="h-56 flex-1 min-w-0">
              <Doughnut data={workModeData} options={doughnutOptions()} />
            </div>
            <div className="w-44 shrink-0">
              <ChartLegend
                items={[
                  { label: "Remote", value: stats.totals.remote, color: SERIES[0] },
                  { label: "On-site", value: stats.totals.onSite, color: SERIES[1] },
                ]}
              />
            </div>
          </div>
        ) : (
          <ChartSkeleton height="h-56" />
        )}
      </ChartCard>

      <ChartCard title="Open vs closed">
        {statusData ? (
          <div className="flex items-center gap-6">
            <div className="h-56 flex-1 min-w-0">
              <Doughnut data={statusData} options={doughnutOptions()} />
            </div>
            <div className="w-44 shrink-0">
              <ChartLegend
                items={[
                  { label: "✓ Open", value: stats.totals.open, color: STATUS.good },
                  { label: "✕ Closed", value: stats.totals.closed, color: STATUS.critical },
                ]}
              />
            </div>
          </div>
        ) : (
          <ChartSkeleton height="h-56" />
        )}
      </ChartCard>
    </div>
  );
}
