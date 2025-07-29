// app/admin/associations/page.tsx
"use client";
import { useEffect, useState } from "react";
import { UserMSMEService } from "@/services/user-msme";
import { UserService } from "@/services/user";
import { MSMEService } from "@/services/msme";
import { UserMSME } from "@/types/user-msme";
import { User } from "@/types/user";
import { MSME } from "@/types/msme";
import { AssociationsTable } from "@/components/associations-table";
import { AssociationModal } from "@/components/associations-modal";


const AssociationsPage = () => {
    const [associations, setAssociations] = useState<UserMSME[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [msmes, setMSMEs] = useState<MSME[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedAssociation, setSelectedAssociation] = useState<UserMSME | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [associationsData, usersData, msmesData] = await Promise.all([
                UserMSMEService.getUserMSMEs(),
                UserService.getUsers(),
                MSMEService.getMSMEs(),
            ]);
            setAssociations(associationsData);
            setUsers(usersData);
            setMSMEs(msmesData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAssociation = async (associationId: string) => {
        if (confirm("Are you sure you want to delete this association?")) {
            try {
                await UserMSMEService.deleteUserMSME(associationId);
                await fetchData();
            } catch (error) {
                console.error("Error deleting association:", error);
            }
        }
    };

    const handleEditAssociation = (association: UserMSME) => {
        setSelectedAssociation(association);
        setShowModal(true);
    };

    const handleCreateAssociation = () => {
        setSelectedAssociation(null);
        setShowModal(true);
    };

    const getUserName = (userId: string) => {
        const user = users.find(u => u.id === userId);
        return user ? user.name : userId;
    };

    const getMSMEName = (msmeId: string) => {
        const msme = msmes.find(m => m.id === msmeId);
        return msme ? msme.name : msmeId;
    };

    // const filteredAssociations = associations.filter(association =>
    //     getUserName(association.user_id).includes(searchTerm.toLowerCase()) ||
    //     getMSMEName(association.msme_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     association.email.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User-MSME Associations</h1>
                    <p className="text-gray-600 mt-2">Manage user associations with MSMEs</p>
                </div>
                <button
                    onClick={handleCreateAssociation}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                    Add Association
                </button>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                    <div className="flex items-center space-x-4">
                        <input
                            type="text"
                            placeholder="Search associations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <span className="text-sm text-gray-500">
                            {associations.length} of {associations.length} associations
                        </span>
                    </div>
                </div>

                <AssociationsTable
                    associations={associations}
                    loading={loading}
                    onEdit={handleEditAssociation}
                    onDelete={handleDeleteAssociation}
                    getUserName={getUserName}
                    getMSMEName={getMSMEName}
                />
            </div>

            {showModal && (
                <AssociationModal
                    association={selectedAssociation}
                    users={users}
                    msmes={msmes}
                    onClose={() => setShowModal(false)}
                    onSave={fetchData}
                />
            )}
        </div>
    );
};

export default AssociationsPage;
