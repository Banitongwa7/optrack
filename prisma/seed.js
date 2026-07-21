/**
 * Seed the database with realistic demo opportunities.
 *
 * Safety: refuses to run if the table already contains data,
 * unless FORCE_SEED=1 is set (then existing data is wiped first).
 *
 * Usage: npx prisma db seed
 */
const { PrismaClient } = require("@prisma/client");
const { randomBytes, scryptSync } = require("crypto");

const prisma = new PrismaClient();
const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || "admin@optrack.com";
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || "admin123";

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

// Small deterministic RNG so the seed is reproducible.
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20240917);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];

const LOCATIONS = [
  { country: "Tunisia", cities: ["Tunis", "Sfax", "Sousse"] },
  { country: "Morocco", cities: ["Casablanca", "Rabat", "Marrakesh"] },
  { country: "Algeria", cities: ["Algiers", "Oran"] },
  { country: "Senegal", cities: ["Dakar", "Thiès"] },
  { country: "Ivory Coast", cities: ["Abidjan", "Yamoussoukro"] },
  { country: "Democratic Republic of the Congo", cities: ["Kinshasa", "Lubumbashi", "Goma"] },
  { country: "Cameroon", cities: ["Douala", "Yaoundé"] },
  { country: "Kenya", cities: ["Nairobi", "Mombasa"] },
  { country: "Nigeria", cities: ["Lagos", "Abuja"] },
  { country: "South Africa", cities: ["Cape Town", "Johannesburg"] },
  { country: "Ghana", cities: ["Accra", "Kumasi"] },
  { country: "Rwanda", cities: ["Kigali"] },
  { country: "Egypt", cities: ["Cairo", "Alexandria"] },
  { country: "France", cities: ["Paris", "Lyon", "Toulouse", "Lille"] },
  { country: "Germany", cities: ["Berlin", "Munich", "Hamburg"] },
  { country: "Belgium", cities: ["Brussels", "Ghent"] },
  { country: "Netherlands", cities: ["Amsterdam", "Rotterdam"] },
  { country: "Spain", cities: ["Madrid", "Barcelona"] },
  { country: "United Kingdom", cities: ["London", "Manchester"] },
  { country: "Canada", cities: ["Montreal", "Toronto", "Vancouver"] },
  { country: "United States", cities: ["New York", "San Francisco", "Austin"] },
];

const DOMAINS = [
  "Software Development",
  "Data Science",
  "Business Intelligence",
  "Cybersecurity",
  "Cloud & DevOps",
  "UI/UX Design",
  "Digital Marketing",
  "Project Management",
];

const TYPES = ["Internship", "Full-time", "Apprenticeship", "Freelance"];

const COMPANIES = [
  "TechNova", "DataBridge", "CloudSphere", "InnoSoft", "NexaLabs",
  "BrightPath", "CodeFactory", "InsightWorks", "PixelForge", "SecureNet",
  "AgileMind", "QuantumLeap", "BlueOcean IT", "GreenByte", "SmartFlow",
  "Vertex Solutions", "OpenGate", "FusionWare", "PrimeStack", "Skyline Digital",
];

const ROLES = {
  "Software Development": ["Frontend Developer", "Backend Developer", "Full-Stack Developer", "Mobile Developer"],
  "Data Science": ["Data Scientist", "Machine Learning Engineer", "Data Analyst"],
  "Business Intelligence": ["BI Analyst", "BI Developer", "Data Engineer"],
  Cybersecurity: ["Security Analyst", "Penetration Tester", "SOC Analyst"],
  "Cloud & DevOps": ["DevOps Engineer", "Cloud Architect", "Site Reliability Engineer"],
  "UI/UX Design": ["UI Designer", "UX Researcher", "Product Designer"],
  "Digital Marketing": ["SEO Specialist", "Content Manager", "Growth Marketer"],
  "Project Management": ["Project Manager", "Scrum Master", "Product Owner"],
};

const TYPE_LABEL = {
  Internship: "Internship",
  "Full-time": "Position",
  Apprenticeship: "Apprenticeship",
  Freelance: "Mission",
};

function buildOpportunities(count) {
  const rows = [];
  for (let i = 0; i < count; i++) {
    const location = pick(LOCATIONS);
    const domain = pick(DOMAINS);
    const type = pick(TYPES);
    const role = pick(ROLES[domain]);
    const company = pick(COMPANIES);
    const year = pick([2023, 2024, 2025, 2025, 2026, 2026]);
    const month = Math.floor(rand() * 12);
    const beginAt = new Date(Date.UTC(year, month, 1 + Math.floor(rand() * 27)));
    const durationMonths = type === "Internship" ? 3 + Math.floor(rand() * 4) : 12;
    const endAt = new Date(beginAt);
    endAt.setUTCMonth(endAt.getUTCMonth() + durationMonths);
    const closed = endAt < new Date() ? true : rand() < 0.15;
    const remote = rand() < 0.35;

    rows.push({
      name: `${role} ${TYPE_LABEL[type]}`,
      description: `${company} is looking for a ${role.toLowerCase()} (${type.toLowerCase()}) in ${location.country}${remote ? ", remote-friendly" : ""}. Join the ${domain} team.`,
      company,
      email_company: `jobs@${company.toLowerCase().replace(/[^a-z]/g, "")}.com`,
      type_opportunity: type,
      remote,
      domain,
      url: `https://careers.example.com/${company.toLowerCase().replace(/[^a-z]/g, "")}/${i + 1}`,
      country: location.country,
      city: remote ? "Remote" : pick(location.cities),
      year,
      begin_at: beginAt,
      end_at: endAt,
      closed,
    });
  }
  return rows;
}

async function main() {
  await prisma.adminUser.upsert({
    where: { email: DEFAULT_ADMIN_EMAIL },
    update: {
      password_hash: hashPassword(DEFAULT_ADMIN_PASSWORD),
    },
    create: {
      email: DEFAULT_ADMIN_EMAIL,
      password_hash: hashPassword(DEFAULT_ADMIN_PASSWORD),
    },
  });
  console.log(`Admin user ready: ${DEFAULT_ADMIN_EMAIL}`);

  /*
  const existing = await prisma.opportunity.count();
  if (existing > 0) {
    if (process.env.FORCE_SEED !== "1") {
      console.log(`Database already contains ${existing} opportunities — skipping seed.`);
      console.log("Set FORCE_SEED=1 to wipe and reseed.");
      return;
    }
    await prisma.opportunity.deleteMany();
    console.log(`Deleted ${existing} existing opportunities.`);
  }

  const rows = buildOpportunities(120);
  const { count } = await prisma.opportunity.createMany({ data: rows });
  console.log(`Seeded ${count} opportunities.`);
  */
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
