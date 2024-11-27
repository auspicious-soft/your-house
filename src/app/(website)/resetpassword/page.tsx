 "use client"
import { useState } from 'react';
import InputField from "@/app/(website)/components/InputField";
import Image from "next/image";
import { useRouter } from 'next/router';
import Link from "next/link";
import resetimg from "@/assets/images/img12.png"
import LoginImage from '../components/LoginImage';
import Logo from '@/assets/images/logo.png';


const Page = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handlePopup =() =>{
    setShowPopup(true);
  }
  const handleClosePopup = () => {
    setShowPopup(false);
  };
   const [newPassword, setNewPassword] = useState('');
//   const router = useRouter();

// const handleSubmit = () => {
//   setShowPopup(true);
//   setTimeout(() => {
//     setShowPopup(false);
//     router.push('/login');
//   }, 2000); // Hide the popup after 2 seconds and redirect to login page
// };
    return (
      <>
      <div className="bg-[#D4DFF4] pt-5 md:pt-0">
      <div className="grid md:grid-cols-2 gap-8 md:gap-3 lg:gap-0 items-center  ">
      <div className="bg-white h-full rounded-[30px] m-5 md:m-0  ">
    <div className="flex flex-col justify-center h-full max-w-[465px] p-5 mx-auto ">
    <p className="mb-5 md:mb-9 text-center">
        <Image src={Logo} alt="animate" className="mx-auto max-w-[172px]"/>
          </p>
          <h2 className="text-[#3C3F88] text-center font-[700] text-[30px] mb-5 md:mb-9 ">Change Password</h2>
        <div className="login rounded-[20px] bg-white">
          <div className="">
          <InputField
            type="password"
            label='Enter New Password'
            value={newPassword}
            placeholder="*******"
           onChange={(e) => setNewPassword(e.target.value)}
          />
            <InputField
            type="password"   
            label='Confirm Password'    
            value={newPassword}
            placeholder="******"
            onChange={(e) => setNewPassword(e.target.value)}
          />
    
          <button className="login-button mt-[50px] w-full" onClick={handlePopup}>Change Password</button>
          </div>
        </div>
          </div>
        </div>
        <LoginImage/>
        </div>
        </div>
        {showPopup && (
        <div className="popup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"  onClick={handleClosePopup}>
          <div className="bg-white w-[584px] p-5 py-[45px] rounded-[20px] shadow-lg text-center" onClick={(e) => e.stopPropagation()}>
          <Image src={resetimg} alt="reseettt" className='mx-auto' />
            <p className="text-[#283c63] text-3xl mt-[44px] mb-[23px]">Password Reset Successfully!</p>
            <Link href="/" className='text-[#395996] text-base'>Login To Continue</Link>
          </div>
        </div>
      )}
        </>
    );
};

export default Page;
