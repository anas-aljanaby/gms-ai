import React, { useState, useMemo, useEffect } from 'react';
import type { LeadershipData, Event, EventCategory, EventType, TeamMember, StudentProject, Beneficiary } from '../../../types';
import { useLocalization } from '../../../hooks/useLocalization';
import { ChevronDownIcon, PlusCircleIcon } from '../../icons/GenericIcons';
import { EVENT_TYPES } from '../../../constants';
import { eventTypeToIcon } from '../../icons/LeadershipIcons';

interface BeneficiaryCalendarViewProps {
  beneficiary: Beneficiary;
  leadershipData: LeadershipData;
  dispatch: React.Dispatch<any>;
}

type CalendarItem = (Event | (StudentProject & { startDate: string })) & { source: string; itemType: 'event' | 'project' };

const unitColors: Record<string, { bg: string, text: string, border: string }> = {
    educational: { bg: 'bg-blue-500', text: 'text-blue-800', border: 'border-blue-500' },
    leadership: { bg: 'bg-green-500', text: 'text-green-800', border: 'border-green-500' },
    scout: { bg: 'bg-purple-500', text: 'text-purple-800', border: 'border-purple-500' },
    student_environment: { bg: 'bg-yellow-500', text: 'text-yellow-800', border: 'border-yellow-500' },
    'student-project': { bg: 'bg-orange-500', text: 'text-orange-800', border: 'border-orange-500' },
};

