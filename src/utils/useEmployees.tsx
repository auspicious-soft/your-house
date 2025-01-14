import { getAllEmployees } from '@/services/admin/admin-service';
import React from 'react';
import useSWR from 'swr';

const UseEmployees = () => {
    const { data, error, mutate, isLoading } = useSWR(`/admin/employee`, getAllEmployees)
    const employeeData = data?.data?.data?.map((user: any) => ({
        label: user?.fullName,
        value: user?._id,
    })) || []; 
    return { 
        employeeData,
        isLoading: isLoading,
        error: error, 
    }
}

export default UseEmployees;
