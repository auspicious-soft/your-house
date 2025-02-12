"use client";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
  useTransition,
} from "react";
import Image from "next/image";
import success from "@/assets/images/succes.png";
import Notification from "../components/Notification";
import { toast } from "sonner";
import { AddIcon, EditButtonIcon } from "@/utils/svgicons";
import CustomSelect from "@/app/(website)/components/CustomSelect";
import { updateSingleProjectData } from "@/services/admin/admin-service";
import useClients from "@/utils/useClients";
import Modal from "react-modal";
import { getImageClientS3URL } from "@/utils/axios";
import { useTranslations } from "next-intl";
import { deleteFileFromS3, generateSignedUrlToUploadOn } from "@/actions";
import ReactLoader from "@/components/react-loading";
import UseEmployees from "@/utils/useEmployees";


interface UpdateProps {
  isOpen: boolean;
  id?: any;
  data: any;
  mutate: any;
  onClose: () => void;
}
const UpdateSingleProjectModal: React.FC<UpdateProps> = ({ isOpen, onClose, id, data, mutate, }) => {
  const t = useTranslations("ProjectsPage");
  const h = useTranslations("ToastMessages");
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const [associates, setAssociates] = useState<any>("");

  const { userData, isLoading } = useClients();
  const { employeeData } = UseEmployees();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const oldProjectImage = data?.projectimageLink;
  const [formData, setFormData] = useState<any>({
    projectName: "",
    projectimageLink: "",
    projectstartDate: "",
    projectendDate: "",
    assignCustomer: "",
    description: "",
    employeeId: "",
    homeAddress: "",
    constructionAddress: "",
    progress: 0,
    status: "",
    notes: [],
  });
  const [imagePreview, setImagePreview] = useState<string>("");


  useEffect(() => {
    if (!data) return;
    setFormData({
      projectName: data.projectName || "",
      projectimageLink: data.projectimageLink || "",
      projectstartDate: data.projectstartDate || "",
      projectendDate: data.projectendDate || "",
      description: data.description || "",
      progress: data.progress || "",
      homeAddress: data.homeAddress || "",
      constructionAddress: data.constructionAddress || "",
      attachments: data.attachments?.map((att: any) => att.filePath) || [],
      status: data?.status[data?.status.length - 1] || "",
      notes: data.notes || [],
    });

    setImagePreview(getImageClientS3URL(data.projectimageLink));

    // Format the selected user data
    if (data.userId) {
      setSelectedUser({
        label: data.userId.fullName || "",
        value: data.userId._id || "",
      });
    } else {
      setSelectedUser(null);
    }

    // Format the associates data
    if (data.employeeId?.length > 0) {
      const formattedAssociates = data.employeeId.map((emp: any) => ({
        label: emp.fullName || emp.email || "",
        value: emp._id || "",
      }));
      setAssociates(formattedAssociates);
    } else {
      setAssociates([]);
    }
  }, [data]);

  const handleUserChange = (selected: any) => {
    setSelectedUser(selected);
    setFormData((prev: any) => ({
      ...prev,
      userId: selected ? selected.id : "",
    }));
  };

  const handleSelectChange = (selected: any) => {
    setAssociates(selected);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement & {
      files: FileList;
    };

    if (files && files.length > 0 && name === "projectimageLink") {
      const file = files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
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
    let imageUrl = formData.projectimageLink;
    startTransition(async () => {
      try {
        if (selectedFile) {
          const { signedUrl, key } = await generateSignedUrlToUploadOn(selectedFile.name, selectedFile.type, selectedUser.email);
          await fetch(signedUrl, {
            method: "PUT",
            body: selectedFile,
            headers: {
              "Content-Type": selectedFile.type,
            },
          });
          oldProjectImage && (await deleteFileFromS3(oldProjectImage));
          imageUrl = key;
        }
        const payload = {
          projectName: formData.projectName,
          projectimageLink: imageUrl,
          projectstartDate: formData.projectstartDate,
          projectendDate: formData.projectendDate,
          description: formData.description,
          homeAddress: formData.homeAddress,
          constructionAddress: formData.constructionAddress,
          progress: formData.progress,
          status: formData.status,
          userId: selectedUser?.value || null,
          employeeId: associates.length > 0 ? associates.map((associate: any) => associate.value) : undefined,
        };

        const response = await updateSingleProjectData(`/admin/project/${id}`, payload)

        if (response?.status === 200) {
          toast.success(h("Updated successfully"));
          mutate();
          onClose();
        } else {
          toast.error(h("Failed to add project"));
        }
      } catch (error) {
        console.error("Der opstod en fejl", error);
        toast.error("Der opstod en fejl");
      }
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      bodyOpenClassName="overflow-hidden"
      contentLabel="Edit Client Details"
      className="modal max-w-[1081px] mx-auto rounded-[20px] w-full max-h-[90vh] overflow-auto overflow-custom"
      overlayClassName="w-full h-full p-3 fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
      ariaHideApp={false}
    >
      <div className=" bg-white rounded-t-[10px] md:rounded-t-[30px] w-full py-[30px] px-[15px] md:p-10  ">
        <form onSubmit={handleSubmit} className="fomm-wrapper">
          <h2 className="section-projectName mb-5">{t("aboutProject")}</h2>
          <div className="grid md:flex flex-wrap gap-5 pb-[33px] relative ">
            <div className="md:w-[calc(33.33%-14px)] mb-5">
              <label className="block">{t("projectImage")}</label>
              {!selectedFile ? (
                <div className="relative h-full">
                  {imagePreview && <Image
                    src={imagePreview}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="rounded-full object-cover w-[200px] h-[200px]"
                  />}
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("fileInput")?.click()
                    }
                    className="absolute bottom-5 right-24 p-2 rounded-full bg-[#1657ff] text-white"
                  >
                    <EditButtonIcon />
                  </button>
                </div>
              ) : (
                <div className="relative h-full">
                  <Image
                    src={imagePreview ? imagePreview : success}
                    alt="upload"
                    width={200}
                    height={200}
                    className="rounded-full object-cover w-[200px] h-[200px]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("fileInput")?.click()
                    }
                    className="absolute bottom-5 right-24 p-2 rounded-full bg-[#1657ff] text-white"
                  >
                    <EditButtonIcon />
                  </button>
                </div>
              )}
              <input
                type="file"
                id="fileInput"
                name="projectimageLink"
                className="hidden"
                onChange={handleInputChange}
                accept="image/*"
              />
            </div>
            <div className="w-full">
              <label className="block">{t("title")}</label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                placeholder={t("addProjectName")}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="md:w-[calc(50%-14px)]">
              <label className="block">{t("startDate")}</label>
              <input
                type="date"
                name="projectstartDate"
                value={formData.projectstartDate}
                onChange={handleInputChange}
                placeholder={t("startDate")}
              />
            </div>
            <div className="md:w-[calc(50%-14px)]">
              <label className="block">{t("expectedEndDate")}</label>
              <input
                type="date"
                name="projectendDate"
                value={formData.projectendDate}
                onChange={handleInputChange}
                placeholder=""
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
            <div className="md:w-[calc(33.33%-14px)]">
              <label className="block">{t("status")}</label>
              <input
                type="text"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              />
            </div>
            <div className="md:w-[calc(33.33%-14px)]">
              <label className="block">{t("Progress")}</label>
              <input
                type="number"
                name="progress"
                value={formData.progress}
                onChange={handleInputChange}
              />
            </div>
            <div className="md:w-[calc(33.33%-14px)]">
              <label className="block">{t("assignCustomer")}</label>
              <CustomSelect
                value={selectedUser}
                options={userData}
                onChange={handleUserChange}
                placeholder={t("selectUser")}
                required =  {false}
              />
            </div>
            <div className="md:w-[calc(33.33%-14px)]">
              <label className="block">{t("employeesAssociated")}</label>

              <CustomSelect
                value={associates}
                required={false}
                options={employeeData}
                isMulti={true}
                onChange={handleSelectChange}
                placeholder={t('selectAssociates')}
              />
            </div>
            <div className="w-full">
              <label className="block">{t("description")}</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder={t("description")}
              ></textarea>
            </div>
          </div>
          <div className="mt-5 ">
            <button
              type="submit"
              className="button w-full"
              disabled={isPending}
            >
              {isPending ? (
                <ReactLoader />
              ) : (
                <>
                  {" "}
                  <AddIcon className="w-4 h-4" /> {t("updateProjectDetails")}
                </>
              )}
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
