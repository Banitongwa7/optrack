import { Suspense } from "react";
import TableData from "@/components/table/TableData";

export const metadata = {
  title: "Explore Data",
  description:
    "Browse and filter all opportunities in a paginated table with full-text search, country, type, domain, year and status filters. Export to CSV.",
};

export default function ExplorePage() {
  return (
    <section className="w-full py-4 px-10">
      <div className="flex justify-between items-center border-b border-gray-300">
        <h1 className="text-2xl font-semibold pt-2 pb-6">Explore Data</h1>
      </div>

      <div className="w-full mt-6">
        <Suspense fallback={<div className="text-gray-400 text-sm">Loading…</div>}>
          <TableData />
        </Suspense>
      </div>
    </section>
  );
}
