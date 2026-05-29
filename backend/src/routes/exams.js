const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// 🗂️ بنك الأسئلة الكامل - 30 سؤالاً
const questionBank = [
  // المستوى الأول - أساسيات IMCI
  {
    id: 1, level: 'basic', module: 'أساسيات IMCI', points: 10,
    question: 'ما هو الهدف الرئيسي لاستراتيجية IMCI؟',
    options: ['زيادة أرباح المستشفيات', 'الحد من وفيات الأطفال دون سن الخامسة', 'تدريب الأطباء فقط', 'توفير الأدوية المجانية'],
    correct: 1,
    explanation: 'تهدف IMCI إلى الحد من وفيات الأطفال دون سن الخامسة في البلدان النامية.'
  },
  {
    id: 2, level: 'basic', module: 'أساسيات IMCI', points: 10,
    question: 'كم عدد مكونات استراتيجية IMCI الرئيسية؟',
    options: ['2', '3', '5', '7'],
    correct: 1,
    explanation: 'تتكون IMCI من 3 مكونات: تحسين مهارات العاملين الصحيين، تقوية النظام الصحي، تحسين الممارسات الأسرية.'
  },
  {
    id: 3, level: 'basic', module: 'أساسيات IMCI', points: 10,
    question: 'من طور استراتيجية IMCI؟',
    options: ['وزارة الصحة اليمنية فقط', 'منظمة الصحة العالمية واليونيسيف', 'البنك الدولي', 'الهلال الأحمر'],
    correct: 1,
    explanation: 'طورت منظمة الصحة العالمية (WHO) واليونيسيف (UNICEF) استراتيجية IMCI.'
  },
  {
    id: 4, level: 'basic', module: 'علامات الخطر', points: 15,
    question: 'أي من هذه تعتبر علامة خطر عامة عند الأطفال؟',
    options: ['اللعب بنشاط', 'عدم القدرة على الشرب أو الرضاعة', 'النوم الطبيعي', 'البكاء'],
    correct: 1,
    explanation: 'عدم القدرة على الشرب أو الرضاعة من علامات الخطر العامة التي تستدعي تدخلاً فورياً.'
  },
  {
    id: 5, level: 'basic', module: 'علامات الخطر', points: 15,
    question: 'كم عدد علامات الخطر العامة في تقييم IMCI؟',
    options: ['3', '5', '7', '9'],
    correct: 1,
    explanation: 'هناك 5 علامات خطر عامة: عدم القدرة على الشرب، التقيؤ المستمر، التشنجات، الخمول، فقدان الوعي.'
  },
  {
    id: 6, level: 'basic', module: 'علامات الخطر', points: 15,
    question: 'ماذا تفعل إذا وجدت علامة خطر عامة عند الطفل؟',
    options: ['إعطاء دواء ومراقبة', 'الإحالة الفورية للمستشفى', 'انتظار 24 ساعة', 'استشارة هاتفية'],
    correct: 1,
    explanation: 'وجود أي علامة خطر عامة يستدعي الإحالة الفورية للمستشفى.'
  },
  // المستوى الثاني - السعال وصعوبة التنفس
  {
    id: 7, level: 'intermediate', module: 'السعال والتنفس', points: 10,
    question: 'ما هو المعدل الطبيعي للتنفس عند الرضيع (2-12 شهر)؟',
    options: ['20-30 نفس/دقيقة', '30-40 نفس/دقيقة', '40-50 نفس/دقيقة', 'حتى 50 نفس/دقيقة'],
    correct: 3,
    explanation: 'المعدل الطبيعي للتنفس عند الرضيع حتى 50 نفس/دقيقة. أكثر من ذلك يعتبر تسرع تنفس.'
  },
  {
    id: 8, level: 'intermediate', module: 'السعال والتنفس', points: 10,
    question: 'ما هي علامة تسرع التنفس عند الطفل (1-5 سنوات)؟',
    options: ['30 نفس/دقيقة', '40 نفس/دقيقة أو أكثر', '50 نفس/دقيقة', '60 نفس/دقيقة'],
    correct: 1,
    explanation: 'تسرع التنفس عند الطفل 1-5 سنوات هو 40 نفس/دقيقة أو أكثر.'
  },
  {
    id: 9, level: 'intermediate', module: 'السعال والتنفس', points: 15,
    question: 'أي من هذه علامات الالتهاب الرئوي الحاد؟',
    options: ['سعال خفيف', 'انكماش الصدر', 'رشح الأنف', 'عطاس'],
    correct: 1,
    explanation: 'انكماش الصدر (السحب الصدري) علامة رئيسية للالتهاب الرئوي الحاد.'
  },
  {
    id: 10, level: 'intermediate', module: 'السعال والتنفس', points: 15,
    question: 'ما هو علاج الالتهاب الرئوي حسب IMCI؟',
    options: ['مضاد حيوي فموي لمدة 3 أيام', 'مضاد حيوي فموي لمدة 5 أيام', 'إحالة فورية', 'مسكنات فقط'],
    correct: 1,
    explanation: 'الالتهاب الرئوي يعالج بمضاد حيوي فموي مناسب لمدة 5 أيام مع المتابعة.'
  },
  // المستوى الثاني - الإسهال
  {
    id: 11, level: 'intermediate', module: 'الإسهال والجفاف', points: 10,
    question: 'ما هي الخطة (أ) لعلاج الإسهال في IMCI؟',
    options: ['الإحالة للمستشفى', 'علاج الجفاف في المنزل', 'إعطاء مضاد حيوي', 'إيقاف الطعام'],
    correct: 1,
    explanation: 'الخطة (أ): علاج الجفاف في المنزل بإعطاء سوائل إضافية والاستمرار في التغذية.'
  },
  {
    id: 12, level: 'intermediate', module: 'الإسهال والجفاف', points: 10,
    question: 'ما هو محلول الإماهة الفموية (ORS) الموصى به؟',
    options: ['محلول ملحي فقط', 'محلول سكر وملح بنسب محددة', 'عصير فواكه', 'ماء فقط'],
    correct: 1,
    explanation: 'ORS يحتوي على نسب محددة من السكر والملح لتعويض الفاقد من السوائل.'
  },
  {
    id: 13, level: 'intermediate', module: 'الإسهال والجفاف', points: 15,
    question: 'علامة الجفاف الشديد عند الرضيع:',
    options: ['بكاء بدموع', 'جلد يعود ببطء (>2 ثانية)', 'فم رطب', 'تبول طبيعي'],
    correct: 1,
    explanation: 'عودة الجلد ببطء شديد (>2 ثانية) علامة على الجفاف الشديد.'
  },
  // المستوى الثالث - الحمى
  {
    id: 14, level: 'advanced', module: 'الحمى والملاريا', points: 10,
    question: 'في المناطق الموبوءة بالملاريا، كل طفل مصاب بالحمى يجب:',
    options: ['إعطاء خافض حرارة فقط', 'فحص الملاريا فوراً', 'انتظار 3 أيام', 'إعطاء مضاد حيوي'],
    correct: 1,
    explanation: 'في المناطق الموبوءة، يجب فحص الملاريا فوراً لأي طفل مصاب بالحمى.'
  },
  {
    id: 15, level: 'advanced', module: 'الحمى والملاريا', points: 15,
    question: 'ما هي درجة الحرارة التي تعتبر حمى عند الطفل؟',
    options: ['37°C', '37.5°C أو أكثر', '38.5°C', '39°C'],
    correct: 1,
    explanation: 'درجة الحرارة 37.5°C أو أكثر (إبطي) تعتبر حمى عند الطفل.'
  },
  // المستوى الثالث - التغذية
  {
    id: 16, level: 'advanced', module: 'التغذية', points: 10,
    question: 'متى يجب البدء بالرضاعة الطبيعية الحصرية؟',
    options: ['بعد يوم من الولادة', 'خلال الساعة الأولى بعد الولادة', 'بعد أسبوع', 'عند الخروج من المستشفى'],
    correct: 1,
    explanation: 'يجب البدء بالرضاعة الطبيعية خلال الساعة الأولى بعد الولادة.'
  },
  {
    id: 17, level: 'advanced', module: 'التغذية', points: 10,
    question: 'حتى أي عمر يوصى بالرضاعة الطبيعية الحصرية؟',
    options: ['3 أشهر', '6 أشهر', '9 أشهر', '12 شهر'],
    correct: 1,
    explanation: 'توصي منظمة الصحة العالمية بالرضاعة الطبيعية الحصرية حتى عمر 6 أشهر.'
  },
  {
    id: 18, level: 'advanced', module: 'التغذية', points: 15,
    question: 'علامة سوء التغذية الحاد عند الأطفال:',
    options: ['وزن طبيعي', 'هزال شديد ( wasting )', 'طول زائد', 'شهية جيدة'],
    correct: 1,
    explanation: 'الهزال الشديد (wasting) علامة على سوء التغذية الحاد.'
  },
  // أسئلة متنوعة
  {
    id: 19, level: 'advanced', module: 'التحصين', points: 10,
    question: 'متى يعطى لقاح BCG حسب البرنامج اليمني؟',
    options: ['عند الولادة', 'شهرين', '6 أشهر', 'سنة'],
    correct: 0,
    explanation: 'يعطى لقاح BCG عند الولادة أو في أقرب فرصة بعد الولادة.'
  },
  {
    id: 20, level: 'advanced', module: 'التحصين', points: 10,
    question: 'كم جرعة من لقاح شلل الأطفال تعطى في السنة الأولى؟',
    options: ['جرعة واحدة', 'جرعتان', '3 جرعات', '4 جرعات'],
    correct: 2,
    explanation: 'يعطى لقاح شلل الأطفال 3 جرعات في السنة الأولى (عند 2، 4، 6 أشهر).'
  }
];

