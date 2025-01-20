"use client";
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import OnGoingProjects from "../components/OnGoingProjects";
import CompletedProjects from "../components/CompletedProjects";
import { AddIcon } from "@/utils/svgicons";
import { getAllProjects } from "@/services/admin/admin-service";
import { useTranslations } from "next-intl";
import SearchBar from '../components/SearchBar';

const Page = () => {
  const t = useTranslations('ProjectsPage');
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'ongoing';
  const [activeTab, setActiveTab] = useState(initialTab === 'ongoing' ? t('ongoingProjects') : t('completedProjects'));
  const [query, setQuery] = useState('page=1&limit=10');
  
  const {data, error, isLoading, mutate} = useSWR( `/admin/projects?state=${activeTab === t('ongoingProjects') ? "ongoing" : 'completed'}&${query}`, getAllProjects );
  const projectsData = data?.data;

  // Handle tab change
  const handleTabChange = (tab) => {
    const tabValue = tab === t('ongoingProjects') ? 'ongoing' : 'completed';
    setActiveTab(tab);
    
    // Create new URLSearchParams
    const params = new URLSearchParams(searchParams);
    
    // Update the URL without refresh
    router.push(`/admin/projects?${params.toString()}`, { scroll: false });
  };

  const openNewProject = () => {
    router.push(`/admin/new-project`);
  };

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      setActiveTab(tabFromUrl === 'ongoing' ? t('ongoingProjects') : t('completedProjects'));
    }
  }, [searchParams, t]);

  const renderTabContent = () => {
    switch (activeTab) {
      case t('ongoingProjects'):
        return <div className="ongoingggg"><OnGoingProjects setQuery={setQuery} projectsData={projectsData} error={error} isLoading={isLoading} mutate={mutate} /></div>;
      case t('completedProjects'):
        return <div className="completeeee"><CompletedProjects setQuery={setQuery} projectsData={projectsData} error={error} isLoading={isLoading} mutate={mutate}/></div>;
      default:
        return null;
    }
  };
  
  return (
    <>
      <div>
        <div className='flex justify-between mb-5 gap-3 flex-col-reverse md:flex-row md:items-center'>
          <div className="tabs flex flex-wrap gap-[5px] lg:gap-[5px]">
            {[t('ongoingProjects'), t('completedProjects')].map((tab) => (
              <button
                key={tab}
                className={`tab-button ${activeTab === tab ? 'active' : 'rounded-[28px] bg-[#96A3C6] text-white'} bg-[#1657FF] text-white rounded-[28px] mt-0 text-[14px] px-[16px] py-[10px]`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className='flex gap-2.5 justify-end'>
            <SearchBar setQuery={setQuery}/>
            <button className='!rounded-[3px] !h-[37px] button !px-4' onClick={openNewProject}>
              <AddIcon className="w-4 h-4" />{t('addNewProject')}
            </button>
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