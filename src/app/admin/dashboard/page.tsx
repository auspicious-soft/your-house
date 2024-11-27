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

const Home = () => {
  const session = useSession();
  const router = useRouter();
  const { data, error, isLoading } = useSWR(
    `/admin/dashboard?id=${session?.data?.user?.id}`
  );
  const finalData: any = data?.data;
  const OverviewData = [
    {
      id: "1",
      title: "Ongoing Projects",
      value: 18,
      bgColor: "#F44771",
    },
    {
      id: "2",
      title: "Completed Projects",
      value: 18,
      bgColor: "#FF9A3E",
    },
  ];
  const Projects =[
    {
      id: '1',
      title: "Project 1",
      progress: 50,
      imgSrc: projectImg,
    },
    {
      id: '2',
      title: "Project 2",
      progress: 76,
      imgSrc: projectImg,
    },
  ]

  const openNewProject = () => {
    router.push(`/admin/new-project`);
  };

  return (
    <>
      <h2 className="section-title">Monthly Overview</h2>
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
          <div onClick={()=>openNewProject()}
            className="bg-[#1657FF] min-h-[120px] rounded-[20px] py-[20px] px-[25px] flex justify-between gap-3 md:gap-3 "
          >
            <div className="">
              <p className="leading-normal font-sfproDisplaybold text-[20px] text-[#fff] ">
                Create a New Project
              </p>
              <p className="text-[#fff] text-[14px] max-w-[180px]">
                Click to add a new project to the list.
              </p>
            </div>
            <AddIcon />
          </div>
        </div>
      </div>

      <section className="mt-10">
      <h2 className="section-title">Working Progress</h2>
      <div className="bg-white rounded-[30px] p-[30px] ">
        <h3 className="text-lg text-[#353E6C] font-sfproDisplaysemibold mb-[26px] ">{Projects.length} Ongoing Projects</h3>
          {Projects.map((data)=>(
            <ProjectsProgress
            key={data.id}
            title={data.title}
            progress={data.progress}
            imgSrc={data.imgSrc}
            />
          ))}

      </div>

      </section>

      <section className="mt-10">
        <h2 className="section-title">Recent Projects</h2>
        <RecentProjects />
      </section>
    </>
  );
};
export default Home;
