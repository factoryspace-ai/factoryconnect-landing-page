import { getHeaderNotLoggedIn } from "@/lib/getHeader";
import { Clarification, RFQSubcontractors } from "./types";

export class RFQSubcontractorNotLoggedInApiService {
    static async getRFQCustomers() {
        const header = getHeaderNotLoggedIn();
        const response = await fetch(`/api/external/rfq/subcontractors/not-loggedin`, {
            method: "GET",
            headers: header,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }
    
    static async getRFQById(rfq_id: number) {
        const header = getHeaderNotLoggedIn();
        console.log("header", header);
        const response = await fetch(`/api/external/rfq/subcontractors/not-loggedin/get_by_id?rfq_id=${rfq_id}`, {
            method: "GET",
            headers: header,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }
    
    static async respondRFQ(data: RFQSubcontractors, rfq_id: number) {
        const header = getHeaderNotLoggedIn();
        const response = await fetch(`/api/external/rfq/subcontractors/not-loggedin/respond?rfq_id=${rfq_id}`, {
            method: "POST",
            headers: header,
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    static async clarifyRFQ(data: Clarification, rfq_id: number) {
        const header = getHeaderNotLoggedIn();
        const response = await fetch(`/api/external/rfq/subcontractors/not-loggedin/clarify?rfq_id=${rfq_id}`, {
            method: "POST",
            headers: header,
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    static async getClarifications(rfq_id: number) {
        const header = getHeaderNotLoggedIn();
        const response = await fetch(`/api/external/rfq/subcontractors/not-loggedin/clarify?rfq_id=${rfq_id}`, {
            method: "GET",
            headers: header,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }
}