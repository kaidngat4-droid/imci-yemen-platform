// نظام الحماية من هجمات القوة العمياء
const attempts = new Map();
const BLOCK_DURATION = 300000; // 5 دقائق
const MAX_ATTEMPTS = 5;

function bruteforceProtection(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;
    const record = attempts.get(ip) || { count: 0, blockedUntil: 0 };
    
    if (record.blockedUntil > Date.now()) {
        const remaining = Math.ceil((record.blockedUntil - Date.now()) / 60000);
        return res.status(429).json({
            success: false,
            error: `تم حظرك مؤقتاً. حاول بعد ${remaining} دقيقة`
        });
    }
    
    req.loginAttempt = {
        record,
        increment: () => {
            record.count++;
            if (record.count >= MAX_ATTEMPTS) {
                record.blockedUntil = Date.now() + BLOCK_DURATION;
                record.count = 0;
            }
            attempts.set(ip, record);
        },
        reset: () => {
            attempts.delete(ip);
        }
    };
    
    next();
}

module.exports = bruteforceProtection;
