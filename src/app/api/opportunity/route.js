import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

function buildWhere(searchParams) {
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
      orderBy: { created_at: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    });

    return Response.json({ data, page, totalPage, countData });
  } catch (err) {
    console.error("GET /api/opportunity failed:", err);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}

const REQUIRED_FIELDS = ["name", "company", "type_opportunity", "url", "country", "city"];

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const missing = REQUIRED_FIELDS.filter(
    (f) => !body[f] || typeof body[f] !== "string" || !body[f].trim()
  );
  if (missing.length > 0) {
    return Response.json(
      { error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  const beginAt = body.begin_at ? new Date(body.begin_at) : null;
  const endAt = body.end_at ? new Date(body.end_at) : null;
  const year = body.year
    ? Number(body.year)
    : beginAt
      ? beginAt.getFullYear()
      : new Date().getFullYear();

  try {
    const data = await prisma.opportunity.create({
      data: {
        name: body.name.trim(),
        description: body.description?.trim() || null,
        company: body.company.trim(),
        email_company: body.email_company?.trim() || null,
        type_opportunity: body.type_opportunity.trim(),
        remote: Boolean(body.remote),
        domain: body.domain?.trim() || null,
        url: body.url.trim(),
        country: body.country.trim(),
        city: body.city.trim(),
        year,
        begin_at: beginAt && !isNaN(beginAt) ? beginAt : null,
        end_at: endAt && !isNaN(endAt) ? endAt : null,
        closed: Boolean(body.closed),
      },
    });
    return Response.json({ data }, { status: 201 });
  } catch (err) {
    console.error("POST /api/opportunity failed:", err);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
