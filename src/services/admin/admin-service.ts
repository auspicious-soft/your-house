import { getAxiosInstance } from "@/utils/axios";
import { axiosInstance } from "@/utils/axios";
 
export const loginService = async (payload: any) => await axiosInstance.post(`/login`, { username: payload.username, password: payload.password });
export const forgotPasswordService = async (payload: any) => await axiosInstance.patch(`/forgot-password`, payload)
export const sendOtpService = async (payload: any) => await axiosInstance.post(`/verify-otp`, payload)
export const resetUserPassword = async (payload: any) => await axiosInstance.patch(`/new-password-otp-verified`, payload)


export const getDashboardStats = async (route: string) => {
    const axiosInstance = await getAxiosInstance(true)
    return axiosInstance.get(route)
}

export const deleteProject = async (route: string) => {
    const axiosInstance = await getAxiosInstance(true) 
    return axiosInstance.delete(route)
}
export const getSingleProject = async (route: string) => {
    const axiosInstance = await getAxiosInstance(true)
    return axiosInstance.get(route)
}
export const updateSingleProjectData = async (route: string, payload: any) => {
    const axiosInstance = await getAxiosInstance(true)
    return axiosInstance.patch(route, payload)
}
export const getAllProjects = async (route: string) => {
    const axiosInstance = await getAxiosInstance(true)
    return axiosInstance.get(route)
}
export const getAllUsers = async (route: string) => {
    const axiosInstance = await getAxiosInstance(true)
    return axiosInstance.get(route)
}
export const deleteUsers = async (route: string) => {
    const axiosInstance = await getAxiosInstance(true)
    return axiosInstance.delete(route)
}
export const getSingleUser = async (route: string) => {
    const axiosInstance = await getAxiosInstance(true)
    return axiosInstance.get(route)
}
export const updateSingleUser = async (route: string, payload: any) => {
    const axiosInstance = await getAxiosInstance(true)
    return axiosInstance.patch(route, payload)
}

export const addNewProject = async (route: string, payload: any) => {
    const axiosInstance = await getAxiosInstance(true);
    return axiosInstance.post(route, payload);
};