// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  if (searchParams.has("id")) {
    const id = Number(searchParams.get("id"));
    const data = await prisma.opportunity.findUnique({ where: { id } });
    return Response.json({ data });
  } else {
    if (!searchParams.has("page")) {
      return Response.json({ data: [], totalPage: 0, page: 1, countData: 0 });
    } else {
      const countData = await prisma.opportunity.count();
      const totalPage = Math.ceil(countData / 10);
      if (Number(searchParams.get("page")) > totalPage) {
        return Response.json({
          data: [],
          totalPage,
          page: totalPage,
          countData,
        });
      } else if (Number(searchParams.get("page")) < 1) {
        return Response.json({ data: [], totalPage, page: 1, countData });
      } else {
        const page = searchParams.get("page");
        const data = await prisma.opportunity.findMany({
          skip: (Number(page) - 1) * 10,
          take: 10,
        });
        return Response.json({ data, totalPage, page, countData });
      }
    }
  }
}

export async function POST(req) {
  const body = await req.json();

  if (!body) {
    return Response.json({ error: "Missing body" });
  } else if (!body.search) {
    const data = await prisma.opportunity.create({
      data: {
        name: body.name,
        description: body.description,
        company: body.company,
        type_opportunity: body.type_opportunity,
        remote: body.remote,
        domain: body.domain,
        url: body.url,
        country: body.country,
        city: body.city,
        begin_at: body.begin_at,
        end_at: body.end_at,
        closed: body.closed,
      },
    });
    return Response.json(data);
  } else {
    if (body.search) {
      const data = await prisma.opportunity.findMany({
        where: {
          OR: [
            { name: { contains: body.search } },
            { description: { contains: body.search } },
            { company: { contains: body.search } },
            { type_opportunity: { contains: body.search } },
            { domain: { contains: body.search } },
            { country: { contains: body.search } },
            { city: { contains: body.search } },
          ],
        },
      });
      return Response.json(data);
    }
  }
}
