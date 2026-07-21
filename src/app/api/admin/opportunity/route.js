import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/admin-auth";

function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

function parseBoolean(value, fieldName) {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`${fieldName} must be true or false`);
}

function parseOptionalDate(value, fieldName) {
  if (value === null || value === undefined || value === "") return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} must be a valid date`);
  }
  return date;
}

function parseOptionalInteger(value, fieldName) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) {
    throw new Error(`${fieldName} must be an integer`);
  }
  return parsed;
}

function parseOpportunityPayload(body) {
  const name = body?.name?.trim();
  const company = body?.company?.trim();
  const type_opportunity = body?.type_opportunity?.trim();
  const url = body?.url?.trim();
  const country = body?.country?.trim();
  const city = body?.city?.trim();

  if (!name || !company || !type_opportunity || !url || !country || !city) {
    throw new Error("name, company, type_opportunity, url, country, city are required");
  }

  return {
    name,
    description: body?.description?.trim() || null,
    company,
    email_company: body?.email_company?.trim() || null,
    type_opportunity,
    remote: parseBoolean(body?.remote, "remote"),
    domain: body?.domain?.trim() || null,
    url,
    country,
    city,
    year: parseOptionalInteger(body?.year, "year"),
    begin_at: parseOptionalDate(body?.begin_at, "begin_at"),
    end_at: parseOptionalDate(body?.end_at, "end_at"),
    closed: body?.closed === null || body?.closed === undefined || body?.closed === "" ? null : parseBoolean(body.closed, "closed"),
  };
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
