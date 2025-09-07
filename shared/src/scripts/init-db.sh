#!/usr/bin/env bash
set -euo pipefail

: "${DB_HOST:?Need DB_HOST}"
: "${DB_NAME:?Need DB_NAME}"
: "${DB_USER:?Need DB_USER}"
: "${DB_PASSWORD:?Need DB_PASSWORD}"

CHECK_TABLE="fragrances"

EXISTS=$(PGPASSWORD=$DB_PASSWORD psql \
  -h $DB_HOST \
  -U $DB_USER \
  -d $DB_NAME \
  -tAc "SELECT to_regclass('public.${CHECK_TABLE}') IS NOT NULL")

if [ "$EXISTS" = "t" ]; then
  echo "Database already initialized (found table: $CHECK_TABLE). Skipping schema.sql."
else
  echo "Database not initialized. Applying schema.sql..."
  PGPASSWORD=$DB_PASSWORD psql \
    -h $DB_HOST \
    -U $DB_USER \
    -d $DB_NAME \
    -f src/db/schema.sql

  if [ -f src/db/seed.sql ]; then
    echo "Applying seed.sql..."
    PGPASSWORD=$DB_PASSWORD psql \
      -h $DB_HOST \
      -U $DB_USER \
      -d $DB_NAME \
      -f src/db/seed.sql
  fi

  echo "Database initialized successfully."
fi
