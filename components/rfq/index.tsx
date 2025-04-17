"use client";
import IncomingRFQ from './components/incoming-rfq';


export default function RFQComponent() {
    return (
        <>
            {/* ===== Main ===== */}
            <div>
                <div className='mb-4 flex items-center justify-between space-y-2'> {/* Increased margin */}
                    <h1 className='text-2xl font-bold tracking-tight'>Request for Quotation</h1>
                </div>
                <IncomingRFQ />
            </div>
        </>
    )
}