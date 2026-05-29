// نظام فحص الصلاحيات للصفحات
(function() {
    const protectedPages = {
        '/instructor': ['admin', 'instructor'],
        '/admin': ['admin'],
        '/dashboard': ['admin', 'instructor', 'doctor', 'nurse', 'trainee'],
    };
    
    const currentPath = window.location.pathname;
    const requiredRoles = protectedPages[currentPath];
    
    if (requiredRoles) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token');
        
        if (!token || !user.role) {
            // غير مسجل - تحويل لصفحة الدخول
            window.location.href = '/login?redirect=' + encodeURIComponent(currentPath);
            return;
        }
        
        if (!requiredRoles.includes(user.role)) {
            // غير مصرح - عرض رسالة
            document.body.innerHTML = `
                <div style="text-align:center;padding:80px 20px;font-family:'Cairo',sans-serif;">
                    <div style="font-size:80px;">🚫</div>
                    <h1 style="color:#b91c1c;">غير مصرح بالدخول</h1>
                    <p style="color:#666;">عذراً، لا تملك الصلاحية للوصول إلى هذه الصفحة.</p>
                    <p style="color:#0d9488;">الدور الحالي: ${user.role}</p>
                    <a href="/dashboard" style="display:inline-block;margin-top:20px;padding:12px 30px;background:#0d9488;color:white;border-radius:30px;text-decoration:none;font-weight:bold;">العودة للوحة التحكم</a>
                </div>
            `;
        }
    }
})();
