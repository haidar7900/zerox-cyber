const { useState, useEffect, useRef } = React;

// مدافع الأمن السيبراني - الإصدار الكامل
// تصميم: المهندس حيدر الجنابي
// فريق: Zerox

function App() {
  // الإعدادات
  const CONFIG = {
    questionsPerLevel: 5,
    diffs: {
      easy: { timePerQ: 30, name: 'سهولة' },
      medium: { timePerQ: 20, name: 'متوسطة' },
      hard: { timePerQ: 12, name: 'صعبة' }
    },
    basePoints: 100,
    hintPenalty: 20,
    skipPenalty: 30,
    fiftyUsedPenalty: 10
  };

  // بنك الأسئلة
  const QUESTION_BANK = {
    easy: [
      { q: 'وصلت رسالة من مصدر مجهول تطلب الضغط على رابط لتحديث الحساب. شنو تسوي؟', a: ['أضغط وأدخل بياناتي', 'أتجاهل وأبلغ', 'أرد واطلب توضيح', 'أنشر للأصدقاء'], correct: 1, explain: 'التحقق من المرسل والروابط مهم قبل التفاعل.' },
      { q: 'كلمة مرور قوية لازم تكون؟', a: ['قصيرة وسهلة', 'طويلة ومعقدة', 'اسم المستخدم', 'password'], correct: 1, explain: 'طويلة ومعقدة أفضل.' },
      { q: 'هل مشاركة كلمة السر مع صديق آمن؟', a: ['نعم', 'لا', 'إذا طلبها المدير', 'إذا طلبتها الحكومة'], correct: 1, explain: 'لا تشارك كلمات المرور.' },
      { q: 'أفضل طريقة لحماية الحساب؟', a: ['كلمة مرور فقط', 'المصادقة الثنائية (2FA)', 'مشاركة الحساب', 'عدم تحديث النظام'], correct: 1, explain: '2FA تضيف طبقة حماية.' },
      { q: 'تحديث النظام يعني؟', a: ['تغيير الخلفية', 'تصحيحات وتحسينات للأمان', 'حذف الملفات', 'إعطاء صلاحيات'], correct: 1, explain: 'التحديثات تحمي ضد ثغرات.' }
    ],
    medium: [
      { q: 'موقع يطلب صلاحية الوصول للكاميرا من مصدر غير معروف، تعمل شنو؟', a: ['أعطيه صلاحية مؤقتة', 'أمنعه وأراجع المصدر', 'أعطيه دائما', 'أشارك الكاميرا مع الجميع'], correct: 1, explain: 'افحص المصدر قبل إعطاء صلاحيات.' },
      { q: 'ما معنى SSRF؟', a: ['هجوم يصل لشبكات داخلية عبر الخادم', 'حماية متقدمة', 'أداة فحص', 'مزود استضافة'], correct: 0, explain: 'SSRF يعيد توجيه الخادم لطلبات داخلية.' },
      { q: 'كيفية تقليل خطر Phishing؟', a: ['فتح كل الروابط', 'التحقق من المرسل وURL', 'تحميل كل المرفقات', 'إعطاء بياناتك'], correct: 1, explain: 'التحقق من العنوان والمرسل مهم.' },
      { q: 'أيها يساعد بكشف البرامج الخبيثة؟', a: ['مضاد فيروسات محدث', 'إلغاء التحديثات', 'مشاركة الملفات', 'تحميل أي ملف'], correct: 0, explain: 'مضاد فيروسات محدث يساعد.' },
      { q: 'ما معنى "least privilege"؟', a: ['منح أقل صلاحية لازمة', 'منح كل الصلاحيات', 'حذف الحسابات', 'منح الصلاحية لاحقاً'], correct: 0, explain: 'التقليل من الصلاحيات يقلل الهجوم.' }
    ],
    hard: [
      { q: 'حل CSRF النموذجي؟', a: ['استخدام توكنات CSRF', 'تعطيل الجلسات', 'السماح بكل الطلبات', 'حذف الكوكيز'], correct: 0, explain: 'توكنات CSRF تمنع الطلبات المزيفة.' },
      { q: 'ميزة Content Security Policy؟', a: ['تقليل XSS', 'زيادة التحميل', 'تحسين التصميم', 'منع كل الموارد'], correct: 0, explain: 'CSP تحدد مصادرك المسموحة.' },
      { q: 'التعامل مع Third-party JS غير موثوق؟', a: ['تنفيذه مباشرة', 'عزله/فحصه', 'مشاركته', 'تجاهله'], correct: 1, explain: 'العزل والتحليل يقلل المخاطر.' },
      { q: 'الفرق بين التشفير والتجزئة؟', a: ['التشفير قابل للعكس، التجزئة لا', 'نفس الشي', 'التشفير أبطأ', 'التجزئة قابلة للعكس'], correct: 0, explain: 'التشفير قابل للفك عادة.' },
      { q: 'أفضل طريقة لحفظ أسرار التطبيق؟', a: ['حفظها في الكود', 'استخدام secret manager', 'نشرها علناً', 'حفظها في ملف نصي'], correct: 1, explain: 'Secret managers آمنة.' }
    ]
  };

  // الحالات
  const [difficulty, setDifficulty] = useState('easy');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [hints, setHints] = useState(2);
  const [fifty, setFifty] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [streak, setStreak] = useState(0);
  const [highscore, setHighscore] = useState(() => {
    try {
      return Number(localStorage.getItem('zerox_high')) || 0;
    } catch {
      return 0;
    }
  });
  const [phase, setPhase] = useState('welcome');
  const [disabledAnswers, setDisabledAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [notification, setNotification] = useState('');

  const timerRef = useRef(null);

  // دوال اللعبة
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const pickQuestions = (diff) => {
    const pool = shuffle(QUESTION_BANK[diff] || []);
    return pool.slice(0, CONFIG.questionsPerLevel);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const startGame = () => {
    setScore(0);
    setHints(2);
    setFifty(1);
    setStreak(0);
    setCurrentIndex(0);
    setDisabledAnswers([]);
    setSelectedAnswer(null);
    setShowConfetti(false);
    
    const qs = pickQuestions(difficulty);
    setQuestions(qs);
    setPhase('game');
    
    const time = CONFIG.diffs[difficulty].timePerQ;
    setTimeLeft(time);
    setTimerRunning(true);
  };

  const handleAnswer = (idx, reason = 'click') => {
    if (!timerRunning) return;
    
    setTimerRunning(false);
    const q = questions[currentIndex];
    if (!q) return;

    if (reason === 'timeout' || idx === null) {
      setScore(s => Math.max(0, s - CONFIG.skipPenalty));
      setStreak(0);
      showNotification('⏰ انتهى الوقت! -' + CONFIG.skipPenalty + ' نقطة');
    } else {
      if (idx === q.correct) {
        const timeBonus = Math.ceil(timeLeft * 10);
        const combo = 1 + Math.floor(streak / 2);
        const gained = CONFIG.basePoints + timeBonus * combo;
        setScore(s => s + gained);
        setStreak(st => st + 1);
        showNotification('🎉 إجابة صحيحة! +' + gained + ' نقطة');
      } else {
        setScore(s => Math.max(0, s - CONFIG.skipPenalty));
        setStreak(0);
        showNotification('❌ إجابة خاطئة! -' + CONFIG.skipPenalty + ' نقطة');
      }
    }

    setSelectedAnswer(idx);
    setTimeout(nextOrEnd, 1500);
  };

  const nextOrEnd = () => {
    const next = currentIndex + 1;
    if (next >= CONFIG.questionsPerLevel) {
      endGame();
    } else {
      setCurrentIndex(next);
      setDisabledAnswers([]);
      setSelectedAnswer(null);
      const time = CONFIG.diffs[difficulty].timePerQ;
      setTimeLeft(time);
      setTimerRunning(true);
    }
  };

  const endGame = () => {
    setTimerRunning(false);
    setPhase('result');
    
    if (score > highscore) {
      setHighscore(score);
      try {
        localStorage.setItem('zerox_high', score.toString());
      } catch (e) {
        console.log('لا يمكن حفظ السجل');
      }
      setShowConfetti(true);
      showNotification('🏆 مبروك! سجل جديد!');
    }
  };

  const useHint = () => {
    if (hints <= 0) {
      showNotification('❌ لا توجد تلميحات متاحة');
      return;
    }
    setHints(h => h - 1);
    setScore(s => Math.max(0, s - CONFIG.hintPenalty));
    showNotification('💡 تم استخدام تلميح -' + CONFIG.hintPenalty + ' نقطة');
  };

  const useFifty = () => {
    if (fifty <= 0) {
      showNotification('❌ لا يمكن استخدام 50/50');
      return;
    }
    setFifty(f => f - 1);
    setScore(s => Math.max(0, s - CONFIG.fiftyUsedPenalty));
    
    const q = questions[currentIndex];
    if (!q) return;
    const correct = q.correct;
    const indices = [0, 1, 2, 3].filter(i => i !== correct);
    const removed = shuffle(indices).slice(0, 2);
    setDisabledAnswers(removed);
    showNotification('🎯 تم استخدام 50/50 -' + CONFIG.fiftyUsedPenalty + ' نقطة');
  };

  const skipQuestion = () => {
    handleAnswer(null, 'skip');
  };

  const copyScore = () => {
    const text = `مدافع الأمن السيبراني - فريق Zerox\nنتيجتي: ${score} نقطة 🏆\nتصميم: المهندس حيدر الجنابي`;
    navigator.clipboard.writeText(text).then(() => {
      showNotification('✅ تم نسخ النتيجة!');
    });
  };

  const resetHighscore = () => {
    setHighscore(0);
    try {
      localStorage.removeItem('zerox_high');
    } catch (e) {
      console.log('لا يمكن حذف السجل');
    }
    showNotification('🗑️ تم حذف السجل');
  };

  // التايمر
  useEffect(() => {
    if (!timerRunning) return;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setTimerRunning(false);
          handleAnswer(null, 'timeout');
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerRunning]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // الكونفيتي
  const Confetti = () => {
    const canvasRef = useRef(null);
    
    useEffect(() => {
      if (!showConfetti) return;
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const pieces = [];
      for (let i = 0; i < 120; i++) {
        pieces.push({
          x: Math.random() * canvas.width,
          y: -Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 6,
          vy: Math.random() * 6 + 2,
          size: Math.random() * 8 + 4,
          color: `hsl(${Math.random() * 360}, 80%, 60%)`,
          rot: Math.random() * 360,
          vr: Math.random() * 6 - 3
        });
      }
      
      let animationId;
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < pieces.length; i++) {
          const p = pieces[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.12;
          p.rot += p.vr;
          
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot * Math.PI / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
        
        // إزالة القطع التي سقطت
        for (let i = pieces.length - 1; i >= 0; i--) {
          if (pieces[i].y > canvas.height + 50) {
            pieces.splice(i, 1);
          }
        }
        
        if (pieces.length > 0) {
          animationId = requestAnimationFrame(animate);
        }
      };
      
      animate();
      
      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      };
    }, [showConfetti]);
    
    if (!showConfetti) return null;
    
    return React.createElement('canvas', {
      ref: canvasRef,
      className: 'confetti'
    });
  };

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex % CONFIG.questionsPerLevel) / CONFIG.questionsPerLevel) * 100;

  // الواجهة
  return React.createElement('div', { className: 'container' },
    showConfetti && React.createElement(Confetti),
    
    notification && React.createElement('div', { className: 'notification' }, notification),
    
    React.createElement('div', { className: 'wrapper' },
      // الهيدر
      React.createElement('div', { className: 'header' },
        React.createElement('div', { className: 'logo' }, 'Zerox'),
        React.createElement('div', null,
          React.createElement('h1', { className: 'title' }, 'مدافع الأمن السيبراني'),
          React.createElement('p', { className: 'subtitle' }, 'لعبة تعليمية عن الأمن السيبراني — فريق Zerox'),
          React.createElement('p', { className: 'designer' }, 'تصميم: المهندس حيدر الجنابي')
        )
      ),
      
      React.createElement('div', { className: 'grid' },
        // المحتوى الرئيسي
        React.createElement('main', { className: 'main-content' },
          React.createElement('div', { className: 'card' },
            // شاشة الترحيب
            phase === 'welcome' && React.createElement('div', { className: 'screen' },
              React.createElement('h2', { className: 'text-3xl font-extrabold mb-2' }, 'أهلاً بك أيها المدافع 🛡️'),
              React.createElement('p', { className: 'text-gray mb-4' }, 
                'احمِ الحسابات وتعلم أساسيات الحماية عبر أسئلة قصيرة وتحديات سريعة.'
              ),
              React.createElement('div', { className: 'actions' },
                React.createElement('button', { 
                  onClick: startGame, 
                  className: 'btn btn-primary' 
                }, '🎮 ابدأ اللعبة'),
                React.createElement('button', { 
                  onClick: () => setPhase('how'), 
                  className: 'btn btn-secondary' 
                }, '📖 كيف تُلعب')
              ),
              React.createElement('div', { className: 'mt-6' },
                React.createElement('div', { className: 'text-gray text-sm mb-2' }, 'اختر مستوى:'),
                React.createElement('div', { className: 'difficulty-selector' },
                  React.createElement('button', { 
                    onClick: () => setDifficulty('easy'),
                    className: `diff-btn ${difficulty === 'easy' ? 'active' : ''}` 
                  }, '🟢 سهلة'),
                  React.createElement('button', { 
                    onClick: () => setDifficulty('medium'),
                    className: `diff-btn ${difficulty === 'medium' ? 'active' : ''}` 
                  }, '🟡 متوسطة'),
                  React.createElement('button', { 
                    onClick: () => setDifficulty('hard'),
                    className: `diff-btn ${difficulty === 'hard' ? 'active' : ''}` 
                  }, '🔴 صعبة')
                )
              )
            ),
            
            // شاشة التعليمات
            phase === 'how' && React.createElement('div', { className: 'screen' },
              React.createElement('h3', { className: 'text-xl font-semibold mb-2' }, '📋 قواعد سريعة'),
              React.createElement('ul', { className: 'rules-list' },
                React.createElement('li', null, '⏱️ كل سؤال له وقت محدد — أجب بسرعة لتحصل على نقاط أعلى'),
                React.createElement('li', null, '💡 H = تلميح (ينقص نقاط قليلاً)'),
                React.createElement('li', null, '🎯 F = 50/50 يزيل خيارين خاطئين'),
                React.createElement('li', null, '🏆 سجلك يخزن محلياً')
              ),
              React.createElement('button', { 
                onClick: () => setPhase('welcome'), 
                className: 'btn btn-secondary' 
              }, '↩️ رجوع')
            ),
            
            // شاشة اللعبة
            phase === 'game' && currentQuestion && React.createElement('div', null,
              React.createElement('div', { className: 'info-bar' },
                React.createElement('div', { className: 'stats' },
                  React.createElement('div', { className: 'stat' }, '🏆 النقاط: ' + score),
                  React.createElement('div', { className: 'stat' }, '📊 المرحلة: ' + CONFIG.diffs[difficulty].name),
                  React.createElement('div', { className: 'stat' }, '⏰ التوقيت: ' + timeLeft.toString().padStart(2, '0') + 's')
                ),
                React.createElement('div', { className: 'tools' },
                  React.createElement('div', { className: 'tool' }, '💡 تلميحات: ' + hints),
                  React.createElement('div', { className: 'tool' }, '🎯 50/50: ' + fifty)
                )
              ),
              
              React.createElement('div', { className: 'card-light' },
                React.createElement('div', { className: 'question-text' }, currentQuestion.q),
                React.createElement('div', { className: 'answers-grid' },
                  currentQuestion.a.map((opt, i) => 
                    React.createElement('button', {
                      key: i,
                      onClick: () => !disabledAnswers.includes(i) && handleAnswer(i),
                      disabled: disabledAnswers.includes(i),
                      className: `answer-btn ${selectedAnswer === i ? 'selected' : ''} ${disabledAnswers.includes(i) ? 'disabled' : ''}`
                    },
                      React.createElement('span', { className: 'answer-number' }, (i + 1) + '.'),
                      React.createElement('span', { className: 'answer-text' }, opt)
                    )
                  )
                )
              ),
              
              React.createElement('div', { className: 'game-tools' },
                React.createElement('button', { 
                  onClick: useHint, 
                  disabled: hints <= 0,
                  className: 'btn btn-secondary' 
                }, '💡 H — تلميح'),
                React.createElement('button', { 
                  onClick: useFifty, 
                  disabled: fifty <= 0,
                  className: 'btn btn-secondary' 
                }, '🎯 F — 50/50'),
                React.createElement('button', { 
                  onClick: skipQuestion,
                  className: 'btn btn-secondary' 
                }, '⏭️ تخطي')
              )
            ),
            
            // شاشة النتائج
            phase === 'result' && React.createElement('div', { className: 'screen' },
              React.createElement('h2', { className: 'big-score' }, score + ' 🏆'),
              React.createElement('p', { className: 'message' },
                score > highscore ? '🎉 مبروك! سجلت أفضل نتيجة جديدة' : 'انتهت الجولة — حاول تحسن نتيجتك'
              ),
              React.createElement('div', { className: 'actions' },
                React.createElement('button', { 
                  onClick: () => setPhase('welcome'), 
                  className: 'btn btn-secondary' 
                }, '🏠 العودة للقائمة'),
                React.createElement('button', { 
                  onClick: copyScore,
                  className: 'btn btn-primary' 
                }, '📋 نسخ النتيجة')
              )
            )
          )
        ),
        
        // الشريط الجانبي
        React.createElement('aside', { className: 'sidebar' },
          React.createElement('div', { className: 'card' },
            React.createElement('h3', { className: 'font-semibold' }, '📈 التقدم'),
            React.createElement('p', { className: 'text-gray text-sm' }, 'مستوى واحد = ' + CONFIG.questionsPerLevel + ' أسئلة'),
            React.createElement('div', { className: 'progress-container' },
              React.createElement('div', { className: 'progress-bar' },
                React.createElement('div', { 
                  className: 'progress-fill',
                  style: { width: progress + '%' }
                })
              )
            ),
            React.createElement('div', { className: 'text-sm mt-2' }, 
              'السؤال: ' + (currentIndex % CONFIG.questionsPerLevel + 1) + '/' + CONFIG.questionsPerLevel
            )
          ),
          
          React.createElement('div', { className: 'card' },
            React.createElement('h3', { className: 'font-semibold' }, '🎯 مستوى اللعبة'),
            React.createElement('p', { className: 'text-gray text-sm mb-2' }, 'اختر مستوى قبل البدء'),
            React.createElement('div', { className: 'difficulty-selector' },
              React.createElement('button', { 
                onClick: () => setDifficulty('easy'),
                className: `diff-btn ${difficulty === 'easy' ? 'active' : ''}` 
              }, '🟢 سهلة'),
              React.createElement('button', { 
                onClick: () => setDifficulty('medium'),
                className: `diff-btn ${difficulty === 'medium' ? 'active' : ''}` 
              }, '🟡 متوسطة'),
              React.createElement('button', { 
                onClick: () => setDifficulty('hard'),
                className: `diff-btn ${difficulty === 'hard' ? 'active' : ''}` 
              }, '🔴 صعبة')
            )
          ),
          
          React.createElement('div', { className: 'card' },
            React.createElement('h3', { className: 'font-semibold' }, '⭐ سجل اللعبة'),
            React.createElement('p', { className: 'text-gray text-sm' }, 'أعلى نتيجة: ' + highscore),
            React.createElement('div', { className: 'difficulty-selector mt-2' },
              React.createElement('button', { 
                onClick: resetHighscore,
                className: 'btn btn-secondary btn-small' 
              }, '🗑️ حذف السجل'),
              React.createElement('button', { 
                onClick: () => navigator.clipboard.writeText('مدافع الأمن السيبراني - فريق Zerox\nأعلى نتيجة: ' + highscore + ' 🏆\nتصميم: المهندس حيدر الجنابي'),
                className: 'btn btn-secondary btn-small' 
              }, '📋 نسخ')
            )
          ),
          
          React.createElement('div', { className: 'card dev-card' },
            React.createElement('h3', { className: 'font-semibold' }, '👨‍💻 عن التصميم'),
            React.createElement('p', { className: 'text-gray text-sm mt-2' },
              React.createElement('strong', null, 'المصمم: '), 'المهندس حيدر الجنابي',
              React.createElement('br', null),
              React.createElement('strong', null, 'الفريق: '), 'Zerox',
              React.createElement('br', null),
              React.createElement('strong', null, 'الهدف: '), 'نشر الوعي بالأمن السيبراني'
            )
          )
        )
      )
    )
  );
}
// ==============================================
// 🚀 النظام الموسع - كل الإضافات في ملف واحد
// ==============================================

