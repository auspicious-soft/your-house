"use client";
import { ArrowIcon } from '@/utils/svgicons';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

interface OverviewProps {
  title: string;
  value: number | string;
  bgColor: string
  bgImage?: string;
};
const DashboardCard: React.FC<OverviewProps> = ({ title, value, bgColor }) => {
  const t = useTranslations('CustomerDashboard');
  const session = useSession()
  const isAdmin = (session as any)?.data?.user?.role === 'admin'
  const router = useRouter();
  return (
    <>
      <div style={{ backgroundColor: bgColor }} className=" card-bg min-h-[120px] rounded-[10px] md:rounded-[20px] py-[20px] px-[25px] flex flex-col  gap-3 md:gap-3">
        <p className='leading-[normal] font-sfproDisplaybold text-[18px] md:text-[20px] text-[#fff] '>{title}</p>
        <div className='flex items-center justify-between '>
          <h3 className='text-[28px] leading-[normal] md:text-[36px] text-[#fff] font-sfproDisplaymedium'>{value} </h3>
          {isAdmin && <div onClick={() => {
            title === t("ongoingProjects") ?  router.push('/admin/projects?tab=ongoing') : router.push('/admin/projects?tab=completed')
          }}>
            <ArrowIcon />
          </div>
          }
        </div>
      </div>
    </>
  );
};

export default DashboardCard;
