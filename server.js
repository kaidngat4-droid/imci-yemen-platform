const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = 5173;
const ROOT = __dirname;

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.json': 'application/json',
    '.woff2': 'font/woff2'
};

// Cache Control حسب نوع الملف
function getCacheControl(ext) {
    if (ext === '.html') return 'no-cache';
    if (['.css', '.js'].includes(ext)) return 'max-age=86400'; // يوم
    return 'max-age=604800'; // أسبوع للصور
}

function serveFile(res, filePath, acceptEncoding) {
    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || 'application/octet-stream';
    
    try {
        let data = fs.readFileSync(filePath);
        
        // ضغط Gzip للملفات النصية
        if (acceptEncoding && acceptEncoding.includes('gzip') && 
            ['.html', '.css', '.js', '.json'].includes(ext)) {
            data = zlib.gzipSync(data);
            res.writeHead(200, {
                'Content-Type': type,
                'Content-Encoding': 'gzip',
                'Cache-Control': getCacheControl(ext),
                'Vary': 'Accept-Encoding'
            });
        } else {
            res.writeHead(200, {
                'Content-Type': type,
                'Cache-Control': getCacheControl(ext)
            });
        }
        
        res.end(data);
        return true;
    } catch(e) {
        return false;
    }
}

const server = http.createServer((req, res) => {
    let url = req.url === '/' ? '/index.html' : req.url;
    url = url.split('?')[0];
    
    const filePath = path.join(ROOT, url);
    const acceptEncoding = req.headers['accept-encoding'];
    
    // أمان: تأكد أن الملف داخل المجلد
    if (!filePath.startsWith(ROOT)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }
    
    // الملف موجود مباشرة
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        if (serveFile(res, filePath, acceptEncoding)) {
            console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.url} → 200 ${acceptEncoding?.includes('gzip') ? '(gzip)' : ''}`);
            return;
        }
    }
    
    // جرب إضافة .html
    if (!path.extname(url)) {
        const htmlPath = filePath + '.html';
        if (fs.existsSync(htmlPath)) {
            if (serveFile(res, htmlPath, acceptEncoding)) {
                console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.url} → 200 (html)`);
                return;
            }
        }
    }
    
    // fallback
    const indexPath = path.join(ROOT, 'index.html');
    if (fs.existsSync(indexPath)) {
        serveFile(res, indexPath, acceptEncoding);
        console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.url} → 200 (fallback)`);
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('╔══════════════════════════════════╗');
    console.log('║  🏥 IMCI Yemen Platform       ║');
    console.log('║  Optimized Server Ready        ║');
    console.log('╚══════════════════════════════════╝');
    console.log(`  http://localhost:${PORT}`);
    console.log('');
    console.log('⚡ التحسينات:');
    console.log('   • Gzip Compression');
    console.log('   • Advanced Caching');
    console.log('   • Smart Service Worker');
    console.log('');
    console.log('📁 الملفات المتاحة:');
    fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).forEach(f => console.log(`   ✅ ${f}`));
});
