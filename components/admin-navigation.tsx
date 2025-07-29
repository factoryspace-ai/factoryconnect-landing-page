"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const navigationItems = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Users", href: "/admin/users", icon: "👥" },
    { name: "MSMEs", href: "/admin/msmes", icon: "🏢" },
    { name: "Associations", href: "/admin/associations", icon: "🔗" },
];

export const AdminNavigation = () => {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-white shadow-lg">
            <div className="p-6 border-b">
                <h1 className="text-xl font-bold text-gray-800">Factory Space Admin</h1>
            </div>
            
            <nav className="mt-6">
                {navigationItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                            pathname === item.href
                                ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                    </Link>
                ))}
            </nav>
            
            <div className="absolute bottom-6 left-6">
                <UserButton />
            </div>
        </div>
    );
};
