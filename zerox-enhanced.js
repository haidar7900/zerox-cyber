// zerox-enhanced.js - الإصدار المتقدم من لعبة ZeroX
// هذا ملف منفصل تماماً - لا يؤثر على الملفات الحالية

class ZeroxEnhanced {
    constructor() {
        this.advancedQuestions = this.loadAdvancedQuestions();
        this.dailyChallenges = this.loadDailyChallenges();
        this.achievements = this.loadAchievements();
        this.currentLanguage = 'ar';
        this.isInitialized = false;
    }

    // 🌍 نظام اللغات المتقدم
    loadLanguageSystem() {
        const languages = {
            ar: {
                title: "مدافع الأمن السيبراني - المتقدم",
                advancedMode: "الوضع المتقدم",
                dailyChallenge: "التحدي اليومي",
                achievements: "الإنجازات",
                // ... كل النصوص العربية
            },
            en: {
                title: "Cyber Defender - Advanced", 
                advancedMode: "Advanced Mode",
                dailyChallenge: "Daily Challenge",
                achievements: "Achievements",
                // ... كل النصوص الإنجليزية
            }
        };
        return languages;
    }

    // 🔥 الأسئلة المتقدمة
    loadAdvancedQuestions() {
        return {
            networking: [
                {
                    id: "adv_net_1",
                    difficulty: "hard",
                    q: {
                        ar: "ما الفرق الأساسي بين IDS و IPS؟",
                        en: "What is the fundamental difference between IDS and IPS?"
                    },
                    a: {
                        ar: [
                            "نفس النظام لكن بأسعار مختلفة",
                            "IDS يرصد فقط، IPS يرصد ويمنع",
                            "IDS للشبكات الصغيرة، IPS للكبيرة", 
                            "لا فرق تقني بينهما"
                        ],
                        en: [
                            "Same system with different pricing",
                            "IDS only detects, IPS detects and prevents",
                            "IDS for small networks, IPS for large ones",
                            "No technical difference"
                        ]
                    },
                    correct: 1,
                    explain: {
                        ar: "IDS نظام كشف التسلل يرصد الهجمات فقط، بينما IPS نظام منع التسلل يرصد ويمنع الهجمات تلقائياً",
                        en: "IDS (Intrusion Detection System) only detects attacks, while IPS (Intrusion Prevention System) detects and automatically blocks attacks"
                    }
                }
                // ... المزيد من الأسئلة
            ],
            
            cryptography: [
                {
                    id: "adv_crypto_1", 
                    difficulty: "hard",
                    q: {
                        ar: "ما الفرق بين تشفير RSA و AES؟",
                        en: "What is the difference between RSA and AES encryption?"
                    },
                    a: {
                        ar: [
                            "نفس الخوارزمية بأسماء مختلفة",
                            "RSA للتوقيع، AES للتشفير",
                            "RSA أسرع من AES",
                            "AES للتوقيع، RSA للتشفير"
                        ],
                        en: [
                            "Same algorithm with different names",
                            "RSA for signing, AES for encryption", 
                            "RSA is faster than AES",
                            "AES for signing, RSA for encryption"
                        ]
                    },
                    correct: 1,
                    explain: {
                        ar: "RSA خوارزمية تشفير غير متماثل تستخدم للمفاتيح والتوقيعات، بينما AES خوارزمية تشفير متماثل تستخدم لتشفير البيانات",
                        en: "RSA is an asymmetric encryption algorithm used for keys and signatures, while AES is a symmetric encryption algorithm used for data encryption"
                    }
                }
            ],

            cloudSecurity: [
                {
                    id: "adv_cloud_1",
                    difficulty: "hard", 
                    q: {
                        ar: "ما هو مبدأ 'مسؤولية مشتركة' في أمن السحابة؟",
                        en: "What is the 'shared responsibility' principle in cloud security?"
                    },
                    a: {
                        ar: [
                            "المستخدم مسؤول عن كل شيء",
                            "مزود الخدمة مسؤول عن كل شيء", 
                            "تقسيم المسؤولية بين المستخدم والمزود",
                            "لا توجد مسؤولية محددة"
                        ],
                        en: [
                            "User is responsible for everything",
                            "Service provider is responsible for everything",
                            "Divided responsibility between user and provider", 
                            "No specific responsibility"
                        ]
                    },
                    correct: 2,
                    explain: {
                        ar: "مزود الخدمة مسؤول عن أمن البنية التحتية، بينما المستخدم مسؤول عن أمن بياناته وتطبيقاته",
                        en: "The service provider is responsible for infrastructure security, while the user is responsible for their data and application security"
                    }
                }
            ]
        };
    }

    // 🎯 نظام التحديات اليومية
    loadDailyChallenges() {
        const today = new Date().toDateString();
        return {
            [today]: {
                question: {
                    ar: "كيف تكتشف هجوم DDoS على خادمك؟",
                    en: "How do you detect a DDoS attack on your server?"
                },
                reward: 200,
                timeLimit: 45
            }
        };
    }

