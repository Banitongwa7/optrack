import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/admin-auth";
import { parseOpportunityPayload } from "@/lib/opportunity-admin";

function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(req) {
  if (!getSessionFromRequest(req)) return unauthorized();

  const data = await prisma.opportunity.findMany({
    orderBy: { created_at: "desc" },
    take: 200,
  });

  return Response.json({ data });
}

export async function POST(req) {
  if (!getSessionFromRequest(req)) return unauthorized();

  try {
    const body = await req.json();
    const data = parseOpportunityPayload(body);
    const created = await prisma.opportunity.create({ data });
    return Response.json({ data: created }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message || "Invalid payload" }, { status: 400 });
  }
}

export async function PUT(req) {
  if (!getSessionFromRequest(req)) return unauthorized();

  try {
    const body = await req.json();
    const id = Number(body?.id);
    if (!Number.isInteger(id)) {
      return Response.json({ error: "A valid id is required" }, { status: 400 });
    }

    const data = parseOpportunityPayload(body);
    const updated = await prisma.opportunity.update({ where: { id }, data });
    return Response.json({ data: updated });
  } catch (error) {
    if (error.code === "P2025") {
      return Response.json({ error: "Opportunity not found" }, { status: 404 });
    }
    return Response.json({ error: error.message || "Invalid payload" }, { status: 400 });
  }
}

export async function DELETE(req) {
  if (!getSessionFromRequest(req)) return unauthorized();

  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!Number.isInteger(id)) {
    return Response.json({ error: "A valid id is required" }, { status: 400 });
  }

  try {
    await prisma.opportunity.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (error) {
    if (error.code === "P2025") {
      return Response.json({ error: "Opportunity not found" }, { status: 404 });
    }
    return Response.json({ error: "Unable to delete opportunity" }, { status: 400 });
  }
}
