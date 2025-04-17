"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { EmailOtpAuthService } from "@/lib/services/email-otp-auth/api"; // Ensure this path is correct

export default function RequestOtpPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [inviteToken, setInviteToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState<string>('/app'); // Default redirect

    useEffect(() => {
        const token = searchParams.get("token");
        const url = searchParams.get("redirectUrl");
        if (token) {
            setInviteToken(token);
        } else {
            // Optional: Handle case where token is missing, maybe redirect or show error
            toast.error("Invite token is missing.");
            // router.push('/'); // Redirect to home or an error page
        }
        if (url) {
            setRedirectUrl(url);
        }
    }, [searchParams]);

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteToken || !email) {
            toast.error("Email and invite token are required.");
            return;
        }
        setLoading(true);
        try {
            // Corrected: Send data in the body
            await EmailOtpAuthService.sendOtp(email, inviteToken);
            toast.success("OTP sent successfully! Please check your email.");
            // Navigate to verify OTP page, passing email, token, and redirectUrl
            router.push(
                `/auth/verify-otp?email=${encodeURIComponent(
                    email
                )}&token=${encodeURIComponent(
                    inviteToken
                )}&redirectUrl=${encodeURIComponent(redirectUrl)}`
            );
        } catch (error: any) {
            console.error("Error requesting OTP:", error);
            toast.error(`Failed to send OTP: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    if (!inviteToken && !loading) {
         // Optionally show a loading state or a message while token is being checked
         return (
             <div className="flex items-center justify-center min-h-screen">
                 <Card className="w-full max-w-md">
                     <CardHeader>
                         <CardTitle>Invalid Access</CardTitle>
                     </CardHeader>
                     <CardContent>
                         <p className="text-center text-muted-foreground">
                             An invite token is required to access this page.
                         </p>
                         {/* Optional: Button to go back */}
                         {/* <Button onClick={() => router.push('/')} className="mt-4 w-full">Go Home</Button> */}
                     </CardContent>
                 </Card>
             </div>
         );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Verify Access</CardTitle>
                    <CardDescription>
                        Enter your email address to receive a verification code.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRequestOtp} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Invite Token: {inviteToken ? '*********' : 'Missing'}
                        </p>
                        <Button type="submit" className="w-full" disabled={loading || !inviteToken}>
                            {loading ? "Sending..." : "Send Verification Code"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}