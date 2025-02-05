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
export const getNotesData = async (route: string) => {
    const axiosInstance = await getAxiosInstance(true)
    return axiosInstance.get(route)
}
export const deleteNotesData = async (route: string) => {
    const axiosInstance = await getAxiosInstance(true)
    return axiosInstance.delete(route)
}
export const addNotesData = async (route: string, payload: any) => {
    const axiosInstance = await getAxiosInstance(true);
    return axiosInstance.post(route, payload);
};
export const getAttachmentsData = async (route: string) => {
    const axiosInstance = await getAxiosInstance(true)
    return axiosInstance.get(route)
}
export const deleteAttachmentsData = async (route: string) => {
    const axiosInstance = await getAxiosInstance(true)
    return axiosInstance.delete(route)
}
export const addAttachmentsData = async (route: string, payload: any) => {
    const axiosInstance = await getAxiosInstance(true);
    return axiosInstance.post(route, payload);
};

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

export const addNewUser = async (route: string, payload: any) => {
    const axiosInstance = await getAxiosInstance(true);
    return axiosInstance.post(route, payload);
};

export const addNewProject = async (route: string, payload: any) => {
    const axiosInstance = await getAxiosInstance(true);
    return axiosInstance.post(route, payload);
};
export const getAllEmployees = async (route: string) => {
    const axiosInstance = await getAxiosInstance(true)
    return axiosInstance.get(route)
}
export const deleteEmployee = async (route: string) => {
    const axiosInstance = await getAxiosInstance(true)
    return axiosInstance.delete(route)
}
export const addNewEmployee = async (route: string, payload: any) => {
    const axiosInstance = await getAxiosInstance(true);
    return axiosInstance.post(route, payload);
};
export const getSingleEmployee = async (route: string) => {
    const axiosInstance = await getAxiosInstance(true)
    return axiosInstance.get(route)
}
export const updateEmployee = async (route: string, payload: any) => {
    const axiosInstance = await getAxiosInstance(true)
    return axiosInstance.patch(route, payload)
}

export const getTabsData = async (route: string) => {
    const axiosInstance = await getAxiosInstance(true)
    return axiosInstance.get(route)
}

export const deleteTabData = async (route: string) => {
    const axiosInstance = await getAxiosInstance(true)
    return axiosInstance.delete(route)
}

export const addTimeframe = async (route: string, payload: any) => {
    const axiosInstance = await getAxiosInstance(true);
    return axiosInstance.post(route, payload);
}

export const updateTimeframe = async (route: string, payload: any) => {
    const axiosInstance = await getAxiosInstance(true);
    return axiosInstance.patch(route, payload);
}