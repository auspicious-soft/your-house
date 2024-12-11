"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState, useTransition } from "react";
import Image from "next/image";
import success from "@/assets/images/succes.png";
import Notification from "../components/Notification";
import { toast } from "sonner";
import { AddIcon } from "@/utils/svgicons";
import CustomSelect from "@/app/(website)/components/CustomSelect";
import { addNewProject, updateSingleProjectData } from "@/services/admin/admin-service";
import useClients from "@/utils/useClients";
import Modal from "react-modal";


export const option = [
    { label: "Associate 1", value: "Associate 1" },
    { label: "Associate 2", value: "Associate 2" },
    { label: "Associate 3", value: "Associate 3" },
    { label: "Associate 4", value: "Associate 4" },
    { label: "Associate 5", value: "Associate 5" },
    { label: "Associate 6", value: "Associate 6" },
    { label: "Associate 7", value: "Associate 7" },
    { label: "Associate 8", value: "Associate 8" },
    { label: "Associate 9", value: "Associate 9" },
    { label: "Associate 10", value: "Associate 10" },
];

interface UpdateProps {
  isOpen: boolean;
  id?: any;
  data: any;
  mutate?: any;
  onClose: () => void;
  
}
const UpdateSingleProjectModal:React.FC<UpdateProps> = ({isOpen, onClose, id, data, mutate}) => {
    console.log('data:', data);
  const [notification, setNotification] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [associates, setAssociates] = useState<any>("");
  const { userData, isLoading } = useClients(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    projectName: "",
    projectimageLink: "",
    projectstartDate: "",
    projectendDate: "",
    assignCustomer: "",
    // associates: "",
    description: "",
    attachments: [],
    status: "",
    notes: [],
  });

  useEffect(() => {
    if (data) {
      // Prepare initial form data from the prop
      setFormData({
        projectName: data.projectName || "",
        projectimageLink: data.projectimageLink || "",
        projectstartDate: data.projectstartDate || "",
        projectendDate: data.projectendDate || "",
        description: data.description || "",
        attachments: data.attachments?.map((att: any) => att.filePath) || [],
        status: data.status || "",
        notes: data.notes || [],
      });

      // Set selected user if user data exists
      if (data.userId) {
        setSelectedUser({
          id: data.userId._id,
          label: data.userId.fullName,
          value: data.userId._id
        });
      }

      // Set associates if they exist
      if (data.associates && data.associates.length > 0) {
        const selectedAssociates = data.associates.map((assoc: string) => ({
          label: assoc,
          value: assoc
        }));
        setAssociates(selectedAssociates);
      }
    }
  }, [data]);

  const handleUserChange = (selected: any) => {
    setSelectedUser(selected);
    // Set the userId when a user is selected
    setFormData((prev: any) => ({
      ...prev,
      userId: selected ? selected.id : ""
    }));
  };

  const handleSelectChange = (selected: any) => {
    setAssociates(selected);
  };
 
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement & { files: FileList };
    
    if (files && files.length > 0) {
      const fileURLs = Array.from(files).map((file) =>
        URL.createObjectURL(file) // Replace with actual upload logic later
      );
      setFormData((prev: any) => ({
        ...prev,
        attachments: fileURLs,
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: name === "phoneNumber" ? Number(value) : value,
      }));
    }
  };
  

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    startTransition(async () => {
      try {
        const payload = {
            projectName: formData.projectName,
            projectimageLink: formData.projectimageLink,
            projectstartDate: formData.projectstartDate,
            projectendDate: formData.projectendDate,
            description: formData.description,
             status: formData.status,
            associates: associates.length > 0 
              ? associates.map((associate: any) => associate.value) 
              : [], 
          };
  
        const response = await updateSingleProjectData(`/admin/project/${id}`, payload);
        console.log('payload:', payload);
        console.log('response:', response);
        
        if (response?.status === 200) {
        toast.success("Updated successfully");
          //setNotification("Project Added Successfully");
          mutate(); 
          onClose();
        } else {
          toast.error("Failed to add project");
        }
      } catch (error) {
        console.error("Error adding project:", error);
        toast.error("An error occurred while adding the project");
      }
    });
  }; 


  return (
    <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    bodyOpenClassName='overflow-hidden'
    contentLabel="Edit Client Details"
    className="modal max-w-[1081px] mx-auto rounded-[20px] w-full max-h-[90vh] overflow-auto overflow-custom"
    overlayClassName="w-full h-full p-3 fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
    ariaHideApp={false}
  >
      <div className=" bg-white rounded-t-[10px] md:rounded-t-[30px] w-full py-[30px] px-[15px] md:p-10  ">
        <form onSubmit={handleSubmit} className="fomm-wrapper">
          <h2 className="section-projectName">About Project</h2>
          <div className="grid md:flex flex-wrap gap-5 pb-[33px] relative ">
            <div className="md:w-[calc(66.66%-8px)]">
              <label className="block">Title</label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                placeholder="Add projectName"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="md:w-[calc(33.33%-14px)]">
              <label className="block">Image</label>
              <input
                type="text"
                name="projectimageLink"
                value={formData.projectimageLink}
                placeholder="Add projectName"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="md:w-[calc(33.33%-14px)]">
              <label className="block">Start Date</label>
              <input
                type="date"
                name="projectstartDate"
                value={formData.projectstartDate}
                onChange={handleInputChange}
                placeholder="+12346987"
                required
              />
            </div>
            <div className="md:w-[calc(33.33%-14px)]">
              <label className="block">Expected End Date</label>
              <input
                type="date"
                name="projectendDate"
                value={formData.projectendDate}
                onChange={handleInputChange}
                placeholder=""
                required
              />
            </div>
            <div className="md:w-[calc(33.33%-14px)]">
              <label className="block">Status</label>
              <select 
            name="status" 
            value={formData.status} 
            onChange={handleInputChange}
          >
            <option value="">Select Status</option>
            <option value="1">Foundation</option>
            <option value="2">Construction</option>
            <option value="3">Interior Work</option>
            <option value="4">Completed</option>
          </select>
            </div>
            <div className="md:w-[calc(50%-14px)]">
              <label className="block">Assign Customer</label>
              <CustomSelect
                value={selectedUser}
                options={userData}
                onChange={handleUserChange}
                placeholder="Select User"
              />
            </div>
            <div className="md:w-[calc(50%-14px)]">
            <label className="block">Employees Associated</label>

              <CustomSelect
                value={associates}
                options={option}
                isMulti={true}
                onChange={handleSelectChange}
                placeholder="Select Assoiates"
              />
            </div>
            <div className="w-full">
              <label className="block">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description"
              ></textarea>
            </div>
          </div>
          <div className="mt-5 ">
            <button
              type="submit"
              className="button w-full"
              disabled={isPending}
            >
              {" "}
              <AddIcon className="w-4 h-4" />
              {isPending ? "Updating..." : "Update Project Details"}
            </button>
          </div>
        </form>
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      </div>
    </Modal>
  );
};
export default UpdateSingleProjectModal;
