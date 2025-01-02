import React, { useState, useEffect } from 'react'
import Image from "next/image";
import { getImageUrl } from '@/actions';

const TableRowImage = ({ image }: { image: string }) => {
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