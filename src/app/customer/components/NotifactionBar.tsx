"use client";
import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import avatar from "@/assets/images/avatar.png";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";


export default function NotifactionBar() {
  const [showData, setShowData] = useState(false);
  const t = useTranslations('CustomerDashboard'); 
  return (
    <div>
       <div className="flex items-center gap-3 md:gap-5 relative">
          <div className="cursor-pointer"> 
            <Image
              src={avatar}
              alt="User Profile"
              onClick={() => setShowData(!showData)}
              width={30}
              height={30}
              className="rounded-[5px] w-[30px] h-[30px]"
            />
          </div>
          {showData && (
           <div className="text-right absolute z-[2] top-[40px] right-0 w-[150px] h-auto bg-white p-3 rounded-lg shadow-[0_4px_4px_0_rgba(0,0,0,0.08)]">
            <button onClick={() => signOut({ redirectTo: '/' })} className="button w-full !h-10 ">{t('logOut')}</button>
          </div>
            // <div className="text-right absolute z-[2] top-[40px] right-0 w-[150px] h-auto bg-white p-3 rounded-lg shadow-[0_4px_4px_0_rgba(0,0,0,0.08)]">
            //   <div>
            //     <button
            //       onClick={handleSignOut}
            //       className="text-[#e87223] text-base cursor-pointer font-bold flex items-center justify-center w-full"
            //     >
            //       Log Out
            //     </button>
            //   </div>
            // </div>
          )}
        </div>
        {/* <button
          className="block lg:hidden z-[3] ml-[15px]"
          onClick={toggleSidebar}
        >
          {isOpen ? 'X' : '+'}
        </button> */}
    </div>
  )
}
