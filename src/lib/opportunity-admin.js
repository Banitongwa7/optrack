const TEMPLATE_COLUMNS = [
  { key: "name", header: "name", label: "Nom", required: true, example: "Frontend Engineer Internship" },
  { key: "company", header: "company", label: "Entreprise", required: true, example: "OpTrack Labs" },
  { key: "type_opportunity", header: "type_opportunity", label: "Type", required: true, example: "Internship" },
  { key: "url", header: "url", label: "URL", required: true, example: "https://example.com/jobs/frontend-intern" },
  { key: "country", header: "country", label: "Pays", required: true, example: "Tunisia" },
  { key: "city", header: "city", label: "Ville", required: true, example: "Tunis" },
  { key: "description", header: "description", label: "Description", required: false, example: "6-month internship on analytics dashboards." },
  { key: "email_company", header: "email_company", label: "Email entreprise", required: false, example: "jobs@example.com" },
  { key: "domain", header: "domain", label: "Domaine", required: false, example: "Software Engineering" },
  { key: "remote", header: "remote", label: "Teletravail", required: false, example: "true" },
  { key: "year", header: "year", label: "Annee", required: false, example: "2026" },
  { key: "begin_at", header: "begin_at", label: "Debut", required: false, example: "2026-09-01" },
  { key: "end_at", header: "end_at", label: "Fin", required: false, example: "2027-02-28" },
  { key: "closed", header: "closed", label: "Statut", required: false, example: "false" },
];

const IMPORT_FIELD_ALIASES = Object.fromEntries(
  Object.entries({
    name: ["name", "nom", "title", "titre"],
    description: ["description"],
    company: ["company", "entreprise"],
    email_company: ["email_company", "company_email", "email entreprise", "email_entreprise", "company email"],
    type_opportunity: ["type_opportunity", "type", "opportunity_type", "type opportunite", "type opportunité"],
    remote: ["remote", "teletravail", "tele travail", "telework"],
    domain: ["domain", "domaine"],
    url: ["url", "link", "lien"],
    country: ["country", "pays"],
    city: ["city", "ville"],
    year: ["year", "annee", "année"],
    begin_at: ["begin_at", "start_date", "date_debut", "debut", "début", "start date"],
    end_at: ["end_at", "end_date", "date_fin", "fin", "end date"],
    closed: ["closed", "status", "statut"],
  }).map(([field, aliases]) => [field, aliases.map(normalizeHeader)])
);

export const OPPORTUNITY_TEMPLATE_COLUMNS = TEMPLATE_COLUMNS;

export function parseOpportunityPayload(body) {
  const name = cleanString(body?.name);
  const company = cleanString(body?.company);
  const typeOpportunity = cleanString(body?.type_opportunity);
  const url = cleanString(body?.url);
  const country = cleanString(body?.country);
  const city = cleanString(body?.city);

  if (!name || !company || !typeOpportunity || !url || !country || !city) {
    throw new Error("name, company, type_opportunity, url, country, city are required");
  }

  return {
    name,
    description: optionalString(body?.description),
    company,
    email_company: optionalString(body?.email_company),
    type_opportunity: typeOpportunity,
    remote: body?.remote === undefined ? false : parseBoolean(body?.remote, "remote"),
    domain: optionalString(body?.domain),
    url,
    country,
    city,
    year: parseOptionalInteger(body?.year, "year"),
    begin_at: parseOptionalDate(body?.begin_at, "begin_at"),
    end_at: parseOptionalDate(body?.end_at, "end_at"),
    closed:
      body?.closed === null || body?.closed === undefined || body?.closed === ""
        ? null
        : parseBoolean(body?.closed, "closed"),
  };
}

export function parseOpportunityImportRow(row) {
  const normalizedRow = normalizeRow(row);

  return parseOpportunityPayload({
    name: readField(normalizedRow, "name"),
    description: readField(normalizedRow, "description"),
    company: readField(normalizedRow, "company"),
    email_company: readField(normalizedRow, "email_company"),
    type_opportunity: readField(normalizedRow, "type_opportunity"),
    remote: readField(normalizedRow, "remote"),
    domain: readField(normalizedRow, "domain"),
    url: readField(normalizedRow, "url"),
    country: readField(normalizedRow, "country"),
    city: readField(normalizedRow, "city"),
    year: readField(normalizedRow, "year"),
    begin_at: readField(normalizedRow, "begin_at"),
    end_at: readField(normalizedRow, "end_at"),
    closed: readField(normalizedRow, "closed"),
  });
}

export function isImportRowEmpty(row) {
  return Object.values(row).every((value) => !hasValue(value));
}

function normalizeRow(row) {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [normalizeHeader(key), value])
  );
}

function readField(row, field) {
  const aliases = IMPORT_FIELD_ALIASES[field] || [];

  for (const alias of aliases) {
    if (hasValue(row[alias])) {
      return row[alias];
    }
  }

  return undefined;
}

function hasValue(value) {
  return !(
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "")
  );
}

function optionalString(value) {
  const trimmed = cleanString(value);
  return trimmed || null;
}

function cleanString(value) {
  if (value === undefined || value === null) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).trim();
}

function normalizeHeader(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function parseBoolean(value, fieldName) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") {
    if (value === 1) return true;
    if (value === 0) return false;
  }

  const normalized = normalizeHeader(value);
  const truthy = ["true", "1", "yes", "oui", "remote", "distance", "closed", "ferme", "fermee", "fermee"];
  const falsy = ["false", "0", "no", "non", "open", "ouvert", "ouverte", "on_site", "onsite", "sur_site"];

  if (truthy.includes(normalized)) return true;
  if (falsy.includes(normalized)) return false;

  throw new Error(`${fieldName} must be a recognized boolean value`);
}

function parseOptionalDate(value, fieldName) {
  if (value === null || value === undefined || value === "") return null;

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new Error(`${fieldName} must be a valid date`);
    }
    return value;
  }

  if (typeof value === "number") {
    const date = new Date(Date.UTC(1899, 11, 30) + value * 86400000);
    if (Number.isNaN(date.getTime())) {
      throw new Error(`${fieldName} must be a valid date`);
    }
    return date;
  }

  const date = new Date(String(value));
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