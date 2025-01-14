"use client";
import React, { ChangeEvent, FormEvent, useState, useTransition } from "react";
import Notification from "../components/Notification";
import { toast } from "sonner";
import { AddIcon } from "@/utils/svgicons";
import CustomSelect from "@/app/(website)/components/CustomSelect";
import { addNewProject } from "@/services/admin/admin-service";
import useClients from "@/utils/useClients";
import { useTranslations } from "next-intl";
import { generateSignedUrlOfProjectAttachment, generateSignedUrlToUploadOn } from "@/actions";
import ReactLoader from "@/components/react-loading";
import UseEmployees from "@/utils/useEmployees";

const Page = () => {
  const t = useTranslations('ProjectsPage');
  const h = useTranslations('ToastMessages');
  const [notification, setNotification] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [employees, setEmployees] = useState<any>("");
  const { userData, isLoading } = useClients();
  const {employeeData} = UseEmployees();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  const [formData, setFormData] = useState<any>({
    projectName: "",
    projectimageLink: null, // Changed to null for file storage
    projectstartDate: "",
    projectendDate: "",
    assignCustomer: "",
    description: "",
    homeAddress: "",
    constructionAddress: "",
    employeeId: "", 
    progress: 0,
    attachments: null, // Changed to null for file storage
    status: "",
    notes: [],
  })


  const handleUserChange = (selected: any) => {
    setSelectedUser(selected);
    // Set the userId when a user is selected
    setFormData((prev: any) => ({
      ...prev,
      userId: selected ? selected.id : ""
    }));
  };

  const handleSelectChange = (selected: any) => {
    setEmployees(selected);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement & { files: FileList };

    if (files && files.length > 0) {
      if (name === "projectimageLink") {
        setFormData((prev: any) => ({
          ...prev,
          projectimageLink: files[0]
        }))

      } else if (name === "attachments") {
        setFormData((prev: any) => ({
          ...prev,
          attachments: files[0]
        }))
      }
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: name === "phoneNumber" ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const progressRegex = /^([1-9][0-9]?|100)$/;
    if (formData.progress && !progressRegex.test(formData.progress.toString())) {
      toast.error("Progress must be a number between 1 and 100");
      return;
    }
    let projectImageLink: string | undefined ;
    let attachementUrl: string | undefined;
    startTransition(async () => {
      try {
      if (formData.projectimageLink instanceof File && formData.attachments instanceof File) {
        const { signedUrl, key } = await generateSignedUrlToUploadOn(formData.projectimageLink.name, formData.projectimageLink.type, selectedUser.email)
        await fetch(signedUrl, {
          method: 'PUT',
          body: formData.projectimageLink,
          headers: {
            'Content-Type': formData.projectimageLink.type,
          },
        })
        projectImageLink = key

        const { signedUrl: attachmentUrl, key: attachmentKey } = await generateSignedUrlOfProjectAttachment(formData.attachments.name, formData.attachments.type, selectedUser.email)
        await fetch(attachmentUrl, {
          method: 'PUT',
          body: formData.attachments,
          headers: {
            'Content-Type': formData.attachments.type,
          },
        })
        attachementUrl = attachmentKey
      }
      // else {
      //   toast.warning("Required fields cannot be empty", { position: 'bottom-left' })
      // }
     
        const payload = {
          projectName: formData.projectName,
          userId: selectedUser ? selectedUser.id : "", 
          projectimageLink: projectImageLink,
          projectstartDate: formData.projectstartDate,
          projectendDate: formData.projectendDate,
          description: formData.description,
          progress: formData.progress,
          constructionAddress: formData.constructionAddress,
          homeAddress: formData.homeAddress,
          attachments: attachementUrl, 
          status: formData.status,
          notes: formData.notes, 
          employees: employees
            ? employees.map((associate: any) => associate.value)
            : undefined
        }
 
        const response = await addNewProject("/admin/projects", payload);

        if (response?.status === 201) {
          setNotification(h("Project Added Successfully"))
          setTimeout(() => {
            window.location.href = "/admin/projects"
          }, 2000);
        } else {
          toast.error(h("Failed to add project"));
        }
      } catch (error) {
        console.error("Der opstod en fejl", error);
        toast.error(h("An error occurred while adding the project"));
      }
    });
  };


  return (
    <>
      <div className=" bg-white rounded-t-[10px] md:rounded-t-[30px] w-full py-[30px] px-[15px] md:p-10  ">
        <form onSubmit={handleSubmit} className="fomm-wrapper">
          <h2 className="section-projectName">{t('aboutProject')}</h2>
          <div className="grid md:flex flex-wrap gap-5 mb-[20px] md:mb-[33px] pb-[33px] relative progress-line">
            <div className="md:w-[calc(66.66%-8px)]">
              <label className="block">{t('title')}</label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                placeholder={t('addTitle')}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="md:w-[calc(33.33%-14px)]">
              <label className="block">{t('image')}</label>
              <input
                type="file"
                name="projectimageLink"
                onChange={handleInputChange}
                accept="image/*"
              />

            </div>
            <div className="md:w-[calc(33.33%-14px)]">
              <label className="block"> {t('startDate')}</label>
              <input
                type="date"
                name="projectstartDate"
                value={formData.projectstartDate}
                onChange={handleInputChange}
                placeholder={t('startDate')}
              />
            </div>
            <div className="md:w-[calc(33.33%-14px)]">
              <label className="block">{t('expectedEndDate')}</label>
              <input
                type="date"
                name="projectendDate"
                value={formData.projectendDate}
                onChange={handleInputChange}
                placeholder=""
              />
            </div>
            <div className="md:w-[calc(33.33%-14px)]">
              <label className="block">{t('assignCustomer')}</label>
              <CustomSelect
                value={selectedUser}
                options={userData}
                onChange={handleUserChange}
                placeholder={t('selectUser')}
              />
            </div>
            <div className="md:w-[calc(33.33%-14px)]">
              <label className="block">{t('employeesAssociated')}</label>
              <CustomSelect
                value={employees}
                options={employeeData}
                isMulti={true}
                onChange={handleSelectChange}
                placeholder={t('selectAssociates')}
                required={false}
              />
            </div>
            <div className="md:w-[calc(33.33%-14px)]">
              <label className="block">{t('Construction Address')}</label>
              <input
                type="text"
                name="constructionAddress"
                value={formData.constructionAddress}
                onChange={handleInputChange}
                placeholder=""
              />
            </div>
            <div className="md:w-[calc(33.33%-14px)]">
              <label className="block">{t('Home Address')}</label>
              <input
                type="text"
                name="homeAddress"
                value={formData.homeAddress}
                onChange={handleInputChange}
                placeholder=""
              />
            </div>
            <div className="w-full">
              <label className="block">{t('description')}</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder={t('description')}
              ></textarea>
            </div>
          </div>
          <h2 className="section-projectName">{t('projectProgress')}</h2>
          <div className="grid md:flex flex-wrap gap-5 ">
            <div className="md:w-[calc(50%-10px)]">
              <label className="block">{t('attachments')}</label>
              <input
                type="file"
                name="attachments"
                onChange={handleInputChange}
                accept=".pdf,.doc,.docx,.zip,image/*"
              />
            </div>
            <div className="md:w-[calc(50%-10px)]">
              <label className="block">{t('status')}</label>
              <input type="text" name="status" value={formData.status}  onChange={handleInputChange} />
            </div>
            <div className="md:w-[calc(50%-10px)]">
              <label className="block">{t('Progress')}</label>
              <input type="number" name="progress" value={formData.progress} onChange={handleInputChange} />
            </div>
            <div className="w-full">
              <label className="block">{t('addNotes')}</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder={t('addNotes')}
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

              {isPending ? <ReactLoader /> : <> <AddIcon className="w-4 h-4" /> {t("addNewProject")}</>}
            </button>
          </div>
        </form>
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      </div>
    </>
  );
};
export default Page;
