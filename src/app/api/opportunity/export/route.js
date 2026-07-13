import prisma from "@/lib/prisma";
import { buildWhere, buildOrderBy } from "@/lib/opportunity-query";

export const dynamic = "force-dynamic";

const COLUMNS = [
  ["name", "Title"],
  ["company", "Company"],
  ["type_opportunity", "Type"],
  ["domain", "Domain"],
  ["country", "Country"],
  ["city", "City"],
  ["remote", "Remote"],
  ["closed", "Status"],
  ["year", "Year"],
  ["begin_at", "Start date"],
  ["end_at", "End date"],
  ["email_company", "Company email"],
  ["url", "Link"],
  ["description", "Description"],
];

function csvCell(value) {
  if (value == null) return "";
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function formatValue(field, value) {
  if (field === "remote") return value ? "Remote" : "On-site";
  if (field === "closed") return value ? "Closed" : "Open";
  if ((field === "begin_at" || field === "end_at") && value) {
    return new Date(value).toISOString().slice(0, 10);
  }
  return value;
}

// Exports the current filtered view as CSV (same filters as the list API).
export async function GET(req) {
  const { searchParams } = new URL(req.url);

  try {
    const rows = await prisma.opportunity.findMany({
      where: buildWhere(searchParams),
      orderBy: buildOrderBy(searchParams),
    });

    const lines = [
      COLUMNS.map(([, header]) => csvCell(header)).join(","),
      ...rows.map((row) =>
        COLUMNS.map(([field]) => csvCell(formatValue(field, row[field]))).join(",")
      ),
    ];

    // BOM so Excel opens the file as UTF-8.
    const csv = String.fromCharCode(0xfeff) + lines.join("\r\n");

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="optrack-opportunities.csv"`,
      },
    });
  } catch (err) {
    console.error("GET /api/opportunity/export failed:", err);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
