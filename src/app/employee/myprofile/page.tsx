"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState, useTransition } from "react";
import { EditButtonIcon } from "@/utils/svgicons";
import EditClientDetailsModal from "@/app/admin/components/EditClientDetailsModal";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { getUserInfo, updateUserInfo } from "@/services/client/client-service";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { deleteFileFromS3, generateSignedUrlForUserProfile, getImageUrl } from "@/actions";
import ReactLoading from "react-loading";

const Page = () => {
  const t = useTranslations('ProfilePage');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const session = useSession();
  const [isPending, startTransition] = useTransition();
  const userId = session?.data?.user?.id
  const { data, error, mutate, isLoading } = useSWR(userId ? `/employee/${userId}` : null, getUserInfo)

  const employeeData = data?.data?.data?.employee;
  const [formData, setFormData] = useState<any>({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    profilePic: "",
  });

  useEffect(() => {
    if (employeeData) {
      setFormData({
        fullName: employeeData.fullName || "",
        phoneNumber: employeeData.phoneNumber || "",
        email: employeeData.email || "",
        address: employeeData.address || "",
        profilePic: !(formData.profilePic instanceof File) ? employeeData.profilePic || "" : formData.profilePic,
      })
    }
    const getImage = async (image: string) => {
      if (typeof image === 'string') {
        const url = await getImageUrl(image);
        setProfilePic(url)
      }
    }
    getImage(formData.profilePic)

  }, [employeeData, formData.profilePic]);


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
          const uploadUrl = await generateSignedUrlForUserProfile(fileName, formData.profilePic.type, email, true)
          await fetch(uploadUrl, {
            method: 'PUT',
            body: formData.profilePic,
            headers: {
              'Content-Type': formData.profilePic.type,
            },
          })
          const oldImage = employeeData.profilePic
          if (oldImage.includes('employees')) {
            await deleteFileFromS3(employeeData.profilePic)
          }
          updatedFormData.profilePic = `employees/${email}/${fileName}`
        }
        const response = await updateUserInfo(`/employee/${session?.data?.user?.id}`, updatedFormData);
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
        <div className="mb-10 flex gap-[20px] justify-between  !flex-row-reverse">
          <div>
            <button onClick={() => setIsModalOpen(true)} className="w-full !rounded-[3px] button !h-[40px]">
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
        isEmployee={true}
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

