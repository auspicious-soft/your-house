"use client";
import React, {useState, useTransition} from "react";
import Link from "next/link";
import InputField from "@/app/(website)/components/InputField";
import Image from "next/image";
import LoginImage from "../components/LoginImage";
import Logo from '@/assets/images/logo.png';
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { forgotPasswordService } from "@/services/admin/admin-service";
import { useTranslations } from "next-intl";

const Page: React.FC = () => {
  const t = useTranslations('ForgotPasswordPage');
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isPending, startTransition] = useTransition()
  const handleChange = (e: any) => {
    setUsername(e.target.value)
  }

const handleSubmit = (e: any) => {
  e.preventDefault()
  startTransition(async () => {
    try {
      const response = await forgotPasswordService({ username })
      if (response?.status === 200) {
        toast.success(t('otpSentSuccess'))
        router.push('/otp')
      }
      else {
        toast.error(t("somethingWentWrong"))
      }
    }
  catch (err: any) {
      if (err.status == 404) toast.error('UserName not found')
      else toast.error(t('somethingWentWrong'))
    }
  })
}

  return (
    <>
    <div className="bg-[#D4DFF4] pt-5 md:pt-0">
      <div className="grid md:grid-cols-2 gap-8 md:gap-3 lg:gap-0 items-center  ">
        <div className="bg-white h-full rounded-[30px] m-5 md:m-0  ">
    <div className="flex flex-col justify-center h-full max-w-[465px] p-5 mx-auto ">
     <p className="mb-5 md:mb-9 text-center">
        <Image src={Logo} alt="animate" className="mx-auto max-w-[172px]"/>
          </p>
          <h2 className="text-[#3C3F88] text-center font-[700] text-[30px] mb-5 md:mb-9 ">{t('forgotTitle')}</h2>
        <div className="login rounded-[20px] bg-white">
        <form>
          <InputField
          label={t('emailOrPhone')}
            type="text"
            value={username}
            placeholder={t('emailOrPhone')}
            onChange={handleChange}
          />
           <button disabled={isPending} onClick={handleSubmit} type="submit" className="login-button w-full mt-[50px]">
           {t('confirm')}</button>
          </form>
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
