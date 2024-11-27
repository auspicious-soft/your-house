import { getAxiosInstance } from "@/utils/axios";
import { axiosInstance } from "@/utils/axios";
import stripe from "stripe";

export const addClientSignupData  = async (route: string, payload: any) =>  axiosInstance.post(route, payload)
export const changePasswordService  = async (route: string, payload: any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.patch(route, payload)
}