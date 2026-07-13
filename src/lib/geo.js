import { geoCentroid } from "d3-geo";
import { feature } from "topojson-client";
import worldTopo from "world-atlas/countries-110m.json";
import { atlasNameFor } from "@/lib/countries";

// Hand-picked centroids for countries whose computed centroid is skewed by
// overseas territories or unusual shapes (lat, lng). Everything else falls
// back to the geometric centroid of the world-atlas feature.
const CURATED = {
  france: { lat: 46.6, lng: 2.5 },
  "united states of america": { lat: 39.8, lng: -98.6 },
  canada: { lat: 56.1, lng: -106.3 },
  netherlands: { lat: 52.2, lng: 5.5 },
  norway: { lat: 61.5, lng: 8.8 },
  portugal: { lat: 39.6, lng: -8.0 },
  "united kingdom": { lat: 54.0, lng: -2.5 },
};

let computed;
function computedCentroids() {
  if (!computed) {
    computed = new Map();
    const { features } = feature(worldTopo, worldTopo.objects.countries);
    for (const f of features) {
      const [lng, lat] = geoCentroid(f);
      computed.set(f.properties.name.toLowerCase(), { lat, lng });
    }
  }
  return computed;
}

// Returns { lat, lng } for a DB country name, or null if unknown.
export function centroidFor(dbCountry) {
  const atlasName = atlasNameFor(String(dbCountry)).toLowerCase();
  return CURATED[atlasName] ?? computedCentroids().get(atlasName) ?? null;
}