// AddEventModal Sub-Component
const AddEventModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: Omit<Event, 'id' | 'status'>) => void;
  selectedDate: Date;
  leadershipData: LeadershipData;
}> = ({ isOpen, onClose, onSubmit, selectedDate, leadershipData }) => {
    const { t, language } = useLocalization();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<EventCategory>('educational');
    const [type, setType] = useState<EventType>('lecture');
    const [facilitator, setFacilitator] = useState<TeamMember | null>(null);
    const [location, setLocation] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    
    const allTeamMembers = useMemo(() => leadershipData.units.flatMap(u => u.team), [leadershipData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !category || !type || !facilitator) {
            alert(t('leadership.calendar.form.requiredFields'));
            return;
        }
        onSubmit({
            title: { en: title, ar: title}, // Simple title for all langs
            category,
            type,
            facilitator,
            date: selectedDate.toISOString(),
            startTime,
            location,
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-card dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-lg m-4 p-6" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">{t('leadership.calendar.addNewEvent')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">{t('leadership.calendar.form.eventTitle')}*</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700"/>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">{t('leadership.calendar.form.eventCategory')}*</label>
                            <select value={category} onChange={e => setCategory(e.target.value as EventCategory)} className="mt-1 block w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700">
                                {leadershipData.units.map(u => <option key={u.id} value={u.id}>{u.name[language]}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">{t('leadership.calendar.form.eventType')}*</label>
                            <select value={type} onChange={e => setType(e.target.value as EventType)} className="mt-1 block w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700">
                                {EVENT_TYPES.map(et => <option key={et.id} value={et.id}>{t(`leadership.eventTypes.${et.id}`)}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">{t('leadership.calendar.form.date')}*</label>
                            <input type="text" value={selectedDate.toLocaleDateString(language)} readOnly className="mt-1 block w-full p-2 border rounded-md bg-gray-100 dark:bg-slate-900 dark:border-slate-700 cursor-not-allowed"/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium">{t('leadership.calendar.form.startTime')}</label>
                            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="mt-1 block w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700"/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">{t('leadership.calendar.form.facilitator')}*</label>
                        <select onChange={e => setFacilitator(allTeamMembers.find(m => m.id === e.target.value) || null)} required className="mt-1 block w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700">
                            <option value="">{t('leadership.calendar.form.selectFacilitator')}</option>
                            {allTeamMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">{t('leadership.calendar.form.location')}</label>
                        <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="mt-1 block w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700"/>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-sm font-semibold">{t('leadership.calendar.form.cancel')}</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark">{t('leadership.calendar.form.createEvent')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CalendarTooltip: React.FC<{ info: { top: number; left: number; items: CalendarItem[] } | null }> = ({ info }) => {
    const { language } = useLocalization();
    if (!info) return null;

    return (
        <div
            style={{ top: `${info.top}px`, left: `${info.left}px` }}
            className="fixed z-50 p-3 bg-slate-900/90 dark:bg-black/80 backdrop-blur-sm text-white text-sm rounded-lg shadow-xl w-64 transform -translate-x-1/2 -translate-y-full -mt-2 animate-fade-in-fast pointer-events-none"
        >
            <ul className="space-y-2">
                {info.items.map(item => (
                    <li key={item.id} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${unitColors[item.source as keyof typeof unitColors]?.bg || 'bg-gray-500'}`}></div>
                        <span className="truncate">{item.title[language]}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};


const BeneficiaryCalendarView: React.FC<BeneficiaryCalendarViewProps> = ({ beneficiary, leadershipData, dispatch }) => {
  const { t, language, dir } = useLocalization();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateForNewEvent, setSelectedDateForNewEvent] = useState<Date>(new Date());
  const [tooltipInfo, setTooltipInfo] = useState<{ top: number; left: number; items: CalendarItem[] } | null>(null);

  
  const enrolledProgramIds = useMemo(() => 
    new Set(beneficiary.profile.qualificationPrograms.map(p => p.programId)),
    [beneficiary]
  );

  const allCalendarItems: CalendarItem[] = useMemo(() => {
    const events: CalendarItem[] = leadershipData.units
        .filter(unit => enrolledProgramIds.has(unit.id))
        .flatMap(unit => 
            unit.stages.flatMap(stage => 
                stage.events.map(event => ({ ...event, source: unit.id, itemType: 'event' }))
            )
        );

    const projects: CalendarItem[] = leadershipData.studentProjects
        .filter(proj => beneficiary.profile.communityInitiatives.some(ci => ci.initiativeId === proj.id))
        .map(proj => ({
            ...proj,
            date: proj.startDate,
            source: 'student-project',
            itemType: 'project'
        }));

    return [...events, ...projects];
  }, [leadershipData, enrolledProgramIds, beneficiary.profile.communityInitiatives]);
  
  const unitList = useMemo(() => [
      ...leadershipData.units.filter(u => enrolledProgramIds.has(u.id)).map(u => ({ id: u.id, name: u.name[language], source: u.id })),
      ...(allCalendarItems.some(item => item.itemType === 'project') 
          ? [{ id: 'student-project', name: t('leadership.calendar.studentProjects'), source: 'student-project' }] 
          : [])
  ], [leadershipData, language, t, enrolledProgramIds, allCalendarItems]);

  const [activeFilters, setActiveFilters] = useState<string[]>(unitList.map(u => u.id));
   
   // Reset filters if unitList changes
  useEffect(() => {
    setActiveFilters(unitList.map(u => u.id));
  }, [unitList]);


  const filteredItems = useMemo(() => 
    allCalendarItems.filter(item => activeFilters.includes(item.source)), 
    [allCalendarItems, activeFilters]
  );
  
  const itemsByDate = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    filteredItems.forEach(item => {
        const dateKey = new Date('date' in item ? item.date : item.startDate).toISOString().split('T')[0];
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(item);
    });
    return grouped;
  }, [filteredItems]);
  
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startDate = new Date(startOfMonth);
  const dayOfWeek = startOfMonth.getDay();
  startDate.setDate(startDate.getDate() - dayOfWeek);

  const calendarDays = useMemo(() => {
    const days = [];
    let day = new Date(startDate);
    for (let i = 0; i < 42; i++) {
        days.push(new Date(day));
        day.setDate(day.getDate() + 1);
    }
    return days;
  }, [startDate]);

  
  const today = new Date();
  today.setHours(0,0,0,0);

  const dayNames = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(language, { weekday: 'short' });
    const days = [];
    // Start with Sunday
    for (let i = 0; i < 7; i++) {
        days.push(formatter.format(new Date(2023, 0, i + 1))); 
    }
    return days;
  }, [language]);
  
  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const handleToday = () => setCurrentDate(new Date());

  const handleDateClick = (date: Date) => {
    setSelectedDateForNewEvent(date);
    setIsModalOpen(true);
  };
  
  const handleCreateEvent = (eventData: Omit<Event, 'id' | 'status'>) => {
      dispatch({ type: 'ADD_LEADERSHIP_EVENT', payload: { newEvent: eventData } });
      // Show toast notification placeholder
      alert(t('leadership.calendar.eventCreatedSuccess'));
  };

  const toggleFilter = (id: string) => {
    setActiveFilters(prev => 
        prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };
  
  const handleDayHover = (day: Date, element: HTMLElement) => {
    const itemsForDay = itemsByDate[day.toISOString().split('T')[0]] || [];
    if (itemsForDay.length > 0) {
        const rect = element.getBoundingClientRect();
        setTooltipInfo({
            items: itemsForDay,
            top: rect.top,
            left: rect.left + rect.width / 2,
        });
    }
  };

  const handleDayMouseLeave = () => {
      setTooltipInfo(null);
  };

  return (
    <>
      <AddEventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateEvent}
        selectedDate={selectedDateForNewEvent}
        leadershipData={leadershipData}
      />
      <CalendarTooltip info={tooltipInfo} />
      <div className="bg-card dark:bg-dark-card p-4 sm:p-6 rounded-2xl shadow-soft animate-fade-in space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <button onClick={handlePrevMonth} title={t('leadership.previousMonth')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
              <span className="transform rtl:-rotate-90 ltr:rotate-90 inline-block"><ChevronDownIcon /></span>
            </button>
            <h2 className="text-xl font-bold text-foreground dark:text-dark-foreground text-center w-48">
              {new Intl.DateTimeFormat(language, { month: 'long', year: 'numeric' }).format(currentDate)}
            </h2>
            <button onClick={handleNextMonth} title={t('leadership.nextMonth')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
              <span className="transform rtl:rotate-90 ltr:-rotate-90 inline-block"><ChevronDownIcon /></span>
            </button>
            <button onClick={handleToday} className="px-4 py-1.5 text-sm font-semibold border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700">
              {t('leadership.today')}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {unitList.map(unit => (
              <button key={unit.id} onClick={() => toggleFilter(unit.id)} className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-2 transition-all ${activeFilters.includes(unit.id) ? `${unitColors[unit.source as keyof typeof unitColors]?.bg || 'bg-gray-500'} text-white shadow-md` : 'text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300'}`}>
                <span className={`w-2.5 h-2.5 rounded-full border-2 border-white/50 ${unitColors[unit.source as keyof typeof unitColors]?.bg || 'bg-gray-500'}`}></span>
                {unit.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-slate-700 border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
          {dayNames.map(dayName => (
            <div key={dayName} className="text-center py-2 bg-gray-50 dark:bg-slate-800 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
              {dayName}
            </div>
          ))}

          {calendarDays.map((d, index) => {
            const dateKey = d.toISOString().split('T')[0];
            const isCurrentMonth = d.getMonth() === currentDate.getMonth();
            const isToday = d.getTime() === today.getTime();
            const isWeekend = d.getDay() === 5 || d.getDay() === 6; // Friday & Saturday
            const isPast = d < today;
            const itemsForDay = itemsByDate[dateKey] || [];
            
            const cellClasses = [
                'relative p-1.5 sm:p-2 h-28 sm:h-32 bg-card dark:bg-dark-card cursor-pointer transition-all duration-200 group',
                !isCurrentMonth ? 'bg-gray-50 dark:bg-slate-800/50' : 'hover:bg-primary-light/30 dark:hover:bg-primary/10',
                isWeekend && isCurrentMonth && !isToday ? 'bg-gray-50/50 dark:bg-slate-800/60' : '',
                isPast && isCurrentMonth && !isToday ? 'opacity-60' : '',
                isToday ? 'border-2 border-primary dark:border-secondary' : '',
            ].filter(Boolean).join(' ');

            const dateNumberClasses = [
                'text-sm font-semibold flex items-center justify-center w-7 h-7 rounded-full transition-colors duration-200',
                isToday ? 'bg-primary text-white shadow-md' : '',
                !isCurrentMonth ? 'text-gray-400' : 'text-foreground dark:text-dark-foreground',
            ].filter(Boolean).join(' ');

            return (
              <div 
                key={index} 
                className={cellClasses}
                onClick={() => handleDateClick(d)}
                onMouseEnter={(e) => handleDayHover(d, e.currentTarget)}
                onMouseLeave={handleDayMouseLeave}
              >
                <div className={`flex ${dir === 'rtl' ? 'justify-start' : 'justify-end'}`}>
                    <div className={dateNumberClasses}>
                      {d.getDate()}
                    </div>
                </div>
                
                {itemsForDay.length > 0 && (
                  <div className="absolute bottom-2 left-0 right-0 px-1 flex justify-center items-center gap-1">
                      {itemsForDay.slice(0, 3).map(item => (
                          <div key={item.id} className={`w-2 h-2 rounded-full ${unitColors[item.source as keyof typeof unitColors]?.bg || 'bg-gray-500'}`}></div>
                      ))}
                      {itemsForDay.length > 3 && (
                          <div className="text-[10px] font-bold text-gray-500 leading-none">+{itemsForDay.length - 3}</div>
                      )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default BeneficiaryCalendarView;