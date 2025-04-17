"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Clarification, RFQDetails, SubcontractorResponse } from "@/lib/services/rfq/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar" // Removed AvatarImage
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { format } from "date-fns"
import { FileText, MessageSquare, Send, Plus, Clock, CheckCircle, AlertCircle, User, Building } from "lucide-react" // Added User, Building
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { LoadingSkeleton } from "@/components/loading-skeleton" // Use standard loader
import { RFQSubcontractorNotLoggedInApiService } from "@/lib/services/rfq/api"

const messageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
})

type MessageFormValues = z.infer<typeof messageSchema>

interface RFQDetailsProps {
  rfqId: number
}

// Add proper type augmentation for the missing properties
interface EnhancedClarification extends Clarification {
  sender_tenant_id?: string;
  timestamp?: string;
  sender_role?: string;
}

export default function RFQDetailsView({ rfqId }: RFQDetailsProps) {
  const [rfqDetails, setRfqDetails] = useState<RFQDetails | null>(null)
  const [clarifications, setClarifications] = useState<EnhancedClarification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [isTier1User, setIsTier1User] = useState<boolean | null>(null);
  const [availableMsmes, setAvailableMsmes] = useState<{ id: string; name: string }[]>([]) // Use simpler type
  const router = useRouter()

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  })

  // Fetch available companies (assuming this is for selection)
  useEffect(() => {
    fetchAvailableMsmes()
  }, [])

  const fetchAvailableMsmes = async () => {
    try {
      // Assuming this API returns a list of potential subcontractors/companies
      const response = await fetch("/api/msme/available"); // Use your actual endpoint
      if (!response.ok) throw new Error("Failed to fetch available companies");
      const data = await response.json();
      // Assuming data.msmes is the array [{ id: string, name: string, ... }]
      // TODO: Filter out the current user's own company if necessary
      setAvailableMsmes(data.msmes.map((msme: any) => ({ id: msme.id, name: msme.name })));
    } catch (error) {
      console.error(error);
      toast.error("Error fetching available companies. Selection might be unavailable.");
    }
  };
  // Fetch RFQ Details when tenantId is available
  useEffect(() => {
    if (rfqId ) {
      fetchRFQDetails();
    }
  }, [rfqId])


  const fetchRFQDetails = async () => {

    setIsLoading(true)
    setRfqDetails(null);
    setClarifications([]);
    setIsTier1User(null);

    try {
      // Attempt to fetch as Tier 1 first
      let details: RFQDetails | null = null;
      let fetchedClarifications: EnhancedClarification[] = [];
      let userIsTier1: boolean | null = null;

        try {
          const subResponse = await RFQSubcontractorNotLoggedInApiService.getRFQById(rfqId);
          console.log("Fetched as Subcontractor successfully", subResponse);
          details = subResponse;
          userIsTier1 = false;

          // Fetch clarifications specifically for this subcontractor
          try {
            const clarificationsResponse = await RFQSubcontractorNotLoggedInApiService.getClarifications(rfqId);
            fetchedClarifications = clarificationsResponse || [];
            console.log("Fetched subcontractor clarifications:", fetchedClarifications);
          } catch (clarificationError) {
            console.warn("Failed to fetch clarifications, they might be included in RFQ response:", clarificationError);
            // Try to extract clarifications from the RFQ response if available
            fetchedClarifications = subResponse || [];
          }
        } catch (subError) {
          console.error("Error fetching RFQ details as both Tier 1 and Subcontractor:", subError);
          toast.error("Failed to fetch RFQ details. You may not have access.");
        }
      

      if (details) {
        setRfqDetails(details);
        setClarifications(fetchedClarifications);
        setIsTier1User(userIsTier1);
        console.log("Final RFQ Details State:", details);
        console.log("User is Tier 1:", userIsTier1);
        console.log("Clarifications:", fetchedClarifications);
      }

    } catch (error) {
      console.error("General error fetching RFQ details:", error)
      toast.error("An unexpected error occurred while fetching RFQ details.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async (data: MessageFormValues) => {
    if (isTier1User === null || !rfqDetails) {
      toast.error("Cannot send message: user type or RFQ details unclear.");
      return;
    }

    setIsSending(true)
    try {
      const payload: Clarification = {
        message: data.message,
      };

        // Adjust the parameters based on the actual API requirements
        await RFQSubcontractorNotLoggedInApiService.clarifyRFQ(payload, rfqId);

      // Refresh the clarifications only
      fetchClarifications();
      form.reset()
      toast.success("Message sent successfully")
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Failed to send message. " + (error as Error).message);
    } finally {
      setIsSending(false)
    }
  }

  // Function to only refresh clarifications
  const fetchClarifications = async () => {
    try {
      let fetchedClarifications: EnhancedClarification[] = [];
      
        // Subcontractor sees clarifications relevant to them
        try {
          const response = await RFQSubcontractorNotLoggedInApiService.getClarifications(rfqId);
          console.log("Fetched clarifications as Subcontractor successfully", response);
          fetchedClarifications = response || [];
        } catch (error) {
          console.warn("getClarifications endpoint might not exist, falling back to RFQ data:", error);
          // If the endpoint doesn't exist, try to use clarifications from the rfqDetails if available
          if (rfqDetails && (rfqDetails as any).clarifications) {
            fetchedClarifications = (rfqDetails as any).clarifications;
          }
        }
      
      setClarifications(fetchedClarifications);
    } catch (error) {
      console.error("Error refreshing clarifications:", error);
      toast.error("Could not refresh messages.");
    }
  }


  const handleCreateQuotation = () => {
    // Navigate to quotation page with RFQ ID
    router.push(`/app/rfq/create-quotation?rfq_id=${rfqId}`)
  }

  const handleViewQuotation = (quotationId: number) => {
    router.push(`/app/rfq/view-quotation?rfq_id=${rfqId}&quotation_id=${quotationId}`);
  }

  if (isLoading) {
    return <LoadingSkeleton variant="defaultPage" />;
  }

  if (!rfqDetails || isTier1User === null) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">RFQ Not Found or Access Denied</h2>
          <p className="text-muted-foreground">The requested RFQ could not be found or you may not have permission to view it.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/app?tab=rfq-details")}
          >
            Back to RFQ List
          </Button>
        </div>
      </div>
    )
  }

  // Determine which quotations to show - using type assertion for tenant_id
  const relevantQuotations = rfqDetails.quotations ?? [];

  const getStatusBadge = (status: string) => {
    const lowerStatus = status?.toLowerCase() || '';
    switch (lowerStatus) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case 'in progress': // Example
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">In Progress</Badge>;
      case 'completed': // Example
        return <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white">Completed</Badge>;
      case 'submitted': // Example for quotation status
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300"><CheckCircle className="h-3 w-3 mr-1" /> Submitted</Badge>;
      default:
        return <Badge variant="secondary">{status || 'Unknown'}</Badge>;
    }
  }


  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{rfqDetails.title}</h1>
          <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
            <span>Created: {format(new Date(rfqDetails.created_at), 'PP')}</span>
            <span>RFQ ID: {rfqDetails.id}</span>
            <span>Status: {getStatusBadge(rfqDetails.status)}</span>
            <span>Quantity: {rfqDetails.quantity}</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> Deadline: {format(new Date(rfqDetails.deadline), 'PP')}</span>
          </div>
          {/* Show Customer/Creator Info */}
          {isTier1User && rfqDetails.invited_subcontractors?.length > 0 && (
            <div className="mt-2 text-sm">
              <span className="font-medium">Sent to: </span>
              {/* Ideally resolve IDs to names */}
              <span className="text-muted-foreground">{rfqDetails.invited_subcontractors.flatMap(s => s.subcontractor_ids).length} Subcontractor(s)</span>
            </div>
          )}
          {!isTier1User && rfqDetails.tenant_id && (
            <div className="mt-2 text-sm">
              <span className="font-medium">From: </span>
              {/* Ideally resolve ID to name */}
              <span className="text-muted-foreground">Company ID {availableMsmes.find(msme => msme.id === rfqDetails.tenant_id)?.name || 'Unknown'}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0">
          {!isTier1User && (
            <Button
              onClick={handleCreateQuotation}
              className="flex items-center gap-2"
              // Disable if quotation already submitted? Check relevantQuotations
              disabled={relevantQuotations.length > 0}
            >
              <Plus className="h-4 w-4" />
              {relevantQuotations.length > 0 ? 'Quotation Submitted' : 'Submit Quotation'}
            </Button>
          )}
          {/* Add Tier 1 actions here if needed (e.g., Add Subcontractor, Send Invites, Close RFQ) */}
          {isTier1User && (
            <Button
              variant="outline"
              onClick={() => router.push(`/rfq/edit/${rfqId}`)}
              className="flex items-center gap-2"
            >
              Edit RFQ
            </Button>
            // Add other Tier 1 buttons
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - RFQ Details & Quotations */}
        <div className="space-y-6 lg:col-span-2">
          {/* RFQ Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>RFQ Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {rfqDetails.drawing_link && (
                <div>
                  <h4 className="font-medium mb-1 text-gray-700">Drawing</h4>
                  <Link
                    href={rfqDetails.drawing_link}
                    target="_blank"
                    rel="noopener noreferrer" // Added for security
                    className="flex items-center gap-2 text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    View Technical Drawing
                  </Link>
                </div>
              )}
              <Separator />
              <div>
                <h4 className="font-medium mb-1 text-gray-700">Material Specifications</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{rfqDetails.material_specifications || "N/A"}</p> {/* Added pre-wrap */}
              </div>
              {rfqDetails.additional_specifications && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-1 text-gray-700">Additional Specifications</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">{rfqDetails.additional_specifications}</p> {/* Added pre-wrap */}
                  </div>
                </>
              )}
              {rfqDetails.constraints && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-1 text-gray-700">Constraints</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">{rfqDetails.constraints}</p> {/* Added pre-wrap */}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quotations section */}
          <Card>
            <CardHeader>
              <CardTitle>Quotations</CardTitle>
              <CardDescription>
                {isTier1User
                  ? 'Quotations received from subcontractors'
                  : 'Your quotation submissions for this RFQ'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {relevantQuotations.length > 0 ? (
                <ul className="space-y-4">
                  {relevantQuotations.map((quotation) => (
                    <li key={quotation.id} className="border rounded-lg p-4 transition-shadow hover:shadow-md">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                        <span className="font-medium text-sm">
                          {isTier1User
                            ? `From: ${availableMsmes.find(msme => msme.id === quotation.subcontractor_id)?.name || 'Unknown'}`
                            : 'Your Quotation'
                          }
                        </span>
                        {getStatusBadge((quotation as SubcontractorResponse).status || 'Submitted')}
                        <span className="text-xs text-muted-foreground">
                          {(quotation as SubcontractorResponse).submitted_at
                            ? format(new Date((quotation as SubcontractorResponse).submitted_at!), 'PPp')
                            : ''
                          }
                        </span>
                      </div>

                      <Button
                        variant="link"
                        className="p-0 h-auto text-blue-600"
                        onClick={() => handleViewQuotation(quotation.id!)}
                      >
                        View Full Quotation Details
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <FileText className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm">
                    {isTier1User
                      ? 'No quotations have been submitted yet.'
                      : 'You have not submitted a quotation for this RFQ.'}
                  </p>
                  {!isTier1User && (
                    <Button
                      className="mt-4"
                      onClick={handleCreateQuotation}
                      size="sm"
                    >
                      Create Quotation
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column - Messages & Communication */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Messages & Clarifications</CardTitle>
              <CardDescription>
                Communicate about this RFQ
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow mb-4"> {/* Added margin bottom */}
              {/* Set explicit height for scroll area */}
              <ScrollArea className="h-[450px] pr-4 -mr-4"> {/* Negative margin trick for scrollbar */}
                {clarifications.length > 0 ? (
                  <div className="space-y-5">
                    {clarifications.map((clarification) => {
                      const isCurrentUser = clarification.sender_tenant_id === rfqDetails.tenant_id;
                      const senderName = isCurrentUser 
                        ? "You" 
                        : availableMsmes.find(msme => msme.id === clarification.sender_tenant_id)?.name || 'Other Party';
                      
                      return (
                        <div key={clarification.id} className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''} mb-4`}>
                          <Avatar className={`${isCurrentUser ? 'mt-auto' : 'mt-1'}`}>
                            <AvatarFallback className={isCurrentUser 
                              ? "bg-blue-100 text-blue-700" 
                              : "bg-gray-100 text-gray-600"}>
                              {isCurrentUser 
                                ? <User className="h-4 w-4" /> 
                                : <Building className="h-4 w-4" />}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className={`flex-1 max-w-[80%] space-y-1 rounded-md border ${
                            isCurrentUser 
                              ? 'bg-blue-50 border-blue-200 text-blue-900' 
                              : 'bg-muted/50 border-gray-200'
                            } p-3`}>
                            <div className={`flex items-center justify-between text-xs text-muted-foreground ${
                              isCurrentUser ? 'flex-row-reverse' : ''
                            }`}>
                              <p className={`font-medium ${isCurrentUser ? 'text-blue-700' : 'text-primary'}`}>
                                {senderName}
                              </p>
                              <p className="text-gray-500">
                                {clarification.timestamp
                                  ? format(new Date(clarification.timestamp), 'Pp')
                                  : ''}
                              </p>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{clarification.message}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 text-muted-foreground h-full flex flex-col justify-center items-center">
                    <MessageSquare className="h-10 w-10 text-gray-400 mb-3" />
                    <p className="text-sm">No messages yet.</p>
                    <p className="text-xs">Start the conversation below.</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
            {/* Message Input Form - Stick to bottom */}
            <CardFooter className="mt-auto pt-4 border-t bg-background sticky bottom-0 pb-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSendMessage)} className="w-full">
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex gap-2 items-end"> {/* Align items end */}
                            <Textarea
                              placeholder="Type your message..."
                              className="flex-1 resize-none min-h-[40px]" // Adjusted height
                              rows={1} // Start with 1 row, auto-expand
                              onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto'; // Reset height
                                target.style.height = `${target.scrollHeight}px`; // Set to scroll height
                              }}
                              {...field}
                            />
                            <Button
                              type="submit"
                              size="icon"
                              className="h-10 w-10 flex-shrink-0" // Fixed size
                              disabled={isSending || !field.value} // Disable if sending or empty
                              aria-label="Send message"
                            >
                              {isSending ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              ) : (
                                <Send className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage className="mt-1" />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

