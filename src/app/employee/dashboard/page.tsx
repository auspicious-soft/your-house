"use client";
import DashboardCard from "@/app/admin/components/DashboardCard";
import projectImg from '@/assets/images/cardImg1.png'
import { useSession } from "next-auth/react";
import useSWR from "swr";
import ReactLoading from "react-loading";
import { AddIcon } from "@/utils/svgicons";
import { useRouter } from "next/navigation";
import { getDashboardStats } from "@/services/admin/admin-service";
import { useState } from "react";
import { useTranslations } from "next-intl";
import ClientOnGoingProjects from "@/app/customer/components/ClientOnGoingProjects";
import ClientCompletedProjects from "@/app/customer/components/ClientCompletedProjects";
import { getClientsAllProjects } from "@/services/client/client-service";

const Home = () => {
  const t = useTranslations('CustomerDashboard');
  const session = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(t('ongoingProjects'));
  const id = session?.data?.user?.id
  const [query, setQuery] = useState('');
  const { data, error, isLoading, mutate } = useSWR(id ? `/employee/${id}/dashboard?state=${activeTab === t('ongoingProjects') ? "ongoing" : 'completed'}&${query}` : null, getDashboardStats)
  const dashboardData = data?.data?.data

  const OverviewData = [
    {
      id: "1",
      title: t("ongoingProjects"),
      value: dashboardData?.ongoingProjectCount,
      bgColor: "#F44771",
    },
    {
      id: "2",
      title: t("completedProjects"),
      value: dashboardData?.completedProjectCount,
      bgColor: "#FF9A3E",
    },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case t('ongoingProjects'):
        return <div><ClientOnGoingProjects isEmployee setQuery={setQuery} projectsData={dashboardData} error={error} isLoading={isLoading} mutate={mutate} /> </div>;
      case t('completedProjects'):
        return <div><ClientCompletedProjects isEmployee setQuery={setQuery} projectsData={dashboardData} error={error} isLoading={isLoading} mutate={mutate} /> </div>;
      default: dashboardData
        return null;
    }
  }

  return (
    <>
      <h2 className="section-title">{t('monthlyOverview')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[15px] md:gap-[22px]">
        <div className="md:col-span-2 grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-[15px] md:gap-[22px]">
          {OverviewData.map((card) => (
            <DashboardCard
              key={card.id}
              title={card.title}
              value={
                card.value ?? (
                  <ReactLoading
                    type={"spin"}
                    color={"#26395e"}
                    height={"20px"}
                    width={"20px"}
                  />
                )
              }
              bgColor={card.bgColor}
            />
          ))}
        </div>
        <div className="md:col-span-1">
          <div onClick={() =>  router.push(`/employee/new-project`)}
            className="bg-[#1657FF] min-h-[120px] cursor-pointer md:min-h-[100%] rounded-[10px] md:rounded-[20px] py-[20px] px-[25px] flex justify-between gap-3 md:gap-3 "
          >
            <div className="flex flex-col  gap-3 md:gap-3">
              <p className="leading-normal font-sfproDisplaybold text-[18px] md:text-[20px] text-[#fff] ">
                {t('createNewProject')}
              </p>
              <p className="text-[#fff] text-[14px] max-w-[180px]">
                {t('clickToAddProject')}
              </p>
            </div>
            <AddIcon />
          </div>
        </div>
      </div>
      <div className="mt-10">
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
        </div>
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>


    </>
  );
};
export default Home;
