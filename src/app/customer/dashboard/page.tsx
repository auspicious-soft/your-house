"use client";
import DashboardCard from "@/app/admin/components/DashboardCard";
import useSWR from "swr";
import ReactLoading from "react-loading";
import { ProgressIcon } from "@/utils/svgicons";
import { Line } from "rc-progress";
import { getDashboardData } from "@/services/client/client-service";
import { useTranslations } from "next-intl";
import TableRowImage from "@/components/table-row-img";
import { getImageClientS3URL } from "@/utils/axios";
import profile from "@/assets/images/profile.png";
const Home = () => {
 const t = useTranslations('CustomerDashboard'); 
  const { data, error, isLoading } = useSWR(`/user/dashboard`, getDashboardData);
  const finalData: any = data?.data?.data;
 const onGoingProjects = finalData?.workingProjectDetails;
  const OverviewData = [
    {
      id: "1",
      title: t("ongoingProjects"),
      value: finalData?.ongoingProjectCount,
      bgColor: "#F44771",
    },
    {
      id: "2",
      title: t("completedProjects"),
      value: finalData?.completedProjectCount,
      bgColor: "#FF9A3E",
    },
  ];


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
        <div className="md:col-span-1"></div>
      </div>

      <section className="mt-10">
        <h2 className="section-title">{t('workingProgress')} </h2>
        <div className="bg-white rounded-[10px]  md:rounded-[30px] ">
          <div className="progress-container pb-4">
            <h2 className="section-title pt-[30px] px-[30px] ">
              {onGoingProjects?.length} {t('ongoingProjects')}
            </h2>

            {onGoingProjects?.map((row: any) => (
              <div
                key={row?._id}
                className="project-card py-5 px-[30px] even:bg-[#F3F6FF] "
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                   <TableRowImage image={row?.projectimageLink? getImageClientS3URL(row?.projectimageLink): profile} />
                    <span className="text-[#353E6C] ">{row?.projectName}</span>
                  </div>
                  <div className="bg-[#FF16A2] text-white px-4 py-[7px] rounded-[5px] text-base">
                    {row?.progress}%
                  </div>
                </div>
                <p className="text-[#3C3F88] bg-[#FFF477] py-2.5 px-5 mb-10 inline-block rounded-[50px] font-sfproDisplaymedium ">
                  {row?.status} </p>          
                <Line
                  percent={row?.progress}
                  strokeWidth={0.8}
                  strokeColor="#FF16A2"
                  className="rounded-xl mt-3"
                  trailWidth={1}
                  trailColor="#E4E4E4"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
export default Home;
