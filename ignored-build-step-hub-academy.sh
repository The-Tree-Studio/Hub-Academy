#!/bin/bash

# ============================================================
# Vercel - Ignored Build Step — Hub Academy
# ============================================================
# Retourne 0 → build ANNULÉ (contenu non-critique modifié)
# Retourne 1 → build LANCÉ  (code ou config important modifié)
#
# INSTALLATION :
#   1. Placer ce fichier à la racine du repo Hub Academy
#   2. Vercel Dashboard → Project → Settings → Git
#      → "Ignored Build Step" → saisir : bash ignored-build-step-hub-academy.sh
# ============================================================

echo "🎓 Hub Academy — Analyse des fichiers modifiés..."

CHANGED_FILES=$(git diff --name-only HEAD^ HEAD 2>/dev/null)

if [ -z "$CHANGED_FILES" ]; then
  echo "⚠️  Impossible de comparer les commits. Build lancé par précaution."
  exit 1
fi

echo "Fichiers modifiés :"
echo "$CHANGED_FILES"

# ============================================================
# CONTENU — pas besoin de rebuilder
# ============================================================
IGNORE_PATTERNS=(

  # --- Documentation & repo ---
  "^README"
  "^CHANGELOG"
  "^LICENSE"
  "^CONTRIBUTING"
  ".*\.md$"
  ".*\.mdx$"
  ".*\.txt$"
  "^\.gitignore$"
  "^\.gitattributes$"
  "^CODEOWNERS$"

  # --- Cours & contenu pédagogique ---
  "^content/"
  "^courses/"
  "^curriculum/"
  "^lessons/"
  "^modules/"
  "^chapters/"
  "^academy/"
  "^blog/"
  "^articles/"
  "^posts/"

  # --- Médias & assets statiques ---
  "^public/"
  "^assets/"
  "^static/"
  "^media/"
  ".*\.png$"
  ".*\.jpg$"
  ".*\.jpeg$"
  ".*\.gif$"
  ".*\.webp$"
  ".*\.svg$"
  ".*\.ico$"
  ".*\.mp4$"
  ".*\.webm$"
  ".*\.mov$"
  ".*\.avi$"
  ".*\.vtt$"
  ".*\.srt$"
  ".*\.pdf$"

  # --- Données / CMS / base de données de contenu ---
  "^data/"
  "^mock/"
  "^mocks/"
  "^fixtures/"
  "^seeds/"
  ".*\.json$"
  ".*\.csv$"
  ".*\.xml$"
  ".*\.yaml$"
  ".*\.yml$"

  # --- Traductions (i18n) ---
  "^locales/"
  "^i18n/"
  "^translations/"
  "^lang/"
  "^messages/"
  ".*\.po$"
  ".*\.pot$"

  # --- Config IDE / CI non-fonctionnelle ---
  "^\.github/"
  "^\.vscode/"
  "^\.idea/"
  "^\.husky/"
  "^docs/"

)

# ============================================================
# Vérifie si TOUS les fichiers modifiés sont non-critiques
# ============================================================
ALL_IGNORED=true

while IFS= read -r FILE; do
  MATCHED=false
  for PATTERN in "${IGNORE_PATTERNS[@]}"; do
    if echo "$FILE" | grep -qE "$PATTERN"; then
      MATCHED=true
      break
    fi
  done

  if [ "$MATCHED" = false ]; then
    echo "✅ Fichier important modifié : $FILE → Build nécessaire."
    ALL_IGNORED=false
    break
  fi
done <<< "$CHANGED_FILES"

if [ "$ALL_IGNORED" = true ]; then
  echo "⏭️  Seulement du contenu non-critique modifié. Build ignoré. 💰 Build minutes économisées !"
  exit 0
else
  echo "🚀 Lancement du build Hub Academy..."
  exit 1
fi
