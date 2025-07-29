import { getHeader } from "@/utils/get-header";

export class UserService {
    static async getUsers() {
        try {
            const header = await getHeader();
            const response = await fetch(`/api/user`, {
                method: "GET",
                headers: header,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to fetch users: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error("Error in getUsers:", error);
            throw error;
        }
    }

    static async getUserById(user_id: string) {
        try {
            const header = await getHeader();
            const response = await fetch(`/api/user?user_id=${user_id}`, {
                method: "GET",
                headers: header,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to fetch user ${user_id}: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error(`Error in getUserById for user ${user_id}:`, error);
            throw error;
        }
    }

    static async createUser(user: any) {
        try {
            const header = await getHeader();
            const response = await fetch(`/api/user`, {
                method: "POST",
                headers: header,
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to create user: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error("Error in createUser:", error);
            throw error;
        }
    }

    static async updateUser(user_id: string, user: any) {
        try {
            const header = await getHeader();
            const response = await fetch(`/api/user?user_id=${user_id}`, {
                method: "PUT",
                headers: header,
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to update user ${user_id}: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error(`Error in updateUser for user ${user_id}:`, error);
            throw error;
        }
    }

    static async deleteUser(user_id: string) {
        try {
            const header = await getHeader();
            const response = await fetch(`/api/user?user_id=${user_id}`, {
                method: "DELETE",
                headers: header,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to delete user ${user_id}: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error(`Error in deleteUser for user ${user_id}:`, error);
            throw error;
        }
    }
}