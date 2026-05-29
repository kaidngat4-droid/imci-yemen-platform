#!/data/data/com.termux/files/usr/bin/bash
cd "$(dirname "$0")"

echo "🚀 تشغيل IMCI Yemen Platform..."
echo ""

# PostgreSQL
pg_ctl -D $PREFIX/var/lib/postgresql -o "-p 5432 -i -k /tmp" start 2>/dev/null
echo "✅ PostgreSQL"

# Redis
redis-server --daemonize yes --port 6379 --ignore-warnings ARM64-COW-BUG 2>/dev/null
echo "✅ Redis"

# Backend
cd backend
node src/server.js &
echo "✅ Backend (PID: $!)"
cd ..

sleep 2

echo ""
echo "════════════════════════════════════════"
echo "  ✅ المنصة تعمل!"
echo "  📡 http://localhost:3000"
echo "  💚 http://localhost:3000/health"
echo "  📋 http://localhost:3000/api/v1"
echo "════════════════════════════════════════"
