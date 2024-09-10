'use client'
import { BsArrowLeftShort, BsFillImageFill, BsPerson, BsReverseLayoutTextSidebarReverse } from "react-icons/bs";
import { useState } from "react";
import {AiFillEnvironment, AiOutlineBarChart, AiOutlineFileText, AiOutlineLogout, AiOutlineMail, AiOutlineSetting} from "react-icons/ai"
import { BsSearch } from "react-icons/bs";
import {RiDashboardFill} from "react-icons/ri"


export default function Home() {
  const [open, setOpen] = useState(true)
  const Menus = [
    {title: "Dashboard" , icon: <RiDashboardFill/>},
    {title: "Pages", icon: <AiOutlineFileText/>},
    {title: "Media", spacing : true, icon: <BsFillImageFill/>},
    {
      title: "Projects",
      icon: <BsReverseLayoutTextSidebarReverse/>,
      submenu: true,
      submenuItems:  [
        {title: "Project 1"},
        {title: "Project 2"},
        {title: "Project 3"},
      ]
    },
    {title: "Analytics", icon: <AiOutlineBarChart/>},
    {title: "Inbox", icon: <AiOutlineMail/>},
    {title: "Profile", spacing : true, icon: <BsPerson/>},
    {title: "Setting", icon: <AiOutlineSetting/>},
    {title: "Logout", icon: <AiOutlineLogout/>}
  ]
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

        <ul className="pt-2">
          {Menus.map((menu, index) => (
            <li key={index} className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-light-white rounded-md ${menu.spacing ? "mt-9" : "mt-2"}`}>
              <span className="text-2xl block float-left">
                {menu.icon}
              </span>
              <span className={`${!open && "hidden"} text-base font-medium flex-1 capitalize duration-300`}>{menu.title}</span>
            </li>
          ))}
        </ul>
      </div>






      <div className="p-7">
        <h1 className="text-2xl font-semibold">Home page</h1>
      </div>
    </div>
  );
}
