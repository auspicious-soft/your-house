"use client";
import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import NavLogo from "@/assets/images/logo.png";
import { CustomerActiveIcon, CustomerIcon, DashboardActiveIcon, DashboardIcon, HamburgerIcon, ProjectActiveIcon, ProjectIcon } from "@/utils/svgicons";
import NotifactionBar from "@/app/admin/components/NotifactionBar";

const AdminMobileHeader = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/');
  };

  const [isCollapsed, setIsCollapsed] = useState(false);
  
  useEffect(() => {
    if (isCollapsed) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden'); 
    };
  }, [isCollapsed]);
 
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  const isActive = (path: string) => pathname === path ? 'active' : '';

  const handleLinkClick = (path: string) => {
    setIsCollapsed(false); 
  };

  return (
    <>
      <div className="header min-h-[46px] flex justify-between gap-[10px] py-[15px] px-[15px] bg-white">

        <div className="logoContainer">
          <Link href="/admin/dashboard">
          <Image src={NavLogo} alt="animate" className="mx-auto max-w-[130px]"/>
          </Link>
        </div>
        <div className="flex items-center gap-3 md:gap-5">
        <NotifactionBar />
        <button onClick={toggleSidebar} className="hamburgerButton">
          <HamburgerIcon />
        </button>
        </div>
      </div>
      <div className={`sideNav ${isCollapsed ? 'collapsed' : ''} h-[100%] overflo-custom`}>
        <div className="">

        <ul className="navList">
          <li className={isActive('/admin/dashboard')}>
            <Link href="/admin/dashboard" onClick={() => handleLinkClick("/admin/dashboard")}>
              {isActive('/admin/dashboard') ? <DashboardActiveIcon /> : <DashboardIcon />}
              Dashboard
            </Link>
          </li>
          <li className={isActive('/admin/projects')}>
            <Link href="/admin/projects" onClick={() => handleLinkClick("/admin/projects")}> 
            {isActive('/admin/projects') ? <ProjectActiveIcon /> : <ProjectIcon />}
              Projects
            </Link>
          </li>
          <li className={isActive('/admin/customers')}>
            <Link href="/admin/customers" onClick={() => handleLinkClick("/admin/customers")}>
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

export default AdminMobileHeader;