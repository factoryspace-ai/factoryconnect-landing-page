"use client"
import { useUser } from "@clerk/nextjs"
export const AdminCheck = ({ children }: { children: React.ReactNode }) => {
    const { user } = useUser()
    const isAdmin = user?.publicMetadata.role === 'admin'
    if (!isAdmin) {
        return null
    }
    return (
        <>
            {children}
        </>
    );
};