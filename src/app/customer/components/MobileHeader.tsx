"use client";
import { useState } from "react";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import NavLogo from "@/assets/images/logo.png";
import { CustomerActiveIcon, CustomerIcon, DashboardActiveIcon, DashboardIcon, ProjectActiveIcon, ProjectIcon } from "@/utils/svgicons";

const MobileHeader = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/');
  };

  const [isCollapsed, setIsCollapsed] = useState(false);

  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  const isActive = (path: string) => pathname === path ? 'active' : '';

  return (
    <>
      <div className="header min-h-[46px] justify-between gap-[10px] py-[10px] px-[15px] bg-white">

        <div className="logoContainer">
          <Link href="/customer/dashboard">
          <Image src={NavLogo} alt="animate" className="mx-auto max-w-[172px]"/>
          </Link>
        </div>
        <button onClick={toggleSidebar} className="hamburgerButton">
          dss
        </button>
      </div>
      <div className={`sideNav ${isCollapsed ? 'collapsed' : ''} h-[100%] overflo-custom`}>
        <div className="">

          <ul className="navList">
          <li className={isActive('/admin/dashboard')}>
            <Link href="/admin/dashboard">
              {isActive('/admin/dashboard') ? <DashboardActiveIcon /> : <DashboardIcon />}
              Dashboard
            </Link>
          </li>
          <li className={isActive('/admin/projects')}>
            <Link href="/admin/projects"> 
            {isActive('/admin/projects') ? <ProjectActiveIcon /> : <ProjectIcon />}
              Projects
            </Link>
          </li>
          <li className={isActive('/admin/customers')}>
            <Link href="/admin/customers">
             {isActive('/admin/customers') ? <CustomerActiveIcon /> : <CustomerIcon />}
              Customers
            </Link>
          </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default MobileHeader;
