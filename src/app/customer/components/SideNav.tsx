"use client";
import { useState } from "react";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import NavLogo from "@/assets/images/logo.png"
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
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
  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/');
  }
  return (
    <div className={`sideNav ${isCollapsed ? 'collapsed' : ''} h-[100%] overflo-custom`}>
      <div className="">
        <div className="mb-[50px] ">
          <Link href="/customer/dashboard" className="inline-block">
            <Image src={NavLogo} alt="animate" className=" max-w-[172px]" />
          </Link>
          <button onClick={toggleSidebar} className="hamburgerButton">
          </button>
        </div>
        <ul className="navList">
          <li className={isActive('/customer/dashboard')}>
            <Link href="/customer/dashboard">
              {isActive('/customer/dashboard') ? <DashboardActiveIcon /> : <DashboardIcon />}
              {t('dashboard')}
            </Link>
          </li>
          <li className={`${isActive('/customer/projects')} ${pathname.includes('/project-profile') ? 'active' : ''}`}>
            <Link href="/customer/projects">
              {isActive('/customer/projects') ? <ProjectActiveIcon /> : <ProjectIcon />}
              {t('projects')}
            </Link>
          </li>
          <li className={isActive('/customer/myprofile')}>
            <Link href="/customer/myprofile">
              {isActive('/customer/myprofile') ? <CustomerActiveIcon /> : <CustomerIcon />}
              {t('myProfile')}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideNav;
