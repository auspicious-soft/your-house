import Image from 'next/image';
import React, { useState } from 'react';
import pdfImg from '@/assets/images/PDF.png';
import { DownloadIcon } from '@/utils/svgicons';
import useSWR from 'swr';
import { getClientAttachments } from '@/services/client/client-service';

interface OverViewProps {
  id: any;
  } 
const ClientAttachments: React.FC<OverViewProps> = ({id}) => {
  const {data, isLoading, error, mutate} = useSWR(`/user/attachments/${id}`, getClientAttachments)
  const attachments = data?.data?.data
    
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
         </div>
        </div>
      ))}
   
    </div>
    );
}

export default ClientAttachments;
