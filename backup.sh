#!/data/data/com.termux/files/usr/bin/bash

BACKUP_DIR="$HOME/imci-platform/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p "$BACKUP_DIR"

echo "💾 بدء النسخ الاحتياطي الشامل..."
echo ""

# 1. نسخ قاعدة البيانات
echo "🗄️  نسخ قاعدة البيانات..."
pg_dump -h localhost imci_db > "$BACKUP_DIR/db_$DATE.sql" 2>/dev/null && echo "   ✅ قاعدة البيانات" || echo "   ⚠️  قاعدة البيانات غير متصلة"

# 2. نسخ الملفات
echo "📁 نسخ الملفات..."
tar -czf "$BACKUP_DIR/uploads_$DATE.tar.gz" uploads/ 2>/dev/null && echo "   ✅ الملفات" || echo "   ⚠️  لا توجد ملفات"

# 3. نسخ الكود
echo "📝 نسخ الكود..."
tar -czf "$BACKUP_DIR/backend_$DATE.tar.gz" backend/src/ --exclude=node_modules 2>/dev/null
tar -czf "$BACKUP_DIR/frontend_$DATE.tar.gz" frontend/*.html frontend/*.js --exclude=node_modules 2>/dev/null
echo "   ✅ الكود"

# 4. معلومات النظام
echo "📊 معلومات النظام..."
echo "Platform: IMCI Yemen" > "$BACKUP_DIR/info_$DATE.txt"
echo "Date: $(date)" >> "$BACKUP_DIR/info_$DATE.txt"
echo "Node: $(node --version 2>/dev/null)" >> "$BACKUP_DIR/info_$DATE.txt"
echo "PostgreSQL: $(psql --version 2>/dev/null)" >> "$BACKUP_DIR/info_$DATE.txt"
echo "   ✅ المعلومات"

echo ""
echo "════════════════════════════════════════"
echo "  ✅ اكتمل النسخ الاحتياطي"
echo "  📁 $BACKUP_DIR"
echo "  📦 $(ls $BACKUP_DIR/*$DATE* 2>/dev/null | wc -l) ملفات"
echo "════════════════════════════════════════"