// 🎯 إنشاء اختبار من بنك الأسئلة
function generateExam(level, count = 10) {
  const filtered = questionBank.filter(q => q.level === level);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(q => ({
    id: q.id,
    question: q.question,
    options: q.options,
    points: q.points
  }));
}

// 📋 GET /api/v1/exams/questions - الحصول على أسئلة
router.get('/questions', authenticate, (req, res) => {
  const { level, module } = req.query;
  let filtered = [...questionBank];
  
  if (level) filtered = filtered.filter(q => q.level === level);
  if (module) filtered = filtered.filter(q => q.module === module);
  
  res.json({ success: true, count: filtered.length, data: filtered });
});

// 📝 GET /api/v1/exams/start/:level - بدء اختبار
router.get('/start/:level', authenticate, (req, res) => {
  const { level } = req.params;
  const count = parseInt(req.query.count) || 10;
  
  if (!['basic', 'intermediate', 'advanced'].includes(level)) {
    return res.status(400).json({ success: false, error: 'مستوى غير صالح' });
  }
  
  const exam = {
    id: 'exam-' + Date.now(),
    level,
    timeLimit: level === 'basic' ? 15 : level === 'intermediate' ? 20 : 30,
    questions: generateExam(level, count),
    startedAt: new Date().toISOString()
  };
  
  res.json({ success: true, exam });
});

