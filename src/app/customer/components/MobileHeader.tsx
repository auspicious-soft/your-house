"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import NavLogo from "@/assets/images/logo.png";
import {
  CustomerActiveIcon,
  CustomerIcon,
  DashboardActiveIcon,
  DashboardIcon,
  HamburgerIcon,
  ProjectActiveIcon,
  ProjectIcon,
} from "@/utils/svgicons";
import NotifactionBar from "@/app/admin/components/NotifactionBar";
import { useTranslations } from "next-intl";

const MobileHeader = () => {
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

  const isActive = (path: string) => (currentPath === path ? "active" : "");

  const handleLinkClick = () => {
    setIsCollapsed(false);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <>
      <div className="header min-h-[46px] flex justify-between gap-[10px] py-[15px] px-[15px] bg-white">
        <div className="logoContainer">
          <Link href="/customer/dashboard">
            <Image src={NavLogo} alt="logo" className="mx-auto max-w-[130px]" />
          </Link>
        </div>
        <div className="flex items-center gap-3 md:gap-5">
          <NotifactionBar />
          <button onClick={toggleSidebar} className="hamburgerButton">
            <HamburgerIcon />
          </button>
        </div>
      </div>
      <div className={`sideNav ${isCollapsed ? "collapsed" : ""} h-[100%] overflow-custom`}>
        <ul className="navList">
          <li className={isActive("/customer/dashboard")}>
            <Link href="/customer/dashboard" onClick={handleLinkClick}>
              {isActive("/customer/dashboard") ? <DashboardActiveIcon /> : <DashboardIcon />}
              {t("dashboard")}
            </Link>
          </li>
          <li className={isActive("/customer/projects")}>
            <Link href="/customer/projects" onClick={handleLinkClick}>
              {isActive("/customer/projects") ? <ProjectActiveIcon /> : <ProjectIcon />}
              {t("projects")}
            </Link>
          </li>
          <li className={isActive("/customer/myprofile")}>
            <Link href="/customer/myprofile" onClick={handleLinkClick}>
              {isActive("/customer/myprofile") ? <CustomerActiveIcon /> : <CustomerIcon />}
              {t("myProfile")}
            </Link>
          </li>
          <li className="mr-3">
            <button onClick={handleLogout} className="button w-full !h-10">
              {t("logOut")}
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default MobileHeader;
