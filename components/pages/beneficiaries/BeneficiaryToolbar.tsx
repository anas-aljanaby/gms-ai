

import React from 'react';
import { Briefcase, Map, Users, List, Search } from 'lucide-react';
import { MicrophoneIcon } from '../../icons/AiIcons';

interface BeneficiaryToolbarProps {
    view: string;
    onViewChange: (view: string) => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onAddBeneficiary: () => void;
    onToggleAdvancedFilters: () => void;
    isListening: boolean;
    handleListen: () => void;
    micError: string | null;
}

const BeneficiaryToolbar: React.FC<BeneficiaryToolbarProps> = ({
    view, onViewChange, searchTerm, onSearchChange, onAddBeneficiary, onToggleAdvancedFilters, isListening, handleListen, micError
}) => {

    const getButtonClass = (buttonView: string) => {
        return view === buttonView
            ? "p-2 bg-primary text-white rounded-lg"
            : "p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-md";
    };

    return (
        <div className="p-2 bg-gray-100 dark:bg-dark-card/50 rounded-lg flex items-center gap-2">
            <button 
                onClick={onAddBeneficiary}
                className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600"
            >
                إضافة مستفيد
            </button>

            <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                <button onClick={() => onViewChange('briefcase')} className={getButtonClass('briefcase')} aria-label="Briefcase View"><Briefcase size={20} /></button>
                <button onClick={() => onViewChange('map')} className={getButtonClass('map')} aria-label="Map View"><Map size={20} /></button>
                <button onClick={() => onViewChange('card')} className={getButtonClass('card')} aria-label="Card View"><Users size={20} /></button>
                <button onClick={() => onViewChange('list')} className={getButtonClass('list')} aria-label="List View"><List size={20} /></button>
            </div>

            <button 
                onClick={onToggleAdvancedFilters}
                className="px-3 py-2 text-sm font-medium border bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600"
            >
                فلاتر متقدمة
            </button>

            <div className="relative flex-grow">
                <input 
                    type="text" 
                    value={searchTerm} 
                    onChange={e => onSearchChange(e.target.value)} 
                    placeholder={isListening ? "جاري الاستماع..." : "بحث بالاسم، جهة الاتصال، أو مجال التركيز..."}
                    className="w-full p-3 pr-24 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary"
                />
                 <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                </div>
                 <div className="absolute inset-y-0 right-11 flex items-center">
                     <button
                        onClick={handleListen}
                        disabled={!!micError}
                        title={micError || "Search by voice"}
                        className={`p-2 rounded-full transition-colors disabled:text-gray-400 disabled:cursor-not-allowed ${
                            isListening
                                ? 'text-red-500 bg-red-100 dark:bg-red-900/50 animate-pulse'
                                : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700'
                        }`}
                    >
                        <MicrophoneIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BeneficiaryToolbar;