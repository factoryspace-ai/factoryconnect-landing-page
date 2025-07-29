// components/association-modal.tsx
"use client";
import { useState, useEffect } from "react";
import { UserMSME, CreateUserMSME } from "@/types/user-msme";
import { User } from "@/types/user";
import { MSME } from "@/types/msme";
import { UserMSMEService } from "@/services/user-msme";

interface AssociationModalProps {
    association: UserMSME | null;
    users: User[];
    msmes: MSME[];
    onClose: () => void;
    onSave: () => void;
}

const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "employee", label: "Employee" },
    { value: "viewer", label: "Viewer" },
];

export const AssociationModal = ({
    association,
    users,
    msmes,
    onClose,
    onSave
}: AssociationModalProps) => {
    const [formData, setFormData] = useState<Partial<CreateUserMSME>>({
        user_id: "",
        msme_id: "",
        access_level: "employee",
        email: "",
        status: "active",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (association) {
            setFormData({
                user_id: association.user_id,
                msme_id: association.msme_id,
                access_level: association.access_level,
                email: association.email,
                status: association.status,
            });
        } else {
            // Reset form when creating new association
            setFormData({
                user_id: "",
                msme_id: "",
                access_level: "employee",
                email: "",
                status: "active",
            });
        }
        setErrors({});
    }, [association]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.user_id) {
            newErrors.user_id = "User is required";
        }
        if (!formData.msme_id) {
            newErrors.msme_id = "MSME is required";
        }
        if (!formData.access_level) {
            newErrors.access_level = "Access level is required";
        }
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {

            await UserMSMEService.createUserMSME(formData);

            onSave();
            onClose();
        } catch (error: any) {
            console.error("Error saving association:", error);
            // Handle specific API errors
            if (error.response?.data?.error) {
                setErrors({ general: error.response.data.error });
            } else {
                setErrors({ general: "An error occurred while saving the association" });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUserChange = (userId: string) => {
        const selectedUser = users.find(user => user.id === userId);
        setFormData({
            ...formData,
            user_id: userId,
            email: selectedUser?.email || formData.email,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        {association ? "Edit Association" : "Create New Association"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                {errors.general && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {errors.general}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                User *
                            </label>
                            <select
                                value={formData.user_id || ""}
                                onChange={(e) => handleUserChange(e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.user_id ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                required
                            >
                                <option value="">Select a user</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                            {errors.user_id && (
                                <p className="mt-1 text-sm text-red-600">{errors.user_id}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                MSME *
                            </label>
                            <select
                                value={formData.msme_id || ""}
                                onChange={(e) => setFormData({ ...formData, msme_id: e.target.value })}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.msme_id ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                required
                            >
                                <option value="">Select an MSME</option>
                                {msmes.map((msme) => (
                                    <option key={msme.id} value={msme.id}>
                                        {msme.name} ({msme.city})
                                    </option>
                                ))}
                            </select>
                            {errors.msme_id && (
                                <p className="mt-1 text-sm text-red-600">{errors.msme_id}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role *
                        </label>
                        <select
                            value={formData.access_level || ""}
                            onChange={(e) => setFormData({ ...formData, access_level: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.access_level ? 'border-red-500' : 'border-gray-300'
                                }`}
                            required
                        >
                            {roleOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {errors.role && (
                            <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                value={formData.email || ""}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                required
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.status === "active"}
                                onChange={(e) => setFormData({ ...formData, status: e.target.checked ? "active" : "inactive" })}
                                className="mr-2"
                            />
                            Active
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : association ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
