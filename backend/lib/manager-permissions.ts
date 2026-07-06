import { UserRole } from '@prisma/client';
import { getUserPermissions } from './auth';

/**
 * Vérifie si un utilisateur peut gérer les utilisateurs (ADMIN uniquement)
 */
export function canManageUsers(role: UserRole | null | undefined): boolean {
  const permissions = getUserPermissions(role);
  return permissions.canManageUsers;
}

/**
 * Vérifie si un utilisateur peut gérer les paramètres du site (ADMIN uniquement)
 */
export function canManageSettings(role: UserRole | null | undefined): boolean {
  const permissions = getUserPermissions(role);
  return permissions.canManageSettings;
}

/**
 * Vérifie si un utilisateur peut voir toutes les statistiques (ADMIN uniquement)
 * Les MANAGER peuvent voir les stats de vente mais pas toutes les stats
 */
export function canViewAllStats(role: UserRole | null | undefined): boolean {
  const permissions = getUserPermissions(role);
  return permissions.canViewAllStats;
}

/**
 * Vérifie si un utilisateur peut voir les statistiques de vente (ADMIN et MANAGER)
 */
export function canViewSalesStats(role: UserRole | null | undefined): boolean {
  if (!role) return false;
  return role === 'ADMIN' || role === 'MANAGER';
}

/**
 * Vérifie si un utilisateur peut gérer le stock (ADMIN et MANAGER)
 */
export function canManageStock(role: UserRole | null | undefined): boolean {
  const permissions = getUserPermissions(role);
  return permissions.canManageStock || false;
}

/**
 * Vérifie si un utilisateur peut gérer les catégories (ADMIN et MANAGER)
 */
export function canManageCategories(role: UserRole | null | undefined): boolean {
  const permissions = getUserPermissions(role);
  return permissions.canManageCategories || false;
}

/**
 * Vérifie si un utilisateur peut rembourser des commandes (ADMIN uniquement)
 */
export function canRefundOrders(role: UserRole | null | undefined): boolean {
  const permissions = getUserPermissions(role);
  return permissions.canRefundOrders;
}

/**
 * Vérifie si un utilisateur peut exporter des données sensibles (ADMIN uniquement)
 */
export function canExportData(role: UserRole | null | undefined): boolean {
  const permissions = getUserPermissions(role);
  return permissions.canExportData;
}

/**
 * Vérifie si un utilisateur peut supprimer définitivement des produits (ADMIN uniquement)
 * Les MANAGER peuvent seulement faire des soft deletes
 */
export function canDeleteProducts(role: UserRole | null | undefined): boolean {
  const permissions = getUserPermissions(role);
  return permissions.canDeleteProducts;
}

