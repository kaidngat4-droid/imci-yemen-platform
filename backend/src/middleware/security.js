const crypto = require('crypto');

// 🔐 مفتاح التشفير
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const IV_LENGTH = 16;

// تشفير البيانات
function encrypt(text) {
  if (!text) return text;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.slice(0, 32)), iv);
  let encrypted = cipher.update(text.toString());
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// فك التشفير
function decrypt(text) {
  if (!text) return text;
  const parts = text.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encrypted = Buffer.from(parts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.slice(0, 32)), iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// 🛡️ حماية من XSS
function sanitize(input) {
  if (typeof input !== 'string') return input;
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// 🛡️ التحقق من صحة البيانات
function validateInput(input, type) {
  switch(type) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    case 'phone':
      return /^[0-9]{7,15}$/.test(input);
    case 'name':
      return /^[\u0621-\u064A\s]{2,50}$/.test(input);
    case 'password':
      return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,}$/.test(input);
    default:
      return true;
  }
}

// 🛡️ Rate Limiter بسيط
const rateLimits = new Map();
function rateLimiter(key, maxRequests = 100, windowMs = 900000) {
  const now = Date.now();
  const record = rateLimits.get(key) || { count: 0, resetAt: now + windowMs };
  
  if (now > record.resetAt) {
    record.count = 1;
    record.resetAt = now + windowMs;
  } else {
    record.count++;
  }
  
  rateLimits.set(key, record);
  return record.count <= maxRequests;
}

// 🛡️ Middleware للحماية الشاملة
function securityMiddleware(req, res, next) {
  // رؤوس الأمان
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Rate Limiting
  const clientIP = req.ip || req.connection.remoteAddress;
  if (!rateLimiter(clientIP)) {
    return res.status(429).json({ error: 'طلبات كثيرة جداً. حاول لاحقاً.' });
  }
  
  // تنظيف المدخلات
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitize(req.body[key]);
      }
    });
  }
  
  next();
}

module.exports = { encrypt, decrypt, sanitize, validateInput, rateLimiter, securityMiddleware };
