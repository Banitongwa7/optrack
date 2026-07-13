// Shared query building for the read-only opportunity endpoints
// (list + CSV export), so filters behave identically in both.

export function buildWhere(searchParams) {
  const where = {};

  const search = searchParams.get("search");
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
      { type_opportunity: { contains: search, mode: "insensitive" } },
      { domain: { contains: search, mode: "insensitive" } },
      { country: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
    ];
  }

  const country = searchParams.get("country");
  if (country) where.country = { equals: country, mode: "insensitive" };

  const type = searchParams.get("type");
  if (type) where.type_opportunity = { equals: type, mode: "insensitive" };

  const domain = searchParams.get("domain");
  if (domain) where.domain = { equals: domain, mode: "insensitive" };

  const year = Number(searchParams.get("year"));
  if (year) where.year = year;

  const remote = searchParams.get("remote");
  if (remote === "true" || remote === "false") where.remote = remote === "true";

  const status = searchParams.get("status");
  if (status === "open") where.closed = { not: true };
  if (status === "closed") where.closed = true;

  return where;
}

// Whitelisted sortable columns (query value -> Prisma field).
const SORTABLE = {
  name: "name",
  company: "company",
  country: "country",
  year: "year",
  created_at: "created_at",
};

export function buildOrderBy(searchParams) {
  const field = SORTABLE[searchParams.get("sort")] ?? "created_at";
  const dir = searchParams.get("dir") === "asc" ? "asc" : "desc";
  return { [field]: dir };
}
