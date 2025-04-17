"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from "next/navigation"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    searchColumn?: string // Optional: specify which column to search
    searchPlaceholder?: string // Optional: customize placeholder
    showAddButton?: boolean // Optional: control visibility of Add button
    addButtonText?: string // Optional: customize add button text
    addButtonLink?: string // Optional: customize add button link
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchColumn = "title", // Default search column to 'title' (adjust if needed)
    searchPlaceholder = "Search by title...", // Default placeholder
    showAddButton = true, // Show add button by default
    addButtonText = "New RFQ",
    addButtonLink = "/app/rfq/new"
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
            columnFilters,
        },
        // --- Ensure search column exists ---
      
    })

    const router = useRouter();

    // --- Check if the specified search column actually exists ---
    const searchColumnExists = table.getColumn(searchColumn);

    return (
        <div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-start md:justify-between mb-4 space-y-3 md:space-y-0">
                {/* --- Search Input --- */}
                {searchColumnExists && (
                    <div className="relative flex-1 max-w-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input
                            className="pl-10 w-full"
                            placeholder={searchPlaceholder}
                            value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn(searchColumn)?.setFilterValue(event.target.value)
                            }
                        />
                    </div>
                )}
                {/* --- Add Button (Conditional) --- */}
                {showAddButton && (
                    <div className="w-full md:w-auto flex items-start md:items-center">
                        <Button onClick={() => router.push(addButtonLink)} className="h-9 w-full md:w-auto"> {/* Adjusted height */}
                            <Plus className="mr-2 h-4 w-4" />
                            {addButtonText}
                        </Button>
                    </div>
                )}
            </div>


          <div className="w-full inline-block align-middle">
            <ScrollArea className="rounded-md border whitespace-nowrap">
            <Table className="min-w-full">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} className="text-sm">
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="text-sm py-2 px-4">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            </ScrollArea>
          </div>
            {/* --- Pagination --- */}
            {table.getPageCount() > 1 && ( // Only show pagination if needed
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>

    )
}
