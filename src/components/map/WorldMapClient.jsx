"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import worldTopo from "world-atlas/countries-110m.json";
import { SEQUENTIAL, INK } from "@/lib/palette";
import { buildCountryLookup } from "@/lib/countries";
import { ChartCard, ChartSkeleton } from "@/components/ui/ChartCard";

// 5-step sequential blue scale (light -> dark = few -> many).
const SCALE = [SEQUENTIAL[0], SEQUENTIAL[2], SEQUENTIAL[3], SEQUENTIAL[4], SEQUENTIAL[6]];

function bucketFor(count, max) {
  if (!count) return null;
  const idx = Math.min(
    SCALE.length - 1,
    Math.floor((count / max) * SCALE.length)
  );
  return idx;
}

export default function WorldMapClient() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => {
        if (!res.ok) throw new Error(`API error (${res.status})`);
        return res.json();
      })
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  const lookup = useMemo(
    () => (stats ? buildCountryLookup(stats.byCountry) : new Map()),
    [stats]
  );
  const maxCount = useMemo(
    () => Math.max(1, ...(stats?.byCountry.map((c) => c.count) ?? [1])),
    [stats]
  );

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-4 mt-6">
        Unable to load statistics: {error}. Check the database connection.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 py-6">
      <ChartCard title="Opportunities by country" className="lg:col-span-3">
        {stats ? (
          <>
            <div className="relative w-full overflow-hidden">
              <ComposableMap
                projection="geoEqualEarth"
                projectionConfig={{ scale: 150 }}
                style={{ width: "100%", height: "auto" }}
              >
                <Geographies geography={worldTopo}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const entry = lookup.get(geo.properties.name.toLowerCase());
                      const bucket = bucketFor(entry?.count, maxCount);
                      const fill = bucket == null ? INK.empty : SCALE[bucket];
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={fill}
                          stroke="#ffffff"
                          strokeWidth={0.5}
                          onMouseMove={(evt) =>
                            setTooltip({
                              x: evt.clientX,
                              y: evt.clientY,
                              name: geo.properties.name,
                              count: entry?.count ?? 0,
                            })
                          }
                          onMouseLeave={() => setTooltip(null)}
                          onClick={() => {
                            if (entry) {
                              router.push(
                                `/explore?country=${encodeURIComponent(entry.dbLabel)}`
                              );
                            }
                          }}
                          style={{
                            default: { outline: "none" },
                            hover: {
                              outline: "none",
                              stroke: "#081A51",
                              strokeWidth: 1,
                              cursor: entry ? "pointer" : "default",
                            },
                            pressed: { outline: "none" },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>
              {tooltip && (
                <div
                  className="fixed z-50 pointer-events-none bg-white shadow-lg border border-gray-200 rounded-md px-3 py-2 text-sm"
                  style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
                >
                  <p className="font-semibold text-gray-800">{tooltip.name}</p>
                  <p className="text-gray-600">
                    {tooltip.count} opportunit{tooltip.count === 1 ? "y" : "ies"}
                    {tooltip.count > 0 && (
                      <span className="text-gray-400"> · click to explore</span>
                    )}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mt-4 text-xs text-gray-600 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-3 rounded-sm border border-gray-200" style={{ backgroundColor: INK.empty }} />
                No data
              </span>
              {SCALE.map((color, i) => (
                <span key={color} className="flex items-center gap-1.5">
                  <span className="w-4 h-3 rounded-sm" style={{ backgroundColor: color }} />
                  {i === 0 ? "Few" : i === SCALE.length - 1 ? "Most" : ""}
                </span>
              ))}
            </div>
          </>
        ) : (
          <ChartSkeleton height="h-96" />
        )}
      </ChartCard>

      <ChartCard title="Ranking">
        {stats ? (
          <ol className="space-y-1 max-h-[28rem] overflow-y-auto pr-1">
            {stats.byCountry.map((c, i) => (
              <li key={c.label}>
                <button
                  onClick={() =>
                    router.push(`/explore?country=${encodeURIComponent(c.label)}`)
                  }
                  className="w-full flex items-center gap-2 text-sm py-1.5 px-2 rounded hover:bg-gray-100 text-left"
                >
                  <span className="text-gray-400 w-6 shrink-0 tabular-nums">
                    {i + 1}.
                  </span>
                  <span className="text-gray-700 flex-1 truncate">{c.label}</span>
                  <span className="font-semibold text-gray-900 tabular-nums">
                    {c.count}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        ) : (
          <ChartSkeleton height="h-96" />
        )}
      </ChartCard>
    </div>
  );
}
