export class EmailOtpAuthService {
    // Sends email and invite_token in the BODY
    static async sendOtp(email: string, invite_token: string) {
        const response = await fetch(`/api/external/email-otp-auth/send-otp`, { // Removed query params from URL
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },
            // Send data in the body
            body: JSON.stringify({ email, invite_token }),
        });
        console.log(response);
        const data = await response.json();
        console.log("data", data);
        if (!response.ok) {
            // Try to parse error message from backend if available
            let errorMsg = `HTTP error! status: ${response.status}`;
            try {
                const errorBody = await response.json();
                errorMsg = errorBody.detail || errorBody.message || errorMsg;
            } catch (e) { /* Ignore parsing error */ }
            throw new Error(errorMsg);
        }
        // send-otp might return just a success message or {}
        return data;
    }

    // Sends email, otp, and invite_token in the BODY
    static async verifyOtp(email: string, otp_code: string, invite_token: string) {
        const response = await fetch(`/api/external/email-otp-auth/verify-otp`, { // Removed query params from URL
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },
            // Send data in the body
            body: JSON.stringify({ email, otp_code, invite_token }),
        });

        if (!response.ok) {
             // Try to parse error message from backend if available
            let errorMsg = `HTTP error! status: ${response.status}`;
            try {
                const errorBody = await response.json();
                errorMsg = errorBody.detail || errorBody.message || errorMsg;
            } catch (e) { /* Ignore parsing error */ }
            throw new Error(errorMsg);
        }
        const body = await response.json();
        // No need to set localStorage here, do it in the component after successful call
        // localStorage.setItem('access_token', body.access_token); // REMOVE this side-effect
        return body; // Contains access_token
    }
}