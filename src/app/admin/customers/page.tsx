"use client"
import { DeleteIcon, EditIcon, NextLabel, PreviousLabel } from '@/utils/svgicons';
import Image, {StaticImageData} from 'next/image';
import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import imgs from '@/assets/images/avatar.png'
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { deleteUsers, getAllUsers } from '@/services/admin/admin-service';
import ReactLoading from 'react-loading';
import DeleteDataModal from '../components/DeleteDataModal';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';


const Page: React.FC = () => {
  const t = useTranslations('ProjectsPage'); 

  const router = useRouter();
  const [query, setQuery] = useState('page=1&limit=10');
  const {data, error, mutate, isLoading} = useSWR(`/admin/users`, getAllUsers)
  const usersData = data?.data?.data;
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [selectedId, setSelectedId] = useState('');


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
      const response = await deleteUsers(`/admin/users/${selectedId}`); 
      if (response.status === 200) {
        toast.success("Client deleted successfully");
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
   const openProfile = (id:string) => { 
    router.push(`/admin/customers/profile/${id}`);
  };
  

  return (
    <div>
    <div className="table-common overflo-custom mt-[20px] box-shadow">
      <table>
        <thead>
          <tr>
            <th>{t('image')}</th>
            <th>{t('name')}</th>
            <th>{t('email')}</th>
            <th>{t('phone')}</th>
            <th>{t('address')}</th>
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
            ) : usersData?.length > 0 ? (
          usersData.map((row: any) => (
            <tr key={row?._id}>
              <td><Image src={row?.profilePi} alt='profile' width={50} height={50}/> </td>
              <td>{row?.fullName} </td>
              <td>{row?.email}</td>
              <td>{row?.phoneNumber}</td>
              <td>{row?.address}</td>
              <td>
                <div className='flex items-center gap-[6px] '>
                  <button onClick={()=>openProfile(row?._id)}><EditIcon /> </button>
                  <button onClick={() => openDeleteModal(row?._id)}><DeleteIcon/> </button>
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
      <DeleteDataModal
      isOpen={isDeleteModalOpen}
      onClose={() =>setIsDeleteModalOpen(false)}
      title={t('deleteMsgCustomer')}
      handleDelete={handleDelete}
      />
    </div>
  );
};

export default Page;
