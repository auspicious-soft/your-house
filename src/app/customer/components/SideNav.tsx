"use client";
import { useState } from "react";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import NavLogo from "@/assets/images/logo.png"
import Image from "next/image";

const SideNav = () => {
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
    <div className={`sideNav ${isCollapsed ? 'collapsed' : ''} h-[100%] overflo-custom`}>
      <div className="">
        <div className="header min-h-[46px] justify-between gap-[10px]">
          {!isCollapsed && (
            <div className="logoContainer">
              <Link href="/customer/dashboard">
                <Image src={NavLogo} alt="animate" className="mx-auto max-w-[172px]"/> 
              </Link>
            </div>
          )}
          <button onClick={toggleSidebar} className="hamburgerButton">
          </button>
        </div>
        <ul className="navList">
          <li className={isActive('/customer/dashboard')}>
            <Link href="/customer/dashboard">
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </li>
          <li className={isActive('/customer/wellness')}>
            <Link href="/customer/wellness">
              {!isCollapsed && <span>Wellness</span>}
            </Link>
          </li>
          <li className={isActive('/customer/profile')}>
            <Link href="/customer/profile">
              {!isCollapsed && <span>Profile</span>}
            </Link>
          </li>
          <li className={isActive('/customer/change-password')}>
            <Link href="/customer/change-password">
              {!isCollapsed && <span>Change Password</span>}
            </Link>
          </li>
          <li className={isActive('/customer/billing-insurance')}>
            <Link href="/customer/billing-insurance">
              {!isCollapsed && <span>Billing & Insurance</span>}
            </Link>
          </li>
          <li className={isActive('/customer/plans')}>
            <Link href="/customer/plans">
              {!isCollapsed && <span>Plans</span>}
            </Link>
          </li>
        </ul>
      </div>
      <div className="">
        <ul className="navList">
          <li className="!m-0">
            <a onClick={handleLogout} style={{ cursor: 'pointer' }}>
              {!isCollapsed && <span className="text-[#283C63] text-[600]">Log Out</span>}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideNav;
