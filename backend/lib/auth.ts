import { UserRole } from '@prisma/client';

/**
 * Vérifie si un utilisateur a le rôle requis pour accéder à une ressource
 */
export function hasRole(userRole: UserRole | null | undefined, requiredRoles: UserRole[]): boolean {
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
}

/**
 * Vérifie si un utilisateur est administrateur
 */
export function isAdmin(userRole: UserRole | null | undefined): boolean {
  return hasRole(userRole, ['ADMIN']);
}

/**
 * Vérifie si un utilisateur est gestionnaire
 */
export function isManager(userRole: UserRole | null | undefined): boolean {
  return hasRole(userRole, ['MANAGER']);
}

/**
 * Vérifie si un utilisateur est admin ou gestionnaire
 */
export function isAdminOrManager(userRole: UserRole | null | undefined): boolean {
  return hasRole(userRole, ['ADMIN', 'MANAGER']);
}

/**
 * Vérifie si un utilisateur est un client B2B
 */
export function isB2BCustomer(userRole: UserRole | null | undefined): boolean {
  return hasRole(userRole, ['B2B_CUSTOMER']);
}

/**
 * Vérifie si un utilisateur peut accéder aux routes admin
 */
export function canAccessAdmin(userRole: UserRole | null | undefined): boolean {
  return hasRole(userRole, ['ADMIN', 'MANAGER']);
}

/**
 * Vérifie si un utilisateur peut accéder aux routes B2B
 */
export function canAccessB2B(userRole: UserRole | null | undefined): boolean {
  return hasRole(userRole, ['B2B_CUSTOMER']);
}

/**
 * Permissions par rôle pour les actions admin
 */
export const adminPermissions = {
  ADMIN: {
    canManageUsers: true,
    canManageProducts: true,
    canManageOrders: true,
    canManageSettings: true,
    canViewAllStats: true,
    canManageStock: true,
    canManageCategories: true,
    canDeleteProducts: true,
    canRefundOrders: true,
    canExportData: true,
  },
  MANAGER: {
    canManageUsers: false,
    canManageProducts: true,
    canManageOrders: true,
    canManageSettings: false,
    canViewAllStats: false, // Pas toutes les stats, mais stats de vente OK
    canManageStock: true,
    canManageCategories: true,
    canDeleteProducts: false, // Soft delete uniquement
    canRefundOrders: false,
    canExportData: false,
  },
  CUSTOMER: {
    canManageUsers: false,
    canManageProducts: false,
    canManageOrders: false,
    canManageSettings: false,
    canViewAllStats: false,
    canManageStock: false,
    canManageCategories: false,
    canDeleteProducts: false,
    canRefundOrders: false,
    canExportData: false,
  },
  B2B_CUSTOMER: {
    canManageUsers: false,
    canManageProducts: false,
    canManageOrders: false, // Seulement ses propres commandes
    canManageSettings: false,
    canViewAllStats: false,
    canManageStock: false,
    canManageCategories: false,
    canDeleteProducts: false,
    canRefundOrders: false,
    canExportData: false,
  },
} as const;

/**
 * Récupère les permissions d'un utilisateur selon son rôle
 */
export function getUserPermissions(role: UserRole | null | undefined) {
  if (!role) return adminPermissions.CUSTOMER;
  return adminPermissions[role] || adminPermissions.CUSTOMER;
}