// 🎵 نظام المؤثرات الصوتية
class AudioManager {
  constructor() {
    this.sounds = {
      correct: this.createSound(523, 0.3),
      wrong: this.createSound(220, 0.4),
      click: this.createSound(330, 0.1),
      win: this.createSound(784, 0.5),
      levelUp: this.createSound(659, 0.4)
    };
  }
  
  createSound(frequency, duration) {
    return () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      oscillator.stop(audioContext.currentTime + duration);
    };
  }
  
  play(soundName) {
    if (this.sounds[soundName]) {
      this.sounds[soundName]();
    }
  }
}

// 🌟 نظام الشارات والإنجازات
const ACHIEVEMENTS_SYSTEM = {
  achievements: {
    beginner: { name: "المبتدئ", desc: "أكمل 10 أسئلة", icon: "🟢", earned: false },
    expert: { name: "الخبير", desc: "أجاب على 50 سؤال", icon: "🔴", earned: false },
    speedster: { name: "السريع", desc: "أجاب 5 أسئلة متتالية بسرعة", icon: "⚡", earned: false },
    protector: { name: "الحامي", desc: "أجاب على كل أسئلة الحماية", icon: "🛡️", earned: false }
  },
  
  checkAchievements(score, totalQuestions, correctAnswers) {
    const earned = [];
    
    if (totalQuestions >= 10 && !this.achievements.beginner.earned) {
      this.achievements.beginner.earned = true;
      earned.push('beginner');
    }
    
    if (totalQuestions >= 50 && !this.achievements.expert.earned) {
      this.achievements.expert.earned = true;
      earned.push('expert');
    }
    
    if (correctAnswers >= 5 && !this.achievements.speedster.earned) {
      this.achievements.speedster.earned = true;
      earned.push('speedster');
    }
    
    return earned;
  }
};

