"use client";
import React from 'react';

interface OverviewProps {
  title: string;
  value: number | string;
  bgColor: string
  bgImage?: string;
};
const DashboardCard: React.FC<OverviewProps> = ({ title, value, bgColor }) => {
    return (
      <>
        <div style={{ backgroundColor: bgColor }} className=" card-bg min-h-[120px] rounded-[20px] py-[20px] px-[25px] flex flex-col  gap-3 md:gap-3">
          <p className='leading-[normal] font-sfproDisplaybold text-[20px] text-[#fff] '>{title}</p>
          <h3 className='text-[28px] leading-[normal] md:text-[36px] text-[#fff] font-sfproDisplaymedium'>{value} </h3>
       </div>
      </>
    );
  };
  
  export default DashboardCard;
  