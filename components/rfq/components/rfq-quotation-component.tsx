import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button"; // Adjusted import path
import { Input } from "@/components/ui/input"; // Adjusted import path
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"; // Adjusted import path
// Removed Zustand imports - manage state locally or via props
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Trash, Info } from "lucide-react";
// Removed unused QuotationService import
import { Clarification, RFQDetails } from "@/lib/services/rfq/types";
import { RFQSubcontractorNotLoggedInApiService } from "@/lib/services/rfq/api";
// Removed fetchMsmeDetails import, rely on passed tenantId
import { Textarea } from "@/components/ui/textarea"; // Added Textarea
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // For RFQ info
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RFQQuotationApiService } from "@/lib/services/rfq/quotation/api";
import QuotationPreviewRfq from "./quotation-preview";


// --- Zod Schema for Quotation Form ---
const quotationLineSchema = z.object({
      // id: z.number().optional(), // RHF assigns id, backend might assign its own
      partNo: z.string().optional(), // Part number from RFQ might be reference
      partDescription: z.string().min(1, "Description is required."), // Description of service/item offered
      partCost: z.coerce.number().positive({ message: "Cost must be positive." }), // Cost per unit/service
      minimumQty: z.coerce.number().int().positive({ message: "Quantity must be positive." }), // Corresponds to RFQ quantity usually
      // noOfOperations: z.string().optional(), // Keep if relevant, otherwise remove
      leadTime: z.string().optional(), // Example: Add lead time
      notes: z.string().optional(), // Example: Add notes per line
    });

const quotationSchema = z.object({
  // Seller Details (Prefilled mostly)
  SellerName: z.string(), // Your company name
  sellerAddress1: z.string().optional(),
  sellerAddress2: z.string().optional(),
  sellerGSTIN: z.string().optional(), // Your GSTIN if applicable
  sellerStateName: z.string().optional(),
  sellerCityName: z.string().optional(),
  sellerPincode: z.string().optional(),
  sellerCountry: z.string().optional(),
  sellerContact: z.string().optional(),
  sellerEmail: z.string().optional(),

  // Customer Details (From RFQ or selected)
  customerName: z.string().min(1, "Customer Name required"), // Customer who sent RFQ
  address1: z.string().optional(), // Customer Address
  address2: z.string().optional(),
  custGSTIN: z.string().optional(), // Customer GSTIN if known
  custStateName: z.string().optional(),
  custCityName: z.string().optional(),
  custPincode: z.string().optional(),
  custCountry: z.string().optional(),
  // placeOfSupply: z.string().optional(), // Often derived from customer state

  // Quotation Details
  // invoiceNumber: z.string().optional(), // Use Quotation Number instead?
  quotationNumber: z.string().optional(), // Auto-generate or manual
  invoiceDate: z.string(), // Date of Quotation creation

  // Terms
  paymentTerms: z.string().optional(), // e.g., "Net 30", "50% Advance"
  taxes: z.string().optional(), // e.g., "GST @ 18% extra", "Prices inclusive of taxes"
  transportation: z.string().optional(), // e.g., "Ex-works", "Freight extra at actuals"
  deliveryinst: z.string().optional(), // Specific delivery notes
  validity: z.string().optional(), // e.g., "Quote valid for 30 days"
  // paymentAgree: z.string().optional(), // Covered by paymentTerms?
  // expDurnofProcessing: z.string().optional(), // Covered by leadTime in lines?

  // Line Items
  quotationLines: z.array(quotationLineSchema)
        .min(1, "At least one quotation line is required."), // Must have at least one line item

});

export type QuotationFormValues = z.infer<typeof quotationSchema>;

interface QuotationProps {
  rfqData: RFQDetails; // Make RFQ data mandatory for context
  quotationId?: number; // Optional: for viewing/editing existing quotation
  tenantId?: string; // Your MSME/Tenant ID
  msmeName: string; // Your MSME Name
  previewMode?: boolean;
  clarifications?: Clarification[];
  quotationData?: QuotationFormValues | null;
}

