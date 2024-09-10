'use client'
import { BsArrowLeftShort } from "react-icons/bs";
import { useState } from "react";
import {AiFillEnvironment} from "react-icons/ai"
import { BsSearch } from "react-icons/bs";


export default function Home() {
  const [open, setOpen] = useState(true)
  return (
    <div className="flex ">
      <div className={`bg-dark-purple h-screen p-5 pt-8 relative duration-300 ${open ? "w-72" : "w-20"}`}>
        <BsArrowLeftShort className={`bg-white text-dark-purple rounded-full text-3xl absolute -right-3 top-9 border border-dark-purple cursor-pointer ${!open && "rotate-180"}`} onClick={() => setOpen(!open)}/>
        <div className="inline-flex">
          <AiFillEnvironment className={`bg-amber-300 rounded text-4xl block cursor-pointer float-left duration-500 mr-2 ${open && "rotate-[360deg]"}`}/>
          <h1 className={`text-white origin-left font-medium text-2xl duration-300 ${!open && "scale-0"}`}>OpTrack</h1>
        </div>

        <div className={`flex items-center rounded-md bg-light-white mt-6 py-2 ${!open ? "px-2.5" : "px-4"}`}>
          <BsSearch className={`text-white text-lg block float-left cursor-pointer ${open && "mr-2"}`}/>
          <input type="search" placeholder="Recherche..." className={`text-base bg-transparent w-full text-white focus:outline-none ${!open && "hidden"}`}/>
        </div>
      </div>






      <div className="p-7">
        <h1 className="text-2xl font-semibold">Home page</h1>
      </div>
    </div>
  );
}
