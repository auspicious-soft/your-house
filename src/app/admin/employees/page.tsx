"use client"
import { AddIcon, DeleteIcon, EditIcon, NextLabel, PreviousLabel } from '@/utils/svgicons';
import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import imgs from '@/assets/images/avatar.png'
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { deleteEmployee, getAllEmployees } from '@/services/admin/admin-service';
import ReactLoading from 'react-loading';
import DeleteDataModal from '../components/DeleteDataModal';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import TableRowImage from '@/components/table-row-img';
import { getImageClientS3URL } from '@/utils/axios';
import { deleteFileFromS3 } from '@/actions'; 
import profile from "@/assets/images/profile.png";
import AddNewEmployee from '../components/AddNewEmployee';
import EmployeeProfile from '../components/EmployeeProfile';
import SearchBar from '../components/SearchBar';



const Page: React.FC = () => {
  const t = useTranslations('ProjectsPage');
  const h = useTranslations('ToastMessages');
  const router = useRouter();
  const [query, setQuery] = useState('page=1&limit=10');
  const { data, error, mutate, isLoading } = useSWR(`/admin/employee`, getAllEmployees)
  const employeeData = data?.data?.data;

  const [selectedProfileModal, setSelectedProfileModal] = useState(false); 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(''); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const total = data?.data?.total ?? 0;
  const rowsPerPage = 10;
  const handlePageClick = (selectedItem: { selected: number }) => {
    setQuery(`page=${selectedItem.selected + 1}&limit=${rowsPerPage}`)
  }

  const openDeleteModal = (id: string) => {
    setIsDeleteModalOpen(true);
    setSelectedId(id); 
  };

  const handleDelete = async () => {
    try {
       const response = await deleteEmployee(`/admin/employee/${selectedId}`);
      if (response.status === 200) {
        toast.success(h("deleted successfully"));
        // await deleteFileFromS3(selectedProfilePic)
        setIsDeleteModalOpen(false);
        mutate()
      } else {
        toast.error(h("Failed To Delete Client"));
      }
    } catch (error) { 
       toast.error(h("an Error Occurred While Deleting The Client"));
    }
  }
  const openProfile = (id: string) => {
    setSelectedProfileModal(true);  
    setSelectedId(id); 
    // router.push(`/admin/employees/profile/${id}`);
  };

  const addNewClient = () => {
    setIsModalOpen(true); 
  }

  return (
    <div>
       <div className='flex gap-2.5 justify-end '>
        <SearchBar setQuery={setQuery}/>
          <button className='!rounded-[3px] !h-[37px] button !px-4 ' onClick={addNewClient}><AddIcon className="w-4 h-4" />{t('Add New Employee')}</button>
        </div>
      <div className="table-common overflo-custom mt-[20px] box-shadow">
        <table>
          <thead>
            <tr> 
              <th>{t('Name of the employee')}</th>
              <th>{t('email')}</th>
              <th>{t('phone')}</th> 
              <th>{t('action')}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="">
                  {t('loading')}...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-center text-red-500 ">
                  {t('errorLoadingData')}.
                </td>
              </tr>
            ) : employeeData?.length > 0 ? (
                employeeData.map((row: any) => (
                <tr key={row?._id}>
                  <td>{row?.fullName} </td>
                  <td>{row?.email}</td>
                  <td>{row?.phoneNumber}</td>
                  <td>
                    <div className='flex items-center gap-[6px] '>
                      <button onClick={() => openProfile(row?._id)}><EditIcon /> </button>
                      <button onClick={() => openDeleteModal(row?._id)}><DeleteIcon /> </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td  colSpan={6} >{isLoading ? <ReactLoading type={'spin'} color={'#26395e'} height={'20px'} width={'20px'} /> : <p>{t('noDataFound')}</p>}</td>
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
        title={t('deleteMsgCustomer')}
        handleDelete={handleDelete}
      />
      <AddNewEmployee
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mutate={mutate}
      />
      <EmployeeProfile
      isOpen={selectedProfileModal}
      onClose={()=>setSelectedProfileModal(false)}
      employeeId={selectedId}
      mutate={mutate}
      />

    </div>
  );
};

export default Page;
