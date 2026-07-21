import * as XLSX from "xlsx";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/admin-auth";
import { isImportRowEmpty, parseOpportunityImportRow } from "@/lib/opportunity-admin";

function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(req) {
  if (!getSessionFromRequest(req)) return unauthorized();

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json({ error: "Excel file is required" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
    const firstSheetName = workbook.SheetNames[0];

    if (!firstSheetName) {
      return Response.json({ error: "Workbook is empty" }, { status: 400 });
    }

    const sheet = workbook.Sheets[firstSheetName];
    const rawRows = XLSX.utils.sheet_to_json(sheet, {
      defval: "",
      raw: true,
    });

    const data = [];
    const errors = [];

    rawRows.forEach((row, index) => {
      if (isImportRowEmpty(row)) return;

      try {
        data.push(parseOpportunityImportRow(row));
      } catch (error) {
        errors.push(`Ligne ${index + 2}: ${error.message || "Invalid row"}`);
      }
    });

    if (errors.length > 0) {
      return Response.json(
        {
          error: "Import failed",
          details: errors,
        },
        { status: 400 }
      );
    }

    if (data.length === 0) {
      return Response.json({ error: "No rows to import" }, { status: 400 });
    }

    const result = await prisma.opportunity.createMany({ data });
    return Response.json({ ok: true, count: result.count });
  } catch (error) {
    console.error("POST /api/admin/opportunity/import failed:", error);
    return Response.json({ error: "Unable to import Excel file" }, { status: 500 });
  }
}