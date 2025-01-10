import React, { ChangeEvent, FormEvent, useState, useTransition } from "react";
import Modal from "react-modal";
import Image from "next/image"; // Import Image for Next.js
import { EditImageIcon } from "@/utils/svgicons";
import prev from "@/assets/images/img13.png"
import { updateUserInfo } from "@/services/client/client-service";
import { mutate } from "swr";
import { useTranslations } from "next-intl";
import ReactLoader from "@/components/react-loading";
import { addNewUser } from "@/services/admin/admin-service";
import { toast } from "sonner";

interface AddNewClientOptions {
    isOpen: any;
    onClose: any;
    mutate: any;
}
const AddNewClient:React.FC<AddNewClientOptions> = ({ isOpen, onClose, mutate}) => {
  const t = useTranslations('ProfilePage');
  const h = useTranslations('ToastMessages');
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<any>({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    address: "", 
  })

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
    let updatedFormData = { ...formData }
    startTransition(async () => {
      try {
          console.log('updatedFormData:', updatedFormData);
        const response = await addNewUser(`/admin/users/`, updatedFormData);
        console.log('response:', response);
        if (response?.status === 201) {
          onClose();
          mutate();
          toast.success(h("User details updated successfully"));
        } else {
          toast.error(h("Failed to add User Data"));
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
      contentLabel="Edit Client Details"
      className="modal max-w-[1081px] mx-auto rounded-[20px] w-full max-h-[90vh] overflow-auto overflow-custom"
      overlayClassName="w-full h-full p-3 fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
      ariaHideApp={false}
    >
      <div className="bg-white rounded-lg p-8 relative">
        <div className="flex items-center justify-between mb-10 ">
          <h2 className="main-heading">{t('Add client information')}</h2>
          <button
            onClick={onClose}
            className="bg-[#3B3F88] text-white p-1 px-2 rounded-3xl  "
          >✖
          </button>
        </div>
        <div className=" fomm-wrapper">
          <form onSubmit={handleSubmit} className="grid md:flex flex-wrap gap-5">
            <div className="w-full">
              <label className="block">
                {t('fullName')}
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="md:w-[calc(50%-10px)]">
              <label className="block">
                {t('emailAddress')}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="md:w-[calc(50%-10px)]">
              <label className="block">
                {t('Password')}
              </label>
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="md:w-[calc(50%-10px)]">
              <label className="block">
                {t('phoneNumber')}
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="md:w-[calc(50%-10px)]">
              <label className="block">
                {t('homeAddress')}
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="w-full ">
              <button
                disabled={isPending}
                type="submit"
                className="w-full button !h-[44px] rounded-lg"
              > {!isPending ? t('saveDetails') : <ReactLoader />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}; 

export default AddNewClient;
