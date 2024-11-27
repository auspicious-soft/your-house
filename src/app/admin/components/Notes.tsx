import { DeleteIcon, EditButtonIcon, NotesIcon } from '@/utils/svgicons';
import React from 'react';

const Notes = () => {
    const NotesData = [
        {
          note: 'Lorem Ipsum Name of the file.pdf',
         },
         {
            note: 'Lorem Ipsum Name of the file.pdf',
        },
        {
            note: 'Lorem Ipsum Name of the file.pdf',
        },
      ];
    return (
        <div>
         {NotesData.map((data, index) => (
             <div key={index} className="grid grid-cols-[auto_1fr_auto] gap-3  mb-[10px] ">
                <span><NotesIcon /> </span>
                <p className='text-[#8B8E98]  '>{data.note} </p>
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
