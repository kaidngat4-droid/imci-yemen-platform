#!/data/data/com.termux/files/usr/bin/bash
echo "🛑 إيقاف المنصة..."
pkill -f "node src/server.js"
redis-cli shutdown 2>/dev/null
pg_ctl -D $PREFIX/var/lib/postgresql stop 2>/dev/null
echo "✅ تم الإيقاف"
