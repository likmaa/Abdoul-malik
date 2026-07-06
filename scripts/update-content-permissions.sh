#!/bin/bash

# Script pour mettre à jour toutes les routes de contenu pour bloquer les MANAGER

echo "🔒 Mise à jour des permissions de contenu (ADMIN uniquement)..."

# Liste des fichiers à modifier
FILES=(
  "app/api/admin/content/partners/route.ts"
  "app/api/admin/content/partners/[id]/route.ts"
  "app/api/admin/content/testimonials/route.ts"
  "app/api/admin/content/testimonials/[id]/route.ts"
  "app/api/admin/content/hero-images/route.ts"
  "app/api/admin/content/hero-images/[id]/route.ts"
  "app/api/admin/content/hero-images/reorder/route.ts"
  "app/api/admin/content/immersive-images/route.ts"
  "app/api/admin/content/immersive-images/[id]/route.ts"
  "app/api/admin/content/immersive-images/reorder/route.ts"
  "app/api/admin/content/partners/reorder/route.ts"
  "app/api/admin/content/testimonials/reorder/route.ts"
  "app/api/admin/content/upload-video/route.ts"
  "app/api/admin/content/history/route.ts"
)

echo "✅ Fichiers identifiés. Utilisez les outils de recherche/remplacement pour mettre à jour."
echo "   Remplacer: canAccessAdmin(session.user.role)"
echo "   Par: isAdmin(session.user.role)"
echo ""
echo "   Et ajouter l'import: import { isAdmin } from '@/lib/auth';"

