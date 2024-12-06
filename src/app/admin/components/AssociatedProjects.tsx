"use client"
import { DeleteIcon, EditIcon, NextLabel, PreviousLabel } from '@/utils/svgicons';
import Image, {StaticImageData} from 'next/image';
import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import imgs from '@/assets/images/avatar.png'
import { useRouter } from 'next/navigation';
import { deleteProject } from '@/services/admin/admin-service';
import { toast } from 'sonner';
import DeleteDataModal from './DeleteDataModal';

interface ProjectsProps {
 data: any;
 setQuery: any;
 mutate: any;
}
const AssociatedProjects: React.FC<ProjectsProps> = ({data, setQuery, mutate}) => {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  const total = data?.length ?? 0;
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
          data?.map((row: any) => (
            <tr key={row?._id}>
              <td>{row?._id} </td>
              <td><Image src={row.img} alt='project' width={50} height={50}/> </td>
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
export default AssociatedProjects;
