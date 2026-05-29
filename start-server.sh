#!/bin/bash

PORT=5173
PID=$(fuser -n tcp $PORT 2>/dev/null | awk '{print $1}')

case "$1" in
    start)
        if [ -n "$PID" ]; then
            echo "⚠️ السيرفر يعمل بالفعل على PID: $PID"
            exit 1
        fi
        cd ~/imci-platform/frontend
        echo "🚀 تشغيل IMCI Server..."
        nohup node --max-old-space-size=128 server.js > ~/imci-platform/server.log 2>&1 &
        sleep 2
        NEWPID=$(fuser -n tcp $PORT 2>/dev/null | awk '{print $1}')
        echo "✅ السيرفر يعمل على: http://localhost:$PORT (PID: $NEWPID)"
        ;;
    stop)
        if [ -n "$PID" ]; then
            kill -9 $PID 2>/dev/null
            echo "🛑 تم إيقاف السيرفر (PID: $PID)"
        else
            echo "ℹ️ السيرفر غير مشغل"
        fi
        ;;
    restart)
        $0 stop
        sleep 1
        $0 start
        ;;
    status)
        if [ -n "$PID" ]; then
            echo "✅ السيرفر يعمل (PID: $PID)"
            echo "📊 آخر 3 أسطر من السجل:"
            tail -3 ~/imci-platform/server.log
        else
            echo "❌ السيرفر متوقف"
        fi
        ;;
    logs)
        tail -f ~/imci-platform/server.log
        ;;
    *)
        echo "الاستخدام: $0 {start|stop|restart|status|logs}"
        exit 1
        ;;
esac