// 📚 مكتبة المصطلحات الأمنية
const CYBER_GLOSSARY = {
  terms: {
    phishing: {
      term: "التصيد الإلكتروني",
      definition: "محاولة احتيال للحصول على معلومات حساسة مثل كلمات المرور",
      example: "رسالة بريد إلكتروني مزيفة تطلب تحديث بيانات الحساب"
    },
    malware: {
      term: "البرمجيات الخبيثة",
      definition: "برامج مصممة لإلحاق الضرر بأنظمة الحاسوب",
      example: "الفيروسات وبرامج الفدية وبرامج التجسس"
    },
    encryption: {
      term: "التشفير",
      definition: "عملية تحويل المعلومات إلى صيغة غير قابلة للقراءة",
      example: "تشفير الرسائل في تطبيقات المراسلة"
    },
    firewall: {
      term: "جدار الحماية",
      definition: "نظام يحمي الشبكة من الوصول غير المصرح به",
      example: "برنامج يمنع الهجمات على جهازك"
    }
  },
  
  showGlossary() {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.8); display: flex; justify-content: center;
      align-items: center; z-index: 10000;
    `;
    
    modal.innerHTML = `
      <div style="background: #0b1220; padding: 20px; border-radius: 15px; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto;">
        <h3 style="color: #e6eef6; text-align: center; margin-bottom: 20px;">📚 موسوعة الأمن السيبراني</h3>
        ${Object.values(this.terms).map(term => `
          <div style="background: rgba(255,255,255,0.05); padding: 15px; margin: 10px 0; border-radius: 10px;">
            <h4 style="color: #2dd4bf; margin: 0 0 8px 0;">${term.term}</h4>
            <p style="color: #e6eef6; margin: 0 0 8px 0;">${term.definition}</p>
            <small style="color: #94a3b8;">مثال: ${term.example}</small>
          </div>
        `).join('')}
        <button onclick="this.parentElement.parentElement.remove()" style="background: #2dd4bf; color: #041025; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; width: 100%; margin-top: 15px;">إغلاق</button>
      </div>
    `;
    
    document.body.appendChild(modal);
  }
};

// 📊 نظام الإحصائيات المتقدمة
class AdvancedAnalytics {
  constructor() {
    this.stats = JSON.parse(localStorage.getItem('cyber_analytics')) || {
      totalQuestions: 0,
      correctAnswers: 0,
      totalTime: 0,
      streaks: [],
      categories: {}
    };
  }
  
  save() {
    localStorage.setItem('cyber_analytics', JSON.stringify(this.stats));
  }
  
  recordAnswer(isCorrect, timeSpent, category) {
    this.stats.totalQuestions++;
    if (isCorrect) this.stats.correctAnswers++;
    this.stats.totalTime += timeSpent;
    
    if (!this.stats.categories[category]) {
      this.stats.categories[category] = { correct: 0, total: 0 };
    }
    this.stats.categories[category].total++;
    if (isCorrect) this.stats.categories[category].correct++;
    
    this.save();
  }
  
  getReport() {
    const accuracy = this.stats.totalQuestions > 0 
      ? (this.stats.correctAnswers / this.stats.totalQuestions * 100).toFixed(1)
      : 0;
      
    const avgTime = this.stats.totalQuestions > 0
      ? (this.stats.totalTime / this.stats.totalQuestions).toFixed(1)
      : 0;
    
    return {
      accuracy: accuracy,
      averageTime: avgTime,
      totalQuestions: this.stats.totalQuestions,
      weakCategory: this.getWeakestCategory(),
      level: this.calculateLevel()
    };
  }
  
  getWeakestCategory() {
    let weakest = { name: '', accuracy: 100 };
    for (const [category, data] of Object.entries(this.stats.categories)) {
      const accuracy = (data.correct / data.total) * 100;
      if (accuracy < weakest.accuracy) {
        weakest = { name: category, accuracy };
      }
    }
    return weakest.name || 'لا توجد بيانات كافية';
  }
  
  calculateLevel() {
    const baseLevel = Math.floor(this.stats.totalQuestions / 10) + 1;
    return Math.min(baseLevel, 10); // أقصى مستوى 10
  }
}

// 🔔 نظام الإشعارات
class NotificationSystem {
  show(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed; top: 20px; right: 20px; padding: 15px 20px;
      border-radius: 10px; color: white; z-index: 10000;
      animation: slideIn 0.3s ease; font-weight: bold;
      background: ${type === 'success' ? '#2ed573' : type === 'error' ? '#ff4757' : '#3742fa'};
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 3000);
  }
}

// 🎬 نظام الدروس المصورة (مبسط)
const VIDEO_LESSONS = {
  showLessons() {
    const lessons = [
      { title: "كيفية إنشاء كلمة مرور قوية", duration: "2:30" },
      { title: "التعرف على رسائل التصيد", duration: "3:15" },
      { title: "حماية حسابات التواصل الاجتماعي", duration: "2:45" }
    ];
    
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.8); display: flex; justify-content: center;
      align-items: center; z-index: 10000;
    `;
    
    modal.innerHTML = `
      <div style="background: #0b1220; padding: 25px; border-radius: 15px; max-width: 500px; width: 90%;">
        <h3 style="color: #e6eef6; text-align: center; margin-bottom: 20px;">🎬 الدروس التعليمية</h3>
        ${lessons.map(lesson => `
          <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); padding: 15px; margin: 10px 0; border-radius: 10px;">
            <span style="color: #e6eef6;">${lesson.title}</span>
            <button style="background: #2dd4bf; color: #041025; border: none; padding: 8px 15px; border-radius: 6px; cursor: pointer;">
              تشغيل (${lesson.duration})
            </button>
          </div>
        `).join('')}
        <button onclick="this.parentElement.parentElement.remove()" style="background: #ff6b6b; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; width: 100%; margin-top: 15px;">إغلاق</button>
      </div>
    `;
    
    document.body.appendChild(modal);
  }
};

