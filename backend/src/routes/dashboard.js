const express = require('express');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// GET /api/v1/dashboard/stats
router.get('/stats', authenticate, (req, res) => {
    res.json({
        success: true,
        data: {
            user: {
                name: req.user.firstName,
                role: req.user.role,
                avatar: req.user.firstName?.charAt(0) || 'U'
            },
            stats: {
                courses: { enrolled: 3, completed: 1, active: 2 },
                hours: { total: 65, completed: 24, remaining: 41 },
                exams: { taken: 5, passed: 4, avgScore: 82 },
                certificates: { earned: 1, pending: 2 }
            },
            recentActivity: [
                { action: 'أكمل اختبار', detail: 'أساسيات IMCI - 92%', time: 'منذ ساعتين' },
                { action: 'حضر محاضرة', detail: 'علامات الخطر العامة', time: 'منذ 5 ساعات' },
                { action: 'شاهد درس', detail: 'تقييم الطفل المريض', time: 'منذ يوم' }
            ],
            upcoming: [
                { title: 'محاضرة: الالتهاب الرئوي', date: '2026-05-29', time: '2:00 مساءً' },
                { title: 'اختبار: المستوى المتوسط', date: '2026-05-30', time: '10:00 صباحاً' }
            ]
        }
    });
});

module.exports = router;
