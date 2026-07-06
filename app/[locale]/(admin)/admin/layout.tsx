'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useAuth } from '@/frontend/hooks/useAuth';
import {
  DashboardIcon,
  ProductsIcon,
  OrdersIcon,
  StatsIcon,
  ProfileIcon,
  UsersIcon,
  SettingsIcon,
  ContentIcon,
  CloseIcon,
  BackIcon,
  MenuIcon,
  LogoutIcon,
} from '@/admin-panel/components/admin/AdminIcons';
import { NotificationBell } from '@/admin-panel/components/admin/NotificationBell';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: DashboardIcon },
  { name: 'Produits', href: '/admin/products', icon: ProductsIcon },
  { name: 'Catégories', href: '/admin/categories', icon: ContentIcon },
  { name: 'Commandes', href: '/admin/orders', icon: OrdersIcon },
  { name: 'Statistiques', href: '/admin/stats', icon: StatsIcon },
  { name: 'Contenu', href: '/admin/content', icon: ContentIcon, adminOnly: true },
  { name: 'Utilisateurs', href: '/admin/users', icon: UsersIcon, adminOnly: true },
  { name: 'Logs', href: '/admin/logs', icon: StatsIcon, adminOnly: true },
  { name: 'Terminal', href: '/admin/terminal', icon: SettingsIcon, adminOnly: true },
  { name: 'Paramètres', href: '/admin/settings', icon: SettingsIcon, adminOnly: true },
  { name: 'Profil', href: '/admin/profile', icon: ProfileIcon },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, canAccessAdmin, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    // Blocage global : seuls ADMIN et MANAGER peuvent accéder à /admin
    if (!canAccessAdmin) {
      router.push('/unauthorized');
      return;
    }

    // Blocage fin : certaines sections sont réservées aux ADMIN
    const currentNavItem = navigation.find((item) =>
      pathname?.startsWith(item.href)
    );

    if (currentNavItem?.adminOnly && user?.role !== 'ADMIN') {
      router.push('/unauthorized');
    }
  }, [isLoading, canAccessAdmin, pathname, router, user?.role]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Mobile */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'
          }`}
      >
        <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-6 border-b">
            <span className="text-xl font-bold text-violet-electric">
              Admin Panel
            </span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Fermer le menu"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
          <nav className="mt-8 px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              // Filtrer les éléments admin-only si l'utilisateur n'est pas admin
              if (item.adminOnly && user?.role !== 'ADMIN') {
                return null;
              }
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg transition-all duration-200 ${isActive
                    ? 'bg-violet-electric text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`flex-shrink-0 w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:top-16 lg:bottom-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b border-gray-200">
            <Link href="/admin" className="flex items-center gap-2">
              <img
                src="/logo.webp"
                alt="eJS MARKET"
                className="h-8 w-auto"
              />
              <span className="text-sm font-semibold text-gray-500">Admin</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 pt-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              // Filtrer les éléments admin-only si l'utilisateur n'est pas admin
              if (item.adminOnly && user?.role !== 'ADMIN') {
                return null;
              }
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg transition-all duration-200 ${isActive
                    ? 'bg-violet-electric text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <item.icon className={`flex-shrink-0 w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer Sidebar */}
          <div className="p-4 border-t border-gray-200">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-violet-electric transition-colors"
            >
              <BackIcon className="w-4 h-4" />
              Retour au site
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-4 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">
              {navigation.find((item) => item.href === pathname)?.name || 'Admin'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell pollingInterval={30000} />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name || user?.email}</p>
                <p className="text-xs text-gray-500">
                  {user?.role === 'ADMIN'
                    ? 'Administrateur'
                    : user?.role === 'MANAGER'
                      ? 'Manager'
                      : user?.role}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-violet-electric flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'A'}
              </div>
              <Link
                href="/admin/profile"
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                aria-label="Profil"
                title="Profil"
              >
                <ProfileIcon className="w-5 h-5" />
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                aria-label="Déconnexion"
                title="Déconnexion"
              >
                <LogoutIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

