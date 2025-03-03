"use client";
import { FaHourglassEnd } from "react-icons/fa6";
import Notes from "@/app/admin/components/Notes";
import OverviewOfProjects from "@/app/admin/components/OverviewOfProjects";
import { AddIcon, CallIcon, CrossIcon, MailIcon, MapIcon, ProgressIcon, } from "@/utils/svgicons";
import Image from "next/image";
import { Line } from "rc-progress";
import React, { startTransition, useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FaCheckCircle } from 'react-icons/fa';
import imgNew from "@/assets/images/profile.png";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { deleteAStatus, getSingleProject } from "@/services/admin/admin-service";
import UpdateSingleProjectModal from "@/app/admin/components/UpdateSingleProjectModal";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { getImageClientS3URL } from "@/utils/axios";
import ProjectImages from "@/app/admin/components/ProjectImages";
import UseEmployees from "@/utils/useEmployees";
import DynamicTabs from "@/components/dynamic-tabs";
import TimeframeEditor from "@/components/timeframe";
import ReactLoader from "@/components/react-loading";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const Page = () => {
  const t = useTranslations('ProjectsPage');
  const h = useTranslations('ToastMessages');
  const { id } = useParams();
  const { data, error, mutate, isLoading } = useSWR(`/admin/project/${id}`, getSingleProject);
  const project = data?.data?.data;
  const { employeeData } = UseEmployees();
  const userData = data?.data?.data?.userId;
  const profilePhoto = userData?.profilePic == null || userData?.profilePic == "" ? imgNew : getImageClientS3URL(userData?.profilePic);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
  }
  const session = useSession()
  const fullName = (session as any).data?.user?.fullName
  const renderTabContent = () => {
    switch (activeTab) {
      case ("Drawings"):
        return (
          <div><OverviewOfProjects id={id} userEmail={userData?.email} type={activeTab} fullName={fullName} /></div>
        );
      case ("Progress"):
        return (
          <div><ProjectImages id={id} userEmail={userData?.email} fullName={fullName} /></div>
        );
      case ("Notes"):
        return (
          <div><Notes id={id} fullName={fullName} /></div>
        );
      default:
        return (
          <div><OverviewOfProjects id={id} userEmail={userData?.email} type={activeTab} fullName={fullName} /></div>
        );
    }
  };

  const getEmployeeNames = () => {
    if (!project?.employeeId || !employeeData) return [];

    return project.employeeId.map((i: any) => {
      const employee = employeeData.find((emp: any) => emp.value === i._id);
      return employee?.label || '';
    })
      .filter((name: any) => name !== '');
  }
  
  if (isLoading) return <ReactLoader />
  return (
    <div>
      <div className="grid grid-cols-[1fr] md:grid-cols-[2fr_1fr] lg:grid-cols-[1fr_309px] gap-5">
        <div className="bg-white rounded-[10px] md:rounded-[30px] box-shadow ">
          <div className="flex items-center justify-between border-b border-[#E9EDF3] py-[20px] md:py-[30px] px-[15px] md:px-10">
            <h2 className="main-heading capitalize">{project?.projectName}</h2>
            <button onClick={() => setIsModalOpen(true)} className="!rounded-[3px] !h-[37px] button !px-4 ">
              <AddIcon className="w-4 h-4" /> Redigere
            </button>
          </div>
          <div className="pt-[20px] px-[15px] md:px-10 pb-[15px] md:pb-[40px] border-b border-[#E9EDF3] ">
            <div className=" flex gap-3 flex-col justify-between md:flex-row mb-[20px]">
              <div className="">
                <label className="block text-[#8B8E98] text-[14px] ">
                  {t('startDate')}
                </label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      disabled
                      defaultValue={project?.projectstartDate ? dayjs(project.projectstartDate) : null}
                      value={project?.projectstartDate ? dayjs(project.projectstartDate) : null}
                      views={["year", "month", "day"]}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
              <div className="">
                <label className="block text-[#8B8E98] text-[14px] ">
                  {t('expectedEndDate')}
                </label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer
                    components={["DatePicker"]}
                  >
                    <DatePicker
                      disabled
                      defaultValue={project?.projectendDate ? dayjs(project.projectendDate) : null}
                      value={project?.projectendDate ? dayjs(project.projectendDate) : null}
                      views={["year", "month", "day"]}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            </div>
            <div className="mb-[20px] md:mb-[40px flex flex-col gap-2">
              <label className="block text-[#3C3F88]  ">
                {t('Home Address')}
              </label>
              <p className="text-base  text-[#8B8E98] border border-[#E9EDF3] py-[9px] px-3 rounded-[6px] mt-[6px] ">
                {project?.homeAddress}</p>

              <label className="block text-[#3C3F88] mt-5">
                {t('Construction Address')}
              </label>
              <p className="text-base text-[#8B8E98]  border border-[#E9EDF3] py-[9px] px-3 rounded-[6px] mt-[6px] ">
                {project?.constructionAddress}</p>

              <label className="block text-[#3C3F88]  ">
                {t('description')}
              </label>
              <p className="text-base  text-[#8B8E98] border border-[#E9EDF3] py-[9px] px-3 rounded-[6px] mt-[6px] ">
                {project?.description}</p>
            </div>
            <div className="progress-container pb-4">
              <h2 className="section-title"> {t('progress')}</h2>
              <div className="flex gap-x-3 flex-wrap">

                {project?.status.map((status: any, index: any) => {
                  return (
                    <div key={index} className={`relative flex items-center py-2.5 px-5 mb-10 rounded-[50px]  ${index === project.status.length - 1 ? 'text-black bg-[#FFF477]' : 'text-white bg-green-600'}`}
                    >
                      {index !== project.status.length - 1 && <FaCheckCircle className="mr-2" />}
                      {index === project.status.length - 1 && <FaHourglassEnd className="mr-2" />}
                      {status}
                      <div className="absolute -top-2 -right-2 border rounded-full cursor-pointer" onClick={() => {
                        startTransition(async () => {
                          try {
                            const response = await deleteAStatus(`/user/project/${id}?status=${status}`);
                            if (response.status !== 200) {
                              toast.error(h('Status slettet med succes'));
                            }
                            mutate();
                          } catch (error) {
                            toast.error(h('Status slettet med succes'));
                          }
                        })
                      }
                      }>
                        <CrossIcon />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="text-right">
                {/* <p className="text-[#8B8E98] mb-1 text-sm ">{project?.progress}%</p> */}
              </div>              <div className="text-right">
                <p className="text-[#8B8E98] mb-1 text-sm ">{project?.progress}%</p>
                <Line
                  percent={project?.progress}
                  strokeWidth={1.2}
                  strokeColor="#FF16A2"
                  className="rounded-xl"
                  trailWidth={2}
                  trailColor="#e4e4e4"
                />
              </div>
            </div>
          </div>
          <div className="py-[30px] px-[15px] md:px-10 w-full">
            <div className="">
              <DynamicTabs onTabChange={handleTabChange} />
              {activeTab && <div className="p-5 bg-[#F6F6F6] rounded-[20px] mt-5">
                {renderTabContent()}
              </div>}
            </div>
          </div>
        </div>
        <div className="right-grid bg-white rounded-[10px] md:rounded-[30px] box-shadow">
          <div className="border-b border-[#E9EDF3] pb-5 pt-9 ">
            <div className="custom relative w-[120px] h-[120px] mx-auto mb-5">
              <div className="grid place-items-center h-full">
                <div>
                  <Image
                    src={profilePhoto}
                    alt="upload"
                    width={120}
                    height={120}
                    className="rounded-full"
                  />
                </div>
              </div>
            </div>
            <h2 className="section-title !m-0 text-center">{userData?.fullName}</h2>
          </div>
          <div className="px-[30px] py-5 ">
            <div className="flex gap-[15px] mb-4  ">
              <span><CallIcon /></span>
              <p className="text-sm text-[#8B8E98] ">{userData?.phoneNumber}</p>
            </div>
            <div className="flex gap-[15px] mb-4  ">
              <span><MailIcon /></span>
              <p className="text-sm text-[#8B8E98] ">
                {userData?.email}
              </p>
            </div>
            <div className="flex gap-[15px]  ">
              <span><MapIcon /></span>
              <p className="text-sm text-[#8B8E98] ">
                {userData?.address}
              </p>
            </div>
            <div className="mt-7">
              <h3 className="text-[#3C3F88] text-sm flex mb-2 items-center justify-between ">
                {t('description')}
                {/* <EditProfile /> */}
              </h3>
              <p className="text-[#8B8E98] text-sm  ">{project?.description}
              </p>
            </div>
            <div className="mt-7">
              <h3 className="text-[#3C3F88] text-sm flex mb-2 items-center justify-between ">
                {t('employeesAssociated')}
                {/* <EditProfile /> */}
              </h3>
              <p className="text-[#8B8E98] text-sm capitalize">
                {getEmployeeNames().join(', ')}
              </p>

            </div>
          </div>
        </div>
      </div>
      <div className="p-6 w-full bg-white rounded-3xl mt-5 font-semibold text-[#3c3f88]">
        <p className="pb-4 text-lg">Projekter Timeframe</p>
        <TimeframeEditor project={project} mutate={mutate} />
      </div>
      <UpdateSingleProjectModal
        id={id}
        data={project}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mutate={mutate}
      />
    </div>
  );
};

export default Page;
