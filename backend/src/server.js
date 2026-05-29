require('dotenv').config({ path: '../../.env' });
const express = require('express');
const cors = require('cors');
const { securityMiddleware } = require('./middleware/security');
const { auditMiddleware } = require('./middleware/audit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(securityMiddleware);
app.use(auditMiddleware);

// Routes
const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');
const liveRoutes = require('./routes/live');
const certificatesRoutes = require('./routes/certificates');
const examsRoutes = require('./routes/exams');
const instructorRoutes = require('./routes/instructor');
const adminRoutes = require('./routes/admin');

// Health
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'IMCI Yemen',
    version: '4.0.0',
    security: 'enabled',
    timestamp: new Date().toISOString()
  });
});

// API v1
const api = express.Router();

api.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'IMCI Yemen Platform API v4',
    security: {
      encryption: 'AES-256-CBC',
      auth: 'JWT + RBAC',
      protection: ['XSS', 'CSRF', 'Rate Limiting'],
      audit: 'Enabled'
    },
    endpoints: [
      'auth/*', 'courses/*', 'live/*', 'certificates/*',
      'exams/*', 'instructor/*', 'admin/*'
    ]
  });
});

api.use('/auth', authRoutes);
api.use('/courses', coursesRoutes);
api.use('/live', liveRoutes);
api.use('/certificates', certificatesRoutes);
api.use('/exams', examsRoutes);
api.use('/instructor', instructorRoutes);
api.use('/admin', adminRoutes);

app.use('/api/v1', api);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'المسار غير موجود' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(500).json({ error: 'خطأ داخلي في الخادم' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║  🏥 IMCI Yemen Platform v4.0          ║');
  console.log('║  🔐 Security: Enabled                 ║');
  console.log('║  📝 Audit: Active                     ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('');
  console.log(`✅ http://localhost:${PORT}`);
  console.log(`📋 http://localhost:${PORT}/api/v1`);
  console.log(`🔐 http://localhost:${PORT}/api/v1/admin/health`);
  console.log('');
});
