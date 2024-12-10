import Image from 'next/image';
import React, { useState } from 'react';
import pdfImg from '@/assets/images/PDF.png';
import { DeleteIcon, DownloadIcon, EditButtonIcon, EditIcon } from '@/utils/svgicons';


interface OverViewProps {
  overView: any;
  } 
const OverviewOfProjects: React.FC<OverViewProps> = ({overView}) => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  


    return (
        <div className=''>
        {overView?.map((index: any) => (
        <div key={index} className="flex justify-between items-center mb-5">
          <div className='flex items-center gap-3 '>
            <div><Image src={pdfImg} alt='' /> </div>
          <div>
            <p className="text-[#43527B] text-sm  ">{index?.filePath}</p>
            <p className="text-[#8B8E98] text-xs mt-1  ">
              Uploaded by {index?.uploadedBy?.fullName} <span className='ml-5'>Time: </span>
            </p>
          </div>
          </div>
         <div className="flex gap-[6px]  ">
          <a href={index?.filePath} target='blank'><DownloadIcon /></a>
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
