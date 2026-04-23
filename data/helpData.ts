import type { TourStep, FaqItem, Tutorial } from '../types';

export const tourSteps: TourStep[] = [
    {
        selector: '.sidebar-nav',
        titleKey: 'onboarding.tour.step1_title',
        contentKey: 'onboarding.tour.step1_content'
    },
    {
        selector: '.header-controls',
        titleKey: 'onboarding.tour.step2_title',
        contentKey: 'onboarding.tour.step2_content'
    },
    {
        selector: '.dashboard-controls',
        titleKey: 'onboarding.tour.step3_title',
        contentKey: 'onboarding.tour.step3_content'
    },
    {
        selector: '.ai-fab',
        titleKey: 'onboarding.tour.step4_title',
        contentKey: 'onboarding.tour.step4_content'
    },
];

export const MOCK_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    question: {
      en: "How do I change the language?",
      ar: "كيف يمكنني تغيير اللغة؟",

    },
    answer: {
      en: "You can change the language at any time by clicking the globe icon in the top-right corner of the header.",
      ar: "يمكنك تغيير اللغة في أي وقت بالنقر على أيقونة الكرة الأرضية في الزاوية العلوية اليمنى من الترويسة.",

    },
  },
  {
    id: 'faq-2',
    category: 'general',
    question: {
      en: "How can I customize my dashboard?",
      ar: "كيف يمكنني تخصيص لوحة القيادة الخاصة بي؟",

    },
    answer: {
      en: "On the Dashboard page, click the 'Customize' button (wrench icon) in the top controls. This will allow you to drag, resize, add, or remove widgets.",
      ar: "في صفحة لوحة القيادة، انقر فوق زر 'تخصيص' (أيقونة مفتاح الربط) في عناصر التحكم العلوية. سيسمح لك ذلك بسحب الأدوات وتغيير حجمها وإضافتها وإزالتها.",

    },
  },
   {
    id: 'faq-3',
    category: 'donors',
    question: {
      en: "What is the difference between a 'Prospect' and 'Contacted' donor?",
      ar: "ما الفرق بين المانح 'المحتمل' و'تم التواصل معه'؟",

    },
    answer: {
      en: "A 'Prospect' is a potential donor who has been identified but not yet contacted. Once you make the first contact (email, call, etc.), you should move them to the 'Contacted' stage.",
      ar: "المانح 'المحتمل' هو مانح تم تحديده ولكن لم يتم التواصل معه بعد. بمجرد إجراء أول اتصال (بريد إلكتروني، مكالمة، إلخ)، يجب عليك نقلهم إلى مرحلة 'تم التواصل معه'.",

    },
  },
  {
    id: 'faq-4',
    category: 'projects',
    question: {
      en: "How is project progress calculated?",
      ar: "كيف يتم حساب تقدم المشروع؟",

    },
    answer: {
      en: "Project progress is an aggregate of the completion status of all tasks within its Work Breakdown Structure (WBS). You can view the detailed schedule in the 'Schedule' tab of any project.",
      ar: "تقدم المشروع هو تجميع لحالة إنجاز جميع المهام ضمن هيكل تقسيم العمل (WBS) الخاص به. يمكنك عرض الجدول الزمني المفصل في علامة التبويب 'الجدول الزمني' لأي مشروع.",

    },
  },
  {
    id: 'faq-5',
    category: 'projects',
    question: {
      en: "What is the 'Partnership Opportunities' feature?",
      ar: "ما هي ميزة 'فرص الشراكة'؟",

    },
    answer: {
      en: "The 'Partnership Opportunities' feature, found within the 'Institutional Donors' module, uses AI to help you find the best potential funding partners for your projects. Simply select one of your projects, and the AI will analyze institutional donors to identify those whose focus areas and geographic interests align with your project's goals, providing an alignment score for each potential match. You can then use the AI to help draft an initial application.",
      ar: "ميزة 'فرص الشراكة'، الموجودة في وحدة 'المؤسسات المانحة'، تستخدم الذكاء الاصطناعي لمساعدتك في العثور على أفضل شركاء تمويل محتملين لمشاريعك. ما عليك سوى اختيار أحد مشاريعك، وسيقوم الذكاء الاصطناعي بتحليل المؤسسات المانحة لتحديد تلك التي تتوافق مجالات تركيزها واهتماماتها الجغرافية مع أهداف مشروعك، مع تقديم درجة توافق لكل مطابقة محتملة. يمكنك بعد ذلك استخدام الذكاء الاصطناعي للمساعدة في صياغة طلب أولي.",

    },
  },
  {
    id: 'faq-6',
    category: 'general',
    question: {
      en: "What is the 'AI Insights' panel on the Dashboard?",
      ar: "ما هي لوحة 'رؤى الذكاء الاصطناعي' في لوحة القيادة الرئيسية؟",

    },
    answer: {
      en: "The AI Insights panel on your dashboard provides real-time, actionable intelligence about your organization. It automatically analyzes your data to highlight opportunities (like high-potential donors), alerts (like projects going over budget), recommendations (such as launching a new campaign), and forecasts (predicting future trends like donation increases). It helps you make smarter decisions without manually digging through data.",
      ar: "لوحة رؤى الذكاء الاصطناعي في لوحة القيادة الرئيسية توفر لك معلومات استخباراتية قابلة للتنفيذ وفي الوقت الفعلي حول منظمتك. تقوم اللوحة تلقائيًا بتحليل بياناتك لتسليط الضوء على الفرص (مثل المانحين ذوي الإمكانات العالية)، والتنبيهات (مثل المشاريع التي تتجاوز الميزانية)، والتوصيات (مثل إطلاق حملة جديدة)، والتوقعات (مثل التنبؤ بالاتجاهات المستقبلية كزيادة التبرعات). تساعدك على اتخاذ قرارات أكثر ذكاءً دون الحاجة إلى البحث اليدوي في البيانات.",

    },
  }
];

