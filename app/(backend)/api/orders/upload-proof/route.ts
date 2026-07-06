import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { Prisma } from '@prisma/client';
import fs from 'fs';
import { join } from 'path';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const orderId = formData.get('orderId') as string;

        if (!file || !orderId) {
            return NextResponse.json({ error: 'Fichier ou ID de commande manquant' }, { status: 400 });
        }

        // Vérifier si la commande existe
        const order = await prisma.orders.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filename = `${orderId}-${Date.now()}-${file.name.replace(/\s/g, '_')}`;
        const uploadDir = join(process.cwd(), 'public/uploads/proofs');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const path = join(uploadDir, filename);
        fs.writeFileSync(path, buffer);

        const proofUrl = `/uploads/proofs/${filename}`;


        const updateData: Prisma.ordersUpdateInput = {
            paymentProofUrl: proofUrl,
        } as any;

        await prisma.orders.update({
            where: { id: orderId },
            data: updateData,
        });

        return NextResponse.json({ success: true, proofUrl });
    } catch (error) {
        console.error('Erreur lors de l\'upload de la preuve:', error);
        return NextResponse.json({ error: 'Erreur serveur lors de l\'upload' }, { status: 500 });
    }
}
