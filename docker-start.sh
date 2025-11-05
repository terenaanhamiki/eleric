#!/bin/bash
set -e

echo "Starting Elaric AI in production mode..."
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"

# Start the production server
exec node_modules/.bin/remix-serve build/server/index.js