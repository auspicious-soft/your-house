"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import NavLogo from "@/assets/images/logo.png";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  CustomerActiveIcon,
  CustomerIcon,
  DashboardActiveIcon,
  DashboardIcon,
  EmployeeActiveIcon,
  EmployeeIcon,
  ProjectActiveIcon,
  ProjectIcon,
} from "@/utils/svgicons";
import { useTranslations } from "next-intl";

const SideNav = () => {
  const router = useRouter();
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
          <Link href="/admin/dashboard" className="inline-block">
            <Image src={NavLogo} alt="animate" className=" max-w-[172px]" />
          </Link>
          <button onClick={toggleSidebar} className="hamburgerButton"></button>
        </div>
        <ul className="navList">
          <li className={isActive("/admin/dashboard")}>
            <Link href="/admin/dashboard">
              {isActive("/admin/dashboard") ? <DashboardActiveIcon /> : <DashboardIcon />}
              <div>{t("dashboard")}</div>
            </Link>
          </li>
          <li
            className={`${isActive("/admin/projects")} ${
              currentPath?.includes("/new-project") ? "active" : ""
            } ${currentPath?.includes("/project-profile") ? "active" : ""}`}
          >
            <Link href="/admin/projects">
              {isActive("/admin/projects") ? <ProjectActiveIcon /> : <ProjectIcon />}
              <div>{t("projects")}</div>
            </Link>
          </li>
          <li
            className={`${isActive("/admin/customers")} ${
              currentPath?.startsWith("/admin/customers/profile") ? "active" : ""
            }`}>
            <Link href="/admin/customers">
              {isActive("/admin/customers") ? <CustomerActiveIcon /> : <CustomerIcon />}
              <div>{t("customers")}</div>
            </Link>
          </li>
          <li className={`${isActive("/admin/employees")}`} >
            <Link href="/admin/employees">
              {isActive("/admin/employees") ? <EmployeeActiveIcon /> : <EmployeeIcon />}
              <div>{t("Employees")}</div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideNav;
