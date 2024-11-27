"use client"
import { DeleteIcon, EditIcon, NextLabel, PreviousLabel } from '@/utils/svgicons';
import Image, {StaticImageData} from 'next/image';
import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import imgs from '@/assets/images/avatar.png'
import { useRouter } from 'next/navigation';

interface BillingData {
  id: string;
  img: string | StaticImageData ;
  renewalDate: string;
  chatWithClinician: string;
  videoChat: string;
  billingAmount: string;
}

const Page: React.FC = () => {
  const router = useRouter();
  // Dummy data
  const data: BillingData[] = [
    { id: '123', img: imgs, renewalDate: '04 Jan 2025', chatWithClinician: 'Yes', videoChat: 'Yes', billingAmount: '$25.00' },
    { id: '124', img: imgs, renewalDate: 'Renew Subscription', chatWithClinician: 'Yes', videoChat: 'Yes', billingAmount: '$25.00' },
    { id: '125', img: imgs, renewalDate: '04 Jan 2025', chatWithClinician: 'No', videoChat: 'No', billingAmount: '$25.00' },
    { id: '126', img: imgs, renewalDate: '04 Jan 2025', chatWithClinician: 'Yes', videoChat: 'Yes', billingAmount: '$25.00' },
 
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 2;

  // Pagination handler
  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  const paginatedData = data.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);

   const EditProjectData =(id: string) => {
    router.push(`/admin/projects/project-profile/${id}`);
   }
   const openProfile = (id:string) => { 
    router.push(`/admin/customers/profile/${id}`);
  };
  

  return (
    <div>
    <div className="table-common overflo-custom mt-[20px]">
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name of the client</th>
            <th>Email Address</th>
            <th>Phone Number</th>
            <th>Home Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
          paginatedData.map((row, index) => (
            <tr key={index}>
              <td><Image src={row.img} alt='fgfdg' width={50} height={50}/> </td>
              <td>{row.id} </td>
              <td>{row.renewalDate}</td>
              <td>{row.chatWithClinician}</td>
              <td>{row.videoChat}</td>
              <td>
                <div className='flex items-center gap-[6px] '>
                  <button onClick={()=>openProfile(row.id)}><EditIcon /> </button>
                  <button><DeleteIcon/> </button>
                </div>
              </td>
            </tr>
          ))
          }
        </tbody>
      </table>
      </div>
      <div className="text-right mt-4">
        <ReactPaginate
          previousLabel={<PreviousLabel/>}
          nextLabel={<NextLabel/>}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={Math.ceil(data.length / rowsPerPage)}
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

export default Page;
