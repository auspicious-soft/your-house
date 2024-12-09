import { getAxiosInstance } from "@/utils/axios";
import { axiosInstance } from "@/utils/axios";
import stripe from "stripe";

// export const addClientSignupData  = async (route: string, payload: any) =>  axiosInstance.post(route, payload)
export const userSignupData = async (payload: any) => await axiosInstance.post(`user/signup`, payload)

export const getClientsAllProjects  = async (route: string) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route)
}
export const getDashboardData = async (route: string) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route)
}
export const getUserInfo = async (route: string) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route)
}
export const updateUserInfo = async (route: string, payload: any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.put(route, payload)
}