// 👶 نظام النسخة المبسطة للأطفال
const KIDS_MODE = {
  isActive: false,
  
  toggle() {
    this.isActive = !this.isActive;
    if (this.isActive) {
      this.activateKidsMode();
    } else {
      this.deactivateKidsMode();
    }
  },
  
  activateKidsMode() {
    document.body.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    document.querySelectorAll('.card').forEach(card => {
      card.style.background = '#ff6b6b';
    });
    new NotificationSystem().show('🎮 تم تفعيل وضع الأطفال!', 'success');
  },
  
  deactivateKidsMode() {
    document.body.style.background = 'linear-gradient(to bottom, #041025, #081426)';
    document.querySelectorAll('.card').forEach(card => {
      card.style.background = '#0b1220';
    });
  }
};

// ==============================================
// 🔧 دمج كل الأنظمة مع اللعبة الأساسية
// ==============================================

// تهيئة جميع الأنظمة
const audioManager = new AudioManager();
const analytics = new AdvancedAnalytics();
const notifications = new NotificationSystem();

// دمج مع اللعبة الأساسية
function enhanceGame() {
  // إضافة أزرار التحكم الجديدة
  addControlButtons();
  
  // تحسين نظام الإجابة
  enhanceAnswerSystem();
  
  // إضافة الإحصائيات
  showEnhancedStats();
}

