"use client";
import CompletedProjects from "@/app/admin/components/CompletedProjects";
import Notes from "@/app/admin/components/Notes";
import OnGoingProjects from "@/app/admin/components/OnGoingProjects";
import OverviewOfProjects from "@/app/admin/components/OverviewOfProjects";
import {
  AddIcon,
  CallIcon,
  EditImageIcon,
  EditProfile,
  MailIcon,
  MapIcon,
  ProgressIcon,
} from "@/utils/svgicons";
import Image from "next/image";
import { Line } from "rc-progress";
import React, { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
//import DatePicker from "react-date-picker";

import imgNew from "@/assets/images/img13.png";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const Page = () => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("Overview");

  const [progress, setProgress] = useState(0);
  const steps = [
    { id: 1, label: "Foundation", value: 25 },
    { id: 2, label: "Construction", value: 50 },
    { id: 3, label: "Interior Work", value: 75 },
    { id: 4, label: "Completed", value: 100 },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <div>
            <OverviewOfProjects />
          </div>
        );
      case "Status":
        return (
          <div>
            <CompletedProjects />
          </div>
        );
      case "Notes":
        return (
          <div>
            <Notes />{" "}
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
  }, [activeTab]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        // setFormData((prevData) => ({
        //   ...prevData,
        //   image: result,
        // }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const triggerFileInputClick = () => {
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div>
      <div className="grid grid-cols-[1fr] md:grid-cols-[2fr_1fr] lg:grid-cols-[1fr_309px] gap-5">
        <div className="bg-white rounded-[10px] md:rounded-[30px] box-shadow ">
          <div className="flex items-center justify-between border-b border-[#E9EDF3] py-[20px] md:py-[30px] px-[15px] md:px-10">
            <h2 className="main-heading">Project Name</h2>
            <button className="!rounded-[3px] !h-[37px] button !px-4 ">
              <AddIcon className="w-4 h-4" /> Edit Name
            </button>
          </div>
          <div className="pt-[20px] px-[15px] md:px-10 pb-[15px] md:pb-[40px] border-b border-[#E9EDF3] ">
            <div className=" flex gap-3 flex-col justify-between md:flex-row mb-[20px] md:mb-[40px]">
              <div className="">
                <label className="block text-[#8B8E98] text-[14px] ">
                  Starting Date
                </label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer
                    components={["DatePicker", "DatePicker", "DatePicker"]}
                  >
                    <DatePicker
                      //   label={'"year", "month" and "day"'}
                      views={["year", "month", "day"]}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
              <div className="">
                <label className="block text-[#8B8E98] text-[14px] ">
                  Expected End Date
                </label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer
                    components={["DatePicker", "DatePicker", "DatePicker"]}
                  >
                    <DatePicker views={["year", "month", "day"]} />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            </div>
            <div className="progress-container">
              <h2 className="section-title">Progress</h2>
              <div className="progress-steps grid grid-cols-4 mb-5 ">
                {steps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => setProgress(step.value)}
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
                    <span
                      className={`text-sm font-sfproDisplaymedium ${
                        progress >= step.value
                          ? "text-[#43527B]"
                          : "text-[#8B8E98]"
                      }`}
                    >
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
                {["Overview", "Notes"].map((tab) => (
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
        <div className="right-grid bg-white rounded-[10px] md:rounded-[30px] box-shadow">
          <div className="border-b border-[#E9EDF3] pb-5 pt-9 ">
            <div className="custom relative w-[120px] h-[120px] mx-auto mb-5">
              <div className="grid place-items-center h-full w-full">
                <div>
                  <Image
                    src={imgNew}
                    alt="upload"
                    width={120}
                    height={120}
                    className="rounded-full"
                  />
                </div>
              </div>
            </div>
            <h2 className="section-title !m-0 text-center">Morgan Melendez</h2>
          </div>
          <div className="px-[30px] py-5 ">
            <div className="flex gap-[15px] mb-4  ">
              <span>
                <CallIcon />{" "}
              </span>
              <p className="text-sm text-[#8B8E98] ">+1 (734) 412-4178</p>
            </div>
            <div className="flex gap-[15px] mb-4  ">
              <span>
                <MailIcon />{" "}
              </span>
              <p className="text-sm text-[#8B8E98] ">
                morganmelendez1122@gmail.com
              </p>
            </div>
            <div className="flex gap-[15px]  ">
              <span>
                <MapIcon />{" "}
              </span>
              <p className="text-sm text-[#8B8E98] ">
                klausdalsbrovej 309, 4 hus 109 2730 Herlev
              </p>
            </div>

            <div className="mt-7">
              <h3 className="text-[#3C3F88] text-sm flex mb-2 items-center justify-between ">
                Description <EditProfile />
              </h3>
              <p className="text-[#8B8E98] text-sm  ">
                Customers value our decade-long reliability and quality,
                demonstrated through consistent loyalty and referrals. This
                trust underscores our commitment to delivering exceptional
                software development services.
              </p>
            </div>
            <div className="mt-7">
              <h3 className="text-[#3C3F88] text-sm flex mb-2 items-center justify-between ">
                Employees Associated <EditProfile />
              </h3>
              <p className="text-[#8B8E98] text-sm  ">
                James Anderson, Emma Johnson, Michael Brown, Olivia Martinez,
                William Davis, Sophia Garcia, Ethan Wilson, Isabella Taylor,
                Alexander Thomas, Ava Harris
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
