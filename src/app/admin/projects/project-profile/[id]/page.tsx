"use client";
import { FaHourglassEnd } from "react-icons/fa6";
import Notes from "@/app/admin/components/Notes";
import OverviewOfProjects from "@/app/admin/components/OverviewOfProjects";
import { AddIcon, CallIcon, CrossIcon, MailIcon, MapIcon, ProgressIcon, } from "@/utils/svgicons";
import Image from "next/image";
import { Line } from "rc-progress";
import React, { startTransition, useState } from "react";
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
import useClients from "@/utils/useClients";

const Page = () => {
  const t = useTranslations('ProjectsPage');
  const h = useTranslations('ToastMessages');
  const { id } = useParams();
  const { data, error, mutate, isLoading } = useSWR(`/admin/project/${id}`, getSingleProject);
  const project = data?.data?.data;
  const { employeeData } = UseEmployees();
  const userData = data?.data?.data?.userId;

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
  const { userData: allClients } = useClients();
  const selectedUsers = allClients.filter((client: any) => project?.userId?.map((user: any) => user._id).includes(client.value));

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
        <div className="right-grid bg-white rounded-[10px] md:rounded-[30px] box-shadow w-full">
          <div className="border-b border-[#E9EDF3] p-3 w-full">
            <div className="w-[248px] text-[#3b3e88] text-xl font-bold font-['SF Pro Display'] p-2 !w-full text-center ">Customers Associated </div>
            <div className="w-full flex flex-col gap-3">
              {
                selectedUsers.length > 0 && selectedUsers?.map((user: any, index: any) => {
                  return (
                    <div key={index} className="px-[15px] py-2.5 bg-[#f7f8fb] rounded-[10px] flex-col justify-center items-start gap-1.5 inline-flex w-full">
                      <div className="justify-start items-center gap-1.5 inline-flex">
                        <Image className="w-7 h-7 rounded-full" src={user?.profilePic == null || user?.profilePic == "" ? imgNew : getImageClientS3URL(user?.profilePic)} alt="img" />
                        <div className="text-[#8b8e98] text-base font-medium font-['SF Pro Display']">{user?.label}</div>
                      </div>
                      <div className="justify-start items-center gap-2.5 inline-flex">
                        <div data-svg-wrapper>
                          <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.3216 8.18779V13.6106C16.3216 14.4235 15.6602 15.0849 14.8473 15.0849H4.38917C3.57629 15.0849 2.91492 14.4235 2.91492 13.6106V6.26767C2.91492 5.45476 3.57629 4.79341 4.38917 4.79341H9.76015C9.89847 4.79341 10.0106 4.90553 10.0106 5.04385C10.0106 5.18217 9.89847 5.29429 9.76015 5.29429H4.38917C3.85244 5.29429 3.41579 5.73093 3.41579 6.26767V7.01021L9.14441 9.79221C9.44557 9.93844 9.79101 9.93844 10.0921 9.79221L12.402 8.67046C12.5265 8.61002 12.6762 8.66194 12.7367 8.78633C12.7971 8.91074 12.7452 9.06058 12.6208 9.12099L10.3109 10.2427C9.87076 10.4565 9.3658 10.4565 8.92561 10.2427L3.41579 7.56701V13.6106C3.41579 14.1473 3.85244 14.584 4.38917 14.584H14.8473C15.384 14.584 15.8207 14.1473 15.8207 13.6106V8.18779C15.8207 8.04946 15.9328 7.93735 16.0711 7.93735C16.2094 7.93735 16.3216 8.04949 16.3216 8.18779ZM6.8266 10.819L4.38592 13.2597C4.28811 13.3575 4.28811 13.516 4.38592 13.6139C4.48375 13.7117 4.64228 13.7117 4.74012 13.6139L7.1808 11.1732C7.27861 11.0754 7.27861 10.9168 7.1808 10.819C7.08297 10.7212 6.92444 10.7212 6.8266 10.819ZM12.0557 10.819C11.9579 10.9168 11.9579 11.0754 12.0557 11.1732L14.4964 13.6139C14.5453 13.6627 14.6094 13.6872 14.6735 13.6872C14.8946 13.6872 15.0088 13.4179 14.8506 13.2597L12.4099 10.819C12.3121 10.7212 12.1535 10.7212 12.0557 10.819ZM16.3243 5.61417V6.1707C16.3243 6.55428 16.0123 6.86635 15.6287 6.86635H15.4615C15.347 7.37532 14.8917 7.75679 14.3487 7.75679H13.5139C13.3756 7.75679 13.2635 7.64468 13.2635 7.50635C13.2635 7.36803 13.3756 7.25592 13.5139 7.25592H14.3487C14.7016 7.25592 14.9887 6.96881 14.9887 6.61592V4.94635C14.9887 4.10246 14.3021 3.41591 13.4582 3.41591C12.6144 3.41591 11.9278 4.10246 11.9278 4.94635V6.61592C11.9278 6.75424 11.8157 6.86635 11.6774 6.86635H11.2878C10.9042 6.86635 10.5921 6.55428 10.5921 6.1707V5.61417C10.5921 5.23059 10.9042 4.91852 11.2878 4.91852H11.4271C11.4421 3.81124 12.3475 2.91504 13.4582 2.91504C14.569 2.91504 15.4744 3.81124 15.4894 4.91852H15.6287C16.0123 4.91852 16.3243 5.23059 16.3243 5.61417ZM11.4269 5.41939H11.2878C11.1804 5.41939 11.093 5.50677 11.093 5.61417V6.1707C11.093 6.27811 11.1804 6.36548 11.2878 6.36548H11.4269V5.41939ZM15.8235 5.61417C15.8235 5.50677 15.7361 5.41939 15.6287 5.41939H15.4895V6.36548H15.6287C15.7361 6.36548 15.8235 6.27811 15.8235 6.1707V5.61417Z" fill="#8B8E98" stroke="#8B8E98" stroke-width="0.116604" stroke-linejoin="round" />
                          </svg>
                        </div>
                        <div className="text-[#8b8e98] text-sm font-normal font-['SF Pro Display']">{user?.email}</div>
                      </div>
                      <div className="flex gap-3">
                        <div data-svg-wrapper>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 1.25C6.27208 1.25 3.25 4.27208 3.25 8C3.25 12.875 10 18.75 10 18.75C10 18.75 16.75 12.875 16.75 8C16.75 4.27208 13.7279 1.25 10 1.25ZM10 10.625C8.55025 10.625 7.375 9.44975 7.375 8C7.375 6.55025 8.55025 5.375 10 5.375C11.4497 5.375 12.625 6.55025 12.625 8C12.625 9.44975 11.4497 10.625 10 10.625Z" fill="#8B8E98" stroke="#8B8E98" stroke-width="0.116604" stroke-linejoin="round" />
                          </svg>
                        </div>
                        <p className="text-sm text-[#8B8E98] ">
                          {user?.address}
                        </p>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className="px-[30px] pb-5 ">
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
