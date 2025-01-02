'use client'
import Image from "next/image";
import logo from "@/assets/images/logo.png";
//import LoginCard from "@/components/LoginCard";
import loginImg from "@/assets/images/loginimg.png";
import Link from "next/link";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LoginImage from "../components/LoginImage";
import Logo from '@/assets/images/logo.png';
import { sendOtpService } from "@/services/admin/admin-service";
import { useTranslations } from "next-intl";

//import { sendOtpService } from "@/services/user-service";

export default function Page() {
  const t = useTranslations('EnterOTPPage');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const handleOtpChange = (index: number, value: string) => {
    const sanitizedValue = value.slice(-1);

    if (sanitizedValue && !/^\d$/.test(sanitizedValue)) {
      return;
    }
    const newOtpValues = [...otpValues];
    newOtpValues[index] = sanitizedValue;
    setOtpValues(newOtpValues);

    if (sanitizedValue && index < 5) {
      const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedNumbers = pastedData.replace(/\D/g, '').slice(0, 6).split('');
    

    const newOtpValues = [...otpValues];
    pastedNumbers.forEach((num, index) => {
      if (index < 6) newOtpValues[index] = num;
    });
    setOtpValues(newOtpValues);

    const nextEmptyIndex = newOtpValues.findIndex(value => !value);
    const targetIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    const nextInput = document.querySelector(`input[name="otp-${targetIndex}"]`) as HTMLInputElement;
    if (nextInput) nextInput.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const completeOtp = otpValues.join('');
    startTransition(async () => {
      try {
        const response = await sendOtpService({ otp: completeOtp })
        if (response.status === 200) {
          toast.success(t('emailSentSuccess'))
          router.push(`/resetpassword?otp=${completeOtp}`)
        }
        else {
          toast.error(t('somethingWentWrong'))
        }
      }
      catch (err: any) {
        if (err.status == 404 || err.status == 400) {
         alert(t('invalidOtpOrExpired'))
        }
        else toast.error(t('somethingWentWrong'))
      }
    })
  };

  return (
    <div className="bg-[#D4DFF4] pt-5 md:pt-0">
      <div className="grid md:grid-cols-2 gap-8 md:gap-3 lg:gap-0 items-center  ">
        <div className="bg-white h-full rounded-[30px] m-5 md:m-0  ">
      <div className="flex flex-col justify-center h-full max-w-[465px] px-5 mx-auto ">
      <p className="mb-5 md:mb-9 text-center">
        <Image src={Logo} alt="animate" className="mx-auto max-w-[172px]"/>
          </p>
          <h2 className="text-[#3C3F88] text-center font-[700] text-[30px] mb-5 md:mb-9 ">{t('enterOtp')}</h2>
            {/* <p className="login-desc mb-5 md:mb-10">Enter 4 digit pin sent to your email address.</p> */}
            <form onSubmit={handleSubmit}>
              <div className="mb-5 md:mb-[50px] otp-inputs justify-center flex gap-[11px] items-center">
                {otpValues.map((value, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    name={`otp-${index}`}
                    value={value}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onPaste={handlePaste}
                    maxLength={1}
                    required
                    className="w-12 h-12 text-center bg-[#F4F5F7] border border-[#C4C4C4] rounded-full focus-visible:outline-[#1657FF] focus-visible:outline focus-visible:outline-1  "
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !value && index > 0) {
                        const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`) as HTMLInputElement;
                        if (prevInput) prevInput.focus();
                      }
                    }}
                  />
                ))}
              </div>

              <button
                type="submit"
                className="login-button w-full"
              >{t('confirm')}
              </button>
            </form>
          </div>
        </div>
        <LoginImage/>
      </div>
    </div>
  );
}