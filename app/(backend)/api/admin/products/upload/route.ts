import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend/lib/auth-config';
import { canAccessAdmin } from '@/backend/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !canAccessAdmin(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Vérifier l'extension ET le type MIME
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(extension)) {
      return NextResponse.json(
        { error: `Type de fichier non autorisé (${file.type}). Utilisez JPEG, PNG ou WebP` },
        { status: 400 }
      );
    }

    // Vérifier la taille (max 10MB au lieu de 5MB par sécurité)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(2)}MB). Taille maximale: 10MB` },
        { status: 400 }
      );
    }

    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'products');

    try {
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }
    } catch (err: any) {
      console.error('[Upload] Erreur dossier:', err);
      return NextResponse.json(
        { error: `Erreur permissions dossier: ${err.message}` },
        { status: 500 }
      );
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const filename = `${timestamp}-${randomString}.${extension}`;
    const filepath = join(uploadsDir, filename);

    // Convertir le fichier en buffer et l'écrire
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);
    } catch (err: any) {
      console.error('[Upload] Erreur écriture:', err);
      return NextResponse.json(
        { error: `Erreur écriture fichier: ${err.message}` },
        { status: 500 }
      );
    }

    // Retourner l'URL de l'image
    const imageUrl = `/uploads/products/${filename}`;

    return NextResponse.json({
      success: true,
      url: imageUrl,
      filename: filename
    });
  } catch (error: any) {
    console.error('Erreur lors de l\'upload:', error);
    return NextResponse.json(
      { error: `Erreur serveur: ${error.message}` },
      { status: 500 }
    );
  }
}

