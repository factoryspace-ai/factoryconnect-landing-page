"use client"

import { Separator } from "@/components/ui/separator"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { TopNavbar } from "@/components/simplified/top-navbar"
import { FileText, Settings, Users, BarChart, MessageSquare } from "lucide-react"
import RFQComponent from "@/components/rfq"
import { Button } from "@/components/ui/button"

export default function SettingsProfilePage() {
    const router = useRouter();
    const searchParams = useSearchParams()
    const activeTab = searchParams.get("tab") || "production-orders"

    const tabs = [
        // { id: "production-orders", title: "Production Orders", icon: <Settings className="h-4 w-4" /> },
        { id: "rfq-details", title: "RFQ Details", icon: <MessageSquare className="h-4 w-4" /> },
        // { id: "workorder", title: "Workorder", icon: <MessageSquare className="h-4 w-4" /> },
        // { id: "quotations", title: "Quotations", icon: <MessageSquare className="h-4 w-4" /> },
        // { id: "delivery-challan", title: "Delivery Challan", icon: <MessageSquare className="h-4 w-4" /> },
    ]

    // Handle tab change
    const handleTabChange = (tabId: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', tabId);
        router.push(`/simplified?${params.toString()}`, { scroll: false });
    };

    const handleLogout = () => {
        // Clear all cookies
        // document.cookie.split(";").forEach(function(c) {
        //     document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        // }); 
        localStorage.removeItem("access_token");
        router.push("/");
    }

    const renderTabContent = () => {
        switch (activeTab) {
            // case "production-orders":
            //     return <></>
            case "rfq-details":
                return <RFQComponent />
            // case "workorder":
                // return <WorkorderTab />
            default:
                return <></>
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Simplified View</h3>
                {/* <p className="text-sm text-muted-foreground">
                    Making your work easier.
                </p> */}
                <Button variant="outline" onClick={handleLogout}> Logout </Button>
            </div>
            <Separator />
            
            <TopNavbar items={tabs} defaultTab="production-orders" onChange={handleTabChange}/>
            
            <div className="mt-6">
                {renderTabContent()}
            </div>
        </div>
    )
}