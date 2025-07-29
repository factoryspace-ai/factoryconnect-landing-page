import { getHeader } from "@/utils/get-header";

export class UserMSMEService {
    static async getUserMSMEs() {
        try {
            const header = await getHeader();
            const response = await fetch(`/api/usermsme`, {
                method: "GET",
                headers: header,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to fetch UserMSMEs: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error("Error in getUserMSMEs:", error);
            throw error;
        }
    }

    static async getUserMSMEById(usermsme_id: string) {
        try {
            const header = await getHeader();
            const response = await fetch(`/api/usermsme?association_id=${usermsme_id}`, {
                method: "GET",
                headers: header,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to fetch UserMSME ${usermsme_id}: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error(`Error in getUserMSMEById for UserMSME ${usermsme_id}:`, error);
            throw error;
        }
    }

    static async getUserMSMEByUserId(user_id: string) {
        try {
            const header = await getHeader();
            const response = await fetch(`/api/usermsme/user?user_id=${user_id}`, {
                method: "GET",
                headers: header,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to fetch UserMSME by user ID ${user_id}: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error(`Error in getUserMSMEByUserId for user ${user_id}:`, error);
            throw error;
        }
    }

    static async getUserMSMEByMsmeId(msme_id: string) {
        try {
            const header = await getHeader();
            const response = await fetch(`/api/usermsme/msme?msme_id=${msme_id}`, {
                method: "GET",
                headers: header,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to fetch UserMSME by MSME ID ${msme_id}: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error(`Error in getUserMSMEByMsmeId for MSME ${msme_id}:`, error);
            throw error;
        }
    }

    static async createUserMSME(usermsme: any) {
        try {
            const header = await getHeader();
            const response = await fetch(`/api/usermsme`, {
                method: "POST",
                headers: header,
                body: JSON.stringify(usermsme),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to create UserMSME: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error("Error in createUserMSME:", error);
            throw error;
        }
    }

    static async deleteUserMSME(usermsme_id: string) {
        try {
            const header = await getHeader();
            const response = await fetch(`/api/usermsme?association_id=${usermsme_id}`, {
                method: "DELETE",
                headers: header,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to delete UserMSME ${usermsme_id}: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error(`Error in deleteUserMSME for UserMSME ${usermsme_id}:`, error);
            throw error;
        }
    }
}
