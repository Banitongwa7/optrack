import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Read-only API: OpTrack is a consultation app, so only GET is exposed.
export async function GET(req, { params }) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const data = await prisma.opportunity.findUnique({ where: { id } });
    if (!data) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ data });
  } catch (err) {
    console.error(`GET /api/opportunity/${id} failed:`, err);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
