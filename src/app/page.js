import { BiWorld, BiSolidCategoryAlt } from "react-icons/bi";
import { GoOrganization } from "react-icons/go"
import { GrValidate } from "react-icons/gr"

export default function Home() {
  return (
    <section className="w-full py-4 px-10">
      <div className="flex justify-between items-center border-b border-gray-300">
        <h1 className="text-2xl font-semibold pt-2 pb-6">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-6">
        
        <div className="bg-white shadow rounded-md flex justify-between items-center py-3.5 px-3.5">
          <div className="space-y-2">
            <p className="text-xs text-gray-600 uppercase font-semibold">Country</p>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-semibold">54</h1>
            </div>
          </div>
          <BiWorld className="w-12 h-12 text-gray-300" />
        </div>

        <div className="bg-white shadow rounded-sm flex justify-between items-center py-3.5 px-3.5">
          <div className="space-y-2">
            <p className="text-xs text-gray-600 uppercase font-semibold">Company</p>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-semibold">54</h1>
            </div>
          </div>
          <GoOrganization className="w-12 h-12 text-gray-300" />
        </div>

        <div className="bg-white shadow rounded-sm flex justify-between items-center py-3.5 px-3.5">
          <div className="space-y-2">
            <p className="text-xs text-gray-600 uppercase font-semibold">Opportunity</p>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-semibold">54</h1>
            </div>
          </div>
          <GrValidate className="w-12 h-12 text-gray-300" />
        </div>

        <div className="bg-white shadow rounded-sm flex justify-between items-center py-3.5 px-3.5">
          <div className="space-y-2">
            <p className="text-xs text-gray-600 uppercase font-semibold">Domain</p>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-semibold">54</h1>
            </div>
          </div>
          <BiSolidCategoryAlt className="w-12 h-12 text-gray-300" />
        </div>

      </div>


      <div className="w-full h-screen bg-gray-300 mt-6 rounded">
      Graphs will be here
      </div>




      
    </section>
  );
}
