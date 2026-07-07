import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function parseId(params) {
  const id = Number(params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(req, { params }) {
  const id = parseId(params);
  if (!id) return Response.json({ error: "Invalid id" }, { status: 400 });

  try {
    const data = await prisma.opportunity.findUnique({ where: { id } });
    if (!data) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ data });
  } catch (err) {
    console.error(`GET /api/opportunity/${id} failed:`, err);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}

const UPDATABLE_FIELDS = [
  "name",
  "description",
  "company",
  "email_company",
  "type_opportunity",
  "remote",
  "domain",
  "url",
  "country",
  "city",
  "year",
  "begin_at",
  "end_at",
  "closed",
];

export async function PATCH(req, { params }) {
  const id = parseId(params);
  if (!id) return Response.json({ error: "Invalid id" }, { status: 400 });

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const data = {};
  for (const field of UPDATABLE_FIELDS) {
    if (!(field in body)) continue;
    let value = body[field];
    if (field === "remote" || field === "closed") value = Boolean(value);
    if (field === "year") value = value == null ? null : Number(value);
    if (field === "begin_at" || field === "end_at") {
      value = value ? new Date(value) : null;
      if (value && isNaN(value)) continue;
    }
    data[field] = value;
  }

  if (Object.keys(data).length === 0) {
    return Response.json({ error: "No valid fields to update" }, { status: 400 });
  }

  try {
    const updated = await prisma.opportunity.update({ where: { id }, data });
    return Response.json({ data: updated });
  } catch (err) {
    if (err.code === "P2025") {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    console.error(`PATCH /api/opportunity/${id} failed:`, err);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const id = parseId(params);
  if (!id) return Response.json({ error: "Invalid id" }, { status: 400 });

  try {
    await prisma.opportunity.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (err) {
    if (err.code === "P2025") {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    console.error(`DELETE /api/opportunity/${id} failed:`, err);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
