import type { Language } from '../types';

export interface GRIQuestion {
  category: 'organizational' | 'governance' | 'economic' | 'environmental' | 'social' | 'other';
  disclosureId: string;
  disclosureTitle: string;
  questionId: string;
  questionText: string;
  questionType: 'text' | 'number' | 'currency' | 'mixed';
  required: boolean;
  helpText: string;
  validationRules?: any;
}

export const sampleGRIQuestions: GRIQuestion[] = [
    {
      category: 'organizational',
      disclosureId: '2-1',
      disclosureTitle: 'تفاصيل المنظمة',
      questionId: 'q1',
      questionText: 'ما هو الاسم القانوني الكامل للمنظمة كما هو مسجل رسمياً؟',
      questionType: 'text',
      required: true,
      helpText: 'يجب أن يكون الاسم مطابقاً تماماً للوثائق الرسمية',
      validationRules: { minLength: 3 }
    },
    {
      category: 'organizational',
      disclosureId: '2-1',
      disclosureTitle: 'تفاصيل المنظمة',
      questionId: 'q2',
      questionText: 'ما هو رقم التسجيل الرسمي للمنظمة؟',
      questionType: 'text',
      required: true,
      helpText: 'رقم التسجيل في الجهات الرسمية',
      validationRules: { minLength: 5 }
    },
    {
      category: 'organizational',
      disclosureId: '2-7',
      disclosureTitle: 'الموظفون',
      questionId: 'q3',
      questionText: 'ما هو توزيع الموظفين في المنظمة؟ (الإجمالي، حسب الجنس، حسب نوع العقد)',
      questionType: 'mixed',
      required: true,
      helpText: 'يرجى إدخال الأعداد الصحيحة لكل فئة',
      validationRules: { min: 0 }
    },
    {
      category: 'economic',
      disclosureId: '201-1',
      disclosureTitle: 'القيمة الاقتصادية المباشرة',
      questionId: 'q4',
      questionText: 'ما هو إجمالي الإيرادات للسنة المالية الأخيرة؟',
      questionType: 'currency',
      required: true,
      helpText: 'المبلغ بالعملة المحلية من البيانات المالية المدققة',
      validationRules: { min: 0 }
    },
    {
      category: 'social',
      disclosureId: '404-1',
      disclosureTitle: 'متوسط ساعات التدريب',
      questionId: 'q5',
      questionText: 'ما هو إجمالي عدد ساعات التدريب المقدمة للموظفين خلال السنة؟',
      questionType: 'number',
      required: true,
      helpText: 'يشمل جميع أنواع التدريب (داخلي/خارجي/إلكتروني)',
      validationRules: { min: 0 }
    }
];
