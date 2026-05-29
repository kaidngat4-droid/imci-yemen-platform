const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'imci_jwt_secret_2026';

// 👥 المستخدمين
let users = [];

// تهيئة المستخدمين
(async () => {
  const hash = await bcrypt.hash('Yemen2026!', 10);
  users = [
    {
      id: 'admin-001',
      email: 'Kaidngat4@gmail.com',
      password: hash,
      firstName: 'Salah',
      lastName: 'Al-Ahdal',
      phone: '777000000',
      role: 'admin',
      governorate: 'صنعاء',
      workplace: 'IMCI Yemen Platform',
      isVerified: true,
      bio: 'Full-Stack Developer & Medical Systems Architect'
    },
    {
      id: 'doc-001',
      email: 'doctor@imci-ye.org',
      password: hash,
      firstName: 'محمد',
      lastName: 'اليمني',
      phone: '777123456',
      role: 'doctor',
      governorate: 'صنعاء',
      workplace: 'مستشفى الثورة',
      isVerified: true
    },
    {
      id: 'admin-002',
      email: 'admin@imci-ye.org',
      password: hash,
      firstName: 'مدير',
      lastName: 'النظام',
      role: 'admin',
      governorate: 'صنعاء',
      workplace: 'وزارة الصحة',
      isVerified: true
    }
  ];
  console.log('✅ تم تحميل ' + users.length + ' مستخدمين');
  console.log('🛡️ المدير: Kaidngat4@gmail.com');
})();

// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'يرجى إدخال البريد وكلمة المرور' });
    }
    
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, error: 'بيانات الدخول غير صحيحة' });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, error: 'كلمة المرور غير صحيحة' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, firstName: user.firstName },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      message: 'مرحباً د. ' + user.firstName + '! 🛡️',
      token,
      user: {
        id: user.id, email: user.email,
        firstName: user.firstName, lastName: user.lastName,
        role: user.role, governorate: user.governorate,
        workplace: user.workplace, bio: user.bio
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

// POST /api/v1/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ success: false, error: 'جميع الحقول مطلوبة' });
    }
    
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(409).json({ success: false, error: 'البريد مسجل مسبقاً' });
    }
    
    const hash = await bcrypt.hash(password, 10);
    const user = {
      id: 'user-' + Date.now(),
      email, password: hash,
      firstName, lastName,
      role: role || 'trainee',
      governorate: '', workplace: '',
      isVerified: true
    };
    users.push(user);
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, firstName: user.firstName },
      JWT_SECRET, { expiresIn: '7d' }
    );
    
    res.status(201).json({ success: true, message: 'تم التسجيل', token, user: { id: user.id, email: user.email, firstName: user.firstName, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'فشل التسجيل' });
  }
});

// GET /api/v1/auth/profile
router.get('/profile', authenticate, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ success: false, error: 'غير موجود' });
  res.json({ success: true, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, governorate: user.governorate, workplace: user.workplace, bio: user.bio } });
});

// GET /api/v1/auth/users (للمدير)
router.get('/users', authenticate, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'غير مصرح' });
  }
  const safeUsers = users.map(u => ({ id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName, role: u.role, governorate: u.governorate, workplace: u.workplace }));
  res.json({ success: true, count: safeUsers.length, users: safeUsers });
});

module.exports = router;