    // 🏆 نظام الإنجازات
    loadAchievements() {
        return {
            beginner: {
                name: { ar: "المبتدئ", en: "Beginner" },
                description: { ar: "أكمل 10 أسئلة", en: "Complete 10 questions" },
                icon: "🟢",
                required: 10
            },
            expert: {
                name: { ar: "الخبير", en: "Expert" },
                description: { ar: "أجاب على 50 سؤال متقدم", en: "Answer 50 advanced questions" },
                icon: "🔴", 
                required: 50
            },
            cryptographer: {
                name: { ar: "خبير التشفير", en: "Cryptographer" },
                description: { ar: "أجاب على كل أسئلة التشفير", en: "Answer all cryptography questions" },
                icon: "🔐",
                required: 15
            }
        };
    }

    // 🌐 تبديل اللغة
    switchLanguage(lang) {
        this.currentLanguage = lang;
        this.updateUI();
        this.savePreference('language', lang);
    }

    // 💾 حفظ التفضيلات
    savePreference(key, value) {
        try {
            const prefs = JSON.parse(localStorage.getItem('zerox_prefs') || '{}');
            prefs[key] = value;
            localStorage.setItem('zerox_prefs', JSON.stringify(prefs));
        } catch (e) {
            console.log('لا يمكن حفظ التفضيلات');
        }
    }

    // 🎨 تحديث الواجهة
    updateUI() {
        // تحديث كل النصوص حسب اللغة
        this.updateTexts();
        this.updateDirection();
    }

