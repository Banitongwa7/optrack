import MapPageClient from "@/components/map/MapPageClient";

export const metadata = {
  title: "Map",
  description:
    "Explore opportunities by country on an interactive world choropleth or Google Maps view, with month/year filters, zoom, tooltips and a ranked side panel.",
};

export default function MapPage() {
  return (
    <section className="w-full py-4 px-10">
      <div className="flex justify-between items-center border-b border-gray-300">
        <h1 className="text-2xl font-semibold pt-2 pb-6">Find On Map</h1>
      </div>
      <MapPageClient />
    </section>
  );
}
