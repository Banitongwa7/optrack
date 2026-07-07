"use client";
import { useState } from "react";
import { AiOutlineBarChart } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import { RiDashboardFill } from "react-icons/ri";
import { FaRegMap } from "react-icons/fa";
import { MdArrowBackIosNew } from "react-icons/md";
import { ImEarth } from "react-icons/im";
import { FaDatabase } from "react-icons/fa6";
import { useRouter, usePathname } from "next/navigation";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const Menus = [
    { title: "Dashboard", spacing: true, icon: <RiDashboardFill />, link: "/" },
    { title: "Map", icon: <ImEarth />, link: "/map" },
    { title: "Analytics", icon: <AiOutlineBarChart />, link: "/analytics" },
    { title: "Explore Data", icon: <FaDatabase />, link: "/explore" },
  ];
  const router = useRouter();
  const pathname = usePathname();

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setQuery("");
    router.push(`/explore?search=${encodeURIComponent(q)}`);
  };

  return (
    <div className={`bg-dark-purple h-screen p-5 pt-8 sticky top-0 duration-300 shrink-0 ${open ? "w-72" : "w-20"}`}>
      <MdArrowBackIosNew
        className={`bg-white p-1 text-gray-600 rounded-full text-3xl absolute -right-3 top-9 border border-dark-purple cursor-pointer ${!open && "rotate-180"}`}
        onClick={() => setOpen(!open)}
      />
      <div className="inline-flex">
        <FaRegMap className={`bg-amber-300 text-dark-purple p-1 rounded text-4xl block cursor-pointer float-left duration-500 mr-2 ${open && "rotate-[360deg]"}`} />
        <h1 className={`text-white origin-left font-medium text-2xl duration-300 ${!open && "scale-0"}`}>OpTrack</h1>
      </div>

      <form
        onSubmit={submitSearch}
        className={`flex items-center rounded-md bg-light-white mt-6 py-2 ${!open ? "px-2.5" : "px-4"}`}
      >
        <BsSearch
          className={`text-white text-lg block float-left cursor-pointer ${open && "mr-2"}`}
          onClick={() => (open ? submitSearch(new Event("submit")) : setOpen(true))}
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          className={`text-base bg-transparent w-full text-white focus:outline-none ${!open && "hidden"}`}
        />
      </form>

      <ul className="pt-2">
        {Menus.map((menu) => {
          const active = pathname === menu.link;
          return (
            <li
              key={menu.link}
              className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-light-white rounded-md ${menu.spacing ? "mt-9" : "mt-2"} ${active ? "bg-light-white text-white" : ""}`}
              onClick={() => router.push(menu.link)}
            >
              <span className="text-2xl block float-left">{menu.icon}</span>
              <span className={`${!open && "hidden"} text-base font-medium flex-1 capitalize duration-300`}>
                {menu.title}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
