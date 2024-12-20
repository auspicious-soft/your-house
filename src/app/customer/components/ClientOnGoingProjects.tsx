"use client"
import { DeleteIcon, EditIcon, NextLabel, PreviousLabel, ViewIcon } from '@/utils/svgicons';
import Image, {StaticImageData} from 'next/image';
import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import imgs from '@/assets/images/avatar.png'
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ReactLoading from 'react-loading';
import { useTranslations } from 'next-intl';

interface OnGoingProps {
  projectsData: any;
  mutate: any;
  isLoading: boolean;
  setQuery: any;
  error: any;
}

const ClientOnGoingProjects: React.FC<OnGoingProps> = ({projectsData, mutate, isLoading, setQuery, error}) => {
  const projects = projectsData?.data;
  const total = projectsData?.total ?? 0;
  const router = useRouter(); 
  const t = useTranslations('ProjectsPage'); 
  const rowsPerPage = 10;
  const handlePageClick = (selectedItem: { selected: number }) => {
    setQuery(`page=${selectedItem.selected + 1}&limit=${rowsPerPage}`)
  }
  const EditProjectData =(id: string) => {
    router.push(`/customer/projects/project-profile/${id}`);
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
            ) : projects?.length > 0 ? (
              projects?.map((row: any) => (
            <tr key={row?._id}>
              <td>{row?._id} </td>
              <td><Image src={imgs} alt='fgfdg' width={50} height={50}/> </td>
              <td>{row?.projectName}</td>
              <td>{row?.projectstartDate}</td>
              <td>{row?.projectendDate}</td>
              <td><button onClick={()=>EditProjectData(row?._id)}><EditIcon /> </button></td>
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
          previousLabel={<PreviousLabel/>}
          nextLabel={<NextLabel/>}
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
      
    </div>
  );
};
export default ClientOnGoingProjects;
