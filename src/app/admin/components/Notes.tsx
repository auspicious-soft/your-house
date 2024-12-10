import { DeleteIcon, EditButtonIcon, NotesIcon } from '@/utils/svgicons';
import React from 'react';

interface Notes {
  note: any;
}
const Notes: React.FC<Notes> = ({note}) => {
  return (
        <div>
         {note?.map((data: any) => (
             <div key={data} className="grid grid-cols-[auto_1fr_auto] gap-3  mb-[10px] ">
                <span><NotesIcon /> </span>
                <p className='text-[#8B8E98]  '>{data} </p>
                <button><DeleteIcon /> </button>
            </div>
            ))}
            <div className="mt-4">
        <button className="w-full button !h-[40px] "> <EditButtonIcon/>
          Upload New File
        </button>
      </div>
        </div>
    );
}

export default Notes;
