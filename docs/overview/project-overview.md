# MSS.2 - Global Management System for Non-Profits

<details>
<summary><strong>🇸🇦 العربية</strong></summary>

## 1. نظرة عامة

**MSS.2** هو نظام تخطيط موارد مؤسسات (ERP) شامل ومتقدم، مصمم خصيصًا لتلبية الاحتياجات الفريدة للمنظمات غير الربحية. يتميز النظام بواجهة مستخدم حديثة وبديهية تدعم لغتين (العربية والإنجليزية)، مع التركيز على سهولة الوصول والاستخدام.

### ✨ المميزات الرئيسية

- **لوحة قيادة ذكية وقابلة للتخصيص:** عرض مؤشرات الأداء الرئيسية (KPIs) ورؤى مدعومة بالذكاء الاصطناعي.
- **إدارة شاملة:** وحدات متكاملة لإدارة المانحين، الكفالات، المشاريع، المستفيدين، الموارد البشرية، والمالية.
- **ذكاء اصطناعي متقدم:** يشمل تصنيف المانحين، التنبؤ بأفضل أوقات التواصل، حملات الرسائل الذكية، والبحث الدلالي.
- **دعم متعدد اللغات:** واجهة مستخدم كاملة باللغتين العربية والإنجليزية مع دعم اتجاه النص (RTL).
- **تصميم متجاوب:** تجربة مستخدم سلسة على جميع الأجهزة، من سطح المكتب إلى الهواتف المحمولة.
- **إمكانية الوصول (Accessibility):** مصمم مع مراعاة معايير الوصول لتسهيل الاستخدام للجميع.

---

## 2. التثبيت والتشغيل

هذا التطبيق هو تطبيق ويب من صفحة واحدة (SPA) لا يتطلب عملية بناء معقدة أو تثبيت تبعيات من جهة العميل.

### المتطلبات

- متصفح ويب حديث (Chrome, Firefox, Safari, Edge).
- اتصال بالإنترنت (لجلب المكتبات من CDN والاتصال بـ Gemini API).

### خطوات التشغيل

1.  **الحصول على مفتاح API:** تأكد من أن متغير البيئة `API_KEY` الخاص بـ Gemini API مُعد في بيئة التشغيل الخاصة بك.
2.  **خدمة الملفات:** قم بتقديم مجلد المشروع عبر خادم ويب محلي. أسهل طريقة هي استخدام `http-server`:
    ```bash
    npx http-server .
    ```
3.  **فتح التطبيق:** افتح المتصفح وانتقل إلى العنوان الذي يوفره الخادم (عادةً `http://localhost:8080`).

---

## 3. الإصلاح التلقائي للترجمة (مهم جداً)

لقد تم تجهيز برنامج خاص لك يقوم بإصلاح جميع مشاكل الترجمة في التطبيق بضغطة زر واحدة. هذا البرنامج آمن جدًا ويقوم بعمل نسخة احتياطية كاملة من ملفاتك قبل البدء.

### كيف تستخدمه؟ (شرح بسيط للغاية)

1.  افتح الطرفية (Terminal) في مجلد المشروع.
2.  اكتب الأمر التالي واضغط على مفتاح Enter:

    ```bash
    node fix-translations.js
    ```

هذا كل شيء! سيقوم البرنامج بالعمل تلقائيًا وسيشرح لك كل خطوة يقوم بها. عند الانتهاء، سيكون تطبيقك موحدًا وجاهزًا بالكامل.

**للأمان:** إذا لم تعجبك التغييرات، يمكنك استعادة كل شيء من مجلد `backup` الذي تم إنشاؤه.

---

## 4. الاستخدام

- **التنقل:** استخدم الشريط الجانبي (أو الشريط السفلي على الهاتف المحمول) للتنقل بين الوحدات المختلفة.
- **تغيير اللغة والسمة:** استخدم الأيقونات الموجودة في الترويسة العلوية للتبديل بين اللغات والسمات (فاتح/داكن).
- **تخصيص لوحة القيادة:** انقر على أيقونة "تخصيص" في لوحة القيادة لترتيب الأدوات (widgets) أو إضافتها أو إزالتها.
- **استخدام ميزات الذكاء الاصطناعي:** انتقل إلى وحدة "الذكاء الاصطناعي والأتمتة" لاستكشاف الأدوات المتقدمة.

---

## 5. بنية المشروع

يتبع المشروع بنية بسيطة تعتمد على React و TypeScript، مع تحميل الوحدات عبر `importmap`.

- **`index.html`**: نقطة الدخول الرئيسية للتطبيق. يحتوي على `importmap` لتعريف الوحدات والإعدادات الأولية لـ TailwindCSS.
- **`index.tsx`**: نقطة الدخول لـ React، حيث يتم عرض المكون الجذري `App`.
- **`App.tsx`**: المكون الرئيسي الذي يدير الحالة العامة مثل اللغة والسمة والتنقل بين الوحدات.
- **`components/`**: يحتوي على جميع مكونات React، مقسمة حسب الوظيفة (مثل `layout`, `pages`, `common`).
- **`hooks/`**: يحتوي على الخطافات (Hooks) المخصصة لإدارة الحالة والمنطق المشترك (مثل `useLocalization`, `useTheme`).
- **`data/`**: يحتوي على البيانات الثابتة والمحاكاة المستخدمة في التطبيق.
- **`lib/`**: يحتوي على الوظائف المساعدة والمنطق الأساسي (مثل `i18n`, `utils`).
- **`lib/locales/`**: ملفات الترجمة بصيغة JSON لكل لغة مدعومة.

### تدفق البيانات

