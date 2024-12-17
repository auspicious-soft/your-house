"use client"
import { DeleteIcon, EditIcon, NextLabel, PreviousLabel } from '@/utils/svgicons';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import ReactLoading from 'react-loading';
import ReactPaginate from 'react-paginate';
import DeleteDataModal from './DeleteDataModal';
import { deleteProject } from '@/services/admin/admin-service';
import { toast } from 'sonner';

interface CompleteProps {
  projectsData: any;
  mutate: any;
  isLoading: boolean;
  error: any;
  setQuery: any;
}

const CompletedProjects: React.FC<CompleteProps> = ({projectsData, mutate, isLoading, error, setQuery}) => {
const projects = projectsData?.data;
const total = projectsData?.total ?? 0;
const router = useRouter();
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [selectedId, setSelectedId] = useState('');


const rowsPerPage = 10;
const handlePageClick = (selectedItem: { selected: number }) => {
  setQuery(`page=${selectedItem.selected + 1}&limit=${rowsPerPage}`)
}

  const EditProjectData =(id: string) => {
    router.push(`/admin/projects/project-profile/${id}`);
   }
   const openDeleteModal = (id: string) => {
    setIsDeleteModalOpen(true);
    setSelectedId(id);
  };
  const handleDelete = async () => {
    try {
      const response = await deleteProject(`/admin/project/${selectedId}`); 
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
  
  //const paginatedData = data.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);

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
         {isLoading ? (
              <tr>
                <td colSpan={5} className="">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="text-center text-red-500 ">
                  Error loading data.
                </td>
              </tr>
            ) : projects?.length > 0 ? (
              projects?.map((row: any) => (
            <tr key={row?._id}>
              <td>{row?._id}</td>
              <td>{row?.projectimageLink}</td>
              <td>{row?.projectName}</td>
              <td>{row?.projectstartDate}</td>
              <td>{row?.projectendDate}</td>
              <td>
                <div className='flex items-center gap-[6px] '>
                  <button onClick={()=>EditProjectData(row?._id)}><EditIcon /> </button>
                  <button onClick={() => openDeleteModal(row?._id)}><DeleteIcon/> </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td className='w-full flex justify-center p-3 items-center' colSpan={4} >{isLoading ? <ReactLoading type={'spin'} color={'#26395e'} height={'20px'} width={'20px'} /> : <p className='text-center'>No data found</p>}</td>
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
      title='Are you sure you want to delete this project?'
      handleDelete={handleDelete}
      />
    </div>
  );
};
export default CompletedProjects;
