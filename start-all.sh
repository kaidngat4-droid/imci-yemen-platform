#!/data/data/com.termux/files/usr/bin/bash

echo "🚀 تشغيل منصة IMCI Yemen..."
echo ""

# ─── PostgreSQL ───
echo "🗄️  PostgreSQL..."
rm -f $PREFIX/var/lib/postgresql/postmaster.pid
pg_ctl -D $PREFIX/var/lib/postgresql -o "-p 5432 -i -k /tmp" -l logs/pg.log start 2>/dev/null
sleep 2
pg_ctl -D $PREFIX/var/lib/postgresql status > /dev/null 2>&1 && echo "   ✅ PostgreSQL" || echo "   ⚠️  PostgreSQL (وضع احتياطي)"

# ─── Redis ───
echo "🔴 Redis..."
pkill redis-server 2>/dev/null
sleep 1
redis-server --daemonize yes --port 6379 --ignore-warnings ARM64-COW-BUG 2>/dev/null
redis-cli ping > /dev/null 2>&1 && echo "   ✅ Redis" || echo "   ⚠️  Redis"

# ─── تنظيف ───
echo "🧹 تنظيف المنافذ..."
fuser -k 3000/tcp 2>/dev/null
fuser -k 5173/tcp 2>/dev/null
sleep 2

# ─── Backend ───
echo "📡 Backend (port 3000)..."
cd ~/imci-platform/backend
node src/server.js > ../logs/backend.log 2>&1 &
sleep 3
curl -s http://localhost:3000/health > /dev/null 2>&1 && echo "   ✅ Backend" || echo "   ❌ Backend"

# ─── Frontend ───
echo "🎨 Frontend (port 5173)..."
cd ~/imci-platform/frontend
node server.js > ../logs/frontend.log 2>&1 &
sleep 2
curl -s http://localhost:5173 > /dev/null 2>&1 && echo "   ✅ Frontend" || echo "   ❌ Frontend"

echo ""
echo "════════════════════════════════════════"
echo "  ✅ المنصة جاهزة!"
echo "  🎨 http://localhost:5173"
echo "  📡 http://localhost:3000"
echo "════════════════════════════════════════"
