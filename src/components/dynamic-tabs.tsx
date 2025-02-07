import React, { useState, useTransition } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';
import { axiosInstance } from '@/utils/axios';
import { deleteTabData, getTabsData } from '@/services/admin/admin-service';
import { CrossIcon } from '@/utils/svgicons';
import { useTranslations } from 'next-intl';
import Modal from 'react-modal'
import ReactLoader from './react-loading';

const DynamicTabs = ({ onTabChange, disableAdd = false }: any) => {
    const t = useTranslations('ProjectsPage');
    const { data: dynamicTabs, error, mutate } = useSWR('/tabs', getTabsData);
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [selectedTabToDelete, setSelectedTabToDelete] = useState('')
    const [isAddingTab, setIsAddingTab] = useState(false);
    const [newTabName, setNewTabName] = useState('')
    const [isPending, startTransition] = useTransition()
    // Fixed tabs that cannot be removed
    const fixedTabs = ['Drawings', 'Progress', 'Notes'];
    // Fetch dynamic tabs
    const [activeTab, setActiveTab] = useState('');
    const handleAddTab = async (e: any) => {
        e.preventDefault();
        if (!newTabName.trim()) return;
        if (newTabName.length > 20) return toast.error('Tab name should be less than 20 characters');
        if (allTabs.includes(newTabName)) return toast.error('Tab name already exists');
        try {
            const response = await axiosInstance.post('/tabs', { name: newTabName, type: 'dynamic' });
            if (response.status !== 201) {
                return toast.error('Failed to add tab');
            }
            mutate();
            setNewTabName('');
            setIsAddingTab(false);
        } catch (error) {
            console.error('Error adding tab:', error);
        }
    };
    const tabsFromApi = dynamicTabs?.data?.data;
    // Combine fixed and dynamic tabs
    const allTabs = [...fixedTabs, ...(tabsFromApi || [])?.map((tab: any) => tab.name)];

    const handleTabClick = (tab: any) => {
        setActiveTab(tab);
        onTabChange(tab);
    }

    if (error) {
        return toast.error('Error fetching tabs');
    }
    const handleDeleteClick = async () => {
        const deleteTabName = selectedTabToDelete;
        const deleteTabId = tabsFromApi.find((tab: any) => tab.name.toString() === deleteTabName.toString())._id

        startTransition(async () => {
            try {
                const response = await deleteTabData(`/tabs/${deleteTabId}`)
                if (response.status !== 200) {
                    toast.error('Failed to delete tab');
                }
                toast.success('Tab deleted successfully');
                setDeleteOpen(false)
                setActiveTab(fixedTabs[0]);
                mutate()
            } catch (error) {
                toast.error('Error deleting tab');
            }
        });
    }
    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-2.5 items-center">
                {allTabs.map((tab, index) => {
                    return (
                        <div key={tab} className="relative">
                            <button
                                key={tab}
                                className={`text-base flex justify-between items-center gap-3 rounded-[5px] py-2 px-4 font-sfproDisplaymedium transition-all duration-300 ${activeTab === tab
                                    ? "text-white bg-[#1657ff]"
                                    : "text-[#8B8E98] bg-[#F4F5F7]"
                                    }`}
                                onClick={() => handleTabClick(tab)}
                            >
                                {index < 2 ? t(tab) : tab}
                            </button>
                            {index > 2 && (
                                <button
                                    onClick={() => {
                                        setSelectedTabToDelete(tab)
                                        setDeleteOpen(true)
                                    }}
                                    className="absolute -top-2 -right-2 border rounded-full"
                                >
                                    <CrossIcon />
                                </button>
                            )}
                        </div>
                    )
                })}

                {!disableAdd && <button
                    onClick={() => setIsAddingTab(true)}
                    className={`${isAddingTab ? 'bg-gray-400' : ''} text-base rounded-[5px] py-2 px-4 bg-[#F4F5F7] text-[#8B8E98] hover:bg-[#E4E4E4] transition-all duration-300`}
                >
                    +
                </button>}
            </div>

            {isAddingTab && (
                <div className="mt-4 p-4 bg-[#F4F5F7] rounded-[5px]">
                    <form onSubmit={handleAddTab} className="flex gap-2">
                        <input
                            type="text"
                            value={newTabName}
                            onChange={(e) => setNewTabName(e.target.value)}
                            placeholder="Enter tab name"
                            className="flex-1 px-3 py-2 rounded-[5px] border border-[#E9EDF3]"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#1657ff] text-white rounded-[5px]"
                        >
                            Add Tab
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsAddingTab(false)}
                            className="px-4 py-2 bg-[#F4F5F7] text-[#8B8E98] rounded-[5px] border border-[#E9EDF3]"
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            {
                deleteOpen && <Modal
                    isOpen={deleteOpen}
                    onRequestClose={() => setDeleteOpen(false)}
                    contentLabel="Edit Client Details"
                    className="modal mx-auto w-full max-h-[90vh] overflow-auto overflow-custom"
                    overlayClassName="w-full h-full p-3 fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                    ariaHideApp={false}
                >

                    <div className='bg-white p-4 max-w-[400px] rounded-lg  mx-auto'>
                        <h2 className="text-lg font-normal mb-4">Are you sure you want to delete this tab?</h2>
                        <p className='py-2 pb-4 text-gray-400'> The associated attachments will also be deleted</p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setDeleteOpen(false)}
                                className="px-4 py-2 text-gray-700 rounded-[5px] font-semibold"
                            >
                                Cancel
                            </button>
                            {!isPending ? <button
                                onClick={handleDeleteClick}
                                className="px-4 py-2 bg-red-600 text-white rounded-[5px]"
                            >
                                Delete
                            </button>
                                :
                                <ReactLoader />
                            }
                        </div>
                    </div>
                </Modal>
            }
        </div>
    );
};

export default DynamicTabs;