"use client";
import { useEffect, useState } from "react";
import { AiOutlineBarChart } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import { RiDashboardFill } from "react-icons/ri";
import { FaRegMap } from "react-icons/fa";
import { MdArrowBackIosNew, MdMenu, MdClose } from "react-icons/md";
import { ImEarth } from "react-icons/im";
import { FaDatabase } from "react-icons/fa6";
import { useRouter, usePathname } from "next/navigation";

const Menus = [
  { title: "Dashboard", spacing: true, icon: <RiDashboardFill />, link: "/" },
  { title: "Map", icon: <ImEarth />, link: "/map" },
  { title: "Analytics", icon: <AiOutlineBarChart />, link: "/analytics" },
  { title: "Explore Data", icon: <FaDatabase />, link: "/explore" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  // Close mobile drawer on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const submitSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setQuery("");
    setMobileOpen(false);
    router.push(`/explore?search=${encodeURIComponent(q)}`);
  };

  return (
    <>
      {/* ── Mobile: fixed top bar ───────────────────────────── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-dark-purple h-14 flex items-center px-4 gap-3 shadow-md">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="text-white p-1 rounded hover:bg-light-white transition-colors"
        >
          <MdMenu className="w-6 h-6" />
        </button>
        <FaRegMap className="bg-amber-300 text-dark-purple p-1 rounded text-3xl shrink-0" />
        <span className="text-white font-semibold text-lg tracking-wide">OpTrack</span>
      </header>

      {/* ── Mobile: slide-in overlay drawer ─────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="bg-dark-purple w-72 h-full p-5 pt-8 flex flex-col shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="inline-flex items-center gap-2">
                <FaRegMap className="bg-amber-300 text-dark-purple p-1 rounded text-4xl shrink-0" />
                <span className="text-white font-semibold text-xl">OpTrack</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="text-white p-1 rounded hover:bg-light-white transition-colors"
              >
                <MdClose className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={submitSearch}
              className="flex items-center rounded-md bg-light-white px-4 py-2 mb-2"
            >
              <BsSearch className="text-white text-lg mr-2 shrink-0" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="text-base bg-transparent w-full text-white focus:outline-none placeholder:text-white/60"
              />
            </form>

            <nav>
              <ul className="pt-2">
                {Menus.map((menu) => {
                  const active = pathname === menu.link;
                  return (
                    <li
                      key={menu.link}
                      className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-light-white rounded-md mt-2 transition-colors ${active ? "bg-light-white text-white" : ""}`}
                      onClick={() => router.push(menu.link)}
                    >
                      <span className="text-2xl shrink-0">{menu.icon}</span>
                      <span className="text-base font-medium capitalize">{menu.title}</span>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
          {/* Backdrop — click to close */}
          <div
            className="flex-1 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        </div>
      )}

      {/* ── Desktop: collapsible sidebar ────────────────────── */}
      <div
        className={`hidden lg:block bg-dark-purple h-screen p-5 pt-8 sticky top-0 duration-300 shrink-0 ${open ? "w-72" : "w-20"}`}
      >
        <MdArrowBackIosNew
          className={`bg-white p-1 text-gray-600 rounded-full text-3xl absolute -right-3 top-9 border border-dark-purple cursor-pointer transition-transform duration-300 ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />
        <div className="inline-flex items-center">
          <FaRegMap
            className={`bg-amber-300 text-dark-purple p-1 rounded text-4xl block cursor-pointer float-left duration-500 mr-2 ${open && "rotate-[360deg]"}`}
          />
          <h1
            className={`text-white origin-left font-medium text-2xl duration-300 ${!open && "scale-0"}`}
          >
            OpTrack
          </h1>
        </div>

        <form
          onSubmit={submitSearch}
          className={`flex items-center rounded-md bg-light-white mt-6 py-2 ${!open ? "px-2.5" : "px-4"}`}
        >
          <BsSearch
            className={`text-white text-lg block float-left cursor-pointer ${open && "mr-2"}`}
            onClick={() => (open ? submitSearch() : setOpen(true))}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className={`text-base bg-transparent w-full text-white focus:outline-none placeholder:text-white/60 ${!open && "hidden"}`}
          />
        </form>

        <ul className="pt-2">
          {Menus.map((menu) => {
            const active = pathname === menu.link;
            return (
              <li
                key={menu.link}
                className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-light-white rounded-md transition-colors ${menu.spacing ? "mt-9" : "mt-2"} ${active ? "bg-light-white text-white" : ""}`}
                onClick={() => router.push(menu.link)}
              >
                <span className="text-2xl block float-left">{menu.icon}</span>
                <span
                  className={`${!open && "hidden"} text-base font-medium flex-1 capitalize duration-300`}
                >
                  {menu.title}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
