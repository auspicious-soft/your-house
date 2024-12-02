import React from 'react';
import Modal from "react-modal";
import VideoPlayer from './VideoPlayer';



interface DeleteModalProps {
    onClose: () => void;
    isOpen: boolean;
}
const DeleteDataModal:React.FC<DeleteModalProps> = ({onClose, isOpen}) => {
    return (
        <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Delete Details"
        className=" overflow-hidden relative z-10 max-w-[638px] py-9 px-8 bg-white mx-auto rounded-[20px] w-full max-h-[90vh] overflow-auto overflow-custom"
        overlayClassName="w-full h-full p-3 fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
        ariaHideApp={false}
      >
        <div className='delete-modal-bg flex px-[19px] items-center gap-[26px] mb-[60px] '>
        <VideoPlayer url='/assets/videos/delete.mp4' className='max-w-[108px] mix-blend-multiply '/>
        <h2 className='main-heading text-right w-[calc(100%-134px)]  '>Are you sure you want to delete this project?</h2>
        </div>
        <div className='grid grid-cols-[1fr,1.5fr] gap-2.5 '>
            <button className='text-[#1657FF] border border-[#1657FF] bg-white h-[50px] py-2 rounded-[50px] text-xl font-sfproDisplaybold '>Confirm </button>
            <button onClick={onClose} className='bg-[#FF16A2] text-white h-[50px] py-2 rounded-[50px] text-xl font-sfproDisplaybold '>No, Keep It</button>
        </div>
    </Modal>
    );
}

export default DeleteDataModal;
