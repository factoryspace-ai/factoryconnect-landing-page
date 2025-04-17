"use client";

import { useEffect, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/loading-skeleton';

interface ProtectedLayoutProps {
    children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        // Basic check: Does a token exist?
        // Add more robust validation if needed (e.g., check expiry, call /verify endpoint)
        if (token) {
            setIsVerified(true);
        } else {
            // No token found. This means the user is trying to access /app/* directly
            // without a valid session OR the middleware didn't catch an invite link (shouldn't happen).
            // Redirect to a generic login/error page.
            console.log("ProtectedLayout: No token found, redirecting to auth.");
            // Redirect to request-otp, but without a token, it should ideally show an error or prompt login.
            // Pass the current path as redirectUrl so they can come back after logging in.
            router.replace(`/auth/request-otp?redirectUrl=${encodeURIComponent(pathname)}`);
            // Or redirect to a Clerk sign-in page if using Clerk for regular logins:
            // router.replace(`/sign-in?redirect_url=${encodeURIComponent(pathname)}`);
        }
        setIsLoading(false);

    }, [pathname, router]); // Dependency array

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    // Render children only if verified (token exists in localStorage)
    return isVerified ? <>{children}</> : null; // Render nothing while redirecting
}