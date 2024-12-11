import { addNotesData, deleteNotesData, getNotesData } from '@/services/admin/admin-service';
import { AddFileIcon, DeleteIcon, EditButtonIcon, NotesIcon } from '@/utils/svgicons';
import React, { useState, useTransition } from 'react';
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
  const [text, setText] = useState<string>("");


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
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text.trim()) {
      toast.error("Text cannot be empty");
      return;
    }
    try {
      const notesData = { text };
      const response = await addNotesData(`/admin/notes/${id}`, notesData)
      if (response?.status === 201) {
        toast.success("Note added successfully");
        setIsModalOpen(false);
        mutate()
        setText("")
      } else {
        toast.error("Failed to add Note");
      }
    } catch (error) {
      console.error("Error adding Note", error);
      toast.error("An error occurred while adding the Note");
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
        <button  onClick={()=>setIsModalOpen(true)} className="w-full button !h-[40px] "> <EditButtonIcon/>
          Upload New Note
        </button>
      </div>
      <Modal
      isOpen={isModalOpen}
      onRequestClose={()=>setIsModalOpen(false)}
      bodyOpenClassName='overflow-hidden'
      contentLabel="Edit Client Details"
      className="modal max-w-[600px] bg-white mx-auto rounded-[20px] w-full max-h-[90vh] "
      overlayClassName="w-full h-full p-3 fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
      ariaHideApp={false}>
  <div className='overflow-y-auto overflow-custom p-5'>
    <h2 className="mb-2 ">New Note</h2>
    <form onSubmit={handleSubmit} className="fomm-wrapper">
      <textarea name="text" value={text} onChange={(e)=>setText(e.target.value)} aria-required placeholder="Enter your note here" required></textarea>
      <button type="submit" className='button w-full mt-5'><AddFileIcon/> Add Note</button>
    </form>
  </div>
  </Modal>

    </div>
    );
}

export default Notes;
