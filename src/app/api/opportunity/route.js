import prisma from "@/lib/prisma";
import { buildWhere, buildOrderBy } from "@/lib/opportunity-query";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

// Read-only API: OpTrack is a consultation app. Data management happens
// through Prisma (seed script, `npx prisma studio`), not over HTTP.
export async function GET(req) {
  const { searchParams } = new URL(req.url);

  try {
    if (searchParams.has("id")) {
      const id = Number(searchParams.get("id"));
      if (!Number.isInteger(id)) {
        return Response.json({ error: "Invalid id" }, { status: 400 });
      }
      const data = await prisma.opportunity.findUnique({ where: { id } });
      if (!data) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }
      return Response.json({ data });
    }

    const where = buildWhere(searchParams);
    const countData = await prisma.opportunity.count({ where });
    const totalPage = Math.max(1, Math.ceil(countData / PAGE_SIZE));
    const page = Math.min(
      Math.max(1, Number(searchParams.get("page")) || 1),
      totalPage
    );

    const data = await prisma.opportunity.findMany({
      where,
      orderBy: buildOrderBy(searchParams),
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    });

    return Response.json({ data, page, totalPage, countData });
  } catch (err) {
    console.error("GET /api/opportunity failed:", err);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
