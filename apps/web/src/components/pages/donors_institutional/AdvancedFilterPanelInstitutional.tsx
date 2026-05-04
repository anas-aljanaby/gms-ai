
import React from 'react';
import { useLocalization } from '../../../hooks/useLocalization';

interface AdvancedFilterPanelInstitutionalProps {
    isOpen: boolean;
}

const AdvancedFilterPanelInstitutional: React.FC<AdvancedFilterPanelInstitutionalProps> = ({ isOpen }) => {
    const { t } = useLocalization(['common', 'institutional_donors']);

    return (
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
            <div className="p-4 mb-4 bg-gray-50 dark:bg-dark-card/50 rounded-xl border dark:border-slate-700">
                <h3 className="font-semibold mb-4">{t('institutional_donors.filters')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Placeholder for filter controls from spec */}
                    <div><label className="text-sm">{t('institutional_donors.filter_labels.institutionType')}</label><select className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600"><option>All</option></select></div>
                    <div><label className="text-sm">{t('institutional_donors.filter_labels.relationshipStatus')}</label><select className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600"><option>All</option></select></div>
                    <div><label className="text-sm">{t('institutional_donors.filter_labels.grantFocusArea')}</label><input type="text" className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600" /></div>
                    <div><label className="text-sm">{t('institutional_donors.filter_labels.priorityLevel')}</label><select className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600"><option>All</option></select></div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <button className="px-4 py-2 text-sm font-medium border rounded-lg">Clear</button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg">Apply</button>
                </div>
            </div>
        </div>
    );
};

export default AdvancedFilterPanelInstitutional;
