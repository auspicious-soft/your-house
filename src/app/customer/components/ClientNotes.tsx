import {  getNotesData } from '@/services/admin/admin-service';
import { getClientNotes } from '@/services/client/client-service';
import {NotesIcon } from '@/utils/svgicons';
import React from 'react';
import useSWR from 'swr';


interface Notes {
  id: any;
}
const ClientNotes: React.FC<Notes> = ({id}) => {
  const {data, isLoading, error, mutate} = useSWR(`/user/notes/${id}`, getClientNotes)
  const notes = data?.data?.data
 
  return (
        <div>
         {notes?.map((row: any) => (
             <div key={row?._id} className="grid grid-cols-[auto_1fr_auto] gap-3  mb-[10px] ">
                <span><NotesIcon /> </span>
                <p className='text-[#8B8E98]  '>{row?.text} </p>
            </div>
            ))}
    </div>
    );
}


export default ClientNotes;
