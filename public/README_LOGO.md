# 📸 Instructions pour le Logo

## Emplacement du logo

Placez votre fichier logo dans ce dossier (`/public/`) avec le nom :

**`logo.png`** ou **`logo.svg`**

## Formats acceptés

- PNG (recommandé pour les logos avec transparence)
- SVG (recommandé pour la qualité vectorielle)
- JPG (si pas d'autre option)

## Nom du fichier

Le Header cherche automatiquement :
- `/public/logo.png` (priorité)
- `/public/logo.svg` (si PNG n'existe pas)

## Taille recommandée

- Largeur : ~140px minimum
- Hauteur : ~50px (sera ajustée automatiquement)
- Format : Transparent de préférence (PNG avec alpha)

## Une fois le logo placé

Le Header l'affichera automatiquement. Si vous ne voyez pas le logo :
1. Vérifiez que le fichier s'appelle bien `logo.png` ou `logo.svg`
2. Vérifiez qu'il est dans le dossier `/public/`
3. Redémarrez le serveur de développement (`npm run dev`)

