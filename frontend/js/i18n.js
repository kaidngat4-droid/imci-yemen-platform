const i18n = {
    ar: {
        siteTitle: "IMCI Yemen", home: "الرئيسية", login: "دخول", dashboard: "لوحة التحكم",
        exam: "اختبارات", live: "بث", certificates: "شهادات", faq: "FAQ",
        testimonials: "آراء", search: "بحث", heroTitle: "🏥 IMCI Yemen",
        heroDesc: "منصة التدريب الطبي للرعاية التكاملية لصحة الطفل",
        btnLogin: "🔐 تسجيل الدخول", btnDashboard: "📊 لوحة التحكم", btnLive: "📹 البث المباشر",
        cardLevels: "3 مستويات", cardLevelsDesc: "أساسي | متوسط | متقدم",
        cardLive: "بث مباشر", cardLiveDesc: "محاضرات تفاعلية",
        cardCert: "شهادات معتمدة", cardCertDesc: "من وزارة الصحة",
        ageCalc: "🧮 حاسبة العمر", ageCalcDesc: "حساب عمر الطفل بالأشهر والأيام",
        decisionTree: "🌳 شجرة القرارات", decisionTreeDesc: "بروتوكول التقييم التفاعلي",
        signature: "Engineered & Designed by", role: "Full-Stack Developer & Medical Systems Architect",
        online: "متصل", offline: "غير متصل", dark: "الوضع الليلي", light: "الوضع الفاتح"
    },
    en: {
        siteTitle: "IMCI Yemen", home: "Home", login: "Login", dashboard: "Dashboard",
        exam: "Exams", live: "Live", certificates: "Certificates", faq: "FAQ",
        testimonials: "Testimonials", search: "Search", heroTitle: "🏥 IMCI Yemen",
        heroDesc: "Integrated Management of Childhood Illness Training",
        btnLogin: "🔐 Login", btnDashboard: "📊 Dashboard", btnLive: "📹 Live Room",
        cardLevels: "3 Levels", cardLevelsDesc: "Basic | Intermediate | Advanced",
        cardLive: "Live Stream", cardLiveDesc: "Interactive Lectures",
        cardCert: "Certified", cardCertDesc: "Ministry of Health",
        ageCalc: "🧮 Age Calculator", ageCalcDesc: "Calculate child's age",
        decisionTree: "🌳 Decision Tree", decisionTreeDesc: "Interactive IMCI Protocol",
        signature: "Engineered & Designed by", role: "Full-Stack Developer & Medical Systems Architect",
        online: "Online", offline: "Offline", dark: "Dark Mode", light: "Light Mode"
    }
};
let currentLang = localStorage.getItem('imci-lang') || 'ar';
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('imci-lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    updatePageTexts();
}
function t(key) { return i18n[currentLang]?.[key] || i18n['en'][key] || key; }
function updatePageTexts() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[currentLang]?.[key]) {
            el.textContent = i18n[currentLang][key];
        }
    });
}
document.addEventListener('DOMContentLoaded', () => setLanguage(currentLang));
