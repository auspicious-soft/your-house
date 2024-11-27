"use client";
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";
import imgNew from "@/assets/images/img13.png";


const Page = () => {
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
  return (
    <div>
      <h2 className="section-title">Client Details</h2>
      <div className=" bg-white rounded-[30px] w-full p-10 ">
        <div className="mb-10">
            <Image src={imgNew} alt="hjfg" height={200} width={200} className="max-w-[200px] aspect-square rounded-full  " />           
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
    </div>
  );
};

export default Page;
