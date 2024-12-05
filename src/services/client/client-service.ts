import { getAxiosInstance } from "@/utils/axios";
import { axiosInstance } from "@/utils/axios";
import stripe from "stripe";

// export const addClientSignupData  = async (route: string, payload: any) =>  axiosInstance.post(route, payload)
export const userSignupData = async (payload: any) => await axiosInstance.post(`user/signup`, payload)

export const forgotPasswordService = async (payload: any) => await axiosInstance.patch(`/user/forgot-password`, payload)
export const sendOtpService = async (payload: any) => await axiosInstance.post(`/user/verify-otp`, payload)
export const resetUserPassword = async (payload: any) => await axiosInstance.patch(`/user/new-password-otp-verified`, payload)


export const changePasswordService  = async (route: string, payload: any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.patch(route, payload)
}