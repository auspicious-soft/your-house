"use client";
import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
//import { MenuIcon, ToggleClose } from "@/utils/svgIcons";
import { usePathname } from "next/navigation";
import NotifactionBar from "./NotifactionBar";

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
    <header className="flex justify-between items-center p-[15px]  lg:p-[40px] ">
     
      <div className="flex items-center justify-between w-full">
        <h1 className="main-heading">{currentPageName}</h1>
        <div className="hidden lg:block"><NotifactionBar /> </div>
      </div>
    </header>
  );
};

export default Header;