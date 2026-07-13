import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function countBy(groups, key) {
  return groups
    .map((g) => ({ label: g[key] ?? "Unknown", count: g._count._all }))
    .sort((a, b) => b.count - a.count);
}

// Optional period filters: ?year=2026 restricts to that year; adding
// &month=1..12 narrows to that month (via begin_at, so it needs the year).
function buildWhere(searchParams) {
  const year = Number(searchParams.get("year"));
  if (!Number.isInteger(year) || year <= 0) return {};

  const month = Number(searchParams.get("month"));
  if (Number.isInteger(month) && month >= 1 && month <= 12) {
    return {
      begin_at: {
        gte: new Date(Date.UTC(year, month - 1, 1)),
        lt: new Date(Date.UTC(year, month, 1)),
      },
    };
  }
  return { year };
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const where = buildWhere(searchParams);

  try {
    const [
      totalOpportunities,
      byCountry,
      byType,
      byDomain,
      byYear,
      byRemote,
      byStatus,
      companies,
      recent,
      allYears,
    ] = await Promise.all([
      prisma.opportunity.count({ where }),
      prisma.opportunity.groupBy({ by: ["country"], where, _count: { _all: true } }),
      prisma.opportunity.groupBy({ by: ["type_opportunity"], where, _count: { _all: true } }),
      prisma.opportunity.groupBy({ by: ["domain"], where, _count: { _all: true } }),
      prisma.opportunity.groupBy({ by: ["year"], where, _count: { _all: true } }),
      prisma.opportunity.groupBy({ by: ["remote"], where, _count: { _all: true } }),
      prisma.opportunity.groupBy({ by: ["closed"], where, _count: { _all: true } }),
      prisma.opportunity.findMany({
        where,
        select: { company: true },
        distinct: ["company"],
      }),
      prisma.opportunity.findMany({
        where,
        orderBy: { created_at: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          company: true,
          country: true,
          type_opportunity: true,
          created_at: true,
        },
      }),
      // Unfiltered list of available years, for filter dropdowns.
      prisma.opportunity.findMany({
        select: { year: true },
        distinct: ["year"],
        where: { year: { not: null } },
        orderBy: { year: "asc" },
      }),
    ]);

    const remoteCount = byRemote.find((g) => g.remote)?._count._all ?? 0;
    const openCount = byStatus
      .filter((g) => g.closed !== true)
      .reduce((sum, g) => sum + g._count._all, 0);

    return Response.json({
      totals: {
        opportunities: totalOpportunities,
        countries: byCountry.length,
        companies: companies.length,
        domains: byDomain.filter((g) => g.domain).length,
        remote: remoteCount,
        onSite: totalOpportunities - remoteCount,
        open: openCount,
        closed: totalOpportunities - openCount,
      },
      byCountry: countBy(byCountry, "country"),
      byType: countBy(byType, "type_opportunity"),
      byDomain: countBy(byDomain, "domain"),
      byYear: countBy(byYear, "year").sort((a, b) =>
        String(a.label).localeCompare(String(b.label))
      ),
      years: allYears.map((y) => y.year),
      recent,
    });
  } catch (err) {
    console.error("GET /api/stats failed:", err);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
