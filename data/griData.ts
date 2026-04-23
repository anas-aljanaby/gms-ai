

export type GriDataType = 'text' | 'descriptive_text' | 'list' | 'date' | 'text_link' | 'numbers_tables' | 'chart_text' | 'yes_no_explanation' | 'numbers' | 'numbers_ratios' | 'description_numbers' | 'numbers_methodology';

export interface GriStandard {
  standard: string;
  disclosureNumber: string;
  title: string;
  description: string;
  dataType: GriDataType;
  required: 'Yes' | 'If applicable' | 'Recommended';
  notes?: string;
  category?: 'Economic' | 'Environmental' | 'Social';
}

export const universalStandards: GriStandard[] = [
  // GRI 1: Foundation 2021
  { standard: 'GRI 1', disclosureNumber: '1-1', title: 'تطبيق معايير GRI', description: 'إعلان المنظمة عن استخدامها لمعايير GRI', dataType: 'text', required: 'Yes', notes: 'يجب أن يتضمن الفترة المشمولة' },
  { standard: 'GRI 1', disclosureNumber: '1-2', title: 'مبادئ الإبلاغ', description: 'وصف كيفية تطبيق مبادئ الإبلاغ', dataType: 'descriptive_text', required: 'Yes', notes: 'الدقة، التوازن، الوضوح، المقارنة، الموثوقية، التوقيت' },
  
  // GRI 2: General Disclosures 2021
  { standard: 'GRI 2', disclosureNumber: '2-1', title: 'تفاصيل المنظمة', description: 'الاسم القانوني، طبيعة الملكية، الموقع', dataType: 'text', required: 'Yes', notes: 'معلومات أساسية' },
  { standard: 'GRI 2', disclosureNumber: '2-2', title: 'الكيانات المشمولة', description: 'قائمة الكيانات المشمولة في التقرير', dataType: 'list', required: 'Yes', notes: '' },
  { standard: 'GRI 2', disclosureNumber: '2-3', title: 'فترة التقرير ودوريته', description: 'تحديد الفترة الزمنية ودورية الإبلاغ', dataType: 'date', required: 'Yes', notes: '' },
  { standard: 'GRI 2', disclosureNumber: '2-4', title: 'إعادة صياغة المعلومات', description: 'توضيح أي تعديلات على معلومات سابقة', dataType: 'text', required: 'If applicable', notes: '' },
  { standard: 'GRI 2', disclosureNumber: '2-5', title: 'التحقق الخارجي', description: 'وصف سياسة وممارسات التحقق', dataType: 'text_link', required: 'Recommended', notes: '' },
  { standard: 'GRI 2', disclosureNumber: '2-6', title: 'الأنشطة وسلسلة القيمة', description: 'وصف القطاعات والمنتجات والخدمات', dataType: 'descriptive_text', required: 'Yes', notes: '' },
  { standard: 'GRI 2', disclosureNumber: '2-7', title: 'الموظفون', description: 'إجمالي عدد الموظفين مع التفاصيل', dataType: 'numbers_tables', required: 'Yes', notes: 'حسب الجنس، نوع العقد، المنطقة' },
  { standard: 'GRI 2', disclosureNumber: '2-8', title: 'العمال غير الموظفين', description: 'معلومات عن المتعاقدين والمتطوعين', dataType: 'numbers', required: 'Yes', notes: '' },
  { standard: 'GRI 2', disclosureNumber: '2-9', title: 'هيكل الحوكمة', description: 'وصف هيكل الحوكمة واللجان', dataType: 'chart_text', required: 'Yes', notes: '' },
  { standard: 'GRI 2', disclosureNumber: '2-10', title: 'ترشيح واختيار مجلس الإدارة', description: 'عملية الترشيح والاختيار', dataType: 'descriptive_text', required: 'Yes', notes: '' },
  { standard: 'GRI 2', disclosureNumber: '2-11', title: 'رئيس مجلس الإدارة', description: 'هل الرئيس تنفيذي أم لا', dataType: 'yes_no_explanation', required: 'Yes', notes: '' },
  
  // GRI 3: Material Topics 2021
  { standard: 'GRI 3', disclosureNumber: '3-1', title: 'عملية تحديد الموضوعات الجوهرية', description: 'وصف العملية المتبعة', dataType: 'descriptive_text', required: 'Yes', notes: 'يتضمن إشراك أصحاب المصلحة' },
  { standard: 'GRI 3', disclosureNumber: '3-2', title: 'قائمة الموضوعات الجوهرية', description: 'قائمة بجميع الموضوعات المحددة', dataType: 'list', required: 'Yes', notes: 'مرتبة حسب الأهمية' },
  { standard: 'GRI 3', disclosureNumber: '3-3', title: 'إدارة الموضوعات الجوهرية', description: 'كيف تدير المنظمة كل موضوع', dataType: 'text', required: 'Yes', notes: '' },
];

