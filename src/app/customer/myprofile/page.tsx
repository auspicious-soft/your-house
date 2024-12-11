"use client";
import Image from "next/image";
import React, { ChangeEvent, FormEvent, useEffect, useState, useTransition } from "react";
import imgNew from "@/assets/images/img13.png";
import Modal from "react-modal";
import { EditButtonIcon } from "@/utils/svgicons";
import EditClientDetailsModal from "@/app/admin/components/EditClientDetailsModal";
import AssociatedProjects from "@/app/admin/components/AssociatedProjects";
import ClientProfileProjects from "../components/ClientProfileProjects";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { getUserInfo, updateUserInfo } from "@/services/client/client-service";
import { toast } from "sonner";

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const session = useSession();
  const [isPending, startTransition] = useTransition();
  const {data, error, mutate, isLoading} = useSWR(`/user/${session?.data?.user?.id}`, getUserInfo)
  const customerData = data?.data?.data?.user;
  const [formData, setFormData] = useState<any>({
    fullName: "",
   phoneNumber: "",
   email: "",
   address: "",
   profilePic: "",
 });

 useEffect(() => {
  if (customerData) {
    setFormData({
      fullName: customerData.fullName || "",
      phoneNumber: customerData.phoneNumber || "",
      email: customerData.email || "",
      address: customerData.address || "",
      profilePic: customerData.profilePic || "",
    });
  }
}, [customerData]);


const handleInputChange = (
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value } = e.target as HTMLInputElement & { files: FileList };
  setFormData({
    ...formData,
    [name]: name === "phoneNumber" ? value : value, 
  });
};

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  startTransition(async () => {
    try {
      const response = await updateUserInfo( `/user/${session?.data?.user?.id}`,formData); 
      if (response?.status === 200) {
      setIsModalOpen(false);
      mutate()
        //setNotification("User Added Successfully");
         toast.success("User details updated successfully");
        
      } else {
        toast.error("Failed to add User Data");
      }
    } catch (error) {
      console.error("Error adding User Data:", error);
      toast.error("An error occurred while adding the User Data");
    }
  });
  
};

  return (
    <div>
      <div className=" bg-white rounded-[10px] md:rounded-[30px] w-full py-[30px] px-[15px] md:p-10 ">
        <div className="mb-10 flex gap-[20px] justify-between ">
          {/* src={formData.profilePic || imgNew}  */}
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
              readOnly
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
              readOnly
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
              readOnly
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
              readOnly
            />
          </div>
        </div>
      </div>

      <EditClientDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        id={session?.data?.user?.id}
        mutate={mutate}
      />

      {/* <section className="mt-10">
        <h2 className="section-title">My Projects</h2>
        <ClientProfileProjects />
      </section> */}
    </div>
  );
};

export default Page;

