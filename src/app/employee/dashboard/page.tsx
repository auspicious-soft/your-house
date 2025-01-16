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

const Home = () => {
  const t = useTranslations('CustomerDashboard');
  const session = useSession();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { data, error, isLoading, mutate } = useSWR(`/employee/${session?.data?.user?.id}/dashboard`, getDashboardStats);
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
      </div>


    </>
  );
};
export default Home;
