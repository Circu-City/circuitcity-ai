#!/bin/bash
source /home/circucit/nodevenv/home/circucit/chatbot.circucity.se/20/bin/activate
cd /home/circucit/home/circucit/chatbot.circucity.se

echo "=== NPM ROOT ==="
npm root

echo "=== FIND PRISMA ==="
find /home/circucit/nodevenv/ -name "prisma" -type d 2>/dev/null | head -10
find /home/circucit/nodevenv/ -name "prisma" -type f 2>/dev/null | head -10

echo "=== PRISMA GENERATE ==="
npx prisma@5.22.0 generate 2>&1 || node /home/circucit/nodevenv/home/circucit/chatbot.circucity.se/20/lib/node_modules/prisma/build/index.js generate 2>&1

echo "=== BUILD ==="
npm run build 2>&1

echo "=== DONE ==="
