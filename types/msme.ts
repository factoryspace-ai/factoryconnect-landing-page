export interface CreateMSME {
    name: string;
    subdomain: string;
    description: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
    contact_number: string;
    contact_email: string;
    year_established: string;
    working_hours: string;
    logo: string;
    industry: string;
    services: string;
    ratings: number;
    pricing: string;
    gst: string;
    is_active: boolean;
}

export interface UpdateMSME {
    name?: string;
    subdomain?: string;
    description?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zip_code?: string;
    contact_number?: string;
    contact_email?: string;
    year_established?: string;
    working_hours?: string;
    logo?: string;
    industry?: string;
    services?: string;
    ratings?: number;
    pricing?: string;
    gst?: string;
    is_active?: boolean;
}

export interface MSME {
    id: string;
    created_at: string;
    name: string;
    subdomain: string;
    description: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
    contact_number: string;
    contact_email: string;
    year_established: string;
    working_hours: string;
    logo: string;
    industry: string;
    services: string;
    ratings: number;
    pricing: string;
    gst: string;
    is_active: boolean;
}
