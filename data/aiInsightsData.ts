import type { Language } from '../types';

export interface AiInsightItem {
  text: Record<Language, string>;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
}

export interface AiInsightsData {
  opportunities: AiInsightItem[];
  alerts: AiInsightItem[];
  recommendations: AiInsightItem[];
  predictions: AiInsightItem[];
}

export const MOCK_AI_INSIGHTS: AiInsightsData = {
  opportunities: [
    {
      text: {
        en: "**Aisha Al-Farsi** shows high engagement. Consider soliciting for a major gift for the 'Education for All' campaign.",
        ar: "**عائشة الفارسي** تُظهر تفاعلاً عاليًا. فكر في طلب هبة كبيرة لحملة 'التعليم للجميع'.",
        tr: "**Aisha Al-Farsi** yüksek etkileşim gösteriyor. 'Herkes İçin Eğitim' kampanyası için büyük bir bağış talep etmeyi düşünün."
      },
      confidence: 0.85,
      impact: "high"
    },
    {
      text: {
        en: "3 donors in the 'Cultivating' stage have not been contacted in over 60 days. A follow-up is recommended.",
        ar: "3 مانحين في مرحلة 'تنمية العلاقة' لم يتم التواصل معهم منذ أكثر من 60 يومًا. يوصى بالمتابعة.",
        tr: "'İlişki Geliştirme' aşamasındaki 3 bağışçıyla 60 günden fazla süredir temas kurulmadı. Takip önerilir."
      },
      confidence: 0.95,
      impact: "medium"
    }
  ],
  alerts: [
    {
      text: {
        en: "Project **'PROJ-2024-001'** is trending 15% over budget on its current burn rate.",
        ar: "مشروع **'PROJ-2024-001'** يتجه لتجاوز الميزانية بنسبة 15% بناءً على معدل الصرف الحالي.",
        tr: "Proje **'PROJ-2024-001'** mevcut harcama oranıyla bütçeyi %15 aşma eğiliminde."
      },
      confidence: 0.98,
      impact: "high"
    },
    {
      text: {
        en: "**Fatma Yılmaz** is at high risk of lapsing. Her last donation was over 8 months ago.",
        ar: "**فاطمة يلماز** في خطر كبير للانقطاع. آخر تبرع لها كان قبل أكثر من 8 أشهر.",
        tr: "**Fatma Yılmaz**'ın bağışı kesme riski yüksek. Son bağışının üzerinden 8 aydan fazla geçti."
      },
      confidence: 0.92,
      impact: "medium"
    }
  ],
  recommendations: [
    {
      text: {
        en: "Launch a targeted re-engagement campaign for 'Dormant Donors' focusing on the 'Healthcare' program, their past interest.",
        ar: "أطلق حملة إعادة تفاعل مستهدفة لـ 'المانحين الخاملين' مع التركيز على برنامج 'الرعاية الصحية'، اهتمامهم السابق.",
        tr: "'Pasif Bağışçılar' için geçmişteki ilgi alanları olan 'Sağlık Hizmetleri' programına odaklanan hedefli bir yeniden etkileşim kampanyası başlatın."
      },
      confidence: 0.78,
      impact: "high"
    },
    {
      text: {
        en: "Assign a dedicated manager to **David Chen** due to his high potential and recent major gift.",
        ar: "قم بتعيين مدير مخصص لـ **ديفيد تشين** نظرًا لإمكانياته العالية وهبته الكبيرة الأخيرة.",
        tr: "Yüksek potansiyeli ve son büyük bağışı nedeniyle **David Chen**'e özel bir yönetici atayın."
      },
      confidence: 0.90,
      impact: "medium"
    }
  ],
  predictions: [
    {
      text: {
        en: "Predicting a 10-15% increase in online donations in Q4 based on historical data and current engagement trends.",
        ar: "نتوقع زيادة بنسبة 10-15% في التبرعات عبر الإنترنت في الربع الرابع بناءً على البيانات التاريخية واتجاهات التفاعل الحالية.",
        tr: "Tarihsel verilere ve mevcut etkileşim trendlerine dayanarak 4. çeyrekte çevrimiçi bağışlarda %10-15'lik bir artış öngörülüyor."
      },
      confidence: 0.82,
      impact: "low"
    },
    {
      text: {
        en: "Volunteer engagement is forecasted to dip in August. Plan a recognition event to boost morale.",
        ar: "من المتوقع أن ينخفض تفاعل المتطوعين في أغسطس. خطط لفعالية تقدير لرفع الروح المعنوية.",
        tr: "Gönüllü katılımının Ağustos ayında düşmesi bekleniyor. Morali artırmak için bir tanınma etkinliği planlayın."
      },
      confidence: 0.75,
      impact: "medium"
    }
  ]
};
