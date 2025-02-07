import Image from 'next/image';
import React, { useState } from 'react';
import doc from '@/assets/images/documents.png';
import { AddFileIcon, DeleteIcon, DownloadIcon, EditButtonIcon, EditIcon } from '@/utils/svgicons';
import useSWR from 'swr';
import { addAttachmentsData, deleteAttachmentsData, getAttachmentsData } from '@/services/admin/admin-service';
import Modal from "react-modal";
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { getImageClientS3URL } from '@/utils/axios';
import { deleteFileFromS3, generateSignedUrlOfProjectAttachment } from '@/actions';
import ReactLoader from '@/components/react-loading';

interface OverViewProps {
  id: any;
  userEmail: any;
  fullName: string;
}
const ProjectImages: React.FC<OverViewProps> = ({ id, userEmail, fullName }) => {
  const t = useTranslations('ProjectsPage');
  const h = useTranslations('ToastMessages');
  const { data, isLoading, error, mutate } = useSWR(`/admin/attachments/${id}`, getAttachmentsData)
  const arrays = data?.data?.data

  const attachments = arrays?.filter((attachment: any) => attachment?.type === "Progress");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setUrl] = useState<any>("");
  const [loading, setLoading] = useState(false);

  const deleteAttachments = async (id: any, s3Url: string) => {
    try {
      const response = await deleteAttachmentsData(`/admin/attachments/${id}`);
      if (response.status === 200) {
        await deleteFileFromS3(s3Url)
        toast.success(t("attachments deleted successfully"));
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
    setLoading(true)
    try {
      const { signedUrl: uploadUrl } = await generateSignedUrlOfProjectAttachment(file.name, file.type, userEmail)
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })
      const url = `projects/${userEmail}/attachments/${file.name as string}`
      const attachments = { url, type: "Progress", fullName };
      const response = await addAttachmentsData(`/admin/attachments/${id}`, attachments)
      if (response?.status === 201) {
        toast.success(h("Note added successfully"));
        setIsModalOpen(false);
        mutate()
      } else {
        toast.error(h("Failed to add Note"));
      }
    } catch (error) {
      toast.error('Der opstod en fejl');
    }
    finally {
      setLoading(false)
    }
  }
  return (
    <div className=''>
      {attachments?.map((index: any) => {
        const fileName = index.url.replace('users/', '').replace(`${userEmail}/`, '').replace('projects/', '').replace(`attachments/`, '')
        return (
          <div key={index?._id} className="flex justify-between items-center mb-5">
            <div className='flex items-center gap-3 ' onClick={() => {
              window.open(getImageClientS3URL(index?.url), '_blank')
            }}>
              <div><Image src={doc} alt='' width={35} height={35} /> </div>
              <div>
                <p className="text-[#43527B] text-sm  ">{fileName}</p>
                <p className="text-[#8B8E98] text-xs mt-1  ">
                  Uploaded by {index?.fullName} <span className='ml-5'>Time: {new Date(index?.createdAt).toLocaleString()} </span>
                </p>
              </div>
            </div>
            <div className="flex gap-[6px] cursor-pointer ">
              <div onClick={() => {
                window.open(getImageClientS3URL(index?.url), '_blank')
              }
              } ><DownloadIcon /></div>
              <button onClick={() => deleteAttachments(index?._id, index.url)}><DeleteIcon /> </button>
            </div>
          </div>
        )
      }
      )}
      <div className="">
        <button onClick={() => setIsModalOpen(true)} className="w-full button !h-[40px] "> <EditButtonIcon />
          {t('uploadNewFile')}
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        bodyOpenClassName='overflow-hidden'
        contentLabel="Add Attachments Details"
        className="modal max-w-[600px] bg-white mx-auto rounded-[20px] w-full max-h-[90vh] "
        overlayClassName="w-full h-full p-3 fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
        ariaHideApp={false}>
        <div className='overflow-y-auto overflow-custom p-5'>
          <h2 className="mb-2 ">{t('addNewAttachment')}</h2>
          <form onSubmit={handleSubmit} className="fomm-wrapper">
            <input type="file" name="url" required onChange={(e) => {
              setUrl(e.target.files![0] as any)
            }} />
            <button disabled={loading} type="submit" className='button w-full mt-5'>{!loading ? <><AddFileIcon /> {t('addAttachment')}</> : <ReactLoader />}</button>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default ProjectImages;
