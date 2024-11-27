"use client";
import { useState } from "react";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import NavLogo from "@/assets/images/logo.png"
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { CustomerActiveIcon, CustomerIcon, DashboardActiveIcon, DashboardIcon, ProjectActiveIcon, ProjectIcon } from "@/utils/svgicons";

const SideNav = () => {
  const router = useRouter();

  // const handleLogout = () => {
  //   localStorage.removeItem('authToken');
  //   router.push('https://blacktherapy.vercel.app/');
  // };

  const [isCollapsed, setIsCollapsed] = useState(false);


  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  const isActive = (path: string) => pathname === path ? 'active' : '';
  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/');
  }
  return (
    <div className={`sideNav ${isCollapsed ? 'collapsed' : ''} h-[100%] overflo-custom`}>
      <div className="">
        <div className="mb-[50px] ">
              <Link href="/admin/dashboard" className="inline-block">
              <Image src={NavLogo} alt="animate" className=" max-w-[172px]"/>
              </Link>
          <button onClick={toggleSidebar} className="hamburgerButton">
          </button>
        </div>
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
  );
};

export default SideNav;
