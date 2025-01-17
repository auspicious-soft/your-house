import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import doc from '@/assets/images/documents.png';
import { DownloadIcon } from '@/utils/svgicons';
import useSWR from 'swr';
import { getClientAttachments } from '@/services/client/client-service';
import { useSession } from 'next-auth/react';
import { getImageUrl } from '@/actions';
import Link from 'next/link';

interface OverViewProps {
  id: any;
  type: string;
}

const ClientAttachments: React.FC<OverViewProps> = ({ id, type }) => {
  const { data, isLoading, error, mutate } = useSWR(id ? `/user/attachments/${id}` : null, getClientAttachments);
  const arrays = data?.data?.data 

  const attachments = arrays?.filter((attachment: any) => attachment?.type === type);

  const session = useSession();
  const email = (session as any)?.data?.user?.username;
  const [fileLinks, setFileLinks] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const fetchLinks = async () => {
      if (attachments) {
        const links: {[key: string]: string} = {};
        for (const attachment of attachments) {
          const link = await getImageUrl(attachment.url);
          links[attachment._id] = link;
        }
        setFileLinks(links);
      }
    };
    fetchLinks();
  }, [type]);

  return (
    <div className=''>
      {attachments?.map((attachment: any) => {
        const fileName = attachment.url.replace('users/', '').replace(`${email}/`, '').replace('projects/', '').replace(`attachments/`, '')
        return (
          <div key={attachment._id} className="flex justify-between items-center mb-5">
            <div className='flex items-center gap-3 '>
              <div><Image src={doc} alt='' width={35} height={35}/> </div>
              <div>
                <p className="text-[#43527B] text-sm">{fileName}</p>
                <p className="text-[#8B8E98] text-xs mt-1">
                  Uploaded by {attachment?.createdby?.fullName} <span className='ml-5'>Time: {new Date(attachment?.createdby?.createdAt).toLocaleString()} </span>
                </p>
              </div>
            </div>
            <div className="flex gap-[6px]">
              <div onClick={() => {
                if (fileLinks[attachment._id]) {
                  window.open(fileLinks[attachment._id], '_blank');
                }
              }} className='cursor-pointer' aria-label={`Download ${fileName}`}>
                <DownloadIcon />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ClientAttachments;