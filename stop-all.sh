#!/data/data/com.termux/files/usr/bin/bash
echo "🛑 إيقاف جميع الخدمات..."
fuser -k 3000/tcp 2>/dev/null
fuser -k 5173/tcp 2>/dev/null
redis-cli shutdown 2>/dev/null
pg_ctl -D $PREFIX/var/lib/postgresql stop 2>/dev/null
sleep 1
echo "✅ تم إيقاف جميع الخدمات"