    updateTexts() {
        const texts = this.loadLanguageSystem()[this.currentLanguage];
        // تحديث كل العناصر في الصفحة
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            if (texts[key]) {
                element.textContent = texts[key];
            }
        });
    }

    updateDirection() {
        document.documentElement.dir = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = this.currentLanguage;
    }

    // 🎮 دمج مع اللعبة الأساسية
    integrateWithBaseGame() {
        // نضيف زر اللغة
        this.addLanguageSwitch();
        
        // نضيف قسم الأسئلة المتقدمة
        this.addAdvancedSection();
        
        // نضيف نظام التحديات
        this.addChallengesSection();
    }

    addLanguageSwitch() {
        const header = document.querySelector('.header');
        if (header) {
            const languageSwitch = document.createElement('div');
            languageSwitch.className = 'language-switch';
            languageSwitch.innerHTML = `
                <button class="lang-btn" onclick="zeroxEnhanced.switchLanguage('ar')">🌐 AR</button>
                <button class="lang-btn" onclick="zeroxEnhanced.switchLanguage('en')">🌐 EN</button>
            `;
            header.appendChild(languageSwitch);
        }
    }

    addAdvancedSection() {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            const advancedSection = document.createElement('div');
            advancedSection.className = 'advanced-section';
            advancedSection.innerHTML = `
                <div class="card">
                    <h3 data-lang="advancedMode">الوضع المتقدم</h3>
                    <div class="advanced-options">
                        <button onclick="zeroxEnhanced.startAdvancedGame()" data-lang="startAdvanced">بدء اللعبة المتقدمة</button>
                        <button onclick="zeroxEnhanced.showAchievements()" data-lang="achievements">الإنجازات</button>
                    </div>
                </div>
            `;
            mainContent.appendChild(advancedSection);
        }
    }

    addChallengesSection() {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            const challengesCard = document.createElement('div');
            challengesCard.className = 'card';
            challengesCard.innerHTML = `
                <h3 data-lang="dailyChallenge">التحدي اليومي</h3>
                <p data-lang="challengeDesc">اكسب نقاط إضافية!</p>
                <button onclick="zeroxEnhanced.startDailyChallenge()" data-lang="startChallenge">بدء التحدي</button>
            `;
            sidebar.appendChild(challengesCard);
        }
    }

    // 🎯 بدء اللعبة المتقدمة
    startAdvancedGame() {
        // هنا راح ننشئ واجهة اللعبة المتقدمة
        this.showAdvancedGameInterface();
    }

    showAdvancedGameInterface() {
        // ننشئ واجهة جديدة للعبة المتقدمة
        const gameInterface = document.createElement('div');
        gameInterface.className = 'advanced-game-interface';
        gameInterface.innerHTML = `
            <div class="advanced-header">
                <h2 data-lang="advancedMode">الوضع المتقدم</h2>
                <div class="advanced-stats">
                    <span data-lang="score">النقاط: 0</span>
                    <span data-lang="time">الوقت: 60s</span>
                </div>
            </div>
            <div class="advanced-questions">
                <!-- الأسئلة المتقدمة تظهر هنا -->
            </div>
        `;
        
        document.body.appendChild(gameInterface);
        this.loadRandomAdvancedQuestion();
    }

    loadRandomAdvancedQuestion() {
        // نختار سؤال عشوائي من الأسئلة المتقدمة
        const categories = Object.keys(this.advancedQuestions);
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const questions = this.advancedQuestions[randomCategory];
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        
        this.displayAdvancedQuestion(randomQuestion);
    }

    displayAdvancedQuestion(question) {
        const questionsContainer = document.querySelector('.advanced-questions');
        if (questionsContainer && question) {
            questionsContainer.innerHTML = `
                <div class="advanced-question">
                    <h3>${question.q[this.currentLanguage]}</h3>
                    <div class="advanced-answers">
                        ${question.a[this.currentLanguage].map((answer, index) => `
                            <button onclick="zeroxEnhanced.checkAdvancedAnswer(${index}, ${question.correct})">
                                ${answer}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }

    checkAdvancedAnswer(selected, correct) {
        if (selected === correct) {
            this.showMessage('🎉 إجابة صحيحة!', 'success');
            // منح نقاط إضافية
        } else {
            this.showMessage('❌ إجابة خاطئة', 'error');
            // شرح الإجابة الصحيحة
            this.showExplanation();
        }
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    showExplanation() {
        // عرض شرح للإجابة
    }

    // 🏆 عرض الإنجازات
    showAchievements() {
        const achievementsModal = document.createElement('div');
        achievementsModal.className = 'achievements-modal';
        achievementsModal.innerHTML = `
            <div class="modal-content">
                <h2 data-lang="achievements">الإنجازات</h2>
                <div class="achievements-list">
                    ${Object.entries(this.achievements).map(([key, achievement]) => `
                        <div class="achievement-item">
                            <span class="achievement-icon">${achievement.icon}</span>
                            <div class="achievement-info">
                                <h4>${achievement.name[this.currentLanguage]}</h4>
                                <p>${achievement.description[this.currentLanguage]}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button onclick="this.parentElement.parentElement.remove()" data-lang="close">إغلاق</button>
            </div>
        `;
        document.body.appendChild(achievementsModal);
    }

    // 🎯 بدء التحدي اليومي
    startDailyChallenge() {
        const today = new Date().toDateString();
        const challenge = this.dailyChallenges[today];
        
        if (challenge) {
            this.showDailyChallenge(challenge);
        } else {
            this.showMessage('لا يوجد تحدٍ اليوم', 'info');
        }
    }

    showDailyChallenge(challenge) {
        const challengeModal = document.createElement('div');
        challengeModal.className = 'challenge-modal';
        challengeModal.innerHTML = `
            <div class="modal-content">
                <h2 data-lang="dailyChallenge">التحدي اليومي</h2>
                <p>${challenge.question[this.currentLanguage]}</p>
                <div class="challenge-reward">
                    <span data-lang="reward">الجائزة: ${challenge.reward} نقطة</span>
                    <span data-lang="timeLimit">الوقت: ${challenge.timeLimit} ثانية</span>
                </div>
                <button onclick="zeroxEnhanced.startChallengeGame()" data-lang="start">بدء</button>
            </div>
        `;
        document.body.appendChild(challengeModal);
    }

    // 🎮 التهيئة النهائية
    initialize() {
        if (this.isInitialized) return;
        
        // تحميل التفضيلات
        this.loadPreferences();
        
        // دمج مع اللعبة الأساسية
        this.integrateWithBaseGame();
        
        // تحديث الواجهة
        this.updateUI();
        
        this.isInitialized = true;
        console.log('✅ Zerox Enhanced - تم التحميل بنجاح!');
    }

    loadPreferences() {
        try {
            const prefs = JSON.parse(localStorage.getItem('zerox_prefs') || '{}');
            if (prefs.language) {
                this.currentLanguage = prefs.language;
            }
        } catch (e) {
            console.log('لا يمكن تحميل التفضيلات');
        }
    }
}

// 🚀 التشغيل التلقائي عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // ننتظر حتى تحمل اللعبة الأساسية
    setTimeout(() => {
        window.zeroxEnhanced = new ZeroxEnhanced();
        window.zeroxEnhanced.initialize();
    }, 1000);
});

// 🎨 إضافة تنسيقات CSS للإضافات
const enhancedStyles = `
    .language-switch {
        position: absolute;
        top: 20px;
        left: 20px;
        display: flex;
        gap: 10px;
    }
    
    .lang-btn {
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
    }
    
    .lang-btn:hover {
        background: rgba(255,255,255,0.2);
    }
    
    .advanced-section {
        margin-top: 20px;
    }
    
    .advanced-options {
        display: flex;
        gap: 10px;
        margin-top: 10px;
    }
    
    .advanced-options button {
        background: linear-gradient(45deg, #ff6b6b, #ee5a24);
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 8px;
        cursor: pointer;
    }
    
    .message {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    }
    
    .message.success { background: #2ed573; }
    .message.error { background: #ff4757; }
    .message.info { background: #3742fa; }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .achievements-modal, .challenge-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .modal-content {
        background: #0b1220;
        padding: 30px;
        border-radius: 15px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .achievement-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 10px;
        margin: 10px 0;
        background: rgba(255,255,255,0.05);
        border-radius: 8px;
    }
    
    .achievement-icon {
        font-size: 24px;
    }
`;

// 🎨 إضافة التنسيقات للصفحة
const styleSheet = document.createElement('style');
styleSheet.textContent = enhancedStyles;
document.head.appendChild(styleSheet);

console.log('🚀 Zerox Enhanced - جاهز للتحميل!');
