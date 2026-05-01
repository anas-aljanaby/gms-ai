
import React from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import { SearchIcon } from '../../icons/GenericIcons';
import { Users, Map, Briefcase, List } from 'lucide-react';
import { MicrophoneIcon } from '../../icons/AiIcons';

interface InstitutionalDonorsControlsProps {
    view: 'list' | 'card' | 'map' | 'opportunities';
    onViewChange: (view: 'list' | 'card' | 'map' | 'opportunities') => void;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onAddInstitution: () => void;
    onFiltersToggle: () => void;
    isListening: boolean;
    handleListen: () => void;
    micError: string | null;
}

const InstitutionalDonorsControls: React.FC<InstitutionalDonorsControlsProps> = ({
    view, onViewChange, searchTerm, onSearchChange, onAddInstitution, onFiltersToggle, isListening, handleListen, micError
}) => {
    const { t, dir } = useLocalization();

    const ViewButton: React.FC<{
        label: string;
        icon: React.ReactNode;
        isActive: boolean;
        onClick: () => void;
    }> = ({ label, icon, isActive, onClick }) => (
        <button
            onClick={onClick}
            title={label}
            className={`p-2 rounded-md transition-colors ${isActive ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-slate-700'}`}
        >
            {icon}
        </button>
    );

    return (
        <div className="flex-shrink-0 p-4 mb-4 bg-card dark:bg-dark-card rounded-xl shadow-soft">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <div className={`absolute inset-y-0 flex items-center ${dir === 'ltr' ? 'ps-3' : 'pe-3'} pointer-events-none`}>
                        <SearchIcon />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={isListening ? t('common.listening') : t('institutional_donors.searchPlaceholder')}
                        className={`block w-full p-2.5 ${dir === 'ltr' ? 'ps-10 pe-10' : 'pe-10 ps-10'} text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 focus:ring-primary focus:border-primary`}
                    />
                     <div className={`absolute inset-y-0 flex items-center ${dir === 'ltr' ? 'pe-3' : 'ps-3'} ${dir === 'ltr' ? 'right-0' : 'left-0'}`}>
                        <button
                            onClick={handleListen}
                            disabled={!!micError}
                            title={micError || t('common.voiceSearch')}
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

                <div className="flex items-center gap-2">
                     <button onClick={onFiltersToggle} className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        {t('institutional_donors.filters')}
                    </button>
                    <div className="p-1 bg-gray-100 dark:bg-slate-900 rounded-lg flex items-center">
                        <ViewButton label={t('institutional_donors.listView')} icon={<List size={20} />} isActive={view === 'list'} onClick={() => onViewChange('list')} />
                        <ViewButton label={t('institutional_donors.cardView')} icon={<Users size={20} />} isActive={view === 'card'} onClick={() => onViewChange('card')} />
                        <ViewButton label={t('institutional_donors.mapView')} icon={<Map size={20} />} isActive={view === 'map'} onClick={() => onViewChange('map')} />
                        <ViewButton label={t('institutional_donors.opportunities.title')} icon={<Briefcase size={20} />} isActive={view === 'opportunities'} onClick={() => onViewChange('opportunities')} />
                    </div>
                </div>
                 <button onClick={onAddInstitution} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-secondary hover:bg-secondary-dark rounded-lg transition-colors">
                    {t('institutional_donors.addInstitution')}
                </button>
            </div>
        </div>
    );
};

export default InstitutionalDonorsControls;
