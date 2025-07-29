export interface CreateUser {
    clerk_id: string;
    email: string;
    name: string;
    profile_picture: string;
    bio: string;
    username: string;
    first_name: string;
    last_name: string;
    email_verified: boolean;
    last_sign_in_at: string;
    is_active: boolean;
}

export interface User {
    id: string;
    created_at: string;
    updated_at: string;
    last_sign_in_at: string;
    email: string;
    clerk_id: string;
    name: string;
    profile_picture: string;
    bio: string;
    username: string;
    first_name: string;
    last_name: string;
    email_verified: boolean;
    is_active: boolean;
}
