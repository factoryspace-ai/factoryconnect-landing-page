"use client"

import RFQDetailsView from "@/components/rfq/components/rfq-details"

// --- USE PARAMS INSTEAD OF USE SEARCH PARAMS ---
interface RFQDetailsPageProps {
    params: {
        id: string;
    };
}

export default function RFQDetailsPage({ params }: RFQDetailsPageProps) {
    const rfqId = params.id;

    if (!rfqId || isNaN(parseInt(rfqId))) {
        // Handle invalid ID case if necessary
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Invalid RFQ ID</h2>
                    <p className="text-muted-foreground">The provided RFQ ID is not valid.</p>
                </div>
            </div>
        );
    }

    const numericRfqId = parseInt(rfqId);
    return (
        <div>
            <div className="px-6 mx-auto">
                <main className="">
                    <RFQDetailsView rfqId={numericRfqId} />
                </main>
            </div>
        </div>
    )
}
