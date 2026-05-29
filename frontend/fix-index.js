const fs = require('fs');

let html = fs.readFileSync('index.html','utf8');

if(!html.includes('</body>')){
    html += '\n</body>';
}

if(!html.includes('</html>')){
    html += '\n</html>';
}

html = html.replace(
/<div style="background: linear-gradient\(145deg,[\s\S]*?<\/style>/g,
''
);

html = html.replace(
/<div class="signature">[\s\S]*?<\/div>/g,
''
);

fs.writeFileSync('index.html', html);

console.log('✅ index.html repaired');
