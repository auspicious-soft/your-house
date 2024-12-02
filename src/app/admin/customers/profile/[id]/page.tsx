"use client";
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";
import imgNew from "@/assets/images/img13.png";
import Modal from 'react-modal'
import { EditButtonIcon } from "@/utils/svgicons";
import EditClientDetailsModal from "@/app/admin/components/EditClientDetailsModal";
import AssociatedProjects from "@/app/admin/components/AssociatedProjects";


const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<any>({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement & { files: FileList };
    setFormData({
      ...formData,
      [name]: name === "phoneNumber" ? Number(value) : value, // Convert phoneNumber to number
    });
  };
  const handleSave = () => {
    setIsModalOpen(false);
  };
 
  return ( 
    <div>
      <h2 className="section-title text-[#3C3F88]">Client Details</h2>
      <div className=" bg-white rounded-[10px] md:rounded-[30px] w-full py-[30px] px-[15px] md:p-10 ">
        <div className="mb-10 flex gap-[20px] justify-between ">
            <Image src={imgNew} alt="hjfg" height={200} width={200} className="max-w-[100px] md:max-w-[200px] aspect-square rounded-full  " />           
        <div> 
          <button  onClick={() => setIsModalOpen(true)} className="w-full !rounded-[3px] button !h-[40px] "> 
          <EditButtonIcon/> Edit Details
        </button></div>
        </div>
        <div className="fomm-wrapper grid md:flex flex-wrap gap-5 ">
          <div className="w-full">
            <label className="block">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              placeholder="Full Name"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="md:w-[calc(33.33%-14px)]">
            <label className="block">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Phone Number"
              required
            />
          </div>
          <div className="md:w-[calc(33.33%-14px)]">
            <label className="block">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="fullname@mail.com"
              required
            />
          </div>
          <div className="md:w-[calc(33.33%-14px)]">
            <label className="block">Home Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="emailaddress@mail.com"
              required
            />
          </div>
        </div>
      </div>

      <EditClientDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
      />

      <section className="mt-10">
        <h2 className="section-title">Associated Projects</h2>
        <AssociatedProjects />
      </section>
    </div>
  );
};

export default Page;
