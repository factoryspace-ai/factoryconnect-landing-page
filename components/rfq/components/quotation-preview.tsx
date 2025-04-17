import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
// import { QuotationService } from "@/lib/services/quotation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { QuotationFormValues } from '@/components/rfq/components/rfq-quotation-component';

interface QuotationPreviewProps {
  data: QuotationFormValues;
  onBack: () => void;
}

export const QuotationPreviewRfq: React.FC<QuotationPreviewProps> = ({ data, onBack }) => {
  const invoiceRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfFileName, setPdfFileName] = useState<string>("quotation.pdf");
  const router = useRouter();

  // Calculate totals
  const calculateLineTotal = (qty: number, cost: number) => qty * cost;
  
  const subtotal = data.quotationLines?.reduce((sum, line) => 
    sum + calculateLineTotal(line.minimumQty || 0, line.partCost || 0), 0) || 0;

  const getTaxRate = () => {
    const taxText = data.taxes || '';
    const match = taxText.match(/(\d+(\.\d+)?)%/);
    return match ? parseFloat(match[1]) / 100 : 0;
  };

  const taxAmount = subtotal * getTaxRate();
  const grandTotal = subtotal + taxAmount;


  // const generatePDF = async (invoiceRef: any, quotationData: any) => {
  //   if (!invoiceRef.current) {
  //     console.error("Invoice content is missing!");
  //     toast.error("Invoice content is missing!");
  //     return;
  //   }

  //   try {
  //     const canvas = await html2canvas(invoiceRef.current);
  //     const imgData = canvas.toDataURL("image/png");

  //     const pdf = new jsPDF({
  //       orientation: "portrait",
  //       unit: "mm",
  //       format: "a4",
  //     });
  //     const imgWidth = 190;
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //     pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

  //     const finalFileName = `${pdfFileName}_quotation.pdf`;

  //     const pdfBlob = pdf.output("blob");
  //     const pdfFile = new File([pdfBlob], finalFileName, { type: "application/pdf" });

  //     const formData = new FormData();
  //     formData.append("file", pdfFile);

  //     const uploadResponse = await fetch("/api/upload", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const uploadData = await uploadResponse.json();

  //     const quotationPayload = {
  //       tenant_id: "abc",
  //       customer_id: "abc",
  //       status: "Not Paid",
  //       quotation_data: quotationData,
  //     };

  //     const createdQuotation = await QuotationService.createQuotation(quotationPayload);
  //     console.log("Quotation Created Successfully:", createdQuotation);
  //     toast.success("Quotation created successfully!");

  //     if (uploadData?.url) {
  //       console.log("PDF uploaded successfully!");
  //       toast.success("PDF uploaded successfully!");

  //       const documentPayload = {
  //         file_name: finalFileName,
  //         file_link: uploadData.url,
  //         tenant_id: "abc",
  //         document_id: String(createdQuotation.id),
  //         document_type: "Quotation",
  //         created_at: new Date().toISOString(),
  //         tags: ["quotation", "generated"],
  //       };

  //       toast.success("Document saved successfully!");
  //       setIsModalOpen(false);
  //       return documentPayload;
  //     } else {
  //       console.error("File upload failed.");
  //       toast.error("File upload failed.");
  //     }
  //   } catch (error) {
  //     console.error("Error generating, uploading, or saving PDF:", error);
  //     toast.error("Error generating, uploading, or saving PDF.");
  //   }
  // };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white" ref={invoiceRef}>
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">QUOTATION</h1>
          <div className="mt-2 text-sm text-gray-600">
            <p>Date: {data.invoiceDate}</p>
            <p>Quotation #: {data.quotationNumber}</p>
          </div>
        </div>
        <Button onClick={onBack} variant="outline">
          Back to Edit
        </Button>
      </div>

      {/* Seller Details */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">From:</h2>
          <p className="font-medium">{data.SellerName}</p>
          <p>{data.sellerAddress1}</p>
          {data.sellerAddress2 && <p>{data.sellerAddress2}</p>}
          <p>{data.sellerCityName}, {data.sellerStateName} {data.sellerPincode}</p>
          <p>{data.sellerCountry}</p>
          <p>Phone: {data.sellerContact}</p>
          <p>Email: {data.sellerEmail}</p>
          {data.sellerGSTIN && <p>GSTIN: {data.sellerGSTIN}</p>}
        </div>

        {/* Customer Details */}
        <div>
          <h2 className="text-lg font-semibold mb-2">To:</h2>
          <p className="font-medium">{data.customerName}</p>
          <p>{data.address1}</p>
          {data.address2 && <p>{data.address2}</p>}
          <p>{data.custCityName}, {data.custStateName} {data.custPincode}</p>
          <p>{data.custCountry}</p>
          {data.custGSTIN && <p>GSTIN: {data.custGSTIN}</p>}
        </div>
      </div>

      {/* Line Items */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-2 text-left">Description</th>
              <th className="border p-2 text-right">Quantity</th>
              <th className="border p-2 text-right">Unit Price</th>
              <th className="border p-2 text-right">Lead Time</th>
              <th className="border p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.quotationLines?.map((line, index) => (
              <tr key={index} className="border-b">
                <td className="border p-2">
                  <div>
                    <p className="font-medium">{line.partDescription}</p>
                    {line.notes && <p className="text-sm text-gray-500 mt-1">{line.notes}</p>}
                  </div>
                </td>
                <td className="border p-2 text-right">{line.minimumQty}</td>
                <td className="border p-2 text-right">{line.partCost.toFixed(2)}</td>
                <td className="border p-2 text-right">{line.leadTime || '-'}</td>
                <td className="border p-2 text-right">
                  {calculateLineTotal(line.minimumQty || 0, line.partCost || 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-1/3">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax ({data.taxes}):</span>
              <span>{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-bold">
              <span>Grand Total:</span>
              <span>{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Terms & Conditions</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Payment Terms:</p>
            <p>{data.paymentTerms}</p>
          </div>
          <div>
            <p className="font-medium">Transportation:</p>
            <p>{data.transportation}</p>
          </div>
          <div>
            <p className="font-medium">Validity:</p>
            <p>{data.validity}</p>
          </div>
        </div>
        {data.deliveryinst && (
          <div className="mt-4">
            <p className="font-medium">Delivery Instructions:</p>
            <p>{data.deliveryinst}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-right">
        <p className="font-semibold">Yours Faithfully,</p>
        <p>For {data.SellerName}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end mt-6 space-x-2">
        <Button onClick={() => setIsModalOpen(true)}>Save as PDF</Button>
        <Button onClick={() => router.push("/documents")}>Done</Button>
      </div>

      {/* PDF Save Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter PDF File Name</DialogTitle>
          </DialogHeader>
          <Input 
            value={pdfFileName} 
            onChange={(e) => setPdfFileName(e.target.value)} 
            placeholder="Enter file name" 
          />
          {/* <DialogFooter>
            <Button onClick={() => generatePDF(invoiceRef, data)}>
              Save
            </Button>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuotationPreviewRfq;
