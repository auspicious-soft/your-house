import React, { ChangeEvent } from "react";
import Modal from "react-modal";


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
    return (
        <Modal 
        isOpen={isOpen}
        onRequestClose={onclose} 
        contentLabel="Add New Entry"
        className="modal max-w-[810px] mx-auto rounded-[20px] w-full  max-h-[90vh] overflow-auto overflo-custom "
        overlayClassName="w-full h-full p-3 fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
        ariaHideApp={false} >
          <div className="bg-white rounded-lg p-8 relative">
          <button
            onClick={onclose}
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
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
        </Modal>
    );
}

export default EditClientDetailsModal;
