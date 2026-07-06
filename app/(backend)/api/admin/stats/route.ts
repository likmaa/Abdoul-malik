import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend/lib/auth-config';
import { prisma } from '@/backend/lib/prisma';
import { canAccessAdmin, getUserPermissions } from '@/backend/lib/auth';
import { canViewAllStats, canViewSalesStats } from '@/backend/lib/manager-permissions';

export const dynamic = 'force-dynamic';

// GET - Statistiques
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !canAccessAdmin(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    const permissions = getUserPermissions(session.user.role);
    const canViewAll = canViewAllStats(session.user.role);
    const canViewSales = canViewSalesStats(session.user.role);
    
    if (!canViewSales) {
      return NextResponse.json(
        { error: 'Permission refusée' },
        { status: 403 }
      );
    }
    
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const yearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
    const last30DaysStart = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);

    // Revenus
    const revenueToday = await prisma.orders.aggregate({
      where: {
        status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
        createdAt: { gte: today },
      },
      _sum: { totalTTC: true },
    });

    const revenueWeek = await prisma.orders.aggregate({
      where: {
        status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
        createdAt: { gte: weekAgo },
      },
      _sum: { totalTTC: true },
    });

    const revenueMonth = await prisma.orders.aggregate({
      where: {
        status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
        createdAt: { gte: monthAgo },
      },
      _sum: { totalTTC: true },
    });

    const revenueYear = await prisma.orders.aggregate({
      where: {
        status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
        createdAt: { gte: yearAgo },
      },
      _sum: { totalTTC: true },
    });

    // Commandes
    const ordersToday = await prisma.orders.count({
      where: { createdAt: { gte: today } },
    });

    const ordersWeek = await prisma.orders.count({
      where: { createdAt: { gte: weekAgo } },
    });

    const ordersMonth = await prisma.orders.count({
      where: { createdAt: { gte: monthAgo } },
    });

    // Dernières commandes (activité récente)
    const recentOrders = await prisma.orders.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        createdAt: true,
        status: true,
        totalTTC: true,
        users: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    // Revenus quotidiens sur 30 jours (pour graphique)
    const ordersLast30Days = await prisma.orders.findMany({
      where: {
        status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
        createdAt: { gte: last30DaysStart },
      },
      select: {
        createdAt: true,
        totalTTC: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const dayMs = 24 * 60 * 60 * 1000;
    const dailyMap = new Map<
      string,
      {
        total: number;
        orders: number;
      }
    >();

    for (const order of ordersLast30Days) {
      const key = order.createdAt.toISOString().slice(0, 10); // YYYY-MM-DD
      const existing = dailyMap.get(key) || { total: 0, orders: 0 };
      existing.total += order.totalTTC;
      existing.orders += 1;
      dailyMap.set(key, existing);
    }

    const dailyRevenue = Array.from({ length: 30 }).map((_, index) => {
      const dateObj = new Date(last30DaysStart.getTime() + index * dayMs);
      const key = dateObj.toISOString().slice(0, 10);
      const entry = dailyMap.get(key);

      return {
        date: key,
        label: dateObj.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
        }),
        total: entry?.total || 0,
        orders: entry?.orders || 0,
      };
    });

    // Produits
    const totalProducts = await prisma.products.count();
    const lowStockProducts = await prisma.products.count({
      where: { stock: { lt: 5 } },
    });

    // Commandes en attente
    const pendingOrders = await prisma.orders.count({
      where: { status: 'PENDING' },
    });

    // Top produits (si permissions - ADMIN uniquement)
    let topProducts: any[] = [];
    if (canViewAll) {
      const topProductsData = await prisma.order_items.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        _count: true,
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      });

      topProducts = await Promise.all(
        topProductsData.map(async (item) => {
          const product = await prisma.products.findUnique({
            where: { id: item.productId },
            select: { id: true, name: true, priceHT: true },
          });
          return {
            productId: item.productId,
            product,
            sales: item._sum.quantity || 0,
            orders: item._count,
          };
        })
      );
    }

    // Répartition des statuts de commandes (pour diagramme)
    const statusCounts = await prisma.orders.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    const statusBreakdown = statusCounts.map((item) => ({
      status: item.status,
      count: item._count.status,
    }));

    return NextResponse.json({
      revenue: {
        today: revenueToday._sum.totalTTC || 0,
        week: revenueWeek._sum.totalTTC || 0,
        month: revenueMonth._sum.totalTTC || 0,
        year: revenueYear._sum.totalTTC || 0,
      },
      orders: {
        today: ordersToday,
        week: ordersWeek,
        month: ordersMonth,
      },
      products: {
        total: totalProducts,
        lowStock: lowStockProducts,
      },
      pendingOrders,
      topProducts,
      recentOrders,
      dailyRevenue,
      statusBreakdown,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

