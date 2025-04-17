"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { RFQSubcontractorNotLoggedInApiService } from "@/lib/services/rfq/api"
import { toast } from "sonner"
import { Quotation } from "@/components/rfq/components/rfq-quotation-component"
import { LoadingSkeleton } from "@/components/loading-skeleton" // Use consistent loading
import { RFQDetails } from "@/lib/services/rfq/types" // Import type

export default function QuotationPage() {
  const searchParams = useSearchParams()
  const rfqIdParam = searchParams.get("rfq_id")
  const quotationIdParam = searchParams.get("id") // For viewing/editing existing quotation
  const [rfqData, setRfqData] = useState<RFQDetails | null>(null)
  const [name, setName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true)

   // Fetch RFQ Data once tenantId is available and rfqIdParam is valid
   useEffect(() => {
    if (rfqIdParam && !isNaN(parseInt(rfqIdParam))) {
      fetchRFQData(parseInt(rfqIdParam))
    } else if (!rfqIdParam || isNaN(parseInt(rfqIdParam))) {
       toast.error("Invalid or missing RFQ ID for quotation.");
       setIsLoading(false); // Stop loading if RFQ ID is invalid
    }
    // Don't fetch if tenantId is still null
  }, [rfqIdParam])

  const fetchRFQData = async (id: number) => {
    setIsLoading(true); // Ensure loading state is true
    try {
      // Subcontractors always get RFQ details via this endpoint when creating/viewing their quotation
      const response = await RFQSubcontractorNotLoggedInApiService.getRFQById(id)
      console.log(response);
      setRfqData(response)
    } catch (error) {
      console.error("Error fetching RFQ data for quotation:", error)
      toast.error("Failed to fetch RFQ data.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingSkeleton variant="defaultPage" />; // Use consistent loading skeleton
  }

   if (!rfqData) {
     // Handle case where RFQ data couldn't be fetched but loading finished
     return (
         <div className="flex items-center justify-center h-[60vh]">
             <div className="text-center">
                 <h2 className="text-xl font-semibold mb-2">RFQ Data Not Available</h2>
                 <p className="text-muted-foreground">Could not load the details for the requested RFQ.</p>
             </div>
         </div>
     );
   }

    const quotationId = quotationIdParam ? parseInt(quotationIdParam) : undefined;
    const pageTitle = quotationId ? `View Quotation (ID: ${quotationId})` : `Create Quotation for RFQ ${rfqData.id}`;
    const breadcrumbLabel = quotationId ? `View Quotation ${quotationId}` : `Create Quotation`;

  return (
      <>
          <div className=""> {/* Added padding */}
              <Quotation
                  rfqData={rfqData}
                  quotationId={quotationId}
                  msmeName={name!}
              />
          </div>
      </>
  )
}
