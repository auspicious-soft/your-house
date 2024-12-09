import React from 'react';
import LoginImg  from '@/assets/images/logins.png';
import Image from 'next/image';
const LoginImage = () => {
    return (
        <div>
        <div className="right-image ">   
          <Image src={LoginImg} alt="animate" className="h-full w-[100%] max-h-screen md:min-h-screen object-contain" /> 
        </div>
        </div>
    );
}

export default LoginImage;
