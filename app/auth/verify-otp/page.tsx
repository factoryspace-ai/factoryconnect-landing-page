"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { EmailOtpAuthService } from "@/lib/services/email-otp-auth/api"; // Ensure path is correct

function VerifyOtpContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    // Extract params directly inside the component that uses them
    const email = searchParams.get("email");
    const inviteToken = searchParams.get("token");

    useEffect(() => {
        if (!email || !inviteToken) {
            toast.error("Missing email or invite token. Please start again.");
            router.replace('/auth/request-otp'); // Redirect back if essential info is missing
        }
    }, [email, inviteToken, router]);

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !inviteToken || !otp) {
            toast.error("Email, invite token, and OTP are required.");
            return;
        }
        setLoading(true);
        try {
            // Corrected: Send data in the body
            const response = await EmailOtpAuthService.verifyOtp(email, otp, inviteToken);

            if (response && response.access_token) {
                localStorage.setItem("access_token", response.access_token);
                toast.success("Verification successful!");
                router.replace('/app?tab=rfq-details');
            } else {
                throw new Error("Verification failed: No access token received.");
            }
        } catch (error: any) {
            console.error("Error verifying OTP:", error);
            toast.error(`Verification failed: ${error.message || 'Invalid OTP or token.'}`);
            // Optionally clear OTP field on failure
             setOtp("");
        } finally {
            setLoading(false);
        }
    };

    if (!email || !inviteToken) {
         // Don't render the form if essential parameters are missing
         return (
             <div className="text-center text-muted-foreground p-4">
                 Loading details or invalid access...
             </div>
         );
    }


    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Enter Verification Code</CardTitle>
                <CardDescription>
                    A code has been sent to {email}. Please enter it below.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="otp">One-Time Password (OTP)</Label>
                        <Input
                            id="otp"
                            type="text"
                            inputMode="numeric"
                            placeholder="123456"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            disabled={loading}
                            maxLength={6} // Optional: if OTP length is fixed
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Verifying..." : "Verify Code"}
                    </Button>
                     <Button
                        type="button"
                        variant="link"
                        className="w-full text-sm"
                        onClick={() => router.back()} // Allow user to go back if needed
                     >
                        Entered wrong email? Go back
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}


export default function VerifyOtpPage() {
    // Wrap the component using searchParams with Suspense
    return (
         <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Suspense fallback={<div className="text-center p-6">Loading...</div>}>
                <VerifyOtpContent />
            </Suspense>
         </div>
    );
}