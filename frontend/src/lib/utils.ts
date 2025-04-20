import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Timestamp } from 'firebase/firestore'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isSubscriptionExpired = (expiryDate: Timestamp | null | undefined): boolean => {
  if (!expiryDate) {
    return true; // Consider no expiry date as expired or inactive
  }
  const expiryTime = expiryDate.toDate().getTime();
  return Date.now() > expiryTime;
};
