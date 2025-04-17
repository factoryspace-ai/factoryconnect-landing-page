"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { RFQSubcontractorNotLoggedInApiService } from "@/lib/services/rfq/api"
import { toast } from "sonner"
import { Quotation, QuotationFormValues } from "@/components/rfq/components/rfq-quotation-component"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { RFQDetails, SubcontractorResponse, Clarification } from "@/lib/services/rfq/types" // Import Clarification type
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { RFQQuotationApiService } from "@/lib/services/rfq/quotation/api"

export default function QuotationPage() {
  const searchParams = useSearchParams()
  const rfqIdParam = searchParams.get("rfq_id")
  const quotationIdParam = searchParams.get("quotation_id") // For viewing/editing existing quotation
  const [rfqData, setRfqData] = useState<RFQDetails | null>(null)
  const [quotationData, setQuotationData] = useState<QuotationFormValues | null>(null)
  const [clarifications, setClarifications] = useState<Clarification[]>([]) // State for clarifications
  const [name, setName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Fetch RFQ Data once tenantId is available and rfqIdParam is valid
  useEffect(() => {
    if (rfqIdParam && !isNaN(parseInt(rfqIdParam))) {
      fetchRFQData(parseInt(rfqIdParam))
    } else if (!rfqIdParam || isNaN(parseInt(rfqIdParam))) {
      toast.error("Invalid or missing RFQ ID for quotation.");
      setIsLoading(false);
    }
  }, [rfqIdParam])

  // Fetch quotation data if viewing an existing quotation
  useEffect(() => {
    if (quotationIdParam && !isNaN(parseInt(quotationIdParam))) {
      fetchQuotationData(parseInt(quotationIdParam));
    }
  }, [quotationIdParam]);

  const fetchQuotationData = async (id: number) => {
    try {
      // Implementation will depend on your API structure
      const response = await RFQQuotationApiService.getRFQQuotation(id);
      console.log("Quotation data at view quotation page:", response);
      setQuotationData(response.quotationData.quotation_data);

      // Placeholder for now
      console.log(`Would fetch quotation data for ID: ${id}`);
    } catch (error) {
      console.error("Error fetching quotation data:", error);
      toast.error("Failed to fetch quotation details.");
    }
  };

  const fetchRFQData = async (id: number) => {
    setIsLoading(true);
    setRfqData(null); // Reset data
    setClarifications([]); // Reset clarifications

    // Try as Subcontractor
    try {
      const subResponse = await RFQSubcontractorNotLoggedInApiService.getRFQById(id);
      console.log("Fetched as Subcontractor successfully");
      setRfqData(subResponse);

      // For Subcontractor, clarifications may be included in the response
      if (subResponse.clarifications) {
        setClarifications(subResponse.clarifications);
      }
      // If not, we'll fetch them separately in the useEffect
    } catch (subError) {
      console.error("Error fetching RFQ details as both Tier 1 and Subcontractor:", subError);
      toast.error("Failed to fetch RFQ details. You may not have access to this RFQ.");
    }
};

if (isLoading) {
  return <LoadingSkeleton variant="defaultPage" />;
}

if (!rfqData) {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">RFQ Not Found or Access Denied</h2>
        <p className="text-muted-foreground">The requested RFQ could not be found or you may not have permission to view it.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/workspace/request-for-quotation")}
        >
          Back to RFQ List
        </Button>
      </div>
    </div>
  );
}

const quotationId = quotationIdParam ? parseInt(quotationIdParam) : undefined;
const pageTitle = quotationId ? `View Quotation (ID: ${quotationId})` : `Create Quotation for RFQ ${rfqData.id}`;
const breadcrumbLabel = quotationId ? `View Quotation ${quotationId}` : `Create Quotation`;

return (
  <>
    <div className="container py-8">
      <Quotation
        rfqData={rfqData}
        quotationId={quotationId}
        msmeName={name!}
        previewMode={quotationId !== undefined}
        clarifications={clarifications} // Pass clarifications to the Quotation component
        quotationData={quotationData}
      />
    </div>
  </>
);
}
