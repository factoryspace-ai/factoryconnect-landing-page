"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DocumentUpload } from "@/components/document-upload" // Assuming this component works
import { useRouter } from "next/navigation"
// --- Use specific RFQ type for form values, not RFQDetails ---
import { RFQ } from "@/lib/services/rfq/types/type"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Check, ChevronsUpDown, X, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area" // For company list

// --- Define Schema for Form ---
// Added selected_companies to the form schema itself
const rfqFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  drawing_link: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')), // Allow empty string or valid URL
  quantity: z.coerce.number().int().positive({ // Ensure positive integer
    message: "Quantity must be a positive whole number.",
  }),
  deadline: z.string().refine((date) => !!date, { // Basic check for non-empty date
    message: "Please provide a deadline.",
  }),
  material_specifications: z.string().min(5, { // Slightly increased min length
    message: "Please provide material specifications (min 5 characters).",
  }),
  additional_specifications: z.string().optional(),
  constraints: z.string().optional(),
  selected_companies: z.array(z.object({ // Array of selected companies
    id: z.string(),
    name: z.string(),
  })).optional(), // Optional array
});

type RFQFormValues = z.infer<typeof rfqFormSchema>

// --- Default Values ---
const defaultValues: Partial<RFQFormValues> = {
  title: "",
  drawing_link: "",
  quantity: 1,
  deadline: "",
  material_specifications: "",
  additional_specifications: "",
  constraints: "",
  selected_companies: [], // Initialize as empty array
}

interface RFQFormProps {
  initialData?: RFQ & { selected_companies?: { id: string; name: string}[] }; // Allow initial selected companies
  onSubmit: (data: RFQFormValues) => Promise<void> // Use RFQFormValues
  isLoading?: boolean
  buttonText?: string
}

