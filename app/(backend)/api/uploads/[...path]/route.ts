import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const dynamic = 'force-dynamic';

// Route pour servir les fichiers uploadés
// Accessible via /api/uploads/products/[filename]
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path } = await params;

        if (!path || path.length === 0) {
            return NextResponse.json({ error: 'Chemin non spécifié' }, { status: 400 });
        }

        // Construire le chemin du fichier
        const filePath = join(process.cwd(), 'public', 'uploads', ...path);

        // Vérifier que le fichier existe
        if (!existsSync(filePath)) {
            console.log('[Uploads API] Fichier non trouvé:', filePath);
            return NextResponse.json({ error: 'Fichier non trouvé' }, { status: 404 });
        }

        // Sécurité: vérifier que le chemin reste dans le dossier uploads
        const uploadsDir = join(process.cwd(), 'public', 'uploads');
        if (!filePath.startsWith(uploadsDir)) {
            return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
        }

        // Lire le fichier
        const fileBuffer = await readFile(filePath);

        // Déterminer le type MIME
        const extension = path[path.length - 1].split('.').pop()?.toLowerCase();
        const mimeTypes: Record<string, string> = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'webp': 'image/webp',
            'gif': 'image/gif',
            'svg': 'image/svg+xml',
        };
        const contentType = mimeTypes[extension || ''] || 'application/octet-stream';

        // Retourner le fichier avec les headers appropriés
        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('[Uploads API] Erreur:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
