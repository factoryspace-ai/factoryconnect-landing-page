export interface RFQ {
    title: string;
    drawing_link: string;
    quantity: number;
    deadline: string;
    material_specifications: string;
    additional_specifications: string;
    constraints: string;
}

export interface RFQSubcontractors{
    id?: number;
    subcontractor_ids:  string[];
}

export interface Clarification{
    id?: number;
    message: string;
    parent_message_id?: number;
}

export interface SubcontractorResponse{
    quotation_data: any,
    id?: number,
    subcontractor_id?: string,
    status?: string,
    submitted_at?: string,
}

export interface RFQDetails{
    title: string;
    drawing_link: string;
    quantity: number;
    deadline: string;
    material_specifications: string;
    additional_specifications: string;
    constraints: string;
    id?: number;
    tenant_id: string;
    status: string;
    created_at: string;
    updated_at: string;
    invited_subcontractors: RFQSubcontractors[];
    quotations: SubcontractorResponse[];
}