export const Quotation: React.FC<QuotationProps> = ({
    rfqData,
    quotationId,
    tenantId,
    msmeName,
    previewMode = false,
    clarifications = [],
    quotationData
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(previewMode);
  const [isLoading, setIsLoading] = useState(false); // Loading state for submission
  const [isFetchingExisting, setIsFetchingExisting] = useState(false); // Loading for existing quote
  const [availableMsmes, setAvailableMsmes] = useState<{ id: string; name: string; address?: string; city?: string; zipCode?: string; state?: string; country?: string; contact_number?: string; contact_email?: string; }[]>([]);

  const router = useRouter();

  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      SellerName: msmeName || '', // Set default value for SellerName
      // ... other default values
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "quotationLines",
  });

  const formData = form.watch(); // Watch all form data for preview

  // Calculate totals for invoice display
  const calculateLineTotal = (qty: number, cost: number) => {
    return qty * cost;
  };

  const subtotal = formData.quotationLines?.reduce((sum, line) => {
    return sum + calculateLineTotal(line.minimumQty || 0, line.partCost || 0);
  }, 0) || 0;

  // Parse tax rate from text field - this is a simple extraction, could be enhanced
  const getTaxRate = () => {
    const taxText = formData.taxes || '';
    const match = taxText.match(/(\d+(\.\d+)?)%/);
    return match ? parseFloat(match[1]) / 100 : 0;
  };

  const taxAmount = subtotal * getTaxRate();
  const grandTotal = subtotal + taxAmount;

  // --- Fetch Available MSMEs (for customer/seller info lookup if needed) ---
  useEffect(() => {
    fetchAvailableMsmes();
  }, []);

  const fetchAvailableMsmes = async () => {
    try {
      const response = await fetch("/api/msme/available");
      if (!response.ok) throw new Error("Failed to fetch available MSMEs");
      const data = await response.json();
      setAvailableMsmes(data.msmes || []);
    } catch (error) {
      console.error(error);
    }
  };

  // --- Effect to Initialize Form Data ---
  useEffect(() => {
    const initializeForm = async () => {
      setIsFetchingExisting(true);

      // Find Seller (Your Company) Details
      const seller = availableMsmes.find((msme) => msme.id === tenantId);
      const sellerDetails = {
        SellerName: msmeName || seller?.name || tenantId,
        sellerAddress1: seller?.address || "",
        sellerAddress2: "",
        sellerCityName: seller?.city || "",
        sellerPincode: seller?.zipCode || "",
        sellerStateName: seller?.state || "",
        sellerCountry: seller?.country || "",
        sellerContact: seller?.contact_number || "",
        sellerEmail: localStorage.getItem("email") || "",
        sellerGSTIN: "",
      };

      // Find Customer (RFQ Issuer) Details
      const customer = availableMsmes.find((msme) => msme.id === rfqData.tenant_id);
      const customerDetails = {
        customerName: customer?.name || `Company ID: ${rfqData.tenant_id}`,
        address1: customer?.address || "",
        address2: "",
        custCityName: customer?.city || "",
        custPincode: customer?.zipCode || "",
        custStateName: customer?.state || "",
        custCountry: customer?.country || "",
        custGSTIN: "",
      };

      // Initial Quotation Line
      const initialQuotationLine = {
        partNo: `RFQ-${rfqData.id}`,
        partDescription: rfqData.title || `Quotation for ${rfqData.title}`,
        minimumQty: rfqData.quantity || 1,
        partCost: 0,
        leadTime: "",
        notes: `Based on RFQ specifications: ${rfqData.material_specifications}${rfqData.additional_specifications ? '; ' + rfqData.additional_specifications : ''}${rfqData.constraints ? '; Constraints: ' + rfqData.constraints : ''}`,
      };

      try {
        if (quotationId) {
          // Fetch existing quotation
          const response = await RFQQuotationApiService.getRFQQuotation(quotationId);
          if (response?.quotationData?.quotation_data) {
            form.reset({
              ...sellerDetails,
              ...customerDetails,
              ...response.quotationData.quotation_data,
            });
          } else {
            throw new Error("No quotation data found");
          }
        } else {
          // Initialize new quotation
          form.reset({
            ...sellerDetails,
            ...customerDetails,
            invoiceDate: new Date().toISOString().split("T")[0],
            quotationNumber: `QT-${Date.now()}`,
            paymentTerms: "Net 30",
            taxes: "GST Extra",
            transportation: "Ex-Works",
            validity: "30 Days",
            quotationLines: [initialQuotationLine],
          });
        }
      } catch (error) {
        console.error("Error initializing form:", error);
        toast.error("Failed to load quotation data");
        // Fallback to new quotation if loading existing fails
        form.reset({
          ...sellerDetails,
          ...customerDetails,
          invoiceDate: new Date().toISOString().split("T")[0],
          quotationNumber: `QT-${Date.now()}`,
          paymentTerms: "Net 30",
          taxes: "GST Extra",
          transportation: "Ex-Works",
          validity: "30 Days",
          quotationLines: [initialQuotationLine],
        });
      } finally {
        setIsFetchingExisting(false);
        setIsLoading(false);
      }
    };

    initializeForm();
  }, [rfqData, quotationId, tenantId, msmeName, availableMsmes, form.reset]);

  const handleAddQuotationLine = () => {
    append({
      partDescription: "",
      minimumQty: 1,
      partCost: 0,
      // Initialize other fields as needed
    });
  };

  const handleRemoveQuotationLine = (index: number) => {
      if (fields.length > 1) { // Prevent removing the last line
        remove(index);
      } else {
          toast.error("You must have at least one line item in the quotation.")
      }
  };

  const handleCustomSubmit = async () => {
    console.log("Custom submit handler triggered");
    const formData = form.getValues();
    console.log("Form data from custom submit:", formData);

    try {
      console.log("Preparing API payload...");
      const apiPayload = {
          quotation_data: {
              ...formData,
              total_amount: formData.quotationLines.reduce((sum, line) => sum + (line.partCost * line.minimumQty), 0),
          },
          subcontractor_ids: [tenantId || ''],
      };

      console.log("API Payload prepared:", apiPayload);
      console.log("Calling API with RFQ ID:", rfqData.id);

      await RFQSubcontractorNotLoggedInApiService.respondRFQ(
        apiPayload,
        rfqData.id!,
      );

      console.log("API call successful");
      toast.success("Quotation submitted successfully!");

      console.log("Navigating back to RFQ details page");
      router.push(`/app/rfq/${rfqData.id}`);

    } catch (error) {
      console.error("Error in custom submit:", error);
      toast.error(`Failed to submit quotation: ${(error as Error).message}`);
    }
  };

  if (isFetchingExisting) {
       return <div className="text-center p-6">Loading quotation details...</div>;
  }

  return (
    <>
      {isPreviewMode ? (
        // Pass only necessary data to preview
        <QuotationPreviewRfq data={formData} onBack={() => setIsPreviewMode(false)} />
      ) : (
        <div className="w-full max-w-6xl mx-auto space-y-6">
            {/* RFQ Reference Alert - Keep this outside the invoice */}
            <Alert variant="default" className="bg-blue-50 border-blue-200">
                 <Info className="h-5 w-5 text-blue-700" />
                <AlertTitle className="text-blue-800">Responding to RFQ: {rfqData.title} (ID: {rfqData.id})</AlertTitle>
                <AlertDescription className="text-blue-700 text-sm mt-1">
                    Material Specs: {rfqData.material_specifications}
                </AlertDescription>
            </Alert>

            {/* Invoice-style Form */}
            <Form {...form}>
                <form 
                    onSubmit={(e) => {
                        e.preventDefault();
                        console.log("Form submit event triggered");
                        console.log("Current form values:", form.getValues());
                        console.log("Form validation state:", form.formState);
                        form.handleSubmit(handleCustomSubmit)(e).catch(error => {
                            console.error("Form submission error:", error);
                        });
                    }} 
                    className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden"
                >
                    {/* Invoice Header */}
                    <div className="p-6 bg-gray-50 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between">
                            {/* Seller Details - Left Side */}
                            <div className="mb-4 md:mb-0">
                                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">QUOTATION</h1>
                                <div className="mt-4 text-sm text-gray-700">
                                    <p className="font-semibold text-base">{form.watch("SellerName")}</p>
                                    <p>Email: {form.watch("sellerEmail")}</p>
                                </div>
                            </div>
                            
                            {/* Quotation Info - Right Side */}
                            <div className="flex flex-col">
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="text-gray-500 font-medium">Quotation Number:</div>
                                    <div className="text-right">
                                        <FormField
                                            control={form.control}
                                            name="quotationNumber"
                                            render={({ field }) => (
                                                <Input 
                                                    {...field} 
                                                    className="h-7 p-1 text-right font-medium"
                                                    placeholder={`QT-${Date.now()}`}
                                                />
                                            )}
                                        />
                                    </div>
                                    
                                    <div className="text-gray-500 font-medium">Date:</div>
                                    <div className="text-right">
                                        <FormField
                                            control={form.control}
                                            name="invoiceDate"
                                            render={({ field }) => (
                                                <Input 
                                                    type="date" 
                                                    {...field} 
                                                    className="h-7 p-1 text-right"
                                                />
                                            )}
                                        />
                                    </div>
                                    
                                    <div className="text-gray-500 font-medium">Valid Until:</div>
                                    <div className="text-right">
                                        <FormField
                                            control={form.control}
                                            name="validity"
                                            render={({ field }) => (
                                                <Input 
                                                    {...field} 
                                                    className="h-7 p-1 text-right"
                                                    placeholder="30 Days"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Bill To Section */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">Bill To:</h2>
                        <div className="pl-2 text-sm text-gray-600">
                            <p className="font-medium">{form.watch("customerName")}</p>
                            <p className="mt-1">{form.watch("address1")}</p>
                            {form.watch("address2") && <p>{form.watch("address2")}</p>}
                            <p>{form.watch("custCityName")}, {form.watch("custStateName")} {form.watch("custPincode")}</p>
                            <p>{form.watch("custCountry")}</p>
                            {form.watch("custGSTIN") && <p className="mt-1">GSTIN: {form.watch("custGSTIN")}</p>}
                        </div>
                    </div>
                    
                    {/* Line Items Table */}
                    <div className="px-6 py-4">
                        <div className="overflow-x-auto">
                            <Table className="border rounded-md border-separate border-spacing-0">
                                <TableHeader className="bg-gray-50">
                                    <TableRow className="[&>th]:border [&>th]:border-gray-200">
                                        <TableHead className="w-[40px] text-gray-600 font-semibold">No.</TableHead>
                                        <TableHead className="w-[300px] text-gray-600 font-semibold">Description</TableHead>
                                        <TableHead className="w-[80px] text-right text-gray-600 font-semibold">Qty</TableHead>
                                        <TableHead className="w-[120px] text-right text-gray-600 font-semibold">Unit Price</TableHead>
                                        <TableHead className="w-[120px] text-right text-gray-600 font-semibold">Total</TableHead>
                                        <TableHead className="w-[100px] text-gray-600 font-semibold">Lead Time</TableHead>
                                        <TableHead className="w-[60px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.map((item, index) => {
                                        const qty = form.watch(`quotationLines.${index}.minimumQty`) || 0;
                                        const price = form.watch(`quotationLines.${index}.partCost`) || 0;
                                        const lineTotal = calculateLineTotal(qty, price);
                                        
                                        return (
                                            <TableRow key={item.id} className="[&>td]:border [&>td]:border-gray-200">
                                                <TableCell className="text-center text-gray-500">{index + 1}</TableCell>
                                                <TableCell>
                                                    <FormField
                                                        control={form.control}
                                                        name={`quotationLines.${index}.partDescription`}
                                                        render={({ field }) => (
                                                            <FormItem className="space-y-0">
                                                                <FormControl>
                                                                    <Textarea 
                                                                        placeholder="Item description" 
                                                                        {...field} 
                                                                        rows={2} 
                                                                        className="min-w-[240px] resize-none border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    {form.watch(`quotationLines.${index}.notes`) && (
                                                        <div className="mt-1.5 text-xs text-gray-500 italic">
                                                            Note: {form.watch(`quotationLines.${index}.notes`)}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <FormField
                                                        control={form.control}
                                                        name={`quotationLines.${index}.minimumQty`}
                                                        render={({ field }) => (
                                                            <FormItem className="space-y-0">
                                                                <FormControl>
                                                                    <Input 
                                                                        type="number" 
                                                                        min="1" 
                                                                        {...field} 
                                                                        className="min-w-[60px] text-right border-0 p-0 h-8 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <FormField
                                                        control={form.control}
                                                        name={`quotationLines.${index}.partCost`}
                                                        render={({ field }) => (
                                                            <FormItem className="space-y-0">
                                                                <FormControl>
                                                                    <Input 
                                                                        type="number" 
                                                                        step="0.01" 
                                                                        min="0" 
                                                                        {...field} 
                                                                        className="min-w-[80px] text-right border-0 p-0 h-8 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {lineTotal.toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    <FormField
                                                        control={form.control}
                                                        name={`quotationLines.${index}.leadTime`}
                                                        render={({ field }) => (
                                                            <FormItem className="space-y-0">
                                                                <FormControl>
                                                                    <Input 
                                                                        placeholder="e.g., 2 Weeks" 
                                                                        {...field} 
                                                                        className="min-w-[90px] border-0 p-0 h-8 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleRemoveQuotationLine(index)}
                                                        disabled={fields.length <= 1}
                                                        className="h-8 w-8 text-gray-400 hover:text-red-500"
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        
                        {/* Add Item Button */}
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={handleAddQuotationLine} 
                            className="mt-4 text-sm"
                            size="sm"
                        >
                            + Add Line Item
                        </Button>
                    </div>
                    
                    {/* Totals & Summary Section */}
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex justify-end">
                            <div className="w-full md:w-1/2 lg:w-1/3">
                                <div className="space-y-1">
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span className="font-medium">{subtotal.toFixed(2)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center py-1">
                                        <div className="flex items-center">
                                            <span className="text-gray-600 mr-2">Tax:</span>
                                            <FormField
                                                control={form.control}
                                                name="taxes"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-0">
                                                        <FormControl>
                                                            <Input 
                                                                {...field} 
                                                                placeholder="e.g., GST @ 18%" 
                                                                className="h-7 p-1 w-24 text-xs border-gray-200"
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <span className="font-medium">{taxAmount.toFixed(2)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between border-t border-gray-300 pt-2 mt-2">
                                        <span className="text-gray-800 font-semibold">Grand Total:</span>
                                        <span className="font-bold text-lg">{grandTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Terms & Conditions Section */}
                    <div className="px-6 py-4 border-t border-gray-200">
                        <h3 className="font-semibold text-gray-700 mb-3">Terms & Conditions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <FormField
                                control={form.control}
                                name="paymentTerms"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-600 text-sm">Payment Terms</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Net 30, 100% Advance" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="transportation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-600 text-sm">Transportation</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Ex-Works, Included" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        <FormField
                            control={form.control}
                            name="deliveryinst"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-600 text-sm">Additional Notes</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Delivery instructions, warranty information, or other notes..." 
                                            {...field} 
                                            rows={3}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    
                    {/* Form Actions */}
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col space-y-2 sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-4">
                        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button 
                            type="button" 
                            onClick={handleCustomSubmit} 
                            disabled={isLoading}
                        >
                            {isLoading ? 
                                "Submitting..." : 
                                (quotationId ? "Update Quotation" : "Submit Quotation to Customer")}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
      )}
    </>
  );
};