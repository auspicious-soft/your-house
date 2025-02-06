"use client"
import { DeleteIcon, EditIcon, NextLabel, PreviousLabel } from '@/utils/svgicons';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import DeleteDataModal from './DeleteDataModal';
import { toast } from 'sonner';
import { deleteProject } from '@/services/admin/admin-service';
import ReactLoading from 'react-loading';
import { useTranslations } from 'next-intl';
import { getImageClientS3URL } from '@/utils/axios';
import TableRowImage from '@/components/table-row-img';
import profile from "@/assets/images/profile.png";

interface recentProjectsProps {
  recentProjects: any;
  mutate: any;
  isLoading: boolean;
  error: any;
  setQuery: any;
}

const RecentProjects: React.FC<recentProjectsProps> = ({ recentProjects, mutate, isLoading, error, setQuery }) => {
  const total = recentProjects?.total ?? 0;
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const t = useTranslations('ProjectsPage');
  const h = useTranslations('ToastMessages');
  const rowsPerPage = 10;
  const handlePageClick = (selectedItem: { selected: number }) => {
    setQuery(`page=${selectedItem.selected + 1}&limit=${rowsPerPage}`)
  }
  // const rowsPerPage = 10;

  // const handlePageClick = (selectedItem: { selected: number }) => {
  //   setQuery(`page=${selectedItem.selected + 1}&limit=${rowsPerPage}`)
  // }
  //const paginatedData = data.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);

  const openDeleteModal = (id: string) => {
    setIsDeleteModalOpen(true);
    setSelectedId(id);
  };
  const handleDelete = async () => {
    try {
      const response = await deleteProject(`/admin/project/${selectedId}`);
      if (response.status === 200) {
        toast.success(h("Client deleted successfully"));
        setIsDeleteModalOpen(false);
        mutate()
      } else {
        toast.error(h("Failed To Delete Client"));
      }
    } catch (error) {
      toast.error(h("an Error Occurred While Deleting The Client"));
    }
  }
  const EditProjectData = (id: string) => {
    router.push(`/admin/projects/project-profile/${id}`);
  }


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
            ) : recentProjects?.length > 0 ? (
              recentProjects?.map((row: any) => (
                <tr key={row?._id}>
                  <td>{row?.identifier}</td>
                  <td><TableRowImage image={row?.projectimageLink?  getImageClientS3URL(row?.projectimageLink) : profile} /></td>
                  <td>{row?.projectName}</td>
                  <td>{row?.projectstartDate}</td>
                  <td>{row?.projectendDate}</td>
                  <td>
                    <div className='flex items-center gap-[6px] '>
                      <button onClick={() => EditProjectData(row?._id)}><EditIcon /> </button>
                      <button onClick={() => openDeleteModal(row?._id)}><DeleteIcon /> </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr >
                <td colSpan={6} className='border-2'>{isLoading ? <ReactLoading type={'spin'} color={'#1657FF'} height={'20px'} width={'20px'} /> : <p >{t('noDataFound')}</p>}</td>
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

export default RecentProjects;
