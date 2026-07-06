import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return `${price.toFixed(2)} €`;
}

export function calculateTTC(priceHT: number) {
  return priceHT * 1.2;
}

export function getProductImageUrl(url?: string | null) {
  return url || '/placeholder.png';
}

export function generateSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}
