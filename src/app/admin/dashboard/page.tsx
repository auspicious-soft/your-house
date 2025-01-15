"use client";
import DashboardCard from "@/app/admin/components/DashboardCard";
import projectImg from '@/assets/images/cardImg1.png'
import { useSession } from "next-auth/react";
import useSWR from "swr";
import ReactLoading from "react-loading";
import { AddIcon } from "@/utils/svgicons";
import RecentProjects from "../components/RecentProjects";
import ProjectsProgress from "../components/ProjectsProgress";
import { useRouter } from "next/navigation";
import { getDashboardStats } from "@/services/admin/admin-service";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { getImageClientS3URL } from "@/utils/axios";
import profile from "@/assets/images/profile.png";

const Home = () => {
  const t = useTranslations('CustomerDashboard');
  const session = useSession();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { data, error, isLoading, mutate } = useSWR(`/admin/dashboard`, getDashboardStats);
  const dashboardData = data?.data?.data;
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
  ];

  const openNewProject = () => {
    router.push(`/admin/new-project`);
  };

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
          <div onClick={() => openNewProject()}
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

      <section className="mt-10">
        <h2 className="section-title">{t('workingProgress')}</h2>
        <div className="bg-white rounded-[10px]  md:rounded-[30px]  py-[30px] px-[15px] md:p-[30px]">
          <h3 className="text-lg text-[#353E6C] font-sfproDisplaysemibold mb-[26px] ">{dashboardData?.workingProjectDetails.length} {t('ongoingProjects')}</h3>
          {dashboardData?.workingProjectDetails.map((data: any) => {
            return (
              <ProjectsProgress
                key={data?._id}
                title={data?.projectName}
                progress={data?.progress}
                imgSrc={data?.projectimageLink? getImageClientS3URL(data?.projectimageLink): profile}
              />
            )
          })}
        </div>

      </section>

      <section className="mt-10">
        <h2 className="section-title">{t('recentProjects')}</h2>
        <RecentProjects setQuery={setQuery} recentProjects={dashboardData?.recentProjectDetails} error={error} isLoading={isLoading} mutate={mutate} />
      </section>
    </>
  );
};
export default Home;
