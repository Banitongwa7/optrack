import React from 'react'
import TableData from '@/components/table/TableData'

export default function page() {
  return (
    <section className="w-full py-4 px-10">
      <div className="flex justify-between items-center border-b border-gray-300">
        <h1 className="text-2xl font-semibold pt-2 pb-6">Explore Data</h1>
      </div>

      <div className='w-full mt-6'>
        <TableData />
      </div>
    </section>
  )
}
