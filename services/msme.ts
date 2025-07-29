import { getHeader } from "@/utils/get-header";

export class MSMEService {
    static async getMSMEs() {
        try {
            const header = await getHeader();
            const response = await fetch(`/api/msme-admin`, {
                method: "GET",
                headers: header,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to fetch MSMEs: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error("Error in getMSMEs:", error);
            throw error;
        }
    }

    static async getMSMEById(msme_id: string) {
        try {
            const header = await getHeader();
            const response = await fetch(`/api/msme-admin?msme_id=${msme_id}`, {
                method: "GET",
                headers: header,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to fetch MSME ${msme_id}: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error(`Error in getMSMEById for MSME ${msme_id}:`, error);
            throw error;
        }
    }

    static async createMSME(msme: any, creator_user_id: string) {
        try {
            const header = await getHeader();
            const response = await fetch(`/api/msme-admin?creator_user_id=${creator_user_id}`, {
                method: "POST",
                headers: header,
                body: JSON.stringify(msme),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to create MSME: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error("Error in createMSME:", error);
            throw error;
        }
    }

    static async updateMSME(msme_id: string, msme: any) {
        try {
            const header = await getHeader();
            const response = await fetch(`/api/msme-admin?msme_id=${msme_id}`, {
                method: "PUT",
                headers: header,
                body: JSON.stringify(msme),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to update MSME ${msme_id}: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error(`Error in updateMSME for MSME ${msme_id}:`, error);
            throw error;
        }
    }

    static async deleteMSME(msme_id: string) {
        try {
            const header = await getHeader();
            const response = await fetch(`/api/msme-admin?msme_id=${msme_id}`, {
                method: "DELETE",
                headers: header,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to delete MSME ${msme_id}: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error(`Error in deleteMSME for MSME ${msme_id}:`, error);
            throw error;
        }
    }
}
