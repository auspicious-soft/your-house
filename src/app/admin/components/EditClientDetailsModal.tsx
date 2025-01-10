import React, { ChangeEvent, FormEvent, useState, useTransition } from "react";
import Modal from "react-modal";
import Image from "next/image"; // Import Image for Next.js
import { EditImageIcon } from "@/utils/svgicons";
import prev from "@/assets/images/img13.png"
import { updateUserInfo } from "@/services/client/client-service";
import { mutate } from "swr";
import { useTranslations } from "next-intl";
import ReactLoader from "@/components/react-loading";

const EditClientDetailsModal = ({ isOpen, onClose, formData, mutate, handleInputChange, id, handleSubmit, profilePic, setFormData, isPending
}: {
  isOpen: boolean;
  id?: string;
  mutate: any;
  onClose: () => void;
  formData: {
    fullName: string;
    phoneNumber: string | number;
    email: string;
    address: string;
    profilePic: string;
  };
  setFormData: React.Dispatch<any>;
  profilePic: string;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>
  isPending: boolean
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const t = useTranslations('ProfilePage');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev: any) => ({
        ...prev,
        profilePic: file
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
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
          <h2 className="main-heading">{t('editClientDetails')}</h2>
          <button
            onClick={onClose}
            className="bg-[#3B3F88] text-white p-1 px-2 rounded-3xl  "
          >✖
          </button>
        </div>
        <div className=" fomm-wrapper">
          {/* Image Upload Section */}
          <div className="custom relative w-[200px] h-[200px] mb-5">
            <input
              className="absolute top-0 left-0 h-full w-full opacity-0 !p-0 cursor-pointer"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview ? (
              <div className="relative h-full">
                <Image
                  unoptimized
                  src={imagePreview}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="rounded-full h-full object-cover aspect-square"
                />
                <button
                  type="button"
                  onClick={triggerFileInputClick}
                  className="absolute bottom-0 right-0 bg-gray-100 p-2 rounded-full "
                >
                  <EditImageIcon />
                </button>
              </div>
            ) : (
              <div className="grid place-items-center h-full w-full bg-[#f1f1f1] rounded-full">
                <div>
                  {profilePic && <Image
                    unoptimized
                    src={profilePic || prev}
                    alt="upload"
                    width={200}
                    height={200}
                    className="rounded-full max-h-[200px] object-cover aspect-square "
                  />}
                  <p className="absolute bottom-[10px] right-4  pointer-events-none">
                    <EditImageIcon />
                  </p>
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="grid md:flex flex-wrap gap-5">
            {/* Form Fields */}
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
            <div className="md:w-[calc(33.33%-14px)]">
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
            <div className="md:w-[calc(33.33%-14px)]">
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
            <div className="md:w-[calc(33.33%-14px)]">
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

export default EditClientDetailsModal;
