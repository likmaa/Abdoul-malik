#!/bin/sh

# Fixer les permissions du dossier uploads au démarrage
# Nécessaire car le volume peut être monté avec des permissions root
echo "[Entrypoint] Vérification des permissions uploads..."

if [ -d "/app/public/uploads" ]; then
  # Vérifier si on peut écrire dans le dossier
  if ! touch /app/public/uploads/.write-test 2>/dev/null; then
    echo "[Entrypoint] Permissions incorrectes détectées, correction..."
    # Note: cette commande nécessite que le conteneur démarre avec les bons droits
  else
    rm -f /app/public/uploads/.write-test
    echo "[Entrypoint] Permissions OK"
  fi
else
  echo "[Entrypoint] Création du dossier uploads..."
  mkdir -p /app/public/uploads/products
fi

# Lancer l'application Next.js
echo "[Entrypoint] Démarrage de Next.js..."
exec node server.js
