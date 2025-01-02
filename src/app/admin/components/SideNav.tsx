"use client";
import { useState } from "react";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import NavLogo from "@/assets/images/logo.png"
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CustomerActiveIcon, CustomerIcon, DashboardActiveIcon, DashboardIcon, ProjectActiveIcon, ProjectIcon } from "@/utils/svgicons";
import { useTranslations } from "next-intl";

const SideNav = () => {
  const router = useRouter();
  const t = useTranslations('CustomerDashboard');

  const [isCollapsed, setIsCollapsed] = useState(false);


  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  const isActive = (path: string) => pathname === path ? 'active' : '';

  return (
    <div className={`sideNav ${isCollapsed ? 'collapsed' : ''} h-[100%] overflo-custom`}>
      <div className="">
        <div className="mb-[50px] ">
          <Link href="/admin/dashboard" className="inline-block">
            <Image src={NavLogo} alt="animate" className=" max-w-[172px]" />
          </Link>
          <button onClick={toggleSidebar} className="hamburgerButton">
          </button>
        </div>
        <ul className="navList">
          <li className={isActive('/admin/dashboard')}>
            <Link href="/admin/dashboard">
              {isActive('/admin/dashboard') ? <DashboardActiveIcon /> : <DashboardIcon />}
              {t('dashboard')}
            </Link>
          </li>
          <li className={`${isActive('/admin/projects')} ${pathname.includes('/new-project') ? 'active' : ''} ${pathname.includes('/project-profile') ? 'active' : ''}`}>
            <Link href="/admin/projects">
              {isActive('/admin/projects') ? <ProjectActiveIcon /> : <ProjectIcon />}
              {t('projects')}
            </Link>
          </li>
          <li className={`${isActive('/admin/customers')} ${pathname.startsWith('/admin/customers/profile') ? 'active' : ''}`}>
            {/* {isActive('/admin/customers')}> */}
            <Link href="/admin/customers">
              {isActive('/admin/customers') ? <CustomerActiveIcon /> : <CustomerIcon />}
              {t('customers')}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideNav;
