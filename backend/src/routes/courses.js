const express = require('express');
const pool = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/v1/courses
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM modules WHERE status = $1 ORDER BY "order"',
      ['PUBLISHED']
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    // بيانات احتياطية
    res.json({
      success: true,
      data: [
        { id: '1', title: 'أساسيات IMCI', level: 'basic', description: 'أساسيات الإدارة المتكاملة لصحة الطفل' },
        { id: '2', title: 'الأمراض الشائعة', level: 'intermediate', description: 'تشخيص وعلاج الأمراض الشائعة' },
        { id: '3', title: 'التدريب العملي', level: 'advanced', description: 'حالات سريرية وتطبيقات عملية' }
      ]
    });
  }
});

// POST /api/v1/courses/:id/enroll
router.post('/:id/enroll', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query(
      'INSERT INTO enrollments ("userId", "moduleId") VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, id]
    );

    res.json({ success: true, message: 'تم التسجيل في الدورة بنجاح' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'فشل التسجيل' });
  }
});

// GET /api/v1/courses/my-enrollments
router.get('/my-enrollments', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.*, e.progress, e.status as enroll_status
       FROM enrollments e
       JOIN modules m ON e."moduleId" = m.id
       WHERE e."userId" = $1`,
      [req.user.id]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.json({ success: true, data: [] });
  }
});

module.exports = router;
