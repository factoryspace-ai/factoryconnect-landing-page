"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// import { SignUpButton, useAuth } from "@clerk/nextjs";

interface MsmeWaitingFormProps {
  subdomain?: string;
  onSuccess?: () => void;
}

export function MsmeWaitingForm({ subdomain, onSuccess }: MsmeWaitingFormProps) {
  const [loading, setLoading] = useState(false);
  const [subdomainError, setSubdomainError] = useState<string | null>(null);
  // const { isSignedIn, isLoaded } = useAuth();


  // State variables for form inputs
  const [companyName, setCompanyName] = useState("");
  const [subdomainValue, setSubdomainValue] = useState("");
  const [email, setEmail] = useState("");
  const [companyDetails, setCompanyDetails] = useState("");
  const [showForm, setShowForm] = useState(false);

  const router = useRouter();

  const checkSubdomain = async (value: string) => {
    try {
      const response = await fetch(`/api/msme/waiting-list?subdomain=${encodeURIComponent(value)}`, {
        method: "GET",
      });

      if (!response.ok) {
        const data = await response.json();
        setSubdomainError(data.message || "Subdomain already exists");
        return false;
      }

      setSubdomainError(null);
      return true;
    } catch (error) {
      setSubdomainError("Error checking subdomain");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // if (!isSignedIn || !isLoaded) {
    //   setShowForm(true);
    //   return
    // }
    e.preventDefault();
    setLoading(true);

    const data = {
      companyName,
      subdomain: subdomainValue || subdomain,
      email,
      companyDetails,
    };

    try {
      const response = await fetch("/api/msme/waiting-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit request");
      }

      toast.success("Success! Your request has been submitted. We'll review it shortly.");

      // Reset form fields on success
      setCompanyName("");
      setSubdomainValue("");
      setEmail("");
      setCompanyDetails("");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // if (showForm) {
  //   return (
  //     <div className="space-y-4">
  //       <p>Please sign in to submit your request</p>
  //       <SignUpButton mode="modal">
  //         <Button className="bg-black text-white hover:bg-black/90" size="lg">
  //           Sign Up
  //         </Button>
  //       </SignUpButton>
  //     </div>
  //   );
  // }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          name="companyName"
          placeholder="Company Name"
          required
          value={companyName}
          className="bg-zinc-900 text-white"
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </div>

      {!subdomain && (
        <div className="space-y-2">
          <Input
            name="subdomain"
            placeholder="Subdomain"
            required
            className={subdomainError ? "border-red-500 bg-zinc-900 text-white" : "bg-zinc-900 text-white"}
            value={subdomainValue}
            onChange={(e) => setSubdomainValue(e.target.value)}
            onBlur={(e) => checkSubdomain(e.target.value)}
          />
          {subdomainError && (
            <p className="text-sm text-left text-red-500 mt-1">{subdomainError}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Input
          name="email"
          type="email"
          placeholder="Email"
          className="bg-zinc-900 text-white"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Textarea
          name="companyDetails"
          placeholder="Tell us about your company..."
          className="bg-zinc-900 text-white"
          required
          value={companyDetails}
          onChange={(e) => setCompanyDetails(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full bg-zinc-800 hover:bg-zinc-700 text-white" disabled={loading}>
        {loading ? "Submitting..." : "Submit Request"}
      </Button>
    </form>
  );
}
