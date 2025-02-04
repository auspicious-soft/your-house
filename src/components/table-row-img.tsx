import React from 'react'
import Image from "next/image";
import { StaticImageData } from 'next/image';


const TableRowImage = ({ image }: { image: string | StaticImageData}) => {
    return (
        <Image
            src={image}
            alt={'alt'}
            unoptimized
            height={40}
            width={40}
            className="w-9 h-9 object-cover rounded-full"
        />
    );
};

export default TableRowImage