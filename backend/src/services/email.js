// خدمة البريد الإلكتروني
const EMAIL_SERVICE = {
    async send(to, subject, message) {
        // في الإنتاج: استخدم nodemailer أو API خارجي
        console.log(`📧 إرسال بريد إلى: ${to}`);
        console.log(`   الموضوع: ${subject}`);
        console.log(`   الرسالة: ${message}`);
        
        // محاكاة إرسال
        return { success: true, messageId: 'msg-' + Date.now() };
    },
    
    async sendWelcome(user) {
        return this.send(
            user.email,
            'مرحباً بك في منصة IMCI Yemen',
            `مرحباً ${user.firstName}!\n\nتم تسجيلك بنجاح في منصة IMCI Yemen.\n\nمع تحيات,\nوزارة الصحة العامة والبيئة`
        );
    },
    
    async sendCertificate(user, certNumber) {
        return this.send(
            user.email,
            '🎉 تم إصدار شهادتك!',
            `مبروك ${user.firstName}!\n\nتم إصدار شهادتك بنجاح.\nرقم الشهادة: ${certNumber}`
        );
    }
};

module.exports = EMAIL_SERVICE;
