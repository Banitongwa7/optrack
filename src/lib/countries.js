// Maps country names as stored in the database to the names used by the
// world-atlas (Natural Earth) topojson, for the choropleth map.
// Matching is case-insensitive; identical names need no entry.
const DB_TO_ATLAS = {
  "united states": "United States of America",
  usa: "United States of America",
  "democratic republic of the congo": "Dem. Rep. Congo",
  "dr congo": "Dem. Rep. Congo",
  drc: "Dem. Rep. Congo",
  "ivory coast": "Côte d'Ivoire",
  "cote d'ivoire": "Côte d'Ivoire",
  "central african republic": "Central African Rep.",
  "republic of the congo": "Congo",
  "south sudan": "S. Sudan",
  "dominican republic": "Dominican Rep.",
  "bosnia and herzegovina": "Bosnia and Herz.",
  "czech republic": "Czechia",
};

export function atlasNameFor(dbCountry) {
  const key = dbCountry.trim().toLowerCase();
  return DB_TO_ATLAS[key] ?? dbCountry.trim();
}

// Builds a lookup keyed by normalized atlas name from the API's byCountry
// stats, so map geographies can find their data (and the original DB label).
export function buildCountryLookup(byCountry) {
  const lookup = new Map();
  for (const entry of byCountry) {
    const atlasName = atlasNameFor(String(entry.label));
    lookup.set(atlasName.toLowerCase(), {
      dbLabel: entry.label,
      count: entry.count,
    });
  }
  return lookup;
}
