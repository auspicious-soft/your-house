"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import Logo from "@/assets/images/logo.png";
//import { MenuIcon, ToggleClose } from "@/utils/svgIcons";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/actions";
import { NotificationIcon, SearchIcon } from "@/utils/svgicons";
import avatar from "@/assets/images/avatar.png";

interface HeaderProps {
  notificationsCount: number;
  userImage: string | StaticImageData;
  toggleSidebar: () => void;
  isOpen: boolean;
}

const Header: React.FC = () => {
  const pathname = usePathname();
  // const router = useRouter()
  const pageNames: { [key: string]: string } = {
    "/admin/dashboard": "Dashboard",
    "/admin/projects": "Projects",
    "/admin/customers": "Customers",
    "/admin/new-project": "Add New Project",
    "/admin/projects/project-profile/": "Projects"
  };

  const currentPageName = pageNames[pathname] || "Projects";

  return (
    <header className="flex justify-between items-center p-5  md:p-[40px] ">
     
      <div className="flex items-center justify-end lg:justify-between w-full">
        <h1 className="hidden lg:block main-heading">{currentPageName}</h1>

        <div className="flex items-center gap-5 relative">
        <div><SearchIcon/> </div>
        <button><NotificationIcon/> </button>
          <div className="cursor-pointer">
            <Image
              src={avatar}
              alt="User Pr
              
              ofile"
              width={30}
              height={30}
              className="rounded-[5px] w-[30px] h-[30px]"
            />
          </div>
          {/* {showData && (
            <div className="text-right absolute z-[2] top-[40px] right-0 w-[150px] h-auto bg-white p-3 rounded-lg shadow-[0_4px_4px_0_rgba(0,0,0,0.08)]">
              <div>
                <button
                  onClick={handleSignOut}
                  className="text-[#e87223] text-base cursor-pointer font-bold flex items-center justify-center w-full"
                >
                  Log Out
                </button>
              </div>
            </div>
          )} */}
        </div>
        {/* <button
          className="block lg:hidden z-[3] ml-[15px]"
          onClick={toggleSidebar}
        >
          {isOpen ? 'X' : '+'}
        </button> */}
      </div>
    </header>
  );
};

export default Header;