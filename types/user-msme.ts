export interface CreateUserMSME {
    user_id: string;
    msme_id: string;
    email: string;
    name: string;
    department: string;
    access_level: string;
    invited_by: string;
    status: string;
}

export interface UserMSME {
    id?: string;
    user_id: string;
    msme_id: string;
    email: string;
    name: string;
    department: string;
    access_level: string;
    invited_by: string;
    status: string;
}
