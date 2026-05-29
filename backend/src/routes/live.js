const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

let liveSessions = [
  {
    id: 'live-001',
    title: 'علامات الخطر العامة في الأطفال',
    titleEn: 'General Danger Signs in Children',
    instructor: 'د. صلاح الأهدل',
    instructorEn: 'Dr. Salah Al-Ahdal',
    description: 'محاضرة تفاعلية عن العلامات التي تستدعي التدخل الطبي الفوري عند الأطفال دون سن الخامسة - يقدمها د. صلاح الأهدل',
    date: '2026-05-28',
    time: '10:00 صباحاً',
    duration: 60,
    platform: 'jitsi',
    meetingId: 'IMCI-Yemen-DangerSigns',
    meetingUrl: 'https://meet.jit.si/IMCI-Yemen-DangerSigns',
    status: 'live',
    level: 'basic',
    maxParticipants: 100,
    registeredCount: 45,
    attendees: [],
    chat: []
  },
  {
    id: 'live-002',
    title: 'تشخيص وعلاج الالتهاب الرئوي',
    titleEn: 'Diagnosis and Treatment of Pneumonia',
    instructor: 'د. صلاح الأهدل',
    instructorEn: 'Dr. Salah Al-Ahdal',
    description: 'ورشة عملية عن تشخيص الالتهاب الرئوي عند الأطفال حسب بروتوكول IMCI',
    date: '2026-05-29',
    time: '2:00 مساءً',
    duration: 90,
    platform: 'jitsi',
    meetingId: 'IMCI-Yemen-Pneumonia',
    meetingUrl: 'https://meet.jit.si/IMCI-Yemen-Pneumonia',
    status: 'scheduled',
    level: 'intermediate',
    maxParticipants: 100,
    registeredCount: 62,
    attendees: [],
    chat: []
  },
  {
    id: 'live-003',
    title: 'إدارة حالات الإسهال والجفاف',
    titleEn: 'Management of Diarrhea and Dehydration',
    instructor: 'د. صلاح الأهدل',
    instructorEn: 'Dr. Salah Al-Ahdal',
    description: 'تدريب عملي على خطط علاج الإسهال (أ، ب، ج) حسب تصنيف IMCI',
    date: '2026-05-30',
    time: '11:00 صباحاً',
    duration: 75,
    platform: 'jitsi',
    meetingId: 'IMCI-Yemen-Diarrhea',
    meetingUrl: 'https://meet.jit.si/IMCI-Yemen-Diarrhea',
    status: 'scheduled',
    level: 'intermediate',
    maxParticipants: 80,
    registeredCount: 30,
    attendees: [],
    chat: []
  }
];

// GET /api/v1/live/active
router.get('/active', (req, res) => {
  res.json({ success: true, count: liveSessions.length, data: liveSessions });
});

// GET /api/v1/live/:id
router.get('/:id', (req, res) => {
  const session = liveSessions.find(s => s.id === req.params.id);
  if (!session) return res.status(404).json({ success: false, error: 'المحاضرة غير موجودة' });
  res.json({ success: true, data: session });
});

// GET /api/v1/live/:id/join
router.get('/:id/join', authenticate, (req, res) => {
  const session = liveSessions.find(s => s.id === req.params.id);
  if (!session) return res.status(404).json({ success: false, error: 'المحاضرة غير موجودة' });
  
  const userName = req.user.firstName || 'متدرب';
  session.attendees.push({ name: userName, time: new Date().toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' }) });
  
  res.json({ success: true, meetingUrl: session.meetingUrl, meetingId: session.meetingId, instructor: session.instructor });
});

// POST /api/v1/live/schedule
router.post('/schedule', authenticate, authorize('instructor', 'admin'), (req, res) => {
  const { title, description, date, time, duration, level } = req.body;
  if (!title || !date || !time) return res.status(400).json({ success: false, error: 'العنوان والتاريخ والوقت مطلوبة' });
  
  const newSession = {
    id: 'live-' + Date.now(),
    title,
    description: description || '',
    instructor: req.user.firstName || 'مدرب',
    date, time,
    duration: duration || 60,
    platform: 'jitsi',
    meetingId: 'IMCI-Yemen-' + Date.now(),
    meetingUrl: 'https://meet.jit.si/IMCI-Yemen-' + Date.now(),
    status: 'scheduled',
    level: level || 'basic',
    maxParticipants: 100,
    registeredCount: 0,
    attendees: [],
    chat: []
  };
  
  liveSessions.push(newSession);
  res.status(201).json({ success: true, message: 'تمت جدولة المحاضرة', session: newSession });
});

module.exports = router;