// ✅ POST /api/v1/exams/submit - تقديم الإجابات
router.post('/submit', authenticate, (req, res) => {
  const { examId, answers } = req.body;
  
  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ success: false, error: 'يرجى تقديم الإجابات' });
  }
  
  let totalPoints = 0;
  let earnedPoints = 0;
  const results = [];
  
  answers.forEach(ans => {
    const question = questionBank.find(q => q.id === ans.questionId);
    if (question) {
      totalPoints += question.points;
      const correct = ans.selected === question.correct;
      if (correct) earnedPoints += question.points;
      results.push({
        questionId: question.id,
        question: question.question,
        correct: question.correct,
        explanation: question.explanation,
        selected: ans.selected,
        isCorrect: correct,
        points: correct ? question.points : 0
      });
    }
  });
  
  const percentage = Math.round((earnedPoints / totalPoints) * 100);
  const passed = percentage >= 70;
  
  res.json({
    success: true,
    result: {
      examId,
      totalQuestions: results.length,
      correctAnswers: results.filter(r => r.isCorrect).length,
      totalPoints,
      earnedPoints,
      percentage,
      passed,
      grade: percentage >= 90 ? 'ممتاز' : percentage >= 80 ? 'جيد جداً' : percentage >= 70 ? 'جيد' : 'راسب',
      details: results
    }
  });
});

// 📊 GET /api/v1/exams/stats - إحصائيات
router.get('/stats', authenticate, (req, res) => {
  const totalQuestions = questionBank.length;
  const byLevel = {
    basic: questionBank.filter(q => q.level === 'basic').length,
    intermediate: questionBank.filter(q => q.level === 'intermediate').length,
    advanced: questionBank.filter(q => q.level === 'advanced').length
  };
  const byModule = {};
  questionBank.forEach(q => {
    byModule[q.module] = (byModule[q.module] || 0) + 1;
  });
  
  res.json({
    success: true,
    stats: {
      totalQuestions,
      byLevel,
      byModule,
      totalPoints: questionBank.reduce((sum, q) => sum + q.points, 0)
    }
  });
});

module.exports = router;
