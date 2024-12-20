"use client";
import {
  ProgressIcon,
} from "@/utils/svgicons";
import { Line } from "rc-progress";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ClientAttachments from "@/app/customer/components/ClientAttachments";
import ClientNotes from "@/app/customer/components/ClientNotes";
import { useTranslations } from "next-intl";
import useSWR from "swr";
import { getClientSingleProject } from "@/services/client/client-service";

interface FileItem {
  name: string;
  uploadedBy: string;
  time: string;
}
const Page = () => {
  const t = useTranslations('ProjectsPage'); 
  const {id} = useParams();
  const [activeTab, setActiveTab] = useState(t("overview"));
  const {data, error, mutate, isLoading} = useSWR(`/user/project/${id}`, getClientSingleProject);
  const project = data?.data?.data;

  const [progress, setProgress] = useState(0);


  const steps = [
    { id: 1, label: t("foundation"), value: 25 },
    { id: 2, label: t("construction"), value: 50 },
    { id: 3, label: t("interiorWork"), value: 75 },
    { id: 4, label: t("completed"), value: 100 },
  ];
  useEffect(() => {
    const statusToProgress = { 
      '1': 25,
      '2': 50,
      '3': 75,
      '4': 100
    };
    const numericStatus = String(project?.status);
    const calculatedProgress = (statusToProgress as any)[numericStatus] || 0;
    setProgress(calculatedProgress);
  }, [project?.status]);


  const renderTabContent = () => {
    switch (activeTab) {
      case t("overview"): 
        return (
          <div>
           <ClientAttachments id={id} />
        </div>
        );
      case "Status":
        return (
          <div>
            {/* <CompletedProjects /> */}
          </div>
        );
      case t("notes"):
        return (
          <div>
           <ClientNotes id={id} />
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    // Any additional logic based on activeTab can go here if needed
  }, [activeTab]);


  return ( 
    <div>
      <div className="grid grid-cols-[1fr] gap-5">
        <div className="bg-white rounded-[10px] md:rounded-[30px] box-shadow ">
          <div className="flex items-center justify-between border-b border-[#E9EDF3] py-[20px] md:py-[30px] px-[15px] md:px-10"> 
            <h2 className="main-heading">{project?.projectName}</h2> 
          </div>
          <div className="pt-[20px] px-[15px] md:px-10 pb-[15px] md:pb-[40px] border-b border-[#E9EDF3] ">
            <div className=" flex gap-3 flex-col justify-between md:flex-row mb-[20px] md:mb-[40px]">
              <div className="">
                <label className="block text-[#8B8E98] text-[14px] ">
                {t('startDate')}
                </label>
               <p className="text-base text-[#3C3F88] border border-[#E9EDF3] py-[9px] px-3 rounded-[6px] mt-[6px] ">{project?.projectstartDate}</p>
              </div>
              <div className="">
                <label className="block text-[#8B8E98] text-[14px] ">
                {t('expectedEndDate')}
                </label>
                <p className="text-base text-[#3C3F88] border border-[#E9EDF3] py-[9px] px-3 rounded-[6px] mt-[6px] ">{project?.projectendDate}</p>
              </div>
            </div>
            <div className="progress-container">
              <h2 className="section-title">{t('progress')}</h2>
              <div className="progress-steps grid grid-cols-4 mb-5 ">
                {steps.map((step) => (
                  <button
                    key={step.id}
                    // onClick={() => setProgress(step.value)}
                    className={`progress-step ${
                      progress >= step.value ? "active" : ""
                    }`}
                  >
                    <div className="checked flex justify-center mb-2.5  ">
                      {progress >= step.value ? (
                        <ProgressIcon className="fill-[#FF16A2] " />
                      ) : (
                        <ProgressIcon />
                      )}
                    </div>
                    <span className="text-[#43527B] text-[12px] md:text-sm font-sfproDisplaymedium  ">
                      {step.label}
                    </span>
                  </button>
                ))}
              </div>
              <Line
                percent={progress}
                strokeWidth={1.2}
                strokeColor="#FF16A2"
                className="rounded-xl"
                trailWidth={2}
                trailColor="#e4e4e4"
              /> 
            </div>
          </div>
          <div className="py-[30px] px-[15px] md:px-10">
            <div className="">
              <div className="flex gap-2.5">
                {[t("overview"), t("notes")].map((tab) => (
                  <button
                    key={tab}
                    className={`text-base rounded-[5px] py-2 px-4 font-sfproDisplaymedium transition-all duration-300 ${
                      activeTab === tab
                        ? "text-white bg-[#3C3F88] "
                        : "text-[#8B8E98] bg-[#F4F5F7] "
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {" "}
                    {tab}
                  </button>
                ))}
              </div>
              <div className="p-5 bg-[#F6F6F6] rounded-[20px] mt-5 ">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
