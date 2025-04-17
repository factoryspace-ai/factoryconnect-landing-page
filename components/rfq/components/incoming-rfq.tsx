"use client";
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ArrowUpDown, Eye, MoreHorizontal, Pencil } from 'lucide-react'; // Use Eye for view action
import { DataTable } from './data-table'; // Reuse DataTable
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge'; // For status
import { format } from 'date-fns'; // For dates
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { RFQSubcontractorNotLoggedInApiService } from '@/lib/services/rfq/api';

// Type expected by the DataTable for Incoming RFQs
interface IncomingRfqData {
    rfq_id: number;
    title: string;
    // customerName: string; // Need to resolve customer ID to name if possible
    deadline: string;
    status: string;
    createdAt?: string;
    // Add other relevant fields if needed
}

export default function IncomingRFQ() {
    const router = useRouter();
    // const [tenantId, setTenantId] = useState<string | null>(null);
    const [incomingRfqs, setIncomingRfqs] = useState<IncomingRfqData[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch Tenant ID first
    // Fetch Incoming RFQs when tenantId is available
    useEffect(() => {
        // if (!tenantId) return; // Don't fetch if tenantId is not set

        const fetchIncoming = async () => {
            setLoading(true);
            try {
                const response = await RFQSubcontractorNotLoggedInApiService.getRFQCustomers();
                console.log("response", response)
                // Assuming response.rfqs contains the array of RFQDetails
                const formattedData: IncomingRfqData[] = response.map((rfq: any) => ({
                    rfq_id: rfq.rfq_id!,
                    title: rfq.title,
                    // customerName: rfq.tenant_id, // Placeholder - needs name resolution
                    deadline: format(new Date(rfq.deadline), 'PP'), // Format date nicely
                    status: rfq.status,
                    // createdAt: format(new Date(rfq.created_at), 'PP'),
                }));
                setIncomingRfqs(formattedData);
            } catch (error) {
                console.error("Error fetching incoming RFQs:", error);
                toast.error("Failed to load incoming RFQs.");
            } finally {
                setLoading(false);
            }
        };

        fetchIncoming();
    }, []); // Re-run when tenantId changes

    // --- Define Columns for Incoming RFQs Table ---
    const columns: ColumnDef<IncomingRfqData>[] = [
        {
            accessorKey: "title",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
        },
        // { // TODO: Add Customer Name column (requires fetching MSME name by tenant_id)
        //     accessorKey: "customerName",
        //     header: "Customer",
        // },
        {
            accessorKey: "deadline",
            header: "Deadline",
        },
        {
            accessorKey: "rfq_id",
            header: "ID",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
                 if (status?.toLowerCase() === 'pending') variant = 'secondary';
                 if (status?.toLowerCase() === 'completed') variant = 'default'; // Or success variant if you have one
                return <Badge variant={variant}>{status}</Badge>;
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                // <Button
                //     variant="outline"
                //     size="sm"
                //     title="View Details"
                //     onClick={() => router.push(`/workspace/request-for-quotation/${row.original.rfq_id}`)}
                // >
                //     <Eye className="h-4 w-4" />
                // </Button>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => router.push(`/app/rfq/${row.original.rfq_id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View Details</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            ),
        },
    ];

    if (loading) {
        // Show loading indicator while fetching RFQs
        return <div className="text-center p-4">Loading incoming RFQs...</div>;
    }

    return (
        <div className="w-full">
            <DataTable
                columns={columns}
                data={incomingRfqs}
                searchColumn="title"
                searchPlaceholder="Search incoming RFQs..."
                showAddButton={false}
            />
        </div>
    );
}