function addControlButtons() {
  const controlsDiv = document.createElement('div');
  controlsDiv.style.cssText = `
    display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap; justify-content: center;
  `;
  
  controlsDiv.innerHTML = `
    <button onclick="CYBER_GLOSSARY.showGlossary()" style="background: #3742fa; color: white; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer;">
      📚 الموسوعة
    </button>
    <button onclick="VIDEO_LESSONS.showLessons()" style="background: #ffa502; color: #041025; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer;">
      🎬 الدروس
    </button>
    <button onclick="KIDS_MODE.toggle()" style="background: #ff6b6b; color: white; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer;">
      👶 وضع الأطفال
    </button>
    <button onclick="showAdvancedReport()" style="background: #2ed573; color: #041025; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer;">
      📊 التقرير المتقدم
    </button>
  `;
  
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.appendChild(controlsDiv);
  }
}

function enhanceAnswerSystem() {
  // هذا سيرتبط مع نظام الإجابة الأساسي
  console.log('نظام الإجابة المحسن جاهز!');
}

function showAdvancedReport() {
  const report = analytics.getReport();
  notifications.show(
    `📊 دقتك: ${report.accuracy}% | متوسط الوقت: ${report.averageTime}ث | المستوى: ${report.level}`,
    'success'
  );
}

// تشغيل النظام المحسن عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    enhanceGame();
    console.log('🎉 جميع الأنظمة المحسنة نشطة!');
  }, 1000);
});

// جعل الدوال متاحة globally
window.CYBER_GLOSSARY = CYBER_GLOSSARY;
window.VIDEO_LESSONS = VIDEO_LESSONS;
window.KIDS_MODE = KIDS_MODE;
window.showAdvancedReport = showAdvancedReport;

// تشغيل التطبيق
ReactDOM.render(React.createElement(App), document.getElementById('root'));


