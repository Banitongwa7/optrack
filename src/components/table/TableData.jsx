import React from "react";
import Image from "next/image";
import { IoLinkSharp } from "react-icons/io5";

export default function TableData() {
  return (
    <div className="bg-white shadow rounded-sm my-2.5 overflow-x-auto">
      <table className="min-w-max w-full table-auto">
        <thead>
          <tr className="bg-dark-purple text-white uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Title</th>
            <th className="py-3 px-6 text-left">Company</th>
            <th className="py-3 px-6 text-center">Type</th>
            <th className="py-3 px-6 text-center">Domain</th>
            <th className="py-3 px-6 text-center">Country</th>
            <th className="py-3 px-6 text-center">City</th>
            <th className="py-3 px-6 text-center">Closed</th>
            <th className="py-3 px-6 text-center">Year</th>
            <th className="py-3 px-6 text-center">Link</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-medium">
          <tr className="border-b border-gray-200 hover:bg-gray-100">
            <td className="py-3 px-6 text-left whitespace-nowrap">Reactjs</td>
            <td className="py-3 px-6 text-left">
                hello
            </td>
            <td className="py-3 px-6 text-center">Stage</td>
            <td className="py-3 px-6 text-center">
              Business intelligence
            </td>
            <td className="py-3 px-6 text-center">
              Tunisia
            </td>
            <td className="py-3 px-6 text-center">Tunis</td>
            <td className="py-3 px-6 text-center">
            <span className="bg-red-200 text-red-700 py-1 px-3 rounded-full text-xs">
                Deactivated
              </span>
            </td>
            <td className="py-3 px-6 text-center">2023</td>
            <td>
              <div className="flex item-center justify-center">
                <IoLinkSharp className="w-5 h-5 transform hover:text-purple-500 hover:scale-110 cursor-pointer" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
