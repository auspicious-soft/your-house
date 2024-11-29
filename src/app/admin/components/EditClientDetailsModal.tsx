import React, { ChangeEvent, useState } from "react";
import Modal from "react-modal";
import Image from "next/image"; // Import Image for Next.js
import { EditImageIcon } from "@/utils/svgicons";

const EditClientDetailsModal = ({
  isOpen,
  onClose,
  formData,
  handleInputChange,
  handleSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    fullName: string;
    phoneNumber: string | number;
    email: string;
    address: string;
  };
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleSave: () => void;
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImagePreview(result);
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
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Edit Client Details"
      className="modal max-w-[810px] mx-auto rounded-[20px] w-full max-h-[90vh] overflow-auto overflow-custom"
      overlayClassName="w-full h-full p-3 fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
      ariaHideApp={false}
    >
      <div className="bg-white rounded-lg p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✖️
        </button>
        <h3 className="text-xl mb-4 font-semibold">Edit Client Details</h3>
        <div className=" fomm-wrapper space-y-4">
          {/* Image Upload Section */}
          <div className="custom relative w-[120px] h-[120px] mx-auto mb-5">
            <input
              className="absolute top-0 left-0 h-full w-full opacity-0 p-0 cursor-pointer"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview ? (
              <div className="relative h-full">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={120}
                  height={120}
                  className="rounded-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={triggerFileInputClick}
                  className="absolute bottom-0 right-0 bg-gray-100 p-2 rounded-full"
                >
                  <EditImageIcon />
                </button>
              </div>
            ) : (
              <div className="grid place-items-center h-full w-full bg-[#f1f1f1] rounded-full">
                <div>
                  <Image
                    src="/default-image.png" // Replace with actual default image path
                    alt="upload"
                    width={120}
                    height={120}
                    className="rounded-full"
                  />
                  <p className="absolute bottom-0 right-0 pointer-events-none">
                    <EditImageIcon />
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="w-full">
          <label className="block">
            Full Name
          </label>
          <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            </div>
            <div className="w-full">
          <label className="block">
            Phone Number
          </label>
          <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            </div>
            <div className="w-full">
          <label className="block">
            Email Address
          </label>
          <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            </div>
            <div className="w-full">
          <label className="block">
            Home Address
          </label>
          <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={handleSave}
            className="w-full  button !h-[44px] rounded-lg "
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditClientDetailsModal;
