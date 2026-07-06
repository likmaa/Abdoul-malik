'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DashboardIcon,
  ProductsIcon,
  OrdersIcon,
  BoxIcon,
  ProfileIcon,
} from '@/admin-panel/components/admin/AdminIcons';

const navigation = [
  { name: 'Dashboard', href: '/b2b', icon: DashboardIcon },
  { name: 'Catalogue', href: '/b2b/catalog', icon: ProductsIcon },
  { name: 'Mes Commandes', href: '/b2b/orders', icon: OrdersIcon },
  { name: 'Factures', href: '/b2b/invoices', icon: BoxIcon },
  { name: 'Profil', href: '/b2b/profile', icon: ProfileIcon },
];

export default function B2BLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-off-white">
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
              Espace B2B
            </span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Fermer le menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="mt-8 px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                      ? 'bg-violet-electric text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b border-gray-200">
            <Link href="/b2b" className="flex items-center gap-2">
              <img
                src="/logo.webp"
                alt="eJS MARKET"
                className="h-8 w-auto"
              />
              <span className="text-sm font-semibold text-gray-500">B2B</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                      ? 'bg-violet-electric text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
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
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
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
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">
              {navigation.find((item) => item.href === pathname)?.name || 'Espace B2B'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm text-gray-600">
              <span className="font-medium">Tarifs dégressifs</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-violet-electric flex items-center justify-center text-white font-semibold text-sm">
              B
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

