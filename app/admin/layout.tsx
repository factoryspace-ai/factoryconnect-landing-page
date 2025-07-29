import type { Metadata } from "next";
import { AdminCheck } from "@/components/admin-check";
import { AdminNavigation } from "@/components/admin-navigation";

export const metadata: Metadata = {
    title: "Factory Space Admin",
    description: "Factory Space Admin Panel",
};

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="antialiased">
            <AdminCheck>
                <div className="flex h-screen bg-gray-100">
                    <AdminNavigation />
                    <main className="flex-1 overflow-auto">
                        <div className="p-8">
                            {children}
                        </div>
                    </main>
                </div>
            </AdminCheck>
        </div>
    );
}
