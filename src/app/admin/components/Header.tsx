"use client";
import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
//import { MenuIcon, ToggleClose } from "@/utils/svgIcons";
import { usePathname } from "next/navigation";
import NotifactionBar from "./NotifactionBar";
import { useTranslations } from "next-intl";

interface HeaderProps {
  notificationsCount: number;
  userImage: string | StaticImageData;
  toggleSidebar: () => void;
  isOpen: boolean;
}

const Header: React.FC = () => {
  const pathname = usePathname();
  const t = useTranslations('CustomerDashboard');
  const pageNames: { [key: string]: string } = {
    "/admin/dashboard": t("dashboard"),
    "/admin/projects": t("projects"),
    "/admin/customers": t("customers"),
    "/admin/new-project": t("addNewProject"),
    "/admin/projects/project-profile/": t("projects")
    
  };
  const getPageName = (path: string): string => {
    if (path.startsWith("/admin/customers/profile/")) {
      return t("customers");
    }
    return pageNames[path] || t("projects");
  };
  const currentPageName = getPageName(pathname);
  // const currentPageName = pageNames[pathname] || t("projects");

  return (
    <header className="flex justify-between items-center p-[15px]  lg:p-[40px] ">
     
      <div className="flex items-center justify-between w-full">
        <h1 className="main-heading capitalize">{currentPageName}</h1>  
        <div className="hidden lg:block"><NotifactionBar /> </div>
      </div>
    </header>
  );
};

export default Header;