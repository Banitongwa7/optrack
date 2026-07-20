import DashboardClient from "@/components/dashboard/DashboardClient";

export const metadata = {
  title: "Dashboard",
  description:
    "Live counters and charts: total opportunities, countries, companies, type breakdown, yearly evolution and latest entries.",
};

export default function Home() {
  return (
    <section className="w-full py-4 px-4 sm:px-6 lg:px-10">
      <div className="flex justify-between items-center border-b border-gray-300">
        <h1 className="text-xl sm:text-2xl font-semibold pt-2 pb-6">Dashboard</h1>
      </div>
      <DashboardClient />
    </section>
  );
}
