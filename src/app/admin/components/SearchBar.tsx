import { SearchIcon } from '@/utils/svgicons';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
interface SearchBarProps {
    setQuery: React.Dispatch<React.SetStateAction<string>>
}

const SearchBar = (props: SearchBarProps) => {
    const t = useTranslations('EnterOTPPage');
    const { setQuery } = props;
    const [inputValue, setInputValue] = useState('');
    useEffect(() => {
        const handler = setTimeout(() => {
            setQuery(`${inputValue ? 'description=' :''}${inputValue.trim()}`);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [inputValue, setQuery]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };
    return (
        <div className='w-[280px]'>
            <label htmlFor="" className='relative flex w-full '>
            <input type="search" value={inputValue} onChange={handleInputChange}
             name="" id="" placeholder={t("Search")} className='!h-[37px] placeholder:text-[#8B8E98] w-full px-5 pl-[40px] focus-visible:outline-none bg-white rounded-[3px] py-2  text-[#3B3F88] '/>
            <span className='absolute left-[15px] top-[13px] '><SearchIcon /> </span> 
            </label>
        </div>
    );
}

export default SearchBar;
