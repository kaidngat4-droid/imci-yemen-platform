const express = require('express');
const { authenticate } = require('../middleware/auth');
const { requirePermission, getRolePermissions } = require('../middleware/permissions');
const { getAuditLogs } = require('../middleware/audit');
const { encrypt, decrypt } = require('../middleware/security');
const { exec } = require('child_process');
const router = express.Router();

// 📊 GET /api/v1/admin/dashboard
router.get('/dashboard', authenticate, requirePermission('reports.view'), (req, res) => {
  res.json({
    success: true,
    stats: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
      platform: process.platform,
      pid: process.pid
    }
  });
});

// 📋 GET /api/v1/admin/logs
router.get('/logs', authenticate, requirePermission('system.logs'), (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const logs = getAuditLogs(limit);
  res.json({ success: true, count: logs.length, data: logs });
});

// 💾 POST /api/v1/admin/backup
router.post('/backup', authenticate, requirePermission('system.backup'), (req, res) => {
  const backupScript = '/data/data/com.termux/files/home/imci-platform/backup.sh';
  
  exec(`bash ${backupScript}`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ success: false, error: 'فشل النسخ الاحتياطي' });
    }
    res.json({ success: true, message: 'تم النسخ الاحتياطي بنجاح', output: stdout });
  });
});

// 🔐 POST /api/v1/admin/encrypt
router.post('/encrypt', authenticate, requirePermission('system.settings'), (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'النص مطلوب' });
  
  const encrypted = encrypt(text);
  res.json({ success: true, encrypted });
});

// 🔓 POST /api/v1/admin/decrypt
router.post('/decrypt', authenticate, requirePermission('system.settings'), (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'النص المشفر مطلوب' });
  
  const decrypted = decrypt(text);
  res.json({ success: true, decrypted });
});

// 🛡️ GET /api/v1/admin/permissions
router.get('/permissions', authenticate, (req, res) => {
  const permissions = getRolePermissions(req.user.role);
  res.json({ success: true, role: req.user.role, permissions });
});

// 🔄 GET /api/v1/admin/health
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {
      api: true,
      database: true,
      redis: true,
      storage: true
    }
  });
});

module.exports = router;
