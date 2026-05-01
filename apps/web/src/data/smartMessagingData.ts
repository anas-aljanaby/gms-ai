
import type { MessageTemplate } from '../types';

export const MOCK_MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    template_id: 1,
    template_name: "Thank You - Hero Donor - AR",
    donor_category: "Hero Donor",
    message_type: "thank_you",
    language: "ar",
    subject_template: "{donor_name}، أنت بطل حقيقي! تأثيرك وصل لمئات الشباب",
    body_template: `السلام عليكم {donor_name} الفارسي، أنت بطل حقيقي! تأثيرك وصل لمئات الشباب.

بفضل تبرعك السخي الأخير، تمكنا من:
✓ تدريب عشرات الشباب القيادي
✓ إقامة مخيم كشفي شارك فيه ما يزيد عن مائة مشارك
✓ تقديم مئات الساعات التدريبية

قصة نجاح من تبرعك:
أحمد، شاب بعمر 18 عام، كان أحد المستفيدين المباشرين من برنامج القيادة للشباب الذي دعمته. لقد كان أحمد مثالاً للتفاني، وبتدريبه أصبح الآن أكثر ثقة وقدرة على المساهمة في مجتمعه. أنت الآن ضمن أحد أهم داعمينا الأوفياء منذ 39 شهر.

تأثيرك التراكمي: 15250 دولار = خلق فرص تعليمية وتدريبية لمئات الشباب.

بكل الامتنان والتقدير،
فريق [اسم المنظمة]`,
    variables_used: ["donor_name", "last_donation_amount", "beneficiary_name", "age", "program_name", "beneficiary_story", "loyalty_months", "total_donated"],
    tone: "formal",
    created_at: new Date().toISOString(),
    success_rate: 85.5
  },
  {
    template_id: 2,
    template_name: "Re-engagement - Dormant Donor - EN",
    donor_category: "Dormant Donor",
    message_type: "re_engagement",
    language: "en",
    subject_template: "{donor_name}, we miss you! See how your donation changed a life",
    body_template: `Dear {donor_name},\n\nIt's been a while since your last donation, and we wanted to show you the incredible difference your past support made...\n\nYour gift helped a young student named Omar receive the books he needed for his final year. He has now graduated with honors!\n\nWould you consider rejoining us to help another student like Omar?`,
    variables_used: ["donor_name"],
    tone: "warm",
    created_at: new Date().toISOString(),
    success_rate: 35.2
  },
  // Add more templates for other languages and types
  {
    template_id: 3,
    template_name: "Thank You - Hero Donor - EN",
    donor_category: "Hero Donor",
    message_type: "thank_you",
    language: "en",
    subject_template: "{donor_name}, you're a true hero! Your impact has reached hundreds of youths.",
    body_template: `Hello {donor_name},\n\nYou are a true hero! Your impact has reached hundreds of young people.\n\nThanks to your generous last donation, we were able to:\n✓ Train dozens of youth leaders\n✓ Hold a scout camp with over 100 participants\n✓ Provide hundreds of training hours\n\nA success story from your donation:\nAhmed, an 18-year-old, was a direct beneficiary of the youth leadership program you supported. He was a model of dedication, and with his training, he is now more confident and able to contribute to his community.\n\nYou are now among our most loyal supporters for 39 months.\n\nYour cumulative impact: $15,250 = Creating educational and training opportunities for hundreds of youths.\n\nWith all gratitude and appreciation,\nThe [Organization Name] Team`,
    variables_used: ["donor_name"],
    tone: "formal",
    created_at: new Date().toISOString(),
    success_rate: 85.0
  },
  {
    template_id: 4,
    template_name: "Request - General Donor - AR",
    donor_category: "General Donor",
    message_type: "request",
    language: "ar",
    subject_template: "مساهمتك يمكن أن تغير حياة اليوم",
    body_template: `مرحباً {donor_name}،

نأمل أن تكون بخير. نكتب إليك اليوم لأننا بحاجة إلى دعمك لمشروعنا الجديد [اسم المشروع].

كل تبرع، مهما كان حجمه، يساعدنا على تحقيق أهدافنا وإحداث فرق. هل يمكنك مساعدتنا في الوصول إلى هدفنا؟

شكراً لدعمك المستمر.

مع خالص التقدير،
فريق [اسم المنظمة]`,
    variables_used: ["donor_name"],
    tone: "warm",
    created_at: new Date().toISOString(),
    success_rate: 45.0
  },
  {
    template_id: 5,
    template_name: "Request - General Donor - EN",
    donor_category: "General Donor",
    message_type: "request",
    language: "en",
    subject_template: "Your contribution can change a life today",
    body_template: `Hi {donor_name},\n\nWe hope this message finds you well. We're reaching out today because we need your support for our new project, [Project Name].\n\nEvery donation, no matter the size, helps us achieve our goals and make a difference. Can you help us reach our target?\n\nThank you for your continued support.\n\nBest regards,\nThe [Organization Name] Team`,
    variables_used: ["donor_name"],
    tone: "warm",
    created_at: new Date().toISOString(),
    success_rate: 45.0
  }
];
