"use client";
import Image from "next/image";
import React, { ChangeEvent, FormEvent, useEffect, useState, useTransition } from "react";
import { EditButtonIcon } from "@/utils/svgicons";
import EditClientDetailsModal from "@/app/admin/components/EditClientDetailsModal";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { getUserInfo, updateUserInfo } from "@/services/client/client-service";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { deleteFileFromS3, generateSignedUrlForUserProfile, getImageUrl } from "@/actions";
import profile from "@/assets/images/profile.png";
import { getImageClientS3URL } from "@/utils/axios";
import ReactLoading from "react-loading";
const Page = () => {
  const t = useTranslations('ProfilePage');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const session = useSession();
  const [isPending, startTransition] = useTransition();
  const userId = session?.data?.user?.id
  const { data, error, mutate, isLoading } = useSWR(userId ? `/user/${userId}` : null, getUserInfo)

  const customerData = data?.data?.data?.user;
  const [formData, setFormData] = useState<any>({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    profilePic: "",
  });

  useEffect(() => {
    if (customerData) {
      setFormData({
        fullName: customerData.fullName || "",
        phoneNumber: customerData.phoneNumber || "",
        email: customerData.email || "",
        address: customerData.address || "",
        profilePic: !(formData.profilePic instanceof File) ? customerData.profilePic || "" : formData.profilePic,
      })
    }
    const getImage = async (image: string) => {
      if (typeof image === 'string') {
        const url = await getImageUrl(image);
        setProfilePic(url)
      }
    }
    getImage(formData.profilePic)

  }, [customerData, formData.profilePic]);


  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement & { files: FileList };
    setFormData({
      ...formData,
      [name]: name === "phoneNumber" ? value : value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        let updatedFormData = { ...formData }

        //is image uploaded
        if (formData.profilePic instanceof File) {
          const fileName = formData.profilePic.name + '-' + new Date().getTime()
          const email = (session as any)?.data?.user?.username
          const uploadUrl = await generateSignedUrlForUserProfile(fileName, formData.profilePic.type, email)
          await fetch(uploadUrl, {
            method: 'PUT',
            body: formData.profilePic,
            headers: {
              'Content-Type': formData.profilePic.type,
            },
          })
          const oldImage = customerData.profilePic
          if (oldImage.includes('users')) {
            await deleteFileFromS3(customerData.profilePic)
          }
          updatedFormData.profilePic = `users/${email}/${fileName}`
        }
        const response = await updateUserInfo(`/user/${session?.data?.user?.id}`, updatedFormData);
        if (response?.status === 200) {
          setIsModalOpen(false);
          //setNotification("User Added Successfully");
          toast.success(t("successUserAdded"));
          window.location.reload();

        } else {
          toast.error(t("errorUserAddFailed"));
        }
      } catch (error) {

        toast.error(t("errorUserAddException"));
      }
    });

  };

  const [profilePic, setProfilePic] = useState<string>('');

  if (isLoading) {
    return <div className="text-center"><ReactLoading type={'spin'} color={'#1657FF'} height={'50px'} width={'50px'} /> </div>;
  }  
  return (
    <div>
      <div className=" bg-white rounded-[10px] md:rounded-[30px] w-full py-[30px] px-[15px] md:p-10 ">
        <div className="mb-10 flex gap-[20px] justify-between ">
          {profilePic && 
          <Image 
          src={
            formData.profilePic 
            ? (!(formData.profilePic instanceof File) 
                ? getImageClientS3URL(formData.profilePic) 
                : formData.profilePic)
            : profile
          }
          
          alt="hjfg" height={200} width={200} className="max-w-[100px] md:max-w-[200px] aspect-square rounded-full  " />}
          <div>
            <button onClick={() => setIsModalOpen(true)} className="w-full !rounded-[3px] button !h-[40px] ">
              <EditButtonIcon />{t('editDetails')}
            </button></div>
        </div>
        <div className="fomm-wrapper grid md:flex flex-wrap gap-5 ">
          <div className="w-full">
            <label className="block">{t('fullName')}</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              placeholder={t('fullName')}
              onChange={handleInputChange}
              readOnly
            />
          </div>
          <div className="md:w-[calc(33.33%-14px)]">
            <label className="block">{t('phoneNumber')}</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder={t('phoneNumber')}
              readOnly
            />
          </div>
          <div className="md:w-[calc(33.33%-14px)]">
            <label className="block">{t('emailAddress')}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t('emailAddress')}
              readOnly
            />
          </div>
          <div className="md:w-[calc(33.33%-14px)]">
            <label className="block">{t('homeAddress')}</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder={t('homeAddress')}
              readOnly
            />
          </div>
        </div>
      </div>

      {isModalOpen && <EditClientDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        profilePic={profilePic}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        setFormData={setFormData}
        id={session?.data?.user?.id}
        mutate={mutate}
        isPending={isPending}
      />
      }
      {/* <section className="mt-10">
        <h2 className="section-title">My Projects</h2>
        <ClientProfileProjects />
      </section> */}
    </div>
  );
};

export default Page;

