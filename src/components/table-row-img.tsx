import React, { useState, useEffect } from 'react'
import Image from "next/image";
import { getImageUrl } from '@/actions';

const TableRowImage = ({ image }: { image: string }) => {
    const [imageUrl, setImageUrl] = useState<string>('');
    console.log('imageUrl: ', imageUrl);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const url = await getImageUrl(image);
                setImageUrl(url);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load image');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchImage();
    }, [image]);

    if (isLoading) {
        return <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />;
    }

    if (error || !imageUrl) {
        return <div className="w-10 h-10 rounded-full bg-red-200" />;
    }

    return (
        <Image
            src={imageUrl}
            alt={'alt'}
            unoptimized
            height={40}
            width={40}
            className="max-w-10 max-h-10 object-cover rounded-full"
        />
    );
};

export default TableRowImage