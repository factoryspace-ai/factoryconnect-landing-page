
export const getHeader = async (): Promise<Record<string, string>> => {
    try {
        const token = await fetch('/api/token').then(res => res.json());
        return {
            'Authorization': `Bearer ${token.token}`,
            'Content-Type': 'application/json',
            'accept': 'application/json',
            "ngrok-skip-browser-warning": "true",
            // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            // 'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Tenant-ID',
            // 'Access-Control-Allow-Origin': '*',
        };
    } catch (error) {
        console.error('Error generating headers:', error);
        throw new Error('Failed to generate authentication headers');
    }
};