export default function RFQForm({
  initialData,
  onSubmit, // Removed default implementation here, must be passed from parent
  isLoading = false,
  buttonText = "Submit RFQ"
}: RFQFormProps) {
  const [drawingUrl, setDrawingUrl] = useState<string>(initialData?.drawing_link || "") // Initialize from initialData
  const [availableMsmes, setAvailableMsmes] = useState<{ id: string; name: string, industry: string }[]>([]) // Use simpler type
  const [openCompanySelector, setOpenCompanySelector] = useState(false);
  const router = useRouter()
  const [newSubcontractorEmail, setNewSubcontractorEmail] = useState("");
  const [newSubcontractorName, setNewSubcontractorName] = useState("");
  const [isAddingNewSubcontractor, setIsAddingNewSubcontractor] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const emailSchema = z.string().email("Please enter a valid email address");

  const validateEmail = (email: string) => {
    try {
      emailSchema.parse(email);
      setEmailError(null);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0].message);
      }
      return false;
    }
  };

  const form = useForm<RFQFormValues>({
    resolver: zodResolver(rfqFormSchema),
     // Merge default values with initial data, ensuring selected_companies is an array
    defaultValues: {
        ...defaultValues,
        ...initialData,
        selected_companies: initialData?.selected_companies || [], // Ensure it's an array
        deadline: initialData?.deadline ? initialData.deadline.split('T')[0] : "", // Format initial date
    },
  });

   // Reset form if initialData changes (e.g., in edit mode)
  useEffect(() => {
    if (initialData) {
      form.reset({
        ...defaultValues,
        ...initialData,
        selected_companies: initialData?.selected_companies || [],
        deadline: initialData?.deadline ? initialData.deadline.split('T')[0] : "",
      });
      setDrawingUrl(initialData.drawing_link || "");
    }
  }, [initialData, form]);


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
      console.log("Response:", data);
      setAvailableMsmes(data.msmes.map((msme: any) => ({ id: msme.id, name: msme.name, industry: msme.industry })));
    } catch (error) {
      console.error(error);
      toast.error("Error fetching available companies. Selection might be unavailable.");
    }
  };

  // --- Handler passed to the parent component ---
  const handleFormSubmit = async (data: RFQFormValues) => {
      console.log("RFQ Form Data:", data);
      // The parent page (new/edit) will handle the actual API call
      await onSubmit(data);
  }

  // --- Handle drawing upload ---
  const handleDrawingUpload = (fileData: { file_link: string }) => {
    const url = fileData.file_link;
    form.setValue("drawing_link", url, { shouldValidate: true }); // Set value and validate
    setDrawingUrl(url);
  }

  // --- Watch selected companies for display ---
  const selectedCompanies = form.watch("selected_companies") || []

  // --- Select/Deselect Company ---
  const handleSelectCompany = (company: { id: string; name: string }) => {
    const currentSelected = form.getValues("selected_companies") || [];
    const isAlreadySelected = currentSelected.some(c => c.id === company.id);

    if (isAlreadySelected) {
      form.setValue("selected_companies", currentSelected.filter(c => c.id !== company.id));
    } else {
      form.setValue("selected_companies", [...currentSelected, company]);
    }
    // Keep the popover open for multiple selections if desired, or close it:
    // setOpenCompanySelector(false);
  }

  // --- Remove Company from Badge ---
  const removeCompany = (companyId: string) => {
    const currentSelected = form.getValues("selected_companies") || []
    form.setValue("selected_companies", currentSelected.filter(c => c.id !== companyId));
  }

  const handleAddNewSubcontractor = async () => {
    try {
      if (!newSubcontractorEmail || !newSubcontractorName) {
        setEmailError("Please enter both email address and company name");
        return;
      }

      if (!validateEmail(newSubcontractorEmail)) {
        return;
      }

      const response = await fetch("/api/msme/available", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: newSubcontractorEmail,
          name: newSubcontractorName
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add subcontractor");
      }

      const newCompany = await response.json();
      
      // Add the new company to selected companies
      const currentSelected = form.getValues("selected_companies") || [];
      form.setValue("selected_companies", [...currentSelected, { 
        id: newCompany.id, 
        name: newSubcontractorName 
      }]);

      toast.success("Subcontractor added successfully");
      setNewSubcontractorEmail("");
      setNewSubcontractorName("");
      setEmailError(null);
      setIsAddingNewSubcontractor(false);
      fetchAvailableMsmes(); // Refresh the list of available MSMEs
    } catch (error) {
      console.error("Error adding subcontractor:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add subcontractor");
    }
  };

  return (
    <Form {...form}>
      {/* --- Pass the actual submit handler --- */}
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8 max-w-5xl mx-auto p-4">
        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4 p-2">
                <h4 className="font-semibold text-lg mb-1">RFQ Details</h4>
                <p className="text-sm text-muted-foreground">Provide the core information for your request.</p>
            </div>
            <div className="md:col-span-8 space-y-6 p-6 border rounded-lg bg-muted/50 shadow-sm" >
                 <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Title <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Precision Machined Part XYZ" {...field} />
                        </FormControl>
                        <FormDescription>A clear, concise title.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quantity <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                            <Input type="number" min="1" placeholder="Enter quantity" {...field} />
                            </FormControl>
                             <FormDescription>Number of units required.</FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Deadline <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                            {/* Ensure value is in 'yyyy-MM-dd' format */}
                            <Input type="date" {...field} min={new Date().toISOString().split("T")[0]} />
                            </FormControl>
                             <FormDescription>Required completion date.</FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>

         {/* Specifications Section */}
         <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4 p-2">
                 <h4 className="font-semibold text-lg mb-1">Specifications</h4>
                <p className="text-sm text-muted-foreground">Describe the technical requirements in detail.</p>
            </div>
            <div className="md:col-span-8 space-y-6 p-6 border rounded-lg bg-muted/50 shadow-sm">
                 <FormField
                    control={form.control}
                    name="material_specifications"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Material Specifications <span className="text-destructive">*</span></FormLabel>
                         <FormControl>
                        <Textarea
                            placeholder="Specify required materials, grades, standards (e.g., Aluminum 6061-T6, Stainless Steel 304)"
                            className="min-h-[100px]"
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="additional_specifications"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Additional Specifications</FormLabel>
                         <FormControl>
                        <Textarea
                            placeholder="Tolerances, surface finish, required certifications, testing procedures, etc."
                            className="min-h-[100px]"
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="constraints"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Constraints</FormLabel>
                        <FormControl>
                        <Textarea
                            placeholder="Any limitations, budget constraints, specific tooling requirements, packaging needs, etc."
                            className="min-h-[100px]"
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
        </div>

         {/* Drawing Upload Section */}
         <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
             <div className="md:col-span-4 p-2">
                <h4 className="font-semibold text-lg mb-1">Technical Drawing</h4>
                <p className="text-sm text-muted-foreground">Attach relevant technical drawings or files (PDF, STEP, DXF, images).</p>
            </div>
             <div className="md:col-span-8 space-y-4 p-6 border rounded-lg bg-muted/50 shadow-sm">
                 {/* Display current drawing URL */}
                 <FormField
                    control={form.control}
                    name="drawing_link"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Drawing URL</FormLabel>
                        <FormControl>
                            <Input placeholder="https://example.com/drawing.pdf" {...field} />
                        </FormControl>
                        <FormDescription>Enter the URL or upload below.</FormDescription>
                        <FormMessage />
                         {/* Optionally show a preview if it's an image URL */}
                         {field.value && !field.value.endsWith('.pdf') && field.value.startsWith('http') && (
                             <img src={field.value} alt="Drawing Preview" className="mt-2 max-h-40 rounded border" />
                         )}
                         {field.value && field.value.endsWith('.pdf') && (
                             <a href={field.value} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline mt-2 block">View PDF Document</a>
                         )}
                    </FormItem>
                    )}
                />
                <DocumentUpload
                    buttonText="Upload Drawing File"
                    buttonVariant="outline"
                    onUploadComplete={handleDrawingUpload} // Upload and set the URL
                    // Pass necessary props to DocumentUpload (e.g., endpoint, allowed types)
                />
                 <p className="text-xs text-muted-foreground">Uploading a file will populate the URL field above.</p>
             </div>
        </div>

        {/* Companies Selection Section */}
         <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
             <div className="md:col-span-4 p-2">
                 <h4 className="font-semibold text-lg mb-1">Select Subcontractors</h4>
                <p className="text-sm text-muted-foreground">
                  Choose which companies should receive this RFQ. You can select multiple companies.
                </p>
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    • Search for existing companies by name
                  </p>
                  <p className="text-sm text-muted-foreground">
                    • Can't find a company? Add them by email
                  </p>
                </div>
            </div>
             <div className="md:col-span-8 space-y-4 p-6 border rounded-lg bg-muted/50 shadow-sm">
                 <FormField
                    control={form.control}
                    name="selected_companies"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Target Companies</FormLabel>
                        <Popover open={openCompanySelector} onOpenChange={setOpenCompanySelector}>
                            <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openCompanySelector}
                                className="w-full justify-between"
                            >
                                {selectedCompanies.length > 0
                                    ? `${selectedCompanies.length} Compan${selectedCompanies.length === 1 ? 'y' : 'ies'} Selected`
                                    : "Select Companies..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                             <Command>
                                <CommandInput placeholder="Search companies by name..." />
                                <ScrollArea className="max-h-60">
                                    <CommandList>
                                        <CommandEmpty>
                                            {isAddingNewSubcontractor ? (
                                                <div className="p-4 space-y-4">
                                                    <div className="space-y-2">
                                                        <h4 className="font-medium">Add New Subcontractor</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            Enter the email address and company name of the subcontractor you want to add.
                                                        </p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Input
                                                            placeholder="Company Name"
                                                            value={newSubcontractorName}
                                                            onChange={(e) => setNewSubcontractorName(e.target.value)}
                                                        />
                                                        <Input
                                                            placeholder="Email Address"
                                                            value={newSubcontractorEmail}
                                                            onChange={(e) => setNewSubcontractorEmail(e.target.value)}
                                                        />
                                                        {emailError && <p className="text-sm text-red-500">{emailError}</p>}
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                size="sm"
                                                                onClick={handleAddNewSubcontractor}
                                                            >
                                                                Add
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setIsAddingNewSubcontractor(false);
                                                                    setNewSubcontractorEmail("");
                                                                    setNewSubcontractorName("");
                                                                    setEmailError(null);
                                                                }}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-4 space-y-4">
                                                    <div className="space-y-2">
                                                        <h4 className="font-medium">No companies found</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            Can't find the company you're looking for? Add them by email.
                                                        </p>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="w-full"
                                                        onClick={() => setIsAddingNewSubcontractor(true)}
                                                    >
                                                        <UserPlus className="mr-2 h-4 w-4" />
                                                        Add New Subcontractor
                                                    </Button>
                                                </div>
                                            )}
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {availableMsmes.map((company) => {
                                            const isSelected = selectedCompanies.some(c => c.id === company.id);
                                            return (
                                                <CommandItem
                                                key={company.id}
                                                value={company.name}
                                                onSelect={() => {
                                                    handleSelectCompany(company);
                                                }}
                                                >
                                                <Check
                                                    className={cn(
                                                    "mr-2 h-4 w-4",
                                                    isSelected ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                <div className="flex flex-col">
                                                    <span>{company.name}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {company.industry || "No industry specified"}
                                                    </span>
                                                </div>
                                                </CommandItem>
                                            );
                                            })}
                                        </CommandGroup>
                                    </CommandList>
                                </ScrollArea>
                             </Command>
                            </PopoverContent>
                        </Popover>

                        {/* Display selected companies as badges */}
                         <FormDescription>
                            Companies selected to receive this RFQ.
                        </FormDescription>
                         <div className="mt-2 flex flex-wrap gap-2">
                            {selectedCompanies.map((company) => (
                            <Badge key={company.id} variant="secondary" className="flex items-center gap-1.5 pr-1">
                                {company.name}
                                <button
                                    type="button"
                                    onClick={() => removeCompany(company.id)}
                                    className="rounded-full hover:bg-muted p-0.5"
                                    aria-label={`Remove ${company.name}`}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                            ))}
                        </div>
                        <FormMessage />
                    </FormItem>
                    )}
                />
             </div>
         </div>


        {/* --- Submit Button --- */}
        <div className="flex justify-end gap-4 pt-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()} // Go back instead of fixed URL
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : buttonText}
          </Button>
        </div>
      </form>
    </Form>
  )
}