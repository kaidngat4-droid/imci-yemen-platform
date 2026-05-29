#!/data/data/com.termux/files/usr/bin/bash
clear
echo "╔══════════════════════════════════════════╗"
echo "║   📊 IMCI Yemen Platform Status        ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Backend
echo -n "📡 Backend (3000):  "
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ يعمل"
    echo "   $(curl -s http://localhost:3000/health | head -c 100)..."
else
    echo "❌ متوقف"
fi

echo ""

# Frontend
echo -n "🎨 Frontend (5173): "
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ يعمل"
else
    echo "❌ متوقف"
fi

echo ""

# PostgreSQL
echo -n "🗄️  PostgreSQL:     "
if pg_ctl -D $PREFIX/var/lib/postgresql status > /dev/null 2>&1; then
    echo "✅ يعمل"
else
    echo "❌ متوقف"
fi

echo ""

# Redis
echo -n "🔴 Redis:          "
if redis-cli ping > /dev/null 2>&1; then
    echo "✅ يعمل"
else
    echo "❌ متوقف"
fi

echo ""
echo "──────────────────────────────────────────"
echo "  🚀 تشغيل:  ./start-all.sh"
echo "  🛑 إيقاف:  ./stop-all.sh"
echo "  📊 حالة:   ./status.sh"
echo "──────────────────────────────────────────"
