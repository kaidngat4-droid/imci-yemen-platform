// نظام الإشعارات
const IMCI_Notifications = {
    show(message, type = 'info') {
        const colors = {
            success: '#16a34a',
            error: '#e53e3e',
            warning: '#fbbf24',
            info: '#0d9488'
        };
        
        const el = document.createElement('div');
        el.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background: ${colors[type] || colors.info}; color: white;
            padding: 12px 24px; border-radius: 30px; font-weight: bold;
            z-index: 99999; animation: slideDown 0.4s ease;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3); font-family: 'Cairo', sans-serif;
            text-align: center; max-width: 90%;
        `;
        el.textContent = message;
        document.body.appendChild(el);
        setTimeout(() => {
            el.style.opacity = '0';
            el.style.transition = 'opacity 0.3s';
            setTimeout(() => el.remove(), 300);
        }, 3000);
    }
};

// إضافة CSS للأنيميشن
const style = document.createElement('style');
style.textContent = '@keyframes slideDown { from { opacity:0; transform:translateX(-50%) translateY(-30px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }';
document.head.appendChild(style);
