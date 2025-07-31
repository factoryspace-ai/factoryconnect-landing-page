"use client"
import Unauthorized from "@/app/unauthorized/page";
import { useUser } from "@clerk/nextjs"
export const AdminCheck = ({ children }: { children: React.ReactNode }) => {
    const { user } = useUser()
    const isAdmin = user?.publicMetadata.role === 'superadmin'
    if (!isAdmin) {
        return <Unauthorized />
    }
    return (
        <>
            {children}
        </>
    );
};