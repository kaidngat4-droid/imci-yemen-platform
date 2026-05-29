// نظام التنبيهات
const IMCI_Alerts = {
    init() {
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    },
    
    send(title, body, icon = '/icons/icon-192.png') {
        if (Notification.permission === 'granted') {
            new Notification(title, { body, icon, vibrate: [200, 100, 200] });
        }
    },
    
    // تنبيهات مجدولة
    schedule(title, body, delay) {
        setTimeout(() => this.send(title, body), delay);
    }
};

// تنبيه تلقائي عند تحميل الصفحة
IMCI_Alerts.init();
