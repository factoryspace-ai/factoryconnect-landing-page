"use client";
import { useEffect, useState } from "react";
import { UserService } from "@/services/user";
import { MSMEService } from "@/services/msme";
import { UserMSMEService } from "@/services/user-msme";

interface Stats {
    totalUsers: number;
    totalMSMEs: number;
    totalAssociations: number;
    activeUsers: number;
    activeMSMEs: number;
}

const AdminDashboard = () => {
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        totalMSMEs: 0,
        totalAssociations: 0,
        activeUsers: 0,
        activeMSMEs: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [users, msmes, associations] = await Promise.all([
                    UserService.getUsers(),
                    MSMEService.getMSMEs(),
                    UserMSMEService.getUserMSMEs(),
                ]);

                setStats({
                    totalUsers: users.length || 0,
                    totalMSMEs: msmes.length || 0,
                    totalAssociations: associations.length || 0,
                    activeUsers: users.filter((user: any) => user.is_active).length || 0,
                    activeMSMEs: msmes.filter((msme: any) => msme.is_active).length || 0,
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { title: "Total Users", value: stats.totalUsers, color: "blue", icon: "👥" },
        { title: "Active Users", value: stats.activeUsers, color: "green", icon: "✅" },
        { title: "Total MSMEs", value: stats.totalMSMEs, color: "purple", icon: "🏢" },
        { title: "Active MSMEs", value: stats.activeMSMEs, color: "indigo", icon: "🟢" },
        { title: "Associations", value: stats.totalAssociations, color: "orange", icon: "🔗" },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome to Factory Space Admin Panel</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                {statCards.map((card) => (
                    <div key={card.title} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                            </div>
                            <div className="text-2xl">{card.icon}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                    <p className="text-gray-600">Activity tracking coming soon...</p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                    <div className="space-y-2">
                        <button className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                            Add New User
                        </button>
                        <button className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                            Add New MSME
                        </button>
                        <button className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                            Manage Associations
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
