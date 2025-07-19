"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { MsmeWaitingForm } from "./msme-waiting-form";
import { useRouter } from "next/navigation";
import { getSubdomainUrl } from "@/lib/utils";

interface MSME {
  msme: {
    id: string;
    name: string;
    subdomain: string;
  };
}

export function MsmeList() {
  const [msmes, setMsmes] = useState<MSME[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchMsmes = async () => {
    try {
      const response = await fetch("/api/msme");
      if (response.ok) {
        const data = await response.json();
        setMsmes(data);
      }
    } catch (error) {
      console.error("Error fetching MSMEs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMsmes();
  }, []);

  const handleMsmeClick = (subdomain: string) => {
    window.open(getSubdomainUrl(subdomain), '_blank');
  };

  if (loading) {
    return (
      <Card className="p-6 w-full shadow-lg bg-zinc-900 border-zinc-700">
        <div className="animate-pulse flex space-x-4">
          <div className="w-1/4 h-4 bg-zinc-700 rounded"></div>
          <div className="w-1/2 h-4 bg-zinc-700 rounded"></div>
          <div className="w-3/4 h-4 bg-zinc-700 rounded"></div>
        </div>
        <div className="animate-pulse flex space-x-4 mt-4">
          <div className="w-1/4 h-4 bg-zinc-700 rounded"></div>
          <div className="w-1/2 h-4 bg-zinc-700 rounded"></div>
          <div className="w-3/4 h-4 bg-zinc-700 rounded"></div>
        </div>
      </Card>
    );
  }

  if (msmes.length === 0) {
    return (
      <Card className="p-6 w-full shadow-lg bg-zinc-900 border-zinc-700">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-white">Welcome to FactorySpace</h3>
          <p className="text-muted-foreground">
            Submit your organization details to get started
          </p>
          <div className="max-w-md mx-auto">
            <MsmeWaitingForm onSuccess={() => {
              fetchMsmes();
              router.refresh();
            }} />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 w-full shadow-lg bg-zinc-900 border-zinc-700">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Your Organization</h2>
        </div>

         <div className="space-y-3">
           {msmes.map(({ msme }) => (
             <div
               key={msme.id}
               onClick={() => handleMsmeClick(msme.subdomain)}
               className="cursor-pointer"
             >
               <Card className="p-4 hover:shadow-md transition-shadow bg-zinc-800">
                 <div className="space-y-1">
                   <div className="flex justify-between items-start">
                     <h3 className="font-medium text-white">{msme.name}</h3>
                   </div>
                   <p className="text-xs text-muted-foreground">
                     {getSubdomainUrl(msme.subdomain)}
                   </p>
                 </div>
               </Card>
             </div>
           ))}
         </div>
       </div>
    </Card>
  );
}
