// نظام الرسوم البيانية البسيط
const IMCI_Charts = {
    // رسم شريطي
    bar(canvasId, data, labels, colors) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        const barW = w / data.length - 10;
        const max = Math.max(...data);
        
        ctx.clearRect(0, 0, w, h);
        data.forEach((val, i) => {
            const barH = (val / max) * (h - 30);
            const x = i * (barW + 10) + 5;
            const y = h - barH - 20;
            ctx.fillStyle = colors[i] || '#14b8a6';
            ctx.fillRect(x, y, barW, barH);
            ctx.fillStyle = '#fff';
            ctx.font = '12px Cairo';
            ctx.fillText(labels[i], x, h - 5);
            ctx.fillText(val, x + barW/3, y - 5);
        });
    },
    
    // رسم دائري
    pie(canvasId, data, labels, colors) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const r = Math.min(cx, cy) - 10;
        const total = data.reduce((a, b) => a + b, 0);
        
        let start = -Math.PI / 2;
        data.forEach((val, i) => {
            const slice = (val / total) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, r, start, start + slice);
            ctx.fillStyle = colors[i] || '#14b8a6';
            ctx.fill();
            start += slice;
        });
    }
};
