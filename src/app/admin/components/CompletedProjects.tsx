"use client"
import { DeleteIcon, EditIcon, NextLabel, PreviousLabel } from '@/utils/svgicons';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import ReactLoading from 'react-loading';
import ReactPaginate from 'react-paginate';
import DeleteDataModal from './DeleteDataModal';
import { deleteProject } from '@/services/admin/admin-service';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import TableRowImage from '@/components/table-row-img';
import { getImageClientS3URL } from '@/utils/axios';
import { deleteFileFromS3 } from '@/actions';

interface CompleteProps {
  projectsData: any;
  mutate: any;
  isLoading: boolean;
  error: any;
  setQuery: any;
}

const CompletedProjects: React.FC<CompleteProps> = ({ projectsData, mutate, isLoading, error, setQuery }) => {
  const projects = projectsData?.data;
  const total = projectsData?.total ?? 0;
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const t = useTranslations('ProjectsPage');
  const [selectedProjectImage, setSelectedProjectImage] = useState('')
  const rowsPerPage = 10;
  const handlePageClick = (selectedItem: { selected: number }) => {
    setQuery(`page=${selectedItem.selected + 1}&limit=${rowsPerPage}`)
  }

  const EditProjectData = (id: string) => {
    router.push(`/admin/projects/project-profile/${id}`);
  }
  const openDeleteModal = (id: string, imageLink: string) => {
    setIsDeleteModalOpen(true);
    setSelectedId(id);
    setSelectedProjectImage(imageLink)
  };
  const handleDelete = async () => {
    try {
      const response = await deleteProject(`/admin/project/${selectedId}`);
      if (response.status === 200) {
        toast.success("Client deleted successfully");
        await deleteFileFromS3(selectedProjectImage)
        setIsDeleteModalOpen(false);
        mutate()
      } else {
        toast.error("Failed to delete Client");
      }
    } catch (error) {
      console.error("Error deleting Client", error);
      toast.error("An error occurred while deleting the Client");
    }
  }

  //const paginatedData = data.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);

  return (
    <div>
      <div className="table-common overflo-custom mt-[20px] box-shadow">
        <table>
          <thead>
            <tr>
              <th>{t('projectId')}</th>
              <th>{t('image')}</th>
              <th>{t('projectName')}</th>
              <th>{t('startDate')}</th>
              <th>{t('expectedEndDate')}</th>
              <th>{t('action')}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="">
                  {t('loading')}...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="text-center text-red-500 ">
                  {t('errorLoadingData')}.
                </td>
              </tr>
            ) : projects?.length > 0 ? (
              projects?.map((row: any) => (
                <tr key={row?._id}>
                  <td>{row?._id}</td>
                  <td><TableRowImage image={getImageClientS3URL(row?.projectimageLink)} /></td>
                  <td>{row?.projectName}</td>
                  <td>{row?.projectstartDate}</td>
                  <td>{row?.projectendDate}</td>
                  <td>
                    <div className='flex items-center gap-[6px] '>
                      <button onClick={() => EditProjectData(row?._id)}><EditIcon /> </button>
                      <button onClick={() => openDeleteModal(row?._id, row?.projectimageLink)}><DeleteIcon /> </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className='w-full flex justify-center p-3 items-center' colSpan={4} >{isLoading ? <ReactLoading type={'spin'} color={'#26395e'} height={'20px'} width={'20px'} /> : <p className='text-center'>{t('noDataFound')}</p>}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="text-right mt-4">
        <ReactPaginate
          previousLabel={<PreviousLabel />}
          nextLabel={<NextLabel />}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={Math.ceil(total / rowsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'inline-flex mt-[34px] gap-1'}
          pageClassName={' text-[#3C3F88] border border-{#F1F1F1} bg-white rounded-full'}  // anchor tag
          pageLinkClassName={'grid place-items-center h-10 w-10  inline-block'}
          activeClassName={'!bg-[#1657FF] active rounded-full text-white'} // active anchor
          previousClassName={'leading-[normal]  '}
          previousLinkClassName={'grid place-items-center h-10 w-10 inline-block border border-{#F1F1F1} bg-white rounded-full'}
          nextLinkClassName={'grid place-items-center h-10 w-10 inline-block border border-{#F1F1F1} bg-white rounded-full'}
          disabledClassName={'opacity-50 cursor-not-allowed'}
        />
      </div>
      <DeleteDataModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={t('areYouSureMessage')}
        handleDelete={handleDelete}
      />
    </div>
  );
};
export default CompletedProjects;