export const topicStandards: GriStandard[] = [
  // Economic Standards (200 series)
  // FIX: Changed category from 'اقتصادي' to 'Economic' to match the type definition.
  { category: 'Economic', standard: 'GRI 201', disclosureNumber: '201-1', title: 'القيمة الاقتصادية المباشرة', description: 'الإيرادات، التكاليف، الأجور، الاستثمارات المجتمعية', dataType: 'numbers_tables', required: 'Yes' },
  // FIX: Changed category from 'اقتصادي' to 'Economic' to match the type definition.
  { category: 'Economic', standard: 'GRI 201', disclosureNumber: '201-2', title: 'الآثار المالية لتغير المناخ', description: 'المخاطر والفرص المالية', dataType: 'text', required: 'If applicable' },
  // FIX: Changed category from 'اقتصادي' to 'Economic' to match the type definition.
  { category: 'Economic', standard: 'GRI 201', disclosureNumber: '201-3', title: 'التزامات خطط المعاشات', description: 'تغطية التزامات المنظمة', dataType: 'numbers_ratios', required: 'If applicable' },
  // FIX: Changed category from 'اقتصادي' to 'Economic' to match the type definition.
  { category: 'Economic', standard: 'GRI 201', disclosureNumber: '201-4', title: 'المساعدة المالية من الحكومة', description: 'المنح، الإعانات، الحوافز الضريبية', dataType: 'numbers', required: 'Yes' },
  // FIX: Changed category from 'اقتصادي' to 'Economic' to match the type definition.
  { category: 'Economic', standard: 'GRI 203', disclosureNumber: '203-1', title: 'استثمارات البنية التحتية', description: 'تطوير البنية التحتية والخدمات', dataType: 'description_numbers', required: 'Recommended' },
  // FIX: Changed category from 'اقتصادي' to 'Economic' to match the type definition.
  { category: 'Economic', standard: 'GRI 203', disclosureNumber: '203-2', title: 'الآثار الاقتصادية غير المباشرة', description: 'الأثر على المجتمعات المحلية', dataType: 'descriptive_text', required: 'Recommended' },
  // FIX: Changed category from 'اقتصادي' to 'Economic' to match the type definition.
  { category: 'Economic', standard: 'GRI 205', disclosureNumber: '205-1', title: 'تقييم مخاطر الفساد', description: 'العمليات التي تم تقييمها', dataType: 'numbers_ratios', required: 'Yes' },
  // FIX: Changed category from 'اقتصادي' to 'Economic' to match the type definition.
  { category: 'Economic', standard: 'GRI 205', disclosureNumber: '205-2', title: 'التواصل والتدريب على مكافحة الفساد', description: 'نسبة المدربين', dataType: 'numbers_ratios', required: 'Yes' },
  // FIX: Changed category from 'اقتصادي' to 'Economic' to match the type definition.
  { category: 'Economic', standard: 'GRI 205', disclosureNumber: '205-3', title: 'حوادث الفساد المؤكدة', description: 'عدد الحوادث والإجراءات', dataType: 'numbers', required: 'Yes' },
  
  // Environmental Standards (300 series)
  // FIX: Changed category from 'بيئي' to 'Environmental' to match the type definition.
  { category: 'Environmental', standard: 'GRI 301', disclosureNumber: '301-1', title: 'المواد المستخدمة', description: 'الوزن أو الحجم', dataType: 'numbers_tables', required: 'If applicable' },
  // FIX: Changed category from 'بيئي' to 'Environmental' to match the type definition.
  { category: 'Environmental', standard: 'GRI 302', disclosureNumber: '302-1', title: 'استهلاك الطاقة', description: 'استهلاك الطاقة داخل المنظمة', dataType: 'numbers', required: 'Recommended' },
  // FIX: Changed category from 'بيئي' to 'Environmental' to match the type definition.
  { category: 'Environmental', standard: 'GRI 303', disclosureNumber: '303-1', title: 'التفاعل مع المياه', description: 'كيفية إدارة المياه', dataType: 'descriptive_text', required: 'If applicable' },
  // FIX: Changed category from 'بيئي' to 'Environmental' to match the type definition.
  { category: 'Environmental', standard: 'GRI 305', disclosureNumber: '305-1', title: 'انبعاثات غازات الدفيئة المباشرة', description: 'النطاق 1', dataType: 'numbers_methodology', required: 'Recommended' },
  // FIX: Changed category from 'بيئي' to 'Environmental' to match the type definition.
  { category: 'Environmental', standard: 'GRI 306', disclosureNumber: '306-1', title: 'توليد النفايات', description: 'أنواع وكميات النفايات', dataType: 'numbers_tables', required: 'If applicable' },
  
  // Social Standards (400 series)
  // FIX: Changed category from 'اجتماعي' to 'Social' to match the type definition.
  { category: 'Social', standard: 'GRI 401', disclosureNumber: '401-1', title: 'الموظفون الجدد ومعدل الدوران', description: 'التوظيف والمغادرين', dataType: 'numbers_ratios', required: 'Yes' },
  // FIX: Changed category from 'اجتماعي' to 'Social' to match the type definition.
  { category: 'Social', standard: 'GRI 401', disclosureNumber: '401-2', title: 'المزايا للموظفين', description: 'المزايا المقدمة', dataType: 'list', required: 'Yes' },
  // FIX: Changed category from 'اجتماعي' to 'Social' to match the type definition.
  { category: 'Social', standard: 'GRI 401', disclosureNumber: '401-3', title: 'إجازة الوالدية', description: 'معدلات الاستخدام والعودة', dataType: 'numbers_ratios', required: 'Yes' },
  // FIX: Changed category from 'اجتماعي' to 'Social' to match the type definition.
  { category: 'Social', standard: 'GRI 403', disclosureNumber: '403-1', title: 'نظام إدارة الصحة والسلامة', description: 'وصف النظام', dataType: 'descriptive_text', required: 'Yes' },
  // FIX: Changed category from 'اجتماعي' to 'Social' to match the type definition.
  { category: 'Social', standard: 'GRI 404', disclosureNumber: '404-1', title: 'متوسط ساعات التدريب', description: 'لكل موظف سنوياً', dataType: 'numbers', required: 'Yes' },
  // FIX: Changed category from 'اجتماعي' to 'Social' to match the type definition.
  { category: 'Social', standard: 'GRI 405', disclosureNumber: '405-1', title: 'التنوع في الحوكمة والموظفين', description: 'التوزيع حسب الجنس والعمر', dataType: 'numbers_tables', required: 'Yes' },
  // FIX: Changed category from 'اجتماعي' to 'Social' to match the type definition.
  { category: 'Social', standard: 'GRI 413', disclosureNumber: '413-1', title: 'مشاركة المجتمع المحلي', description: 'البرامج المجتمعية', dataType: 'text', required: 'Recommended' },
  // FIX: Changed category from 'اجتماعي' to 'Social' to match the type definition.
  { category: 'Social', standard: 'GRI 414', disclosureNumber: '414-1', title: 'تقييم الموردين اجتماعياً', description: 'نسبة الموردين المقيّمين', dataType: 'numbers_ratios', required: 'If applicable' },
];
