import { clsx, ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSubdomainUrl(subdomain: string): string {
  const isProduction = process.env.NODE_ENV === 'production';
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
  
  return isProduction
    ? `https://${subdomain}.${rootDomain}`
    : `http://${subdomain}.localhost:3000`;
}
