// app/admin/users/page.tsx
"use client";
import { useEffect, useState } from "react";
import { UserService } from "@/services/user";
import { User } from "@/types/user";
import { UserTable } from "@/components/user-table";
import { UserModal } from "@/components/user-modal";

const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await UserService.getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (confirm("Are you sure you want to delete this user?")) {
            try {
                await UserService.deleteUser(userId);
                await fetchUsers();
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleCreateUser = () => {
        setSelectedUser(null);
        setShowModal(true);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Users</h1>
                    <p className="text-gray-600 mt-2">Manage user accounts and permissions</p>
                </div>
                <button
                    onClick={handleCreateUser}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                    Add New User
                </button>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                    <div className="flex items-center space-x-4">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <span className="text-sm text-gray-500">
                            {filteredUsers.length} of {users.length} users
                        </span>
                    </div>
                </div>

                <UserTable
                    users={filteredUsers}
                    loading={loading}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                />
            </div>

            {showModal && (
                <UserModal
                    user={selectedUser}
                    onClose={() => setShowModal(false)}
                    onSave={fetchUsers}
                />
            )}
        </div>
    );
};

export default UsersPage;