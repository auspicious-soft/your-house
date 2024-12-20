"use client";
import { FaHandsHelping } from "react-icons/fa";
import { useState, useEffect, useTransition } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react'; 
import Modal from 'react-modal';
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OnGoingProjects from "../components/OnGoingProjects";
import CompletedProjects from "../components/CompletedProjects";
import { AddIcon } from "@/utils/svgicons";
import { getAllProjects } from "@/services/admin/admin-service";
import { useTranslations } from "next-intl";
const Page = () => {
  const t = useTranslations('ProjectsPage'); 
  const [activeTab, setActiveTab] = useState(t('ongoingProjects'));
  const [query, setQuery] = useState('page=1&limit=10');
  const {data, error, isLoading, mutate} = useSWR(`/admin/projects?state=${activeTab === t('ongoingProjects') ? "ongoing" : 'completed'}&${query}`, getAllProjects)
  const projectsData = data?.data;
  const router = useRouter();

  const renderTabContent = () => {
    switch (activeTab) {
      case t('ongoingProjects'):
        return <div className="ongoingggg"><OnGoingProjects setQuery={setQuery}  projectsData={projectsData} error={error} isLoading={isLoading}  mutate={mutate}  /> </div>;
      case t('completedProjects'):
        return <div className="completeeee"><CompletedProjects setQuery={setQuery} projectsData={projectsData} error={error} isLoading={isLoading}  mutate={mutate}/> </div>;
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
        <div className='flex  justify-between mb-5 gap-3 flex-col-reverse md:flex-row md:items-center '>
          <div className="tabs flex flex-wrap gap-[5px] lg:gap-[5px]">
            {[t('ongoingProjects'), t('completedProjects')].map((tab) => (
              <button
                key={tab}
                className={`tab-button ${activeTab === tab ? 'active' : '  rounded-[28px] bg-[#96A3C6] text-white'} bg-[#1657FF] text-white rounded-[28px]  mt-0 text-[14px] px-[16px] py-[10px] `}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div>
            <button className='!rounded-[3px] !h-[37px] button !px-4 ' onClick={openNewProject}><AddIcon className="w-4 h-4" />{t('addNewProject')}</button>
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