
import React, { useState } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import type { IndividualDonor, SortDirection } from '../../../types';
import { formatDate, formatCurrency, formatNumber } from '../../../lib/utils';
import { MoreHorizontalIcon, ChevronDownIcon } from '../../icons/GenericIcons';
import { StatusBadge, TierBadge } from './DonorBadges';

interface DonorsTableProps {
    donors: IndividualDonor[];
    onDonorSelect: (donor: IndividualDonor) => void;
    sortColumn: keyof IndividualDonor | null;
    sortDirection: SortDirection;
    onSort: (column: keyof IndividualDonor) => void;
}

const DonorsTable: React.FC<DonorsTableProps> = ({ donors, onDonorSelect, sortColumn, sortDirection, onSort }) => {
    const { t, language } = useLocalization(['common', 'individual_donors', 'donors']);
    const [selectedDonors, setSelectedDonors] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const paginatedDonors = donors.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
    const totalPages = Math.ceil(donors.length / rowsPerPage);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedDonors(new Set(donors.map(d => d.id)));
        } else {
            setSelectedDonors(new Set());
        }
    };

    const handleSelectRow = (id: string) => {
        const newSelection = new Set(selectedDonors);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedDonors(newSelection);
    };
    
    const SortableHeader: React.FC<{ column: keyof IndividualDonor, labelKey: string }> = ({ column, labelKey }) => (
        <th scope="col" className="px-6 py-3">
            <div
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => onSort(column)}
            >
                {t(labelKey)}
                {sortColumn === column && (
                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                )}
            </div>
        </th>
    );

    return (
        <div className="bg-card dark:bg-dark-card rounded-2xl shadow-soft overflow-hidden border border-gray-200 dark:border-slate-700/50">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-start text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-dark-card/50 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="p-4"><input type="checkbox" onChange={handleSelectAll} /></th>
                            <SortableHeader column="fullName" labelKey="individual_donors.columns.donor" />
                            <SortableHeader column="totalDonations" labelKey="individual_donors.columns.totalDonations" />
                            <SortableHeader column="avgGift" labelKey="individual_donors.columns.avgGift" />
                            <SortableHeader column="donationsCount" labelKey="individual_donors.columns.donationCount" />
                            <SortableHeader column="lastDonationDate" labelKey="individual_donors.columns.lastDonationDate" />
                            <SortableHeader column="status" labelKey="individual_donors.columns.status" />
                            <SortableHeader column="tier" labelKey="individual_donors.columns.tier" />
                            <SortableHeader column="tags" labelKey="individual_donors.columns.tags" />
                            <th scope="col" className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedDonors.map(donor => (
                            <tr key={donor.id} className="bg-card dark:bg-dark-card border-b dark:border-slate-700 hover:bg-gray-50/50 dark:hover:bg-slate-800/20">
                                <td className="w-4 p-4"><input type="checkbox" checked={selectedDonors.has(donor.id)} onChange={() => handleSelectRow(donor.id)} /></td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img className="w-10 h-10 rounded-full" src={donor.avatar} alt={donor.fullName.en} loading="lazy" />
                                        <div>
                                            <button onClick={() => onDonorSelect(donor)} className="font-bold text-foreground dark:text-dark-foreground hover:underline text-start">{donor.fullName[language]}</button>
                                            <div className="text-xs text-gray-500">{donor.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-semibold">{formatCurrency(donor.totalDonations, language)}</td>
                                <td className="px-6 py-4 font-semibold">{formatCurrency(donor.avgGift || 0, language)}</td>
                                <td className="px-6 py-4 font-semibold">{formatNumber(donor.donationsCount || 0, language)}</td>
                                <td className="px-6 py-4">{donor.lastDonationDate ? formatDate(donor.lastDonationDate, language) : 'N/A'}</td>
                                <td className="px-6 py-4"><StatusBadge status={donor.status} /></td>
                                <td className="px-6 py-4"><TierBadge tier={donor.tier} /></td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {donor.tags.slice(0, 2).map(tag => <span key={tag} className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-slate-700 rounded-full">{tag}</span>)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-end"><button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700" aria-label="More options"><MoreHorizontalIcon /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {donors.length === 0 && <div className="text-center py-16 text-gray-500">{t('individual_donors.noResults')}</div>}
            </div>
             <nav className="flex items-center justify-between p-4" aria-label="Table navigation">
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {t('common.pagination_summary', { 
                        start: Math.min((currentPage - 1) * rowsPerPage + 1, donors.length), 
                        end: Math.min(currentPage * rowsPerPage, donors.length), 
                        total: donors.length 
                    })}
                </span>
                <ul className="inline-flex items-center -space-x-px rtl:space-x-reverse">
                    <li><button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="px-3 py-2 ms-0 leading-tight border rounded-s-lg disabled:opacity-50">{t('common.previous')}</button></li>
                    <li><button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="px-3 py-2 leading-tight border rounded-e-lg disabled:opacity-50">{t('common.next')}</button></li>
                </ul>
            </nav>
        </div>
    );
};

export default DonorsTable;
