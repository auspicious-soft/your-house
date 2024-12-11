"use client";
import { useState, useEffect, useTransition } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import Modal from 'react-modal';
import { toast } from "sonner";
import router from "next/router";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ClientCompletedProjects from "../components/ClientCompletedProjects";
import { AddIcon } from "@/utils/svgicons";
import ClientOnGoingProjects from "../components/ClientOnGoingProjects";
import { getClientsAllProjects } from '@/services/client/client-service';
const Page = () => {

  const session = useSession();
  const id = session?.data?.user?.id
  const [activeTab, setActiveTab] = useState('On-going Projects');
  const [query, setQuery] = useState('');
  const {data, error, isLoading, mutate} = useSWR(`/user/${id}/projects?state=${activeTab === 'On-going Projects' ? "ongoing" : 'completed'}&${query}`, getClientsAllProjects)
  const projectsData = data?.data;
 
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'On-going Projects':
        return <div><ClientOnGoingProjects setQuery={setQuery}  projectsData={projectsData} error={error} isLoading={isLoading}  mutate={mutate}/> </div>;
      case 'Completed Projects':
        return <div><ClientCompletedProjects setQuery={setQuery}  projectsData={projectsData} error={error} isLoading={isLoading}  mutate={mutate}/> </div>;
     default:
        return null;
    }
  }
  
  return (
    <>
      <div>
        <div className='flex  justify-between mb-5 gap-3 flex-col-reverse md:flex-row md:items-center '>
          <div className="tabs flex flex-wrap gap-[5px] lg:gap-[5px]">
            {['On-going Projects', 'Completed Projects'].map((tab) => (
              <button
                key={tab}
                className={`tab-button ${activeTab === tab ? 'active' : '  rounded-[28px] bg-[#96A3C6] text-white'} bg-[#1657FF] text-white rounded-[28px]  mt-0 text-[14px] px-[16px] py-[10px] `}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
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