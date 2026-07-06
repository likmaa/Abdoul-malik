// Helpers pour la gestion des produits et commandes

import { ProductDimensions, ProductAttributes } from './types';
import { SHIPPING_LIMITS } from './constants';

/**
 * Détermine si un produit nécessite un transporteur spécial
 * basé sur son poids et ses dimensions
 */
export function requiresSpecialShipping(
  weight: number,
  dimensions: ProductDimensions
): boolean {
  const maxDimension = Math.max(
    dimensions.length,
    dimensions.width,
    dimensions.height
  );

  return (
    weight > SHIPPING_LIMITS.MAX_WEIGHT_STANDARD ||
    maxDimension > SHIPPING_LIMITS.MAX_DIMENSION_STANDARD
  );
}

/**
 * Calcule le volume d'un produit (en cm³)
 */
export function calculateVolume(dimensions: ProductDimensions): number {
  return dimensions.length * dimensions.width * dimensions.height;
}

/**
 * Formate un nom de produit localisé
 */
export function getLocalizedProductName(
  name: Record<string, string>,
  locale: string = 'fr'
): string {
  return name[locale] || name.fr || name.en || Object.values(name)[0] || '';
}

/**
 * Génère un SKU unique basé sur la marque et la catégorie
 */
export function generateSKU(brand: string, category: string, index: number): string {
  const brandCode = brand.substring(0, 3).toUpperCase();
  const categoryCode = category.substring(0, 3).toUpperCase();
  const indexStr = String(index).padStart(4, '0');
  return `${brandCode}-${categoryCode}-${indexStr}`;
}

/**
 * Valide les dimensions d'un produit
 */
export function validateDimensions(dimensions: ProductDimensions): boolean {
  return (
    dimensions.length > 0 &&
    dimensions.width > 0 &&
    dimensions.height > 0 &&
    dimensions.length < 1000 && // Max 10m
    dimensions.width < 1000 &&
    dimensions.height < 1000
  );
}

