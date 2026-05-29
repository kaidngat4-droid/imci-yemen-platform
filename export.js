// نظام التصدير
const IMCI_Export = {
    // تصدير كـ PDF
    toPDF(elementId, filename) {
        const el = document.getElementById(elementId);
        if (!el) return;
        const opt = {
            margin: 10,
            filename: filename + '.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        // يتطلب html2pdf.js - يمكن إضافته لاحقاً
        alert('📄 جاري تجهيز التصدير: ' + filename);
    },
    
    // طباعة
    print(elementId) {
        const el = document.getElementById(elementId);
        if (!el) { window.print(); return; }
        const win = window.open('', '_blank');
        win.document.write('<html><head><title>طباعة</title></head><body>');
        win.document.write(el.innerHTML);
        win.document.write('</body></html>');
        win.document.close();
        win.print();
    }
};
