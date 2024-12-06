"use client"
import { DeleteIcon, EditIcon, NextLabel, PreviousLabel, ViewIcon } from '@/utils/svgicons';
import Image, {StaticImageData} from 'next/image';
import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import imgs from '@/assets/images/avatar.png'
import { useRouter } from 'next/navigation';

interface OnGoingProps {
  projectsData: any;
  mutate: any;
  isLoading: boolean;
  setQuery: any;
  error: any;
}

const ClientOnGoingProjects: React.FC<OnGoingProps> = ({projectsData, mutate, isLoading, setQuery, error}) => {
  const router = useRouter();
 
  const data = [
    { id: '#123', apptDate: '26 July 2023', renewalDate: '04 Jan 2025', chatWithClinician: 'Yes', videoChat: 'Yes', billingAmount: '$25.00' },
    { id: '#124', apptDate: '26 July 2023', renewalDate: 'Renew Subscription', chatWithClinician: 'Yes', videoChat: 'Yes', billingAmount: '$25.00' },
    { id: '#125', apptDate: '26 July 2023', renewalDate: '04 Jan 2025', chatWithClinician: 'No', videoChat: 'No', billingAmount: '$25.00' },
    { id: '#126', apptDate: '26 July 2023', renewalDate: '04 Jan 2025', chatWithClinician: 'Yes', videoChat: 'Yes', billingAmount: '$25.00' },
    { id: '#127', apptDate: '26 July 2023', renewalDate: 'Renew Subscription', chatWithClinician: 'Yes', videoChat: 'Yes', billingAmount: '$25.00' },
    { id: '#128', apptDate: '26 July 2023', renewalDate: '04 Jan 2025', chatWithClinician: 'No', videoChat: 'No', billingAmount: '$25.00' },

  ];
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 2;

  // Pagination handler
  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  const paginatedData = data.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);

   const EditProjectData =(id: string) => {
    router.push(`/customer/projects/project-profile/${id}`);
   }


  return (
    <div>
    <div className="table-common overflo-custom mt-[20px] box-shadow">
      <table>
        <thead>
          <tr>
            <th>Project ID</th>
            <th>Image</th>
            <th>Name of the project</th>
            <th>Starting Date</th>
            <th>Estimated End Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
          paginatedData.map((row, index) => (
            <tr key={index}>
              <td>{row.id} </td>
              <td><Image src={imgs} alt='fgfdg' width={50} height={50}/> </td>
              <td>{row.renewalDate}</td>
              <td>{row.chatWithClinician}</td>
              <td>{row.videoChat}</td>
              <td>
                <div className=''>
                  <button onClick={()=>EditProjectData(row.id)}><ViewIcon/> </button>
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
export default ClientOnGoingProjects;
