#!/bin/bash

# Script d'aide pour configurer la base de données
# Usage: ./scripts/setup-database.sh

set -e

echo "🚀 Configuration de la base de données pour eJS MARKET"
echo ""

# Détecter le système d'exploitation
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
else
    OS="other"
fi

echo "📋 Système détecté: $OS"
echo ""

# Vérifier si PostgreSQL est installé
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL est déjà installé"
    psql --version
else
    echo "❌ PostgreSQL n'est pas installé"
    echo ""
    echo "Choisissez une option :"
    echo "1. Installer PostgreSQL localement (macOS avec Homebrew)"
    echo "2. Utiliser une base PostgreSQL managée (Neon, Supabase, etc.)"
    echo ""
    read -p "Votre choix (1 ou 2): " choice
    
    if [ "$choice" == "1" ]; then
        if [ "$OS" == "macos" ]; then
            if command -v brew &> /dev/null; then
                echo "📦 Installation de PostgreSQL via Homebrew..."
                brew install postgresql@15
                brew services start postgresql@15
                echo "✅ PostgreSQL installé et démarré"
            else
                echo "❌ Homebrew n'est pas installé"
                echo "Installez Homebrew depuis https://brew.sh"
                exit 1
            fi
        elif [ "$OS" == "linux" ]; then
            echo "📦 Installation de PostgreSQL..."
            sudo apt update
            sudo apt install -y postgresql postgresql-contrib
            sudo systemctl start postgresql
            sudo systemctl enable postgresql
            echo "✅ PostgreSQL installé et démarré"
        else
            echo "❌ Installation automatique non supportée pour votre OS"
            echo "Installez PostgreSQL manuellement depuis https://www.postgresql.org/download/"
            exit 1
        fi
    elif [ "$choice" == "2" ]; then
        echo ""
        echo "🌐 Configuration d'une base PostgreSQL managée (ex: Neon) :"
        echo "1. Allez sur https://neon.tech (ou votre fournisseur PostgreSQL managé)"
        echo "2. Créez un compte et un projet"
        echo "3. Copiez la connection string PostgreSQL (URI)"
        echo "4. Mettez à jour DATABASE_URL dans .env.local"
        echo ""
        echo "Une fois fait, appuyez sur Entrée pour continuer..."
        read
    else
        echo "❌ Choix invalide"
        exit 1
    fi
fi

echo ""
echo "📝 Configuration de la base de données..."

# Demander les informations de connexion
read -p "Nom de la base de données [ejs_market]: " db_name
db_name=${db_name:-ejs_market}

read -p "Utilisateur PostgreSQL [postgres]: " db_user
db_user=${db_user:-postgres}

read -sp "Mot de passe PostgreSQL: " db_password
echo ""

read -p "Hôte [localhost]: " db_host
db_host=${db_host:-localhost}

read -p "Port [5432]: " db_port
db_port=${db_port:-5432}

# Créer la DATABASE_URL
DATABASE_URL="postgresql://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}?schema=public"

echo ""
echo "📋 DATABASE_URL générée:"
echo "DATABASE_URL=\"${DATABASE_URL}\""
echo ""

# Proposer de mettre à jour .env.local
read -p "Mettre à jour .env.local avec cette configuration? (o/n): " update_env

if [ "$update_env" == "o" ] || [ "$update_env" == "O" ]; then
    # Mettre à jour .env.local
    if [ -f .env.local ]; then
        # Remplacer la ligne DATABASE_URL si elle existe
        if grep -q "^DATABASE_URL=" .env.local; then
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' "s|^DATABASE_URL=.*|DATABASE_URL=\"${DATABASE_URL}\"|" .env.local
            else
                sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"${DATABASE_URL}\"|" .env.local
            fi
        else
            echo "DATABASE_URL=\"${DATABASE_URL}\"" >> .env.local
        fi
        echo "✅ .env.local mis à jour"
    else
        echo "DATABASE_URL=\"${DATABASE_URL}\"" > .env.local
        echo "✅ .env.local créé"
    fi
fi

echo ""
echo "🔧 Création de la base de données..."

# Tester la connexion et créer la base si elle n'existe pas
if PGPASSWORD="${db_password}" psql -h "${db_host}" -p "${db_port}" -U "${db_user}" -lqt | cut -d \| -f 1 | grep -qw "${db_name}"; then
    echo "✅ La base de données '${db_name}' existe déjà"
else
    echo "📦 Création de la base de données '${db_name}'..."
    PGPASSWORD="${db_password}" psql -h "${db_host}" -p "${db_port}" -U "${db_user}" -c "CREATE DATABASE ${db_name};" || {
        echo "⚠️  Impossible de créer la base de données automatiquement"
        echo "Créez-la manuellement avec:"
        echo "  createdb ${db_name}"
        echo "  ou"
        echo "  psql -c 'CREATE DATABASE ${db_name};'"
    }
fi

echo ""
echo "✨ Configuration terminée !"
echo ""
echo "Prochaines étapes :"
echo "1. npm run db:push    # Créer les tables"
echo "2. npm run db:seed    # Créer l'utilisateur admin"
echo "3. npm run db:studio  # Visualiser la base de données"

