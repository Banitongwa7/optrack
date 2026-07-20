import AnalyticsClient from "@/components/analytics/AnalyticsClient";

export const metadata = {
  title: "Analytics",
  description:
    "Visualize opportunity trends: top countries, domain breakdown, yearly evolution, work-mode distribution and open vs. closed ratios.",
};

export default function AnalyticsPage() {
  return (
    <section className="w-full py-4 px-10">
      <div className="flex justify-between items-center border-b border-gray-300">
        <h1 className="text-2xl font-semibold pt-2 pb-6">Analytics</h1>
      </div>
      <AnalyticsClient />
    </section>
  );
}
