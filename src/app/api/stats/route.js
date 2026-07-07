import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function countBy(groups, key) {
  return groups
    .map((g) => ({ label: g[key] ?? "Unknown", count: g._count._all }))
    .sort((a, b) => b.count - a.count);
}

export async function GET() {
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
    ] = await Promise.all([
      prisma.opportunity.count(),
      prisma.opportunity.groupBy({ by: ["country"], _count: { _all: true } }),
      prisma.opportunity.groupBy({ by: ["type_opportunity"], _count: { _all: true } }),
      prisma.opportunity.groupBy({ by: ["domain"], _count: { _all: true } }),
      prisma.opportunity.groupBy({ by: ["year"], _count: { _all: true } }),
      prisma.opportunity.groupBy({ by: ["remote"], _count: { _all: true } }),
      prisma.opportunity.groupBy({ by: ["closed"], _count: { _all: true } }),
      prisma.opportunity.findMany({
        select: { company: true },
        distinct: ["company"],
      }),
      prisma.opportunity.findMany({
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
      recent,
    });
  } catch (err) {
    console.error("GET /api/stats failed:", err);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
