import { useReducer, useEffect } from 'react';
import type { LeadershipData, EventStatus, QuranicStationStatus, Event, EventCategory } from '../types';
import { initialLeadershipData } from '../data/leadershipData';

type Action = 
  | {
      type: 'UPDATE_LEADERSHIP_EVENT_STATUS';
      payload: { eventId: string; newStatus: EventStatus };
    }
  | {
      type: 'UPDATE_QURANIC_STATION_STATUS';
      payload: { stageKey: keyof LeadershipData['quranicTimeline']; week: number; newStatus: QuranicStationStatus };
    }
  | {
      type: 'ADD_LEADERSHIP_EVENT';
      payload: { newEvent: Omit<Event, 'id' | 'status'> };
    };
    
/**
 * getSemesterStageId - تحديد معرف مرحلة الفصل الدراسي بناءً على التاريخ.
 * @param {Date} date - التاريخ المراد تحديده.
 * @returns {'s1' | 's2' | 's3'} - معرف المرحلة ('s1' للفصل الثاني، 's2' للفصل الأول، 's3' للعطلة الصيفية).
 */
const getSemesterStageId = (date: Date): 's1' | 's2' | 's3' => {
    const month = date.getMonth(); // 0-11
    // Second Semester (s1): Feb (1) - Jun (5)
    if (month >= 1 && month <= 5) return 's1';
    // Summer Break (s3): Jul (6) - Aug (7)
    if (month >= 6 && month <= 7) return 's3';
    // First Semester (s2): Sep (8) - Jan (0)
    return 's2';
};

/**
 * reducer - Reducer لإدارة حالة بيانات التأهيل القيادي.
 * @param {LeadershipData} state - الحالة الحالية.
 * @param {Action} action - الإجراء المطلوب تنفيذه.
 * @returns {LeadershipData} - الحالة الجديدة.
 */
const reducer = (state: LeadershipData, action: Action): LeadershipData => {
  switch (action.type) {
    case 'UPDATE_LEADERSHIP_EVENT_STATUS': {
      const { eventId, newStatus } = action.payload;
      return {
        ...state,
        units: state.units.map(unit => ({
          ...unit,
          stages: unit.stages.map(stage => ({
            ...stage,
            events: stage.events.map(event => {
              if (event.id === eventId) {
                const updatedEvent = { ...event, status: newStatus };
                if (newStatus === 'completed') {
                  updatedEvent.completionDate = new Date().toISOString();
                }
                return updatedEvent;
              }
              return event;
            }),
          })),
        })),
      };
    }
    case 'UPDATE_QURANIC_STATION_STATUS': {
        const { stageKey, week, newStatus } = action.payload;
        const updatedStageTimeline = state.quranicTimeline[stageKey].map(station => 
            station.week === week ? { ...station, status: newStatus } : station
        );
        return {
            ...state,
            quranicTimeline: {
                ...state.quranicTimeline,
                [stageKey]: updatedStageTimeline,
            },
        };
    }
    case 'ADD_LEADERSHIP_EVENT': {
        const { newEvent } = action.payload;
        const eventToAdd: Event = {
            ...newEvent,
            id: `event-${new Date().getTime()}`,
            status: 'planned'
        };

        const stageId = getSemesterStageId(new Date(eventToAdd.date));
        const unitId = eventToAdd.category;

        return {
            ...state,
            units: state.units.map(unit => {
                if (unit.id === unitId) {
                    return {
                        ...unit,
                        stages: unit.stages.map(stage => {
                            if (stage.id === stageId) {
                                return {
                                    ...stage,
                                    events: [...stage.events, eventToAdd]
                                };
                            }
                            return stage;
                        })
                    };
                }
                return unit;
            })
        };
    }
    default:
      return state;
  }
};

/**
 * getInitialState - تحميل الحالة الأولية لبيانات القيادة من localStorage أو استخدام البيانات الافتراضية.
 * @returns {LeadershipData} - الحالة الأولية لبيانات القيادة.
 */
const getInitialState = (): LeadershipData => {
  try {
    const storedData = localStorage.getItem('mss2-erp-leadership-data');
    const data: LeadershipData = storedData ? JSON.parse(storedData) : initialLeadershipData;

    // Auto-calculate "missed" status for past "planned" events
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Compare dates only

    const updatedUnits = data.units.map(unit => ({
      ...unit,
      stages: unit.stages.map(stage => ({
        ...stage,
        events: stage.events.map(event => {
          if (event.status === 'planned') {
            const eventDate = new Date(event.date);
            if (eventDate < today) {
              const newStatus: EventStatus = 'missed';
              return { ...event, status: newStatus };
            }
          }
          return event;
        }),
      })),
    }));
    
    // Ensure studentProjects data is present
    const studentProjects = data.studentProjects || initialLeadershipData.studentProjects;

    return { ...data, units: updatedUnits, studentProjects };
  } catch (error) {
    console.error("Failed to load leadership data:", error);
    return initialLeadershipData;
  }
};

/**
 * useLeadershipData - خطاف مخصص لإدارة بيانات وحدة التأهيل القيادي.
 * يوفر الحالة الحالية ودالة dispatch لتحديثها، مع الحفظ التلقائي في localStorage.
 * 
 * @returns {{leadershipData: LeadershipData, dispatch: React.Dispatch<Action>}} - كائن يحتوي على بيانات القيادة ودالة dispatch.
 * 
 * @example
 * const { leadershipData, dispatch } = useLeadershipData();
 * dispatch({ type: 'UPDATE_LEADERSHIP_EVENT_STATUS', payload: { eventId: 'e1', newStatus: 'completed' } });
 */
export const useLeadershipData = () => {
  const [state, dispatch] = useReducer(reducer, getInitialState());

  useEffect(() => {
    try {
      localStorage.setItem('mss2-erp-leadership-data', JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save leadership data to localStorage:", error);
    }
  }, [state]);

  return { leadershipData: state, dispatch };
};
