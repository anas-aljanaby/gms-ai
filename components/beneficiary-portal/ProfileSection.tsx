import React from 'react';

const ProfileSection: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-blue-600">
            أ
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">أحمد محمد علي</h2>
            <p className="text-blue-100 mb-1">طالب ماجستير - هندسة البرمجيات</p>
            <p className="text-sm text-blue-200">📍 جامعة الملك سعود، الرياض</p>
            
            <div className="flex space-x-2 space-x-reverse mt-3">
              <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm">
                مستوى متقدم
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm">
                نشط
              </span>
            </div>
          </div>
          
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 font-semibold">
            تعديل الملف
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Info */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <span className="text-2xl ml-2">🎓</span>
            المعلومات الأكاديمية
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">التخصص</div>
              <div className="font-semibold">هندسة البرمجيات</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">المرحلة</div>
              <div className="font-semibold">ماجستير - السنة الأولى</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">المعدل التراكمي</div>
              <div className="font-semibold text-green-600">3.85 / 4.00</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">التخرج المتوقع</div>
              <div className="font-semibold">يونيو 2026</div>
            </div>
          </div>

          {/* Skills */}
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-semibold mb-3">💪 المهارات القيادية</h4>
            <div className="flex flex-wrap gap-2">
              {['القيادة', 'التفكير الاستراتيجي', 'العمل الجماعي', 'حل المشكلات', 'التواصل الفعال', 'الابتكار'].map(skill => (
                <span key={skill} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-semibold mb-3">🏆 الإنجازات</h4>
            <div className="space-y-2">
              {[
                'قائمة شرف العميد - خريف 2024',
                'ورقة بحثية منشورة',
                'المركز الأول - هاكاثون الابتكار'
              ].map((achievement, idx) => (
                <div key={idx} className="flex items-center p-2 bg-yellow-50 rounded-lg">
                  <span className="text-xl ml-2">🏅</span>
                  <span className="text-sm">{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Insights */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <span className="text-3xl ml-3">🤖</span>
              <h3 className="text-lg font-bold">توصيات ذكية</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-white/20 backdrop-blur rounded-lg p-3">
                <div className="text-sm font-medium mb-1">مهارة موصى بها</div>
                <div className="text-xs">تعلم Python للأبحاث</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-3">
                <div className="text-sm font-medium mb-1">فرصة متاحة</div>
                <div className="text-xs">تدريب في شركة تقنية</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-3">
                <div className="text-sm font-medium mb-1">منحة موصى بها</div>
                <div className="text-xs">برنامج القيادة المتقدم</div>
              </div>
            </div>
          </div>

          {/* Progress Circle */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h4 className="font-semibold mb-4">📊 التقدم الشامل</h4>
            <div className="flex justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#3b82f6"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56 * 0.85} ${2 * Math.PI * 56}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-blue-600">85%</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-green-600 font-medium">أداء ممتاز!</div>
              <div className="text-xs text-gray-500 mt-1">استمر بنفس الوتيرة</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h4 className="font-semibold mb-3">⚡ إجراءات سريعة</h4>
            <div className="space-y-2">
              <button className="w-full text-right p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium text-blue-700 transition-colors">
                📝 تحديث السيرة الذاتية
              </button>
              <button className="w-full text-right p-3 bg-green-50 hover:bg-green-100 rounded-lg text-sm font-medium text-green-700 transition-colors">
                📧 التواصل مع المرشد
              </button>
              <button className="w-full text-right p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-sm font-medium text-purple-700 transition-colors">
                🎯 تحديث الأهداف
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;