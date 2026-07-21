import * as XLSX from "xlsx";
import { getSessionFromRequest } from "@/lib/admin-auth";
import { OPPORTUNITY_TEMPLATE_COLUMNS } from "@/lib/opportunity-admin";

export const dynamic = "force-dynamic";

function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(req) {
  if (!getSessionFromRequest(req)) return unauthorized();

  const workbook = XLSX.utils.book_new();
  const headers = OPPORTUNITY_TEMPLATE_COLUMNS.map((column) => column.header);
  const sampleRow = OPPORTUNITY_TEMPLATE_COLUMNS.map((column) => column.example);
  const guideRows = [
    ["column", "required", "label", "example"],
    ...OPPORTUNITY_TEMPLATE_COLUMNS.map((column) => [
      column.header,
      column.required ? "yes" : "no",
      column.label,
      column.example,
    ]),
  ];

  const dataSheet = XLSX.utils.aoa_to_sheet([headers, sampleRow]);
  const guideSheet = XLSX.utils.aoa_to_sheet(guideRows);

  XLSX.utils.book_append_sheet(workbook, dataSheet, "opportunities");
  XLSX.utils.book_append_sheet(workbook, guideSheet, "guide");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="optrack-import-template.xlsx"',
    },
  });
}