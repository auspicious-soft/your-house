 "use client"
import { Suspense, useEffect, useState, useTransition } from 'react';
import InputField from "@/app/(website)/components/InputField";
import Image from "next/image";
import Link from "next/link"; 
import LoginImage from '@/app/(website)/components/LoginImage';
import Logo from '@/assets/images/logo.png';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetUserPassword } from '@/services/admin/admin-service';
import { useTranslations } from 'next-intl';

function PasswordForm() {
  const t = useTranslations('ChangePasswordPage');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const otp = searchParams.get('otp');
    if (!otp) {
      router.push('/forgotpassword');
      // toast.error('Please complete the forgot password process first');
    }
  }, [router, searchParams]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const newPassword = (form.elements.namedItem('newPassword') as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;
    const otp = searchParams.get('otp');
    
    if (newPassword === confirmPassword) {
      startTransition(async () => {
        try {
          const response = await resetUserPassword({ password: newPassword as string, otp: otp as string });
          if (response.status === 200) {
            toast.success(t('passwordUpdated'));
            router.push('/');
          } else {
            toast.error(t('somethingWentWrong'));
          }
        } catch (error: any) {
          if (error.status === 404) {
            toast.error(t('invalidOtp'));
          } else {
            toast.error(t('somethingWentWrong'));
          }
        }
      });
    } else {
      toast.warning(t('passwordsMustMatch'));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2 md:mb-[17px]">
        <InputField type='password' name="newPassword" placeholder={t('newPasswordPlaceholder')} id="newPassword" />
        {/* <input type="password" name="newPassword" placeholder="Create Password" id="newPassword" /> */}
      </div>
      <div className="mb-4 md:mb-[24px]">
        <InputField type='password' name="confirmPassword" placeholder={t('confirmPasswordPlaceholder')} id="confirmPassword" />
        {/* <input type="password" name="confirmPassword" placeholder="Confirm Password" id="confirmPassword" /> */}
      </div>
      <button disabled={isPending} type="submit" className="login-button mt-[50px] w-full">
      {t('changePasswordButton')}
      </button>
    </form>
  );
}

export default function Page() {
  const t = useTranslations('ChangePasswordPage');
    return (
      <Suspense fallback={<div>Loading...</div>}>
      <div className="bg-[#D4DFF4] pt-5 md:pt-0">
      <div className="grid md:grid-cols-2 gap-8 md:gap-3 lg:gap-0 items-center  ">
      <div className="bg-white h-full rounded-[30px] m-5 md:m-0  ">
    <div className="flex flex-col justify-center h-full max-w-[465px] p-5 mx-auto ">
    <p className="mb-5 md:mb-9 text-center">
        <Image src={Logo} alt="animate" className="mx-auto max-w-[172px]"/>
          </p>
          <h2 className="text-[#3C3F88] text-center font-[700] text-[30px] mb-5 md:mb-9 ">{t('title')}</h2>
        <div className="login rounded-[20px] bg-white">
         <PasswordForm/>
        </div>
          </div>
        </div>
        <LoginImage/>
        </div>
        </div>
      </Suspense>
    );
};

