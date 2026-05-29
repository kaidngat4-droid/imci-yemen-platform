const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '../../../../logs');
const AUDIT_FILE = path.join(LOG_DIR, 'audit.log');

// إنشاء مجلد السجلات
try { fs.mkdirSync(LOG_DIR, { recursive: true }); } catch(e) {}

// 📝 تسجيل حدث تدقيق
function auditLog(action, userId = 'anonymous', details = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    action,
    userId,
    ip: details.ip || 'unknown',
    userAgent: details.userAgent || 'unknown',
    status: details.status || 'success',
    details: details.info || ''
  };
  
  const logLine = JSON.stringify(entry) + '\n';
  
  fs.appendFile(AUDIT_FILE, logLine, (err) => {
    if (err) console.error('Audit log error:', err);
  });
  
  // طباعة ملونة للتطوير
  const colors = { success: '✅', failed: '❌', warning: '⚠️' };
  console.log(`${colors[entry.status] || '📝'} AUDIT: ${action} | ${userId} | ${entry.timestamp}`);
}

// 🛡️ Middleware تسجيل
function auditMiddleware(req, res, next) {
  const startTime = Date.now();
  
  // تسجيل الطلب
  auditLog(
    `${req.method} ${req.path}`,
    req.user?.id || req.ip,
    {
      ip: req.ip,
      userAgent: req.get('User-Agent')?.substring(0, 50),
      status: 'success',
      info: req.method === 'POST' ? JSON.stringify(req.body).substring(0, 100) : ''
    }
  );
  
  // تسجيل وقت الاستجابة
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    if (duration > 1000) {
      console.log(`⏱️  Slow request: ${req.method} ${req.path} - ${duration}ms`);
    }
  });
  
  next();
}

// 📊 عرض السجلات
function getAuditLogs(limit = 50) {
  try {
    const data = fs.readFileSync(AUDIT_FILE, 'utf-8');
    const lines = data.trim().split('\n').filter(Boolean);
    return lines.slice(-limit).map(line => JSON.parse(line));
  } catch(e) {
    return [];
  }
}

module.exports = { auditLog, auditMiddleware, getAuditLogs };
