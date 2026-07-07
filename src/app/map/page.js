import WorldMapClient from "@/components/map/WorldMapClient";

export const metadata = {
  title: "Map",
};

export default function MapPage() {
  return (
    <section className="w-full py-4 px-10">
      <div className="flex justify-between items-center border-b border-gray-300">
        <h1 className="text-2xl font-semibold pt-2 pb-6">Find On Map</h1>
      </div>
      <WorldMapClient />
    </section>
  );
}
