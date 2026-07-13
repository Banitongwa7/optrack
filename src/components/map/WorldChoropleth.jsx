"use client";
import { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { MdAdd, MdRemove, MdOutlineRefresh } from "react-icons/md";
import worldTopo from "world-atlas/countries-110m.json";
import { SEQUENTIAL, INK } from "@/lib/palette";
import { buildCountryLookup } from "@/lib/countries";

// 5-step sequential blue scale (light -> dark = few -> many).
const SCALE = [SEQUENTIAL[0], SEQUENTIAL[2], SEQUENTIAL[3], SEQUENTIAL[4], SEQUENTIAL[6]];
const INITIAL_VIEW = { coordinates: [10, 10], zoom: 1 };

function bucketFor(count, max) {
  if (!count) return null;
  return Math.min(SCALE.length - 1, Math.floor((count / max) * SCALE.length));
}

export default function WorldChoropleth({ byCountry, onCountryClick }) {
  const [tooltip, setTooltip] = useState(null);
  const [view, setView] = useState(INITIAL_VIEW);

  const lookup = useMemo(() => buildCountryLookup(byCountry), [byCountry]);
  const maxCount = Math.max(1, ...byCountry.map((c) => c.count));

  const zoomBy = (factor) =>
    setView((v) => ({ ...v, zoom: Math.min(8, Math.max(1, v.zoom * factor)) }));

  return (
    <>
      <div className="relative w-full overflow-hidden rounded-md bg-[#eef3f8]">
        <div className="absolute right-3 top-3 z-10 flex flex-col gap-1">
          <button
            onClick={() => zoomBy(1.5)}
            aria-label="Zoom in"
            className="bg-white shadow rounded-md p-1.5 text-gray-600 hover:text-gray-900"
          >
            <MdAdd className="w-5 h-5" />
          </button>
          <button
            onClick={() => zoomBy(1 / 1.5)}
            aria-label="Zoom out"
            className="bg-white shadow rounded-md p-1.5 text-gray-600 hover:text-gray-900"
          >
            <MdRemove className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView(INITIAL_VIEW)}
            aria-label="Reset view"
            className="bg-white shadow rounded-md p-1.5 text-gray-600 hover:text-gray-900"
          >
            <MdOutlineRefresh className="w-5 h-5" />
          </button>
        </div>

        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{ scale: 150 }}
          style={{ width: "100%", height: "auto" }}
        >
          <ZoomableGroup
            center={view.coordinates}
            zoom={view.zoom}
            onMoveEnd={({ coordinates, zoom }) => setView({ coordinates, zoom })}
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
                      onClick={() => entry && onCountryClick(entry.dbLabel)}
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
          </ZoomableGroup>
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
          <span
            className="w-4 h-3 rounded-sm border border-gray-200"
            style={{ backgroundColor: INK.empty }}
          />
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
  );
}
