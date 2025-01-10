import Image, {StaticImageData} from 'next/image';
import React from 'react';
import { Line, Circle } from 'rc-progress';

interface ProjectProps {
    title: string;
    progress: number;
    imgSrc: string | StaticImageData;  
}
const ProjectsProgress: React.FC<ProjectProps> = ({title, progress, imgSrc }) => {
    return (
        <div className='flex gap-3 mb-7'>
            <div className='min-w-10 '>
                <Image src={imgSrc} alt='' width={40} height={40} className='rounded-full w-12 h-12'/>
            </div>
            <div className='w-full flex gap-3 items-center'>
            <div className='w-full  '>
            <h4 className='text-sm mb-2 text-[#353E6C] font-sfproDisplaymedium '>{title} </h4>
              <Line percent={progress} trailColor='#D9D9D9' trailWidth={0.2} strokeColor='#F44771' strokeWidth={0.2} />
            </div>
            <div className='min-w-12'>
            <p className='text-sm bg-[linear-gradient(143deg,#CE9FFC_-43.31%,#7367F0_129.93%)] text-white text-center rounded-[4px] py-[4.5px] px-1 '>{progress}%</p>
            </div>
            </div>
        </div>
    );
}

export default ProjectsProgress;
