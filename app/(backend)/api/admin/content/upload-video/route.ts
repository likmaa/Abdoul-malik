import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend/lib/auth-config';
import { isAdmin } from '@/backend/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.role || !isAdmin(session.user.role)) {
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

    // Vérifier le type de fichier
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non autorisé. Formats acceptés: MP4, WebM, MOV' },
        { status: 400 }
      );
    }

    // Vérifier la taille
    if (file.size > MAX_VIDEO_SIZE) {
      return NextResponse.json(
        { error: `Fichier trop volumineux. Taille maximale: ${MAX_VIDEO_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Créer le dossier d'upload si nécessaire
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'videos');
    await mkdir(uploadDir, { recursive: true });

    // Générer un nom de fichier unique
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const filePath = join(uploadDir, uniqueFilename);

    // Convertir le fichier en buffer et l'écrire
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const videoUrl = `/uploads/videos/${uniqueFilename}`;

    return NextResponse.json({ url: videoUrl });
  } catch (error) {
    console.error('Erreur lors de l\'upload de la vidéo:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'upload' },
      { status: 500 }
    );
  }
}

