import React from 'react';
import { Wallet, CheckCircle2, BarChart3, AlertTriangle, Handshake, Lightbulb, Target, ScrollText } from 'lucide-react';

const FinancialSection: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Financial Overview Header */}
      <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Wallet size={28} className="ml-3" />
          الخدمات المالية
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/20 backdrop-blur rounded-xl p-4">
            <div className="text-sm opacity-90 mb-2">الدعم الشهري</div>
            <div className="text-3xl font-bold">5,000 ر.س</div>
            <div className="text-xs mt-2 flex items-center"><CheckCircle2 size={12} className="ml-1" /> تم التحويل في 1 يناير</div>
          </div>
          
          <div className="bg-white/20 backdrop-blur rounded-xl p-4">
            <div className="text-sm opacity-90 mb-2">المنصرف حتى الآن</div>
            <div className="text-3xl font-bold">3,200 ر.س</div>
            <div className="text-xs mt-2 flex items-center"><BarChart3 size={12} className="ml-1" /> 64% من الميزانية</div>
          </div>
          
          <div className="bg-white/20 backdrop-blur rounded-xl p-4">
            <div className="text-sm opacity-90 mb-2">الرصيد المتبقي</div>
            <div className="text-3xl font-bold">1,800 ر.س</div>
            <div className="text-xs mt-2 flex items-center"><AlertTriangle size={12} className="ml-1" /> كافي ل 18 يوم</div>
          </div>
        </div>
      </div>

      {/* Sponsor Info */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Handshake size={24} className="ml-2" />
          معلومات الكفيل
        </h3>
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              م
            </div>
            <div>
              <h4 className="font-bold text-gray-800">مؤسسة الخير للتنمية</h4>
              <p className="text-sm text-gray-600">كفيل مؤسسي</p>
              <p className="text-xs text-gray-500">منذ يناير 2024</p>
            </div>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">
            إرسال رسالة شكر
          </button>
        </div>
      </div>

      {/* Spending Analysis */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center"><BarChart3 size={20} className="ml-2" />تحليل المصروفات (AI)</h3>
          <span className="text-sm text-gray-500">هذا الشهر</span>
        </div>
        
        <div className="space-y-4">
          {[
            { category: 'السكن', amount: 1500, percentage: 47, color: 'blue', trend: 'stable' },
            { category: 'الطعام', amount: 800, percentage: 25, color: 'green', trend: 'up' },
            { category: 'المواصلات', amount: 400, percentage: 12, color: 'yellow', trend: 'stable' },
            { category: 'الكتب والأدوات', amount: 300, percentage: 9, color: 'purple', trend: 'down' },
            { category: 'أخرى', amount: 200, percentage: 7, color: 'gray', trend: 'stable' },
          ].map(item => (
            <div key={item.category}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium flex items-center">
                  {item.category}
                  {item.trend === 'up' && <span className="text-xs text-red-500 mr-1">↑</span>}
                  {item.trend === 'down' && <span className="text-xs text-green-500 mr-1">↓</span>}
                </span>
                <span className="text-sm text-gray-600">{item.amount} ر.س ({item.percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`bg-${item.color}-500 h-2.5 rounded-full transition-all`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Recommendation */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start">
            <Lightbulb size={24} className="ml-3" />
            <div>
              <div className="font-semibold text-gray-800 mb-1">توصية ذكية من AI</div>
              <div className="text-sm text-gray-600">
                مصروفات الطعام أعلى من المتوسط بنسبة 15%. جرب الطبخ المنزلي مع زملائك لتوفير حوالي 200 ر.س شهرياً.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center"><ScrollText size={20} className="ml-2" />سجل المدفوعات</h3>
        
        <div className="space-y-3">
          {[
            { date: '2025-01-01', amount: 5000, status: 'مكتمل', type: 'دعم شهري', method: 'تحويل بنكي' },
            { date: '2024-12-01', amount: 5000, status: 'مكتمل', type: 'دعم شهري', method: 'تحويل بنكي' },
            { date: '2024-11-15', amount: 2000, status: 'مكتمل', type: 'دعم استثنائي', method: 'تحويل بنكي' },
            { date: '2024-11-01', amount: 5000, status: 'مكتمل', type: 'دعم شهري', method: 'تحويل بنكي' },
          ].map((payment, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{payment.type}</div>
                  <div className="text-sm text-gray-500">{payment.date} • {payment.method}</div>
                </div>
              </div>
              <div className="text-left">
                <div className="font-bold text-green-600">{payment.amount.toLocaleString('en-US')} ر.س</div>
                <div className="text-xs text-gray-500">{payment.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Goals */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center"><Target size={20} className="ml-2" />الأهداف المالية</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-xl">
            <div className="flex justify-between mb-2">
              <span className="font-medium">صندوق الطوارئ</span>
              <span className="text-sm text-gray-600">70%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div className="bg-blue-600 h-3 rounded-full" style={{width: '70%'}}></div>
            </div>
            <div className="text-sm text-gray-600">3,500 من 5,000 ر.س</div>
          </div>

          <div className="p-4 bg-purple-50 rounded-xl">
            <div className="flex justify-between mb-2">
              <span className="font-medium">جهاز كمبيوتر جديد</span>
              <span className="text-sm text-gray-600">45%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div className="bg-purple-600 h-3 rounded-full" style={{width: '45%'}}></div>
            </div>
            <div className="text-sm text-gray-600">2,250 من 5,000 ر.س</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSection;