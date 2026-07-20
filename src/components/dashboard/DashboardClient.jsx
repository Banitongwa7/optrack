"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Bar, Doughnut } from "react-chartjs-2";
import { BiWorld, BiSolidCategoryAlt } from "react-icons/bi";
import { GoOrganization } from "react-icons/go";
import { GrValidate } from "react-icons/gr";
import {
  barOptions,
  doughnutOptions,
  BAR_STYLE,
  DOUGHNUT_STYLE,
} from "@/lib/chartjs";
import { SERIES } from "@/lib/palette";
import StatCard from "@/components/ui/StatCard";
import { ChartCard, ChartLegend, ChartSkeleton } from "@/components/ui/ChartCard";

export default function DashboardClient() {
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

  const totals = stats?.totals;

  const yearData = stats && {
    labels: stats.byYear.map((y) => y.label),
    datasets: [
      {
        label: "Opportunities",
        data: stats.byYear.map((y) => y.count),
        backgroundColor: SERIES[0],
        ...BAR_STYLE,
      },
    ],
  };

  const typeData = stats && {
    labels: stats.byType.map((t) => t.label),
    datasets: [
      {
        data: stats.byType.map((t) => t.count),
        backgroundColor: stats.byType.map((_, i) => SERIES[i % SERIES.length]),
        ...DOUGHNUT_STYLE,
      },
    ],
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-6">
        <StatCard label="Opportunities" value={totals?.opportunities} icon={GrValidate} iconColor="text-indigo-500" iconBg="bg-indigo-50" />
        <StatCard label="Countries" value={totals?.countries} icon={BiWorld} iconColor="text-blue-500" iconBg="bg-blue-50" />
        <StatCard label="Companies" value={totals?.companies} icon={GoOrganization} iconColor="text-emerald-500" iconBg="bg-emerald-50" />
        <StatCard label="Domains" value={totals?.domains} icon={BiSolidCategoryAlt} iconColor="text-violet-500" iconBg="bg-violet-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Opportunities by year">
          {yearData ? (
            <div className="h-64">
              <Bar data={yearData} options={barOptions()} />
            </div>
          ) : (
            <ChartSkeleton />
          )}
        </ChartCard>

        <ChartCard title="By opportunity type">
          {typeData ? (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="h-64 w-full sm:flex-1 sm:min-w-0">
                <Doughnut data={typeData} options={doughnutOptions()} />
              </div>
              <div className="sm:w-44 sm:shrink-0 w-full">
                <ChartLegend
                  items={stats.byType.map((t, i) => ({
                    label: t.label,
                    value: t.count,
                    color: SERIES[i % SERIES.length],
                  }))}
                />
              </div>
            </div>
          ) : (
            <ChartSkeleton />
          )}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <ChartCard title="Latest opportunities" className="lg:col-span-2">
          {stats ? (
            <ul className="divide-y divide-gray-100">
              {stats.recent.map((item) => (
                <li key={item.id} className="py-2.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {item.company} · {item.country}
                    </p>
                  </div>
                  <span className="text-xs bg-indigo-50 text-indigo-700 rounded-full px-2.5 py-1 shrink-0 font-medium">
                    {item.type_opportunity}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <ChartSkeleton height="h-48" />
          )}
          <Link
            href="/explore"
            className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
          >
            Explore all data →
          </Link>
        </ChartCard>

        <ChartCard title="Overview">
          {totals ? (
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between items-center">
                <span className="text-gray-600">Open positions</span>
                <span className="font-semibold px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs">
                  ✓ {totals.open}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-600">Closed positions</span>
                <span className="font-semibold px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-xs">
                  ✕ {totals.closed}
                </span>
              </li>
              <li className="flex justify-between items-center border-t border-gray-100 pt-3">
                <span className="text-gray-600">Remote</span>
                <span className="font-semibold text-gray-900">{totals.remote}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-600">On-site</span>
                <span className="font-semibold text-gray-900">{totals.onSite}</span>
              </li>
            </ul>
          ) : (
            <ChartSkeleton height="h-48" />
          )}
        </ChartCard>
      </div>
    </>
  );
}
