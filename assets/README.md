# 📁 Assets - Organisation des fichiers média

Ce dossier contient tous les fichiers multimédias du projet.

## 📂 Structure

```
assets/
├── img/          # Images (logos, illustrations, photos produits, etc.)
├── video/        # Vidéos (promos, tutoriels, etc.)
└── other/        # Autres fichiers (PDF, documents, etc.)
```

## 📸 Dossier `img/`

**Usage** : Images statiques du site
- Logos
- Illustrations
- Photos produits
- Icônes personnalisées
- Bannières
- Images de fond

**Formats recommandés** :
- PNG (avec transparence)
- SVG (pour les logos/icônes)
- WebP (pour les photos, optimisé)
- JPG (si nécessaire)

## 🎥 Dossier `video/`

**Usage** : Vidéos du site
- Vidéos promotionnelles
- Tutoriels
- Démonstrations produits
- Animations

**Formats recommandés** :
- MP4 (H.264)
- WebM (pour le web)

## 📄 Dossier `other/`

**Usage** : Autres fichiers
- PDF (catalogues, guides)
- Documents
- Fichiers source (PSD, AI, etc.)
- Autres ressources

## 📝 Notes

- Les images utilisées directement dans le code Next.js doivent être dans `/public/` pour être accessibles via URL
- Les assets source peuvent rester dans `/assets/` et être copiés vers `/public/` si nécessaire
- Utilisez Next.js Image pour optimiser automatiquement les images

