const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'imci_jwt_secret_2026';

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      error: 'يرجى تسجيل الدخول أولاً' 
    });
  }
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false, 
      error: 'انتهت الجلسة، يرجى إعادة تسجيل الدخول' 
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: 'غير مصرح لك بالوصول' 
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
