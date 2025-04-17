import { getHeaderNotLoggedIn } from "@/lib/getHeader";

export class RFQQuotationApiService {
    static async getRFQQuotation(quotation_id: number) {
        const headers = await getHeaderNotLoggedIn();
        const response = await fetch(`/api/external/rfq/quotation?quotation_id=${quotation_id}`, {
            method: "GET",
            headers: headers
        });
        
        if (!response.ok) {
            throw new Error("Failed to fetch quotation");
        }
        const data = await response.json();
        return data;
    }
}

