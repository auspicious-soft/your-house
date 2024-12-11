import Image from 'next/image';
import React, { useState } from 'react';
import pdfImg from '@/assets/images/PDF.png';
import { AddFileIcon, DeleteIcon, DownloadIcon, EditButtonIcon, EditIcon } from '@/utils/svgicons';
import useSWR from 'swr';
import { addAttachmentsData, deleteAttachmentsData, getAttachmentsData } from '@/services/admin/admin-service';
import Modal from "react-modal";
import { toast } from 'sonner';

interface OverViewProps {
  id: any;
  } 
const OverviewOfProjects: React.FC<OverViewProps> = ({id}) => {
  const {data, isLoading, error, mutate} = useSWR(`/admin/attachments/${id}`, getAttachmentsData)
  const attachments = data?.data?.data
  console.log('attachments:', attachments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [url, setUrl] = useState("");
  

  const deleteAttachments = async (id: any) => {
    try {
      const response = await deleteAttachmentsData(`/admin/attachments/${id}`); 
      if (response.status === 200) {
        toast.success("attachments deleted successfully");
        setIsModalOpen(false);
        mutate()
      } else {
        toast.error("Failed to delete attachments");
      }
    } catch (error) {
      console.error("Error deleting attachments", error);
      toast.error("An error occurred while deleting the attachments");
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const attachments = { url };
      console.log('notesData:', );
      const response = await addAttachmentsData(`/admin/attachments/${id}`, attachments)
      console.log('response:', response);
      if (response?.status === 201) {
        toast.success("Note added successfully");
        setIsModalOpen(false);
        mutate()
      } else {
        toast.error("Failed to add Note");
      }
    } catch (error) {
      console.error("Error adding Note", error);
      toast.error("An error occurred while adding the Note");
    }
  }

    return (
        <div className=''>
        {attachments?.map((index: any) => (
        <div key={index?._id} className="flex justify-between items-center mb-5">
          <div className='flex items-center gap-3 '>
            <div><Image src={pdfImg} alt='' /> </div>
          <div>
            <p className="text-[#43527B] text-sm  ">{index?.url}</p>
            <p className="text-[#8B8E98] text-xs mt-1  ">
              Uploaded by {index?.createdby?.fullName} <span className='ml-5'>Time: {index?.createdby?.createdAt} </span>
            </p>
          </div>
          </div>
         <div className="flex gap-[6px]  ">
          <a href={index?.url} target='blank'><DownloadIcon /></a>
          <button onClick={()=>deleteAttachments(index?._id)}><DeleteIcon /> </button>
         </div>
        </div>
      ))}
      <div className="">
        <button onClick={()=>setIsModalOpen(true)} className="w-full button !h-[40px] "> <EditButtonIcon/>
          Upload New File
        </button>
      </div>
      <Modal
      isOpen={isModalOpen}
      onRequestClose={()=>setIsModalOpen(false)}
      bodyOpenClassName='overflow-hidden'
      contentLabel="Add Attachments Details"
      className="modal max-w-[600px] bg-white mx-auto rounded-[20px] w-full max-h-[90vh] "
      overlayClassName="w-full h-full p-3 fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
      ariaHideApp={false}>
  <div className='overflow-y-auto overflow-custom p-5'>
    <h2 className="mb-2 ">Add New Attachment</h2>
    <form onSubmit={handleSubmit} className="fomm-wrapper">
      <input type="file" name="url" value={url} onChange={(e)=>setUrl(e.target.value)}/>
      <button type="submit" className='button w-full mt-5'><AddFileIcon/> Add Attachment</button>
    </form>
  </div>
  </Modal>
    </div>
    );
}

export default OverviewOfProjects;
