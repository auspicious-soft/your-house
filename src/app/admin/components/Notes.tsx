import { deleteNotesData, getNotesData } from '@/services/admin/admin-service';
import { DeleteIcon, EditButtonIcon, NotesIcon } from '@/utils/svgicons';
import React, { useState } from 'react';
import useSWR from 'swr';
import Modal from "react-modal";
import { toast } from 'sonner';


interface Notes {
  id: any;
}
const Notes: React.FC<Notes> = ({id}) => {
  const {data, isLoading, error, mutate} = useSWR(`/admin/notes/${id}`, getNotesData)
  const notes = data?.data?.data
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log('notessssssssssss:', notes);

  // const deleteNote =(id: any) =>{
  const deleteNote = async (id: any) => {
    try {
      const response = await deleteNotesData(`/admin/notes/${id}`); 
      if (response.status === 200) {
        toast.success("Note deleted successfully");
        setIsModalOpen(false);
        mutate()
      } else {
        toast.error("Failed to delete Note");
      }
    } catch (error) {
      console.error("Error deleting Note", error);
      toast.error("An error occurred while deleting the Note");
    }
  }
  return (
        <div>
         {notes?.map((row: any) => (
             <div key={row?._id} className="grid grid-cols-[auto_1fr_auto] gap-3  mb-[10px] ">
                <span><NotesIcon /> </span>
                <p className='text-[#8B8E98]  '>{row?.text} </p>
                <button onClick={()=>deleteNote(row?._id)}><DeleteIcon /> </button>
            </div>
            ))}
            <div className="mt-4">
        <button className="w-full button !h-[40px] "> <EditButtonIcon/>
          Upload New Note
        </button>
      </div>
      <Modal
    isOpen={isModalOpen}
    onRequestClose={()=>setIsModalOpen(false)}
    bodyOpenClassName='overflow-hidden'
    contentLabel="Edit Client Details"
    className="modal max-w-[1081px] mx-auto rounded-[20px] w-full max-h-[90vh] overflow-auto overflow-custom"
    overlayClassName="w-full h-full p-3 fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
    ariaHideApp={false}
  >
  </Modal>

    </div>
    );
}

export default Notes;