1.  **`DashboardProvider`**: يوفر سياقًا (Context) عامًا للتطبيق لإدارة اللغة، السمة، ووظيفة الترجمة `t`.
2.  **`localStorage`**: يتم استخدام التخزين المحلي للاحتفاظ بحالة المستخدم (مثل اللغة والسمة) وتخزين البيانات التي تم تعديلها مؤقتًا (مثل بيانات المانحين والمشاريع).
3.  **Hooks البيانات (`use...Data`)**: تُستخدم هذه الخطافات لجلب البيانات وإدارتها، مع محاكاة التخزين المؤقت والتحديثات.

---

## 6. واجهة برمجة التطبيقات (API)

- **Google Gemini API**: يُستخدم لجميع ميزات الذكاء الاصطناعي. يتطلب مفتاح API صالح يتم توفيره عبر متغير البيئة `process.env.API_KEY`.
- **LocalStorage API**: تُستخدم لمحاكاة قاعدة بيانات من جهة العميل لتخزين البيانات واستمراريتها بين الجلسات.

---

## 7. النشر (Deployment)

التطبيق عبارة عن مجموعة من الملفات الثابتة. يمكن نشره على أي خدمة استضافة للمواقع الثابتة مثل Vercel, Netlify, GitHub Pages, أو خادم ويب خاص.

---

## 8. المساهمة

نرحب بالمساهمات! يرجى اتباع الإرشادات التالية:

1.  قم بعمل Fork للمشروع.
2.  أنشئ فرعًا جديدًا لميزتك (`git checkout -b feature/AmazingFeature`).
3.  قم بعمل Commit لتغييراتك (`git commit -m 'Add some AmazingFeature'`).
4.  ادفع إلى الفرع (`git push origin feature/AmazingFeature`).
5.  افتح طلب سحب (Pull Request).

---

## 9. الترخيص

موزع بموجب ترخيص MIT. انظر `LICENSE` لمزيد من المعلومات.

</details>

<details>
<summary><strong>🇬🇧 English</strong></summary>

## 1. Overview

**MSS.2** is a comprehensive, advanced Enterprise Resource Planning (ERP) system specifically designed to meet the unique needs of non-profit organizations. The system features a modern, intuitive user interface that supports two languages (Arabic and English), with a focus on accessibility and ease of use.

### ✨ Key Features

- **Smart & Customizable Dashboard:** Display Key Performance Indicators (KPIs) and AI-powered insights.
- **Comprehensive Management:** Integrated modules for managing donors, sponsorships, projects, beneficiaries, HR, and financials.
- **Advanced AI:** Includes donor classification, optimal contact timing prediction, smart message campaigns, and semantic search.
- **Multilingual Support:** Full UI in Arabic and English with Right-to-Left (RTL) support.
- **Responsive Design:** Seamless user experience across all devices, from desktops to mobile phones.
- **Accessibility:** Designed with accessibility standards in mind to ensure usability for everyone.

---

## 2. Installation & Running

This application is a Single Page Application (SPA) that does not require a complex build process or client-side dependency installation.

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge).
- An internet connection (to fetch libraries from CDN and connect to the Gemini API).

### Running the Application

1.  **Get an API Key:** Ensure the `API_KEY` environment variable for the Gemini API is set up in your execution environment.
2.  **Serve Files:** Serve the project directory via a local web server. The easiest way is using `http-server`:
    ```bash
    npx http-server .
    ```
3.  **Open the App:** Open your browser and navigate to the address provided by the server (usually `http://localhost:8080`).
    
---

## 3. Automated Translation Fix (Very Important)

A special program has been prepared for you that fixes all translation problems in the application with a single click. This program is very safe and makes a full backup of your files before it begins.

### How to use it? (Very simple explanation)

1.  Open the Terminal in your project folder.
2.  Type the following command and press Enter:

    ```bash
    node fix-translations.js
    ```

That's it! The program will run automatically and explain every step it takes. When it's finished, your application will be unified and fully ready.

**For Safety:** If you don't like the changes, you can restore everything from the created `backup` folder.

---

## 4. Usage

- **Navigation:** Use the sidebar (or bottom bar on mobile) to navigate between different modules.
- **Change Language & Theme:** Use the icons in the top header to switch between languages and themes (light/dark).
- **Customize Dashboard:** Click the "Customize" icon on the dashboard to rearrange, add, or remove widgets.
- **Use AI Features:** Navigate to the "AI & Automation" module to explore the advanced tools.

---

## 5. Architecture

The project follows a simple architecture based on React and TypeScript, with modules loaded via an `importmap`.

- **`index.html`**: The main entry point of the application.
- **`index.tsx`**: The entry point for React.
- **`App.tsx`**: The main component that manages global state.
- **`components/`**: Contains all React components.
- **`hooks/`**: Contains custom hooks.
- **`data/`**: Contains mock and static data.
- **`lib/`**: Contains utility functions and core logic.
- **`lib/locales/`**: JSON translation files for each supported language.

### Data Flow

1.  **`DashboardProvider`**: Provides a global context for the app.
2.  **`localStorage`**: Used to persist user state and cache modified data.
3.  **Data Hooks (`use...Data`)**: These hooks are used to fetch and manage data, simulating caching and updates.

---

## 6. APIs

- **Google Gemini API**: Used for all AI features.
- **LocalStorage API**: Used to simulate a client-side database.

---

## 7. Deployment

The application consists of static files. It can be deployed on any static hosting service like Vercel, Netlify, GitHub Pages, or a private web server.

---

## 8. Contributing

Contributions are welcome!

1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 9. License

Distributed under the MIT License. See `LICENSE` for more information.

</details>
# gms-ai
