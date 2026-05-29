// نظام إشعارات Push
const IMCI_Push = {
    async subscribe() {
        if (!('Notification' in window)) {
            console.log('المتصفح لا يدعم الإشعارات');
            return;
        }
        
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('✅ تم تفعيل الإشعارات');
            this.showTest();
        }
    },
    
    showTest() {
        new Notification('IMCI Yemen', {
            body: 'تم تفعيل الإشعارات بنجاح! ستتلقى تنبيهات بالمحاضرات الجديدة.',
            icon: '/icons/icon-192.png'
        });
    },
    
    send(title, body) {
        if (Notification.permission === 'granted') {
            new Notification(title, {
                body: body,
                icon: '/icons/icon-192.png',
                badge: '/icons/icon-72.png',
                vibrate: [200, 100, 200]
            });
        }
    }
};
