import React, { useState } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';
import { axiosInstance } from '@/utils/axios';
import { getTabsData } from '@/services/admin/admin-service';
import { CrossIcon } from '@/utils/svgicons';
import { useTranslations } from 'next-intl';

const DynamicTabs = ({ onTabChange }: any) => {
    const t = useTranslations('ProjectsPage');
    const { data: dynamicTabs, error, mutate } = useSWR('/tabs', getTabsData);
    const [isAddingTab, setIsAddingTab] = useState(false);
    const [newTabName, setNewTabName] = useState('');
    // Fixed tabs that cannot be removed
    const fixedTabs = ['Drawings', 'Progress', 'Notes'];
    // Fetch dynamic tabs
    const [activeTab, setActiveTab] = useState(fixedTabs[0]);
    const handleAddTab = async (e: any) => {
        e.preventDefault();
        if (!newTabName.trim()) return;
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

    // Combine fixed and dynamic tabs
    const allTabs = [...fixedTabs, ...(dynamicTabs?.data?.data || [])?.map((tab: any) => tab.name)];

    const handleTabClick = (tab: any) => {
        setActiveTab(tab);
        onTabChange(tab);
    };

    if (error) {
        return toast.error('Error fetching tabs');
    }

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-2.5 items-center">
                {allTabs.map((tab, index) => {
                   return (
                        <button
                            key={tab}
                            className={`text-base flex justify-between items-center gap-3 rounded-[5px] py-2 px-4 font-sfproDisplaymedium transition-all duration-300 ${activeTab === tab 
                                ? "text-white bg-[#3C3F88]"
                                : "text-[#8B8E98] bg-[#F4F5F7]"
                                }`}
                            onClick={() => handleTabClick(tab)}
                        >
                            {index < 2 ? t(tab) :  tab} 
                        </button>
                    )
                })}

                <button
                    onClick={() => setIsAddingTab(true)}
                    className="text-base rounded-[5px] py-2 px-4 bg-[#F4F5F7] text-[#8B8E98] hover:bg-[#E4E4E4] transition-all duration-300"
                >
                    +
                </button>
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
                            className="px-4 py-2 bg-[#3C3F88] text-white rounded-[5px]"
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
        </div>
    );
};

export default DynamicTabs;