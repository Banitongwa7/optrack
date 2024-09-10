'use client'
import { BsArrowLeftShort } from "react-icons/bs";
import { useState } from "react";



export default function Home() {
  const [open, setOpen] = useState(true)
  return (
    <div className="flex ">
      <div className={`bg-dark-purple h-screen p-5 pt-8 relative ${open ? "w-72" : "w-20"}`}>
        <BsArrowLeftShort className="bg-white text-dark-purple rounded-full text-3xl absolute -right-3 top-9 border border-dark-purple cursor-pointer" onClick={() => setOpen(!open)}/>
      </div>
      <div className="p-7">
        <h1 className="text-2xl font-semibold">Home page</h1>
      </div>
    </div>
  );
}
