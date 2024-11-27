import Image from 'next/image';
import React from 'react';
import pdfImg from '@/assets/images/PDF.png';
import { DeleteIcon, DownloadIcon, EditButtonIcon, EditIcon } from '@/utils/svgicons';


interface FileItem {
    name: string;
    uploadedBy: string;
    time: string;
  }
const OverviewOfProjects: React.FC = () => {
    const fileItems: FileItem[] = [
        {
          name: 'Lorem Ipsum Name of the file.pdf',
          uploadedBy: 'Neil Metender',
          time: '11:23 AM',
        },
        {
          name: 'Lorem Ipsum Name of the file.pdf',
          uploadedBy: 'Neil Metender',
          time: '11:24 AM',
        },
        {
          name: 'Lorem Ipsum Name of the file.pdf',
          uploadedBy: 'Neil Metender',
          time: '11:24 AM',
        },
      ];
    return (
        <div className=''>
        {fileItems.map((file, index) => (
        <div key={index} className="flex justify-between items-center mb-5">
          <div className='flex items-center gap-3 '>
            <div><Image src={pdfImg} alt='' /> </div>
          <div>
            <p className="text-[#43527B] text-sm  ">{file.name}</p>
            <p className="text-[#8B8E98] text-xs mt-1  ">
              Uploaded by {file.uploadedBy} <span className='ml-5'>Time: {file.time}</span>
            </p>
          </div>
          </div>
         <div className="flex gap-[6px]  ">
         <button>
            <DownloadIcon />
          </button>
          <button><DeleteIcon /> </button>
         </div>
        </div>
      ))}
      <div className="">
        <button className="w-full button !h-[40px] "> <EditButtonIcon/>
          Upload New File
        </button>
      </div>
    </div>
    );
}

export default OverviewOfProjects;
