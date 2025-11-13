import React, { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { axiosInstance } from '@/lib/axios'
import { Loader } from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'
import { useChatStore } from '@/stores/useChatStore'


const updateApiToken = (token:string | null) => {
    if(token){
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }else{
        delete axiosInstance.defaults.headers.common['Authorization']
    }
}

const AuthProvider = ({children}: {children: React.ReactNode}) => {
    
    const {getToken, userId} = useAuth();
    const [loading, setLoading] = useState(true);
    const {checkAdminStatus} = useAuthStore();
    const { initSocket, disconnectSocket }= useChatStore();

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = await getToken();
                console.log("Got auth token:", token ? "Token present" : "No token");
                updateApiToken(token);
                if(token ){
                    await checkAdminStatus();

                    if(userId) initSocket(userId);
                }
            } catch (error) {
                console.error("Error getting token:", error);
                updateApiToken(null);
            }finally{
                setLoading(false);
            }
        }
        initAuth();
        return () => disconnectSocket();
    }, [getToken, userId, checkAdminStatus, initSocket, disconnectSocket])

    if(loading) return (
        <div className='h-screen w-full flex items-center justify-center'>
            <Loader className='size-8 text-emerald-500 animate-spin' />
        </div>
    )

    return (
        <>
            {children}
        </>
    )
}

export default AuthProvider
