"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import NavLogo from "@/assets/images/logo.png";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DashboardActiveIcon, DashboardIcon, ProjectActiveIcon, ProjectIcon } from "@/utils/svgicons";
import { useTranslations } from "next-intl";

const SideNav = () => {
  const t = useTranslations("CustomerDashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (path: string) =>
    currentPath === path ? "active" : "";

  return (
    <div className={`sideNav ${isCollapsed ? "collapsed" : ""} h-[100%] overflo-custom`}>
      <div className="">
        <div className="mb-[50px]">
          <Link href="/employee/dashboard" className="inline-block">
            <Image src={NavLogo} alt="animate" className=" max-w-[172px]" />
          </Link>
          <button onClick={toggleSidebar} className="hamburgerButton"></button>
        </div>
        <ul className="navList">
          <li className={`${isActive('/employee/dashboard')} ${pathname.startsWith('/employee/dashboard/projects/project-profile') ? 'active' : ''}`}>
            <Link href="/employee/dashboard">
              {isActive("/employee/dashboard") ? <DashboardActiveIcon /> : <DashboardIcon />}
              <div>{t("dashboard")}</div>
            </Link>
          </li>
          <li
            className={`${isActive("/employee/myprofile") ? "active" : ""}`}
          >
            <Link href="/employee/myprofile">
              {isActive("/employee/myprofile") ? <ProjectActiveIcon /> : <ProjectIcon />}
              <div>{t("myProfile")}</div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideNav;
