import useSWR from 'swr';
import { getAllUsers } from '@/services/admin/admin-service';

const useClients = () => {
    const { data, error, isLoading } = useSWR(`/admin/users`, getAllUsers);
    

    const userData = data?.data?.data?.map((user: any) => ({
        label: `${user?.fullName}`,
        value: user._id,
        email: user.email,
        address: user.address,
    })) || []; 

    return {
        userData,
        isLoading: isLoading,
        error: error,
    };
};


export default useClients;
