const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// 🗂️ بيانات تجريبية للمتدربين
const trainees = [
  { id: 't1', firstName: 'محمد', lastName: 'اليمني', email: 'doctor@imci-ye.org', role: 'doctor', governorate: 'صنعاء', enrolledCourses: 3, completedCourses: 1, progress: 65, lastActive: '2026-05-27', status: 'active' },
  { id: 't2', firstName: 'فاطمة', lastName: 'علي', email: 'fatima@imci-ye.org', role: 'doctor', governorate: 'عدن', enrolledCourses: 2, completedCourses: 0, progress: 30, lastActive: '2026-05-26', status: 'active' },
  { id: 't3', firstName: 'أحمد', lastName: 'سعيد', email: 'ahmed@imci-ye.org', role: 'nurse', governorate: 'تعز', enrolledCourses: 3, completedCourses: 3, progress: 100, lastActive: '2026-05-25', status: 'completed' },
  { id: 't4', firstName: 'مريم', lastName: 'عبدالله', email: 'mariam@imci-ye.org', role: 'doctor', governorate: 'حضرموت', enrolledCourses: 1, completedCourses: 0, progress: 10, lastActive: '2026-05-20', status: 'inactive' },
  { id: 't5', firstName: 'عمر', lastName: 'خالد', email: 'omar@imci-ye.org', role: 'nurse', governorate: 'إب', enrolledCourses: 2, completedCourses: 1, progress: 55, lastActive: '2026-05-27', status: 'active' },
  { id: 't6', firstName: 'سلمى', lastName: 'ناصر', email: 'salma@imci-ye.org', role: 'doctor', governorate: 'الحديدة', enrolledCourses: 3, completedCourses: 2, progress: 80, lastActive: '2026-05-27', status: 'active' },
];

// 📊 بيانات الدورات
const courses = [
  { id: 'c1', title: 'أساسيات IMCI', level: 'basic', enrolled: 120, completed: 85, avgScore: 88, lessons: 8, duration: '15 ساعة' },
  { id: 'c2', title: 'الأمراض الشائعة', level: 'intermediate', enrolled: 75, completed: 42, avgScore: 76, lessons: 10, duration: '20 ساعة' },
  { id: 'c3', title: 'التدريب العملي', level: 'advanced', enrolled: 45, completed: 20, avgScore: 72, lessons: 12, duration: '30 ساعة' },
];

// 📋 GET /api/v1/instructor/dashboard
router.get('/dashboard', authenticate, authorize('instructor', 'admin'), (req, res) => {
  const activeTrainees = trainees.filter(t => t.status === 'active').length;
  const completedTrainees = trainees.filter(t => t.status === 'completed').length;
  const totalEnrolled = trainees.reduce((s, t) => s + t.enrolledCourses, 0);
  const avgProgress = Math.round(trainees.reduce((s, t) => s + t.progress, 0) / trainees.length);
  
  res.json({
    success: true,
    stats: {
      totalTrainees: trainees.length,
      activeTrainees,
      completedTrainees,
      totalCourses: courses.length,
      totalEnrolled,
      avgProgress
    },
    recentActivity: trainees.filter(t => t.lastActive === '2026-05-27').map(t => ({
      name: t.firstName + ' ' + t.lastName,
      action: t.progress >= 80 ? 'أكمل اختباراً' : 'شاهد درساً',
      time: 'منذ ساعة'
    }))
  });
});

// 👥 GET /api/v1/instructor/trainees
router.get('/trainees', authenticate, authorize('instructor', 'admin'), (req, res) => {
  const { governorate, status, search } = req.query;
  let filtered = [...trainees];
  
  if (governorate) filtered = filtered.filter(t => t.governorate === governorate);
  if (status) filtered = filtered.filter(t => t.status === status);
  if (search) filtered = filtered.filter(t => 
    t.firstName.includes(search) || t.lastName.includes(search) || t.email.includes(search)
  );
  
  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

// 👤 GET /api/v1/instructor/trainees/:id
router.get('/trainees/:id', authenticate, authorize('instructor', 'admin'), (req, res) => {
  const trainee = trainees.find(t => t.id === req.params.id);
  if (!trainee) {
    return res.status(404).json({ success: false, error: 'المتدرب غير موجود' });
  }
  
  res.json({
    success: true,
    trainee: {
      ...trainee,
      courses: [
        { name: 'أساسيات IMCI', progress: 100, score: 92, status: 'completed' },
        { name: 'الأمراض الشائعة', progress: 65, score: 78, status: 'active' },
        { name: 'التدريب العملي', progress: 0, score: 0, status: 'pending' },
      ],
      activities: [
        { date: '2026-05-27', action: 'إكمال اختبار', detail: 'أساسيات IMCI - 92%' },
        { date: '2026-05-26', action: 'مشاهدة درس', detail: 'علامات الخطر العامة' },
        { date: '2026-05-25', action: 'حضور محاضرة', detail: 'البث المباشر - السعال' },
      ]
    }
  });
});

// 📚 GET /api/v1/instructor/courses
router.get('/courses', authenticate, authorize('instructor', 'admin'), (req, res) => {
  res.json({ success: true, data: courses });
});

// 📊 GET /api/v1/instructor/reports
router.get('/reports', authenticate, authorize('instructor', 'admin'), (req, res) => {
  const byGovernorate = {};
  trainees.forEach(t => {
    byGovernorate[t.governorate] = (byGovernorate[t.governorate] || 0) + 1;
  });
  
  const byRole = {};
  trainees.forEach(t => {
    byRole[t.role] = (byRole[t.role] || 0) + 1;
  });
  
  res.json({
    success: true,
    reports: {
      byGovernorate,
      byRole,
      totalTrainees: trainees.length,
      totalCourses: courses.length,
      completionRate: Math.round((trainees.filter(t => t.status === 'completed').length / trainees.length) * 100),
      avgScore: 82,
      popularCourse: 'أساسيات IMCI',
      activeNow: trainees.filter(t => t.lastActive === '2026-05-27').length
    }
  });
});

// 📝 POST /api/v1/instructor/courses - إضافة دورة
router.post('/courses', authenticate, authorize('instructor', 'admin'), (req, res) => {
  const { title, level, description, duration, lessons } = req.body;
  
  if (!title || !level) {
    return res.status(400).json({ success: false, error: 'العنوان والمستوى مطلوبان' });
  }
  
  const newCourse = {
    id: 'c' + (courses.length + 1),
    title,
    level,
    enrolled: 0,
    completed: 0,
    avgScore: 0,
    lessons: lessons || 5,
    duration: duration || '10 ساعات'
  };
  
  courses.push(newCourse);
  res.status(201).json({ success: true, message: 'تم إضافة الدورة', course: newCourse });
});

// ✏️ PUT /api/v1/instructor/trainees/:id/status
router.put('/trainees/:id/status', authenticate, authorize('instructor', 'admin'), (req, res) => {
  const trainee = trainees.find(t => t.id === req.params.id);
  if (!trainee) {
    return res.status(404).json({ success: false, error: 'المتدرب غير موجود' });
  }
  
  trainee.status = req.body.status || trainee.status;
  res.json({ success: true, message: 'تم تحديث الحالة', trainee });
});

module.exports = router;
