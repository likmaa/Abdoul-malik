import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend/lib/auth-config';
import { prisma } from '@/backend/lib/prisma';
import { canAccessAdmin, getUserPermissions } from '@/backend/lib/auth';

export const dynamic = 'force-dynamic';

// GET - Export de données
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
    if (!permissions.canExportData) {
      return NextResponse.json(
        { error: 'Permission refusée' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'products'; // products, orders, users
    const format = searchParams.get('format') || 'csv'; // csv, json

    let data: any[] = [];
    let filename = '';

    switch (type) {
      case 'products':
        const products = await prisma.products.findMany({
          select: {
            sku: true,
            name: true,
            brand: true,
            category: true,
            priceHT: true,
            stock: true,
            isActive: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        });
        data = products.map(p => ({
          SKU: p.sku,
          Nom: typeof p.name === 'string' ? p.name : (p.name as any)?.fr || '',
          Marque: p.brand,
          Catégorie: p.category,
          'Prix HT (€)': (p.priceHT / 100).toFixed(2),
          Stock: p.stock,
          Actif: p.isActive ? 'Oui' : 'Non',
          'Date création': new Date(p.createdAt).toLocaleDateString('fr-FR'),
        }));
        filename = 'produits';
        break;

      case 'orders':
        const orders = await prisma.orders.findMany({
          include: {
            users: {
              select: { email: true, name: true },
            },
            order_items: {
              include: {
                products: {
                  select: { sku: true, name: true },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        });
        data = orders.map(o => ({
          ID: o.id,
          Email: o.users.email,
          'Nom client': o.users.name || '',
          Statut: o.status,
          'Total HT (€)': (o.totalHT / 100).toFixed(2),
          'Total TTC (€)': (o.totalTTC / 100).toFixed(2),
          'Frais livraison (€)': (o.shippingCost / 100).toFixed(2),
          'Date commande': new Date(o.createdAt).toLocaleDateString('fr-FR'),
          'Nombre articles': o.order_items.length,
        }));
        filename = 'commandes';
        break;

      case 'users':
        const users = await prisma.users.findMany({
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isEmailVerified: true,
            createdAt: true,
            _count: {
              select: { orders: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        });
        data = users.map(u => ({
          Email: u.email,
          Nom: u.name || '',
          Rôle: u.role,
          'Email vérifié': u.isEmailVerified ? 'Oui' : 'Non',
          'Nombre commandes': u._count.orders,
          'Date inscription': new Date(u.createdAt).toLocaleDateString('fr-FR'),
        }));
        filename = 'utilisateurs';
        break;

      default:
        return NextResponse.json(
          { error: 'Type d\'export invalide' },
          { status: 400 }
        );
    }

    if (format === 'csv') {
      // Convertir en CSV
      const headers = Object.keys(data[0] || {});
      const csvRows = [
        headers.join(','),
        ...data.map(row =>
          headers.map(header => {
            const value = row[header];
            return typeof value === 'string' && value.includes(',')
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          }).join(',')
        ),
      ];

      const csv = csvRows.join('\n');
      const csvBuffer = Buffer.from(csv, 'utf-8');

      return new NextResponse(csvBuffer, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    } else {
      // JSON
      return NextResponse.json(data, {
        headers: {
          'Content-Disposition': `attachment; filename="${filename}-${new Date().toISOString().split('T')[0]}.json"`,
        },
      });
    }
  } catch (error) {
    console.error('Erreur lors de l\'export:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

