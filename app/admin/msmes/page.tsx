// app/admin/msmes/page.tsx
"use client";
import { useEffect, useState } from "react";
import { MSMEService } from "@/services/msme";
import { MSME } from "@/types/msme";
import { MSMETable } from "@/components/msme-table";
import { MSMEModal } from "@/components/msme-modal";
import { useUser } from "@clerk/nextjs";

const MSMEsPage = () => {
    const [msmes, setMSMEs] = useState<MSME[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedMSME, setSelectedMSME] = useState<MSME | null>(null);
    const {user} = useUser();

    useEffect(() => {
        fetchMSMEs();
    }, []);

    const fetchMSMEs = async () => {
        try {
            setLoading(true);
            const data = await MSMEService.getMSMEs();
            setMSMEs(data);
        } catch (error) {
            console.error("Error fetching MSMEs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMSME = async (msmeId: string) => {
        if (confirm("Are you sure you want to delete this MSME?")) {
            try {
                await MSMEService.deleteMSME(msmeId);
                await fetchMSMEs();
            } catch (error) {
                console.error("Error deleting MSME:", error);
            }
        }
    };

    const handleEditMSME = (msme: MSME) => {
        setSelectedMSME(msme);
        setShowModal(true);
    };

    const handleCreateMSME = () => {
        setSelectedMSME(null);
        setShowModal(true);
    };

    const filteredMSMEs = msmes.filter(msme =>
        msme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msme.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msme.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">MSMEs</h1>
                    <p className="text-gray-600 mt-2">Manage MSME organizations</p>
                </div>
                <button
                    onClick={handleCreateMSME}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                    Add New MSME
                </button>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                    <div className="flex items-center space-x-4">
                        <input
                            type="text"
                            placeholder="Search MSMEs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <span className="text-sm text-gray-500">
                            {filteredMSMEs.length} of {msmes.length} MSMEs
                        </span>
                    </div>
                </div>

                <MSMETable
                    msmes={filteredMSMEs}
                    loading={loading}
                    onEdit={handleEditMSME}
                    onDelete={handleDeleteMSME}
                />
            </div>

            {showModal && (
                <MSMEModal
                    msme={selectedMSME}
                    onClose={() => setShowModal(false)}
                    onSave={fetchMSMEs}
                    creator_user_id={user?.id!}
                />
            )}
        </div>
    );
};

export default MSMEsPage;