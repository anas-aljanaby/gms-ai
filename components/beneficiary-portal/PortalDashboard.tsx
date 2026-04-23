import React from 'react';

const PortalDashboard: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-2">مرحباً بك في بوابتك الشخصية! 👋</h1>
        <p className="text-blue-100">تابع تقدمك وإنجازاتك من مكان واحد</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex justify-between items-start mb-2">
            <span className="text-gray-600 text-sm">التقدم الأكاديمي</span>
            <span className="text-2xl">🎯</span>
          </div>
          <div className="text-3xl font-bold text-blue-600">85%</div>
          <div className="text-xs text-green-600 mt-1">↑ 5% هذا الشهر</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex justify-between items-start mb-2">
            <span className="text-gray-600 text-sm">نسبة الحضور</span>
            <span className="text-2xl">✅</span>
          </div>
          <div className="text-3xl font-bold text-green-600">92%</div>
          <div className="text-xs text-gray-500 mt-1">18/20 جلسة</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex justify-between items-start mb-2">
            <span className="text-gray-600 text-sm">المشاريع</span>
            <span className="text-2xl">📊</span>
          </div>
          <div className="text-3xl font-bold text-purple-600">3/4</div>
          <div className="text-xs text-orange-600 mt-1">1 قيد التنفيذ</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex justify-between items-start mb-2">
            <span className="text-gray-600 text-sm">الترتيب</span>
            <span className="text-2xl">🏆</span>
          </div>
          <div className="text-3xl font-bold text-yellow-600">#3</div>
          <div className="text-xs text-gray-500 mt-1">من 45 مستفيد</div>
        </div>
      </div>

      {/* Urgent Tasks */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl shadow-lg p-6 border-r-4 border-red-500">
        <div className="flex items-center mb-4">
          <span className="text-2xl ml-3">🔥</span>
          <h2 className="text-xl font-bold text-gray-800">مهام عاجلة</h2>
        </div>
        
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 space-x-reverse">
                <span className="text-red-500 text-xl">⚠️</span>
                <div>
                  <h3 className="font-semibold text-gray-800">تسليم مشروع القيادة</h3>
                  <p className="text-sm text-gray-600 mt-1">متبقي 3 أيام - الأولوية: عالية</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                عرض →
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 space-x-reverse">
                <span className="text-yellow-500 text-xl">📝</span>
                <div>
                  <h3 className="font-semibold text-gray-800">استبيان تقييم الأداء</h3>
                  <p className="text-sm text-gray-600 mt-1">جديد - 10 دقائق فقط</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                ابدأ →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">📅 النشاطات الأخيرة</h3>
        <div className="space-y-3">
          {[
            { icon: '✅', text: 'حضرت ورشة التفكير الاستراتيجي', time: 'منذ ساعتين', color: 'green' },
            { icon: '📝', text: 'سلمت تقرير المشروع الثاني', time: 'أمس', color: 'blue' },
            { icon: '🎯', text: 'حصلت على 95% في التقييم', time: 'منذ 3 أيام', color: 'purple' },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <span className={`text-2xl ml-3 ${activity.color}`}>{activity.icon}</span>
              <div className="flex-1">
                <div className="font-medium text-gray-800">{activity.text}</div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortalDashboard;