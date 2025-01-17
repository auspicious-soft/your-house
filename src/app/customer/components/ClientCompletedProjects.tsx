"use client"
import { DeleteIcon, EditIcon, NextLabel, PreviousLabel, ViewIcon } from '@/utils/svgicons';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Image, {StaticImageData} from 'next/image';
import ReactPaginate from 'react-paginate';
import ReactLoading from 'react-loading';
import imgs from '@/assets/images/avatar.png'
import { useTranslations } from 'next-intl';
import TableRowImage from '@/components/table-row-img';
import { getImageClientS3URL } from '@/utils/axios';
import profile from "@/assets/images/profile.png";

interface CompletedProps {
  projectsData: any;
  mutate: any;
  isLoading: boolean;
  setQuery: any;
  error: any;
  isEmployee?: boolean;
}

const ClientCompletedProjects: React.FC<CompletedProps> = ({projectsData, mutate, isLoading, setQuery, error, isEmployee = false}) => {
  const projects = projectsData?.data;
  const total = projectsData?.total ?? 0;
  const router = useRouter();
  const t = useTranslations('ProjectsPage'); 

  const rowsPerPage = 10;
  const handlePageClick = (selectedItem: { selected: number }) => {
    setQuery(`page=${selectedItem.selected + 1}&limit=${rowsPerPage}`)
  }
  const EditProjectData =(id: string) => {
    router.push(`/${isEmployee ? 'employee' : 'customer'}/${isEmployee ? 'dashboard/' : ''}projects/project-profile/${id}`);
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
              <td>{row?.identifier} </td>
              <td><TableRowImage image={row?.projectimageLink ? getImageClientS3URL(row?.projectimageLink): profile} /></td>
              <td>{row?.projectName}</td>
              <td>{row?.projectstartDate}</td>
              <td>{row?.projectendDate}</td>
              <td><button onClick={()=>EditProjectData(row?._id)}><ViewIcon /> </button></td>
            </tr>
          ))
        ) : (
          <tr >
            <td className='bg-white' colSpan={6} >{isLoading ? <ReactLoading type={'spin'} color={'#26395e'} height={'20px'} width={'20px'} /> : <p>{t('noDataFound')}</p>}</td>
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
export default ClientCompletedProjects;
