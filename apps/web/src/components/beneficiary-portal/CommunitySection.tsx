import React from 'react';

const CommunitySection: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: '👥', label: 'مستفيدين نشطين', value: '45', color: 'blue' },
          { icon: '🌍', label: 'دول ممثلة', value: '12', color: 'green' },
          { icon: '🤝', label: 'مجموعات', value: '8', color: 'purple' },
          { icon: '🎉', label: 'فعاليات قادمة', value: '5', color: 'orange' },
        ].map(stat => (
          <div key={stat.label} className={`bg-white rounded-xl shadow-md p-6 border-t-4 border-${stat.color}-500 hover:shadow-lg transition-shadow`}>
            <div className="text-4xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Groups */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <span className="text-2xl ml-2">🤝</span>
          المجموعات والأندية
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { 
              name: 'نادي التقنية والذكاء الاصطناعي', 
              members: 24, 
              activity: 'نشط',
              icon: '💻',
              joined: true,
              nextEvent: 'ورشة عمل - غداً'
            },
            { 
              name: 'مجموعة الطلاب المصريين', 
              members: 18, 
              activity: 'نشط جداً',
              icon: '🇪🇬',
              joined: false,
              nextEvent: 'لقاء شهري - الأحد'
            },
            { 
              name: 'نادي ريادة الأعمال', 
              members: 32, 
              activity: 'نشط',
              icon: '🚀',
              joined: true,
              nextEvent: 'مسابقة أفكار - الأسبوع القادم'
            },
            { 
              name: 'مجموعة القراءة والثقافة', 
              members: 15, 
              activity: 'متوسط',
              icon: '📚',
              joined: false,
              nextEvent: 'نقاش كتاب - الخميس'
            },
          ].map((group, idx) => (
            <div key={idx} className="border-2 rounded-xl p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <span className="text-4xl">{group.icon}</span>
                  <div>
                    <div className="font-bold text-gray-800">{group.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{group.members} عضو • {group.activity}</div>
                    {group.nextEvent && (
                      <div className="text-xs text-blue-600 mt-1">📅 {group.nextEvent}</div>
                    )}
                  </div>
                </div>
              </div>
              <button className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
                group.joined 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
              }`}>
                {group.joined ? '✓ منضم' : 'انضم للمجموعة'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <span className="text-2xl ml-2">🎉</span>
          الفعاليات القادمة
        </h3>
        
        <div className="space-y-4">
          {[
            {
              title: 'لقاء تعارف للطلاب الجدد',
              date: '18 يناير 2025',
              time: '6:00 مساءً',
              location: 'قاعة المؤتمرات',
              attendees: 28,
              category: 'اجتماعي',
              color: 'blue'
            },
            {
              title: 'ورشة تطوير المهارات القيادية',
              date: '20 يناير 2025',
              time: '4:00 مساءً',
              location: 'مركز التدريب',
              attendees: 35,
              category: 'تعليمي',
              color: 'purple'
            },
            {
              title: 'رحلة ترفيهية - حديقة الملك عبدالله',
              date: '25 يناير 2025',
              time: '10:00 صباحاً',
              location: 'نقطة التجمع: البوابة الرئيسية',
              attendees: 42,
              category: 'ترفيهي',
              color: 'green'
            },
          ].map((event, idx) => (
            <div key={idx} className={`border-2 border-${event.color}-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-${event.color}-50/30`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 space-x-reverse mb-2">
                    <h4 className="font-bold text-gray-800">{event.title}</h4>
                    <span className={`px-2 py-1 bg-${event.color}-100 text-${event.color}-700 rounded text-xs font-medium`}>
                      {event.category}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center">
                      <span className="ml-2">📅</span>
                      {event.date} • ⏰ {event.time}
                    </div>
                    <div className="flex items-center">
                      <span className="ml-2">📍</span>
                      {event.location}
                    </div>
                    <div className="flex items-center">
                      <span className="ml-2">👥</span>
                      {event.attendees} مسجل
                    </div>
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 hover:shadow-lg text-sm font-semibold whitespace-nowrap transition-all">
                  سجّل حضورك
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mentorship Program */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <span className="text-3xl ml-3">🎓</span>
          برنامج الإرشاد (Mentorship)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/20 backdrop-blur rounded-xl p-4">
            <div className="flex items-center space-x-3 space-x-reverse mb-3">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl">
                👨‍🏫
              </div>
              <div>
                <div className="font-bold">د. محمد السالم</div>
                <div className="text-sm opacity-90">مرشدك الأكاديمي</div>
              </div>
            </div>
            <button className="w-full bg-white text-purple-600 py-2 rounded-lg hover:bg-gray-100 font-semibold">
              حجز موعد استشارة
            </button>
          </div>

          <div className="bg-white/20 backdrop-blur rounded-xl p-4">
            <div className="text-center mb-3">
              <div className="text-3xl mb-2">🌟</div>
              <div className="font-bold">كن مرشداً</div>
              <p className="text-xs opacity-90 mt-1">شارك خبراتك وساعد الآخرين على النمو</p>
            </div>
            <button className="w-full bg-white/50 text-white py-2 rounded-lg hover:bg-white/70 hover:text-purple-600 font-semibold transition-colors">
              قدم الآن
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CommunitySection;