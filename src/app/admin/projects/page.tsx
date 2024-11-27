"use client";
import { FaHandsHelping } from "react-icons/fa";
import { useState, useEffect, useTransition } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import Modal from 'react-modal';
import { toast } from "sonner";
import router from "next/router";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OnGoingProjects from "../components/OnGoingProjects";
import CompletedProjects from "../components/CompletedProjects";
import { AddIcon } from "@/utils/svgicons";
const Page = () => {
  const [openModal, setOpenModal] = useState(false);
  const session = useSession();
  const router= useRouter();
  const [activeTab, setActiveTab] = useState('On-going Projects');
  const [shouldFetchAppointments, setShouldFetchAppointments] = useState(false);
  const [query, setQuery] = useState('page=1&limit=10');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (activeTab === 'On-going Projects' || activeTab === 'Completed Projects') {
      setQuery(`appointmentType=${activeTab === 'On-going Projects' ? 'past' : 'upcoming'}&page=1&limit=10`);
      setShouldFetchAppointments(true);
    } else {
      setShouldFetchAppointments(false);
    }
  }, [activeTab]);

  const rowsPerPage = 5;
  //appointmentsData?.data?.limit ?? 0;

  const handlePageClick = (selectedItem: { selected: number }) => {
    setQuery(`page=${selectedItem.selected + 1}&limit=${rowsPerPage}`)
  }
  const renderTabContent = () => {
    switch (activeTab) {
      case 'On-going Projects':
        return <div><OnGoingProjects/> </div>;
      case 'Completed Projects':
        return <div><CompletedProjects /> </div>;
     default:
        return null;
    }
  }

  const openNewProject = () => {
    router.push(`/admin/new-project`);
  };
  
  return (
    <>
      <div>
        <div className='flex items-center justify-between mb-5 '>
          <div className="tabs flex flex-wrap gap-[5px] lg:gap-[20px]">
            {['On-going Projects', 'Completed Projects'].map((tab) => (
              <button
                key={tab}
                className={`tab-button ${activeTab === tab ? 'active' : '  rounded-[28px] bg-[#96A3C6] text-white'} bg-[#1657FF] text-white rounded-[28px]  mt-0 text-[14px] py-[5px] px-[16px] lg:px-[32px] lg:py-[8px] `}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div>
            <button className='!rounded-[3px] !h-[37px] button !px-4 ' onClick={openNewProject}><AddIcon className="w-4 h-4" /> Add New Project</button>
          </div>
        </div>
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>

    </>
  );
};

export default Page;