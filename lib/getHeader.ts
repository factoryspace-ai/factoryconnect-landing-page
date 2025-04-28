export const getHeaderNotLoggedIn = (): Record<string, string> => {
    // This function can ONLY run on the client-side after hydration.
    // Make it synchronous as localStorage is synchronous. async is not needed.
    // if (typeof window === 'undefined' || !window.localStorage) {
    //      // This case handles server-side execution or environments without localStorage
    //     console.error("getHeaderNotLoggedIn: localStorage is not available. Ensure this runs client-side.");
    //     throw new Error("Cannot access authentication headers: Not running in a browser environment.");
    // }

    try {
        // Corrected the key from 'acesss_token' to 'access_token'
        const token = localStorage.getItem('access_token');
        // console.log("token", token);

        if (!token) {
            // More specific error message
            console.warn("getHeaderNotLoggedIn: Token not found in localStorage.");
            throw new Error('Authentication token not found in local storage. Please log in.');
        }

        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'accept': 'application/json',
            // CORS headers are typically handled by the server, not sent by the client.
            // Remove these unless specifically required by your backend for some reason.
            // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            // 'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Tenant-ID',
            // 'Access-Control-Allow-Origin': '*',
        };
    } catch (error) {
        console.error('Error retrieving token from localStorage:', error);
        throw new Error('Failed to generate authentication headers due to storage error.');
    }
};