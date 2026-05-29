// 🔐 تعريف الصلاحيات
const PERMISSIONS = {
  // الدورات
  'courses.view': ['admin', 'instructor', 'doctor', 'nurse', 'trainee'],
  'courses.create': ['admin', 'instructor'],
  'courses.edit': ['admin', 'instructor'],
  'courses.delete': ['admin'],
  
  // المستخدمين
  'users.view': ['admin', 'instructor'],
  'users.create': ['admin'],
  'users.edit': ['admin'],
  'users.delete': ['admin'],
  
  // الاختبارات
  'exams.view': ['admin', 'instructor', 'doctor', 'nurse', 'trainee'],
  'exams.create': ['admin', 'instructor'],
  'exams.grade': ['admin', 'instructor'],
  
  // الشهادات
  'certificates.view': ['admin', 'instructor', 'doctor', 'nurse', 'trainee'],
  'certificates.issue': ['admin', 'instructor'],
  'certificates.revoke': ['admin'],
  
  // البث المباشر
  'live.view': ['admin', 'instructor', 'doctor', 'nurse', 'trainee'],
  'live.host': ['admin', 'instructor'],
  'live.schedule': ['admin', 'instructor'],
  
  // التقارير
  'reports.view': ['admin', 'instructor'],
  'reports.export': ['admin'],
  
  // النظام
  'system.settings': ['admin'],
  'system.logs': ['admin'],
  'system.backup': ['admin'],
};

// 🛡️ التحقق من الصلاحية
function hasPermission(userRole, permission) {
  if (!userRole || !permission) return false;
  const allowedRoles = PERMISSIONS[permission];
  if (!allowedRoles) return false;
  return allowedRoles.includes(userRole);
}

// 🛡️ Middleware للتحقق من الصلاحية
function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'يرجى تسجيل الدخول' });
    }
    
    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({ 
        error: 'غير مصرح',
        required: permission,
        role: req.user.role
      });
    }
    
    next();
  };
}

// 📋 الحصول على صلاحيات دور معين
function getRolePermissions(role) {
  const permissions = {};
  Object.keys(PERMISSIONS).forEach(perm => {
    permissions[perm] = PERMISSIONS[perm].includes(role);
  });
  return permissions;
}

module.exports = { PERMISSIONS, hasPermission, requirePermission, getRolePermissions };
