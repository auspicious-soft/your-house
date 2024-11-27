"use client";
import React, {useState} from "react";
import Link from "next/link";
import InputField from "@/app/(website)/components/InputField";
import Image from "next/image";
import LoginImage from "../components/LoginImage";
import Logo from '@/assets/images/logo.png';

const Page: React.FC = () => {
const [password, setPassword] = useState("");

    return (
        <>
    <div className="bg-[#D4DFF4] pt-5 md:pt-0">
      <div className="grid md:grid-cols-2 gap-8 md:gap-3 lg:gap-0 items-center  ">
        <div className="bg-white h-full rounded-[30px] m-5 md:m-0  ">
    <div className="flex flex-col justify-center h-full max-w-[465px] p-5 mx-auto ">
    <p className="mb-5 md:mb-9 text-center">
        <Image src={Logo} alt="animate" className="mx-auto max-w-[172px]"/>
          </p>
          <h2 className="text-[#3C3F88] text-center font-[700] text-[30px] mb-5 md:mb-9 ">Forgot Password?</h2>
        <div className="login rounded-[20px] bg-white">
        <div className="">
          <InputField
          label="Phone Number / Email Address"
            type="email"
            value={password}
            placeholder="Phone Number/Email Address"
            onChange={(e) => setPassword(e.target.value)}
          />
        <Link href="/resetpassword" className="login-button w-full mt-[50px]">Confirm</Link>
       
          </div>
        </div>
       </div>
          </div>
          <LoginImage/>
        </div>
        </div>
        </>
    );
}

export default Page;
