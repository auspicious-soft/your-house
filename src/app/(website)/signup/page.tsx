"use client";
import React, { useState, useTransition } from "react";
import Link from "next/link";
import ReactPlayer from "react-player";
import InputField from "@/app/(website)/components/InputField";
import Image from "next/image";
import animate from "@/assets/images/loginslide.png"
import { toast } from "sonner";
//import { signUpTherapistService } from "@/services/therapist/therapist-service.";
import { useRouter } from "next/navigation";
import Logo from '@/assets/images/logo.png';
import LoginImage from "../components/LoginImage";

const Page: React.FC = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition()
  const handleSignup = async () => {
    // startTransition(async () => {
    //   try {
    //     const response = await signUpTherapistService({ firstName, lastName, phoneNumber, email, password })
    //     if(response?.data?.success) {
    //       toast.success("Signup Successful")
    //       router.push('/accountcreated')
    //     }
    //   } catch (error: any) {
    //     const err = error?.response?.data
    //     toast.error(Array.isArray(err?.message) ? err?.message[0].message : err.message)
    //   }
    // })
  }
  return (
    <>
      <div className="bg-[#D4DFF4] pt-5 md:pt-0">
      <div className="grid md:grid-cols-2 gap-8 md:gap-3 lg:gap-0 items-center  ">
      <div className="bg-white h-full rounded-[30px] m-5 md:m-0  ">
      <div className="flex flex-col justify-center h-full max-w-[465px] p-5 mx-auto ">
      <p className="mb-5 md:mb-10 text-center">
        <Image src={Logo} alt="animate" className="mx-auto max-w-[172px]"/>
          </p>
          <h2 className="text-[#3C3F88] text-center font-[700] text-[30px] mb-5 md:mb-10 ">Welcome Back</h2>
    
            <div className="login rounded-[20px] bg-white">
              <div className="">
                <InputField
                  type="text"
                  label="Full Name"
                  value={fullName}
                  placeholder="Full Name"
                  required
                  onChange={(e) => setFullName(e.target.value)}
                />
               <div className="flex gap-[30px] ">
               <InputField
                  type="email"
                  label="Email Address"
                  value={email}
                  placeholder="Email Address"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
                <InputField
                  type="number"
                  label="Phone Number"
                  value={phoneNumber}
                  placeholder="+1 245 125 2356"
                  required
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
               </div>
                <InputField
                  type="password"
                  label="Your Password"
                  value={password}
                  placeholder="Your Password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                 <InputField
                  type="password"
                  label="Confirm Password"
                  value={confirmPassword}
                  placeholder="Confirm Password"
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button className="login-button w-full cursor-pointer mt-[50px]" onClick={handleSignup}>Sign Up </button>
            <p className="text-[#353E6C] mt-5 text-center   ">Already have an account? <Link href='/' className="text-[#1657FF] ">Login</Link> </p>
              </div>
            </div>
          </div>

          </div>
          <LoginImage />
        </div>
      </div>
    </>
  );
};
export default Page; 