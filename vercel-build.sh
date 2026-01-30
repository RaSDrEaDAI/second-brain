#!/bin/bash

# Clean npm cache
npm cache clean --force

# Install only production dependencies
npm ci --only=production

# Build Next.js application
npm run build

# Additional optimization steps
next build --no-lint