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
    // Handle save logic
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
              placeholder="e"
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

      {/* <Modal 
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)} 
      contentLabel="Add New Entry"
      className="modal max-w-[810px] mx-auto rounded-[20px] w-full  max-h-[90vh] overflow-auto overflo-custom "
      overlayClassName="w-full h-full p-3 fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
      ariaHideApp={false} >
        <div className="bg-white rounded-lg p-8 relative">
        <button
          onClick={()=> setIsModalOpen(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✖️
        </button>
        <h3 className="text-xl mb-4 font-semibold">Edit Client Details</h3>
        <div className="space-y-4">
          <label className="block">
            Full Name
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </label>
          <label className="block">
            Phone Number
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </label>
          <label className="block">
            Email Address
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </label>
          <label className="block">
            Home Address
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </label>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          {/* <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button> */}
          {/* <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
      </Modal> */} 
      <section className="mt-10">
        <h2 className="section-title">Associated Projects</h2>
        <AssociatedProjects />
      </section>
    </div>
  );
};

export default Page;
