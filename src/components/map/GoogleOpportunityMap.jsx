"use client";
import { useMemo, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { centroidFor } from "@/lib/geo";

// "DEMO_MAP_ID" is Google's documented placeholder enabling Advanced Markers
// without a custom map style.
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";

// Marker diameter in px, scaled by share of the max count.
function sizeFor(count, max) {
  return 28 + Math.round((count / max) * 26);
}

export default function GoogleOpportunityMap({ apiKey, byCountry, onCountryClick }) {
  const [selected, setSelected] = useState(null);

  const markers = useMemo(
    () =>
      byCountry
        .map((entry) => ({ ...entry, position: centroidFor(entry.label) }))
        .filter((entry) => entry.position),
    [byCountry]
  );
  const maxCount = Math.max(1, ...markers.map((m) => m.count));

  return (
    <APIProvider apiKey={apiKey}>
      <div className="w-full h-[32rem] rounded-md overflow-hidden">
        <Map
          defaultCenter={{ lat: 18, lng: 8 }}
          defaultZoom={2.4}
          minZoom={2}
          mapId={MAP_ID}
          gestureHandling="greedy"
          streetViewControl={false}
          mapTypeControl={false}
          fullscreenControl={true}
        >
          {markers.map((marker) => (
            <AdvancedMarker
              key={marker.label}
              position={marker.position}
              onClick={() => setSelected(marker)}
              title={`${marker.label}: ${marker.count}`}
            >
              <div
                className="flex items-center justify-center rounded-full bg-dark-purple text-white font-semibold shadow-lg border-2 border-white hover:scale-110 transition-transform"
                style={{
                  width: sizeFor(marker.count, maxCount),
                  height: sizeFor(marker.count, maxCount),
                  fontSize: 12,
                }}
              >
                {marker.count}
              </div>
            </AdvancedMarker>
          ))}

          {selected && (
            <InfoWindow
              position={selected.position}
              pixelOffset={[0, -sizeFor(selected.count, maxCount) / 2]}
              onCloseClick={() => setSelected(null)}
            >
              <div className="p-1 min-w-40">
                <p className="font-semibold text-gray-800">{selected.label}</p>
                <p className="text-sm text-gray-600 mb-2">
                  {selected.count} opportunit{selected.count === 1 ? "y" : "ies"}
                </p>
                <button
                  onClick={() => onCountryClick(selected.label)}
                  className="text-sm font-medium text-white bg-dark-purple rounded-md px-3 py-1.5 hover:opacity-90"
                >
                  View opportunities →
                </button>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}
