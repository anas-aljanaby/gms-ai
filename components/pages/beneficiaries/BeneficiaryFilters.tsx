
import React, { useState, useMemo } from 'react';
import type { Beneficiary, ProgramProject } from '../../../types';
import { useLocalization } from '../../../hooks/useLocalization';
import { SearchIcon, SparklesIcon } from '../../icons/GenericIcons';
import Spinner from '../../common/Spinner';

interface BeneficiaryFiltersProps {
  projects: ProgramProject[];
  beneficiaries: Beneficiary[];
  filters: { search: string; type: string; project: string; country: string; };
  onFilterChange: React.Dispatch<React.SetStateAction<{ search: string; type: string; project: string; country: string; }>>;
  onAiSearch: (query: string) => void;
  isAiSearching: boolean;
}

const BeneficiaryFilters: React.FC<BeneficiaryFiltersProps> = ({ projects, beneficiaries, filters, onFilterChange, onAiSearch, isAiSearching }) => {
  const { t, language, dir } = useLocalization();
  const [aiQuery, setAiQuery] = useState('');

  const countryOptions = useMemo(() => {
      const countrySet = new Set(beneficiaries.map(b => b.country));
      return Array.from(countrySet).sort();
  }, [beneficiaries]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      onFilterChange(prev => ({...prev, [name]: value}));
  };

  const handleAiSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAiSearch(aiQuery);
  };
  
  return (
    <div className="space-y-4">
      <div className="p-4 bg-card dark:bg-dark-card rounded-xl shadow-soft">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <div className={`absolute inset-y-0 flex items-center ${dir === 'ltr' ? 'ps-3' : 'pe-3'} pointer-events-none`}>
              <SearchIcon />
            </div>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleInputChange}
              placeholder={t('beneficiaries.searchPlaceholder')}
              className={`block w-full p-2.5 ${dir === 'ltr' ? 'ps-10' : 'pe-10'} text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 focus:ring-primary focus:border-primary`}
            />
          </div>
          {/* Type Filter */}
          <select name="type" value={filters.type} onChange={handleInputChange} className="p-2.5 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 focus:ring-primary focus:border-primary">
            <option value="all">{t('beneficiaries.filters.allTypes')}</option>
            <option value="sponsorship">{t('beneficiaries.sponsorships')}</option>
            <option value="direct-support">{t('beneficiaries.directSupport')}</option>
          </select>
          {/* Project Filter */}
          <select name="project" value={filters.project} onChange={handleInputChange} className="p-2.5 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 focus:ring-primary focus:border-primary">
            <option value="all">{t('beneficiaries.filters.allProjects')}</option>
            <option value="sponsorship">{t('beneficiaries.filters.sponsorshipProjects')}</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name[language]}</option>)}
          </select>
          {/* Country Filter */}
          <select name="country" value={filters.country} onChange={handleInputChange} className="p-2.5 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 focus:ring-primary focus:border-primary lg:col-start-3">
            <option value="all">{t('beneficiaries.filters.allCountries')}</option>
            {countryOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      {/* AI Smart Search */}
      <div className="relative p-4 bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-blue-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <SparklesIcon className="w-6 h-6 text-blue-500 dark:text-indigo-400" />
            <h4 className="font-bold text-blue-800 dark:text-indigo-300">{t('beneficiaries.aiSearch.title')}</h4>
          </div>
          <form onSubmit={handleAiSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2 sm:pl-9">
              <input 
                type="text"
                value={aiQuery}
                onChange={e => setAiQuery(e.target.value)}
                placeholder={t('beneficiaries.aiSearch.placeholder')}
                className="w-full p-2 text-sm border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600"
                disabled={isAiSearching}
              />
              <button type="submit" className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg flex items-center justify-center disabled:bg-primary/70" disabled={isAiSearching || !aiQuery.trim()}>
                {isAiSearching ? <Spinner size="w-5 h-5" /> : t('beneficiaries.aiSearch.search')}
              </button>
          </form>
      </div>
    </div>
  );
};

export default BeneficiaryFilters;
