# ✅ Checklist Production - EJS Market

## 🎯 État Actuel du Projet

### ✅ Configuration Technique
- [x] Next.js 15.5.6 installé et configuré
- [x] ESLint 8.57.0 configuré (compatible Next.js 15)
- [x] TypeScript configuré
- [x] Prisma ORM configuré
- [x] Build de production fonctionnel
- [x] Aucune vulnérabilité (`npm audit` clean)
- [x] Tous les tests passent

### ✅ Code Quality
- [x] Composants dynamiques correctement configurés
- [x] Layout optimisé (Server/Client Components)
- [x] Configuration Next.js propre (swcMinify supprimé)
- [x] ESLint actif et fonctionnel

---

## 🚀 Étapes de Déploiement Production

### 1. Préparation du Code

- [x] Build de production testé localement
- [x] Toutes les dépendances à jour
- [x] Configuration ESLint fonctionnelle
- [ ] **À faire** : Corriger les 2 warnings `<img>` → `<Image />` (optionnel)

### 2. Base de Données

- [ ] **Vérifier** : Base de données PostgreSQL configurée (**Neon**)
- [ ] **Vérifier** : `DATABASE_URL` configurée en production
- [ ] **Vérifier** : `DATABASE_URL_UNPOOLED` configurée (si utilisée)
- [ ] **À faire** : Exécuter les migrations Prisma en production
  ```bash
  npx prisma migrate deploy
  ```
- [ ] **À faire** : Seed les données initiales (taux TVA, zones livraison)
  ```bash
  npm run db:seed
  ```

### 3. Variables d'Environnement Production

#### Variables OBLIGATOIRES :

```bash
# Base de données
DATABASE_URL="postgresql://..."
DATABASE_URL_UNPOOLED="postgresql://..." # Optionnel mais recommandé

# NextAuth
NEXTAUTH_URL="https://votre-domaine.com"
NEXTAUTH_SECRET="votre-secret-minimum-32-caracteres"

# Node Environment
NODE_ENV="production"
```

#### Variables OPTIONNELLES :

```bash
# Stripe (si paiements activés)
STRIPE_PUBLIC_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Algolia (si recherche activée)
NEXT_PUBLIC_ALGOLIA_APP_ID="..."
NEXT_PUBLIC_ALGOLIA_API_KEY="..."
ALGOLIA_ADMIN_API_KEY="..."
```

### 4. Déploiement Coolify
#### Étape 1 : Préparer le dépôt GitHub
- [ ] Code poussé sur GitHub
- [ ] Branche `main` prête (avec `Dockerfile`)

#### Étape 2 : Créer le projet dans Coolify
1. Se connecter à votre instance Coolify
2. Cliquer sur **"Sources"** et s'assurer que GitHub est lié
3. Cliquer sur **"Projects"** -> **"Create New Project"** -> **"Production"**
4. Cliquer sur **"Add New Application"** -> **"Public/Private Repository"**
5. Sélectionner le dépôt `EJS-Market`
6. Configurer :
   - **Build Pack** : Dockerfile (automatiquement détecté)
   - **Destination Port** : 3000
   - **Domains** : `https://ejs.ticmiton.com`

#### Étape 3 : Configurer les Variables d'Environnement
Dans l'onglet **Environment Variables**, ajouter :
1. `DATABASE_URL` (PostgreSQL Neon)
2. `NEXT_PUBLIC_APP_URL` = `https://ejs.ticmiton.com`
3. `NEXTAUTH_URL` = `https://ejs.ticmiton.com`
4. `NEXTAUTH_SECRET` = `openssl rand -base64 32`
5. `NODE_ENV` = `production`

#### Étape 4 : Déployer
- [ ] Cliquer sur **"Deploy"**
- [ ] Attendre la fin du build Docker
- [ ] Vérifier les logs dans Coolify
- [ ] Tester l'application sur [ejs.ticmiton.com](https://ejs.ticmiton.com)

### 5. Post-Déploiement
#### Initialisation Base de Données
- [ ] Accéder au terminal de l'application dans Coolify ou localement
- [ ] Exécuter les migrations : `npx prisma migrate deploy`
- [ ] Seed les données initiales : `npm run db:seed`

#### Vérifications
- [ ] Site accessible sur [https://ejs.ticmiton.com](https://ejs.ticmiton.com)
- [ ] Authentification fonctionne (login/register)
- [ ] Base de données connectée
- [ ] Images s'affichent
- [ ] SSL est actif (fourni par Traefik via Coolify)

---

## 🔒 Sécurité Production

### Checklist Sécurité
- [x] Headers de sécurité configurés (`next.config.js`)
- [x] Validation Zod sur les inputs
- [x] NextAuth configuré avec secret fort
- [ ] **À vérifier** : HTTPS activé (automatique sur Coolify / Traefik)
- [ ] **À vérifier** : Variables sensibles dans Coolify (pas dans le code)
- [ ] **À vérifier** : Rate limiting configuré (si nécessaire)

---

## 📊 Monitoring & Analytics

### À Configurer (Optionnel)
- [ ] Logs Coolify configurés

---

## 🚨 En Cas de Problème

### Build Échoue
1. Vérifier les logs Coolify
2. Tester le build localement : `npm run build`
3. Vérifier les variables d'environnement
4. Vérifier la connexion à la base de données

### Erreurs Runtime
1. Vérifier les logs Coolify
2. Vérifier la console navigateur
3. Vérifier la connexion à la base de données
4. Vérifier les variables d'environnement

### Base de Données
- **Déploiement Coolify** : [`docs/DEPLOIEMENT.md`](./docs/DEPLOIEMENT.md)
- **Configuration GitHub** : [`docs/INSTRUCTIONS_GITHUB.md`](./docs/INSTRUCTIONS_GITHUB.md)
- **Base de données** : [`docs/SETUP_DATABASE.md`](./docs/SETUP_DATABASE.md)
- **Authentification** : [`docs/AUTHENTICATION.md`](./docs/AUTHENTICATION.md)

---

## ✅ Prêt pour Production

Une fois toutes les cases cochées, votre application est prête pour la production ! 🚀

**Bon déploiement !**