export const MOCK_TUTORIALS: Tutorial[] = [
    { 
        id: 'tut-1',
        title: { en: 'Creating Your First Project', ar: 'إنشاء مشروعك الأول' },
        description: { en: 'Learn how to set up a new project from scratch, define goals, and add team members.', ar: 'تعلم كيفية إعداد مشروع جديد من البداية وتحديد الأهداف وإضافة أعضاء الفريق.' },
        duration: 5,
        type: 'video',
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    { 
        id: 'tut-2',
        title: { en: 'Interactive: Customize Your Dashboard', ar: 'تفاعلي: خصص لوحة القيادة الخاصة بك' },
        description: { en: 'A step-by-step guide to rearranging your dashboard widgets to fit your workflow.', ar: 'دليل تفصيلي خطوة بخطوة لإعادة ترتيب أدوات لوحة القيادة لتناسب سير عملك.' },
        duration: 3,
        type: 'interactive'
    },
     { 
        id: 'tut-3',
        title: { en: 'Understanding Donor Intelligence', ar: 'فهم ذكاء المانحين' },
        description: { en: 'A deep dive into how the AI classifies donors and what each category means.', ar: 'نظرة عميقة على كيفية تصنيف الذكاء الاصطناعي للمانحين وماذا تعني كل فئة.' },
        duration: 4,
        type: 'video',
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    },
     { 
        id: 'tut-4',
        title: { en: 'Interactive: Running a Smart Message Campaign', ar: 'تفاعلي: تشغيل حملة رسائل ذكية' },
        description: { en: 'Be guided through creating and launching your first AI-powered messaging campaign.', ar: 'احصل على إرشادات لإنشاء وإطلاق أول حملة رسائل مدعومة بالذكاء الاصطناعي.' },
        duration: 8,
        type: 'interactive'
    },
];
