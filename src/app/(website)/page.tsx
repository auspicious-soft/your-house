"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import InputField from "@/app/(website)/components/InputField";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginAction } from "@/actions";
import Logo from "@/assets/images/logo.png";
import LoginImage from "./components/LoginImage";

const Page: React.FC = () => {
  const { data: session } = useSession();
  const [username, serUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  useEffect(() => {
    if (session) {
      if ((session as any)?.user?.role === "user") {
        router.push("/customer/dashboard");
      } else {
        router.push("/admin/dashboard");
      }
    }
  }, [router, session]);

//   const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
//     event
//   ) => {
//     event.preventDefault();

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const phoneRegex = /^\+45\s?\d{2}(\s?\d{2}){3}$/;

//     let loginFieldType = "";
//     if (emailRegex.test(email)) {
//       loginFieldType = "email";
//     } else if (phoneRegex.test(email)) {
//       loginFieldType = "phone";
//     } else {
//       return toast.error(
//         "Please enter a valid email or Danish phone number (+45)."
//       );
//     }

//     if (!password) return toast.error("Password is required");
//     // if (!email || !password) return toast.error('All fields are required')
//     startTransition(async () => {
//       const resss = await loginAction({ input: email, password });

//       if (resss?.success) {
//         toast.success("Logged in successfully");
//         if (resss?.data?.role === "user") {
//           window.location.href = "/customer/dashboard";
//         } else {
//           window.location.href = "/admin/dashboard";
//         }
//       } else {
//         toast.error(
//           Array.isArray(resss?.message)
//             ? resss?.message[0].message
//             : resss?.message
//         );
//       }
//     });
//   };
const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const phoneRegex = /^\+45\s?\d{2}(\s?\d{2}){3}$/;
    const phoneRegex = /^\d{8}$/;
    let loginFieldType = '';
    if (emailRegex.test(username)) {
      loginFieldType = 'username';
    } else if (phoneRegex.test(username)) {
      loginFieldType = 'username';
    } else {
      toast.error('Please enter a valid email or Danish phone number (+45).');
      return;
    }
  
    if (!password) {
      toast.error('Password is required.');
      return;
    }
    try {
      startTransition(async () => {
        const response = await loginAction({ [loginFieldType]: username, password });
  
        if (response?.success) {
          toast.success('Logged in successfully');
          if (response?.data?.user?.role === 'user') {
            window.location.href = '/customer/dashboard';
          } else {
            window.location.href = '/admin/dashboard';
          }
        } else {
          toast.error(
            Array.isArray(response?.message)
              ? response?.message[0].message
              : response?.message || 'An error occurred during login.'
          );
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Something went wrong! Please try again.');
    }
  };
  
  return (
    <div className="bg-[#D4DFF4] pt-5 md:pt-0">
      <div className="grid md:grid-cols-2 gap-8 md:gap-3 lg:gap-0 items-center md:min-h-screen ">
        <div className="bg-white h-full rounded-[30px] m-5 md:m-0  ">
          <div className="flex flex-col justify-center h-full max-w-[465px] p-5 mx-auto ">
            <p className="mb-5 md:mb-9 text-center">
              <Image
                src={Logo}
                alt="animate"
                className="mx-auto max-w-[172px]"
              />
            </p>
            <h2 className="text-[#3C3F88] text-center font-[700] text-[30px] mb-5 md:mb-9 ">
              Welcome Back
            </h2>
            <div className="login rounded-[20px] bg-white">
              <div className="">
                <form onSubmit={handleSubmit}>
                  <InputField
                    type="text"
                    label="Email Address / Phone"
                    value={username}
                    placeholder="Email Address / Phone"
                    onChange={(e) => serUsername(e.target.value)}
                  />
                  <InputField
                    type="password"
                    label="Your Password"
                    value={password}
                    placeholder="Your Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <div className="mt-[-10px] mb-[50px] flex justify-between items-center">
                    <label htmlFor="" className="text-[#353E6C] text-[14px] ">
                      {/* <input type="checkbox" name="" id="" className="mr-[10px]" /> */}
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        className="mr-[10px]"
                      />
                      Keep me logged in
                    </label>

                    <Link
                      href="/forgotpassword"
                      className="text-[#1657FF] text-[14px] "
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <button type="submit" className="login-button w-full">
                    {!isPending ? "Log In" : "Logging In"}
                  </button>

                  <p className="mt-5 text-center text-[#353E6C] text-[14px]">
                    Don’t have an account?{" "}
                    <Link href="/signup" className="text-[#1657FF] ">
                      Create one
                    </Link>{" "}
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
        <LoginImage />
      </div>
    </div>
  );
};

export default Page;
