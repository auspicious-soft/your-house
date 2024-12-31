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
            className="max-w-10 max-h-10 object-cover rounded-full"
        />
    );
};

export default TableRowImage