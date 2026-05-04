import React, { useState, useMemo } from 'react';
import type { InstitutionalDonor } from '../../../types';
import { useLocalization } from '../../../hooks/useLocalization';
import { formatCurrency } from '../../../lib/utils';

// Approximate coordinates for countries on a world map image
const countryCoordinates: Record<string, { top: string; left: string }> = {
    USA: { top: '38%', left: '25%' },
    Canada: { top: '28%', left: '26%' },
    Belgium: { top: '31%', left: '48%' },
    Qatar: { top: '45%', left: '60%' },
    Kuwait: { top: '43%', left: '59%' },
    'Saudi Arabia': { top: '48%', left: '58%' },
    UAE: { top: '46%', left: '62%' },
    Switzerland: { top: '33%', left: '50%' },
    Syria: { top: '40%', left: '56%' },
    Lebanon: { top: '41%', left: '55%' },
    Jordan: { top: '42%', left: '55.5%' },
    Turkey: { top: '38%', left: '55%' },
    Egypt: { top: '45%', left: '53%' },
    'United Kingdom': { top: '30%', left: '47%' },
    Spain: { top: '37%', left: '45%' },
    Japan: { top: '39%', left: '85%' },
    Italy: { top: '36%', left: '51%'},
};

const WorldMapSvg: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 500.5"
        className={className}
        aria-hidden="true"
        fill="currentColor"
    >
        <path d="M500 0C223.9 0 0 159.2 0 355.3c0 74.8 45.1 141.2 115.1 145.2h770.3c69.5-4.5 114.6-70.9 114.6-145.2C1000 159.2 776.1 0 500 0zM453.7 20.3c6.9 0 13.6.4 20.2.8 1.9-.8 3.8-1.5 5.7-2.3-6.1-.2-12.2-.4-18.4-.4-2.5 0-5 .1-7.5.2 2.5-.1 5-.2 7.5-.2 1.4 0 2.8 0 4.2.1zm-10.4 3.1c-2.3 0-4.6.1-6.9.2 2.3-.1 4.6-.2 6.9-.2zm-12.6 3.1c1-.4 2-.8 3-1.2-1 .4-2 .8-3 1.2zm-12.6 3.1c-2.3 0-4.6.1-6.9.2 2.3-.1 4.6-.2 6.9-.2zm-12.6 3.1c-2.3 0-4.6.1-6.9.2 2.3-.1 4.6-.2 6.9-.2zm-12.6 3.1c-2.3 0-4.6.1-6.9.2 2.3-.1 4.6-.2 6.9-.2zm-12.6 3.1c-2.3 0-4.6.1-6.9.2 2.3-.1 4.6-.2 6.9-.2zm-12.6 3.1c-2.3 0-4.6.1-6.9.2 2.3-.1 4.6-.2 6.9-.2zm-12.6 3.1c-2.3 0-4.6.1-6.9.2 2.3-.1 4.6-.2 6.9-.2zm-12.6 3.1c-2.3 0-4.6.1-6.9.2 2.3-.1 4.6-.2 6.9-.2zm-12.6 3.1c-2.3 0-4.6.1-6.9.2 2.3-.1 4.6-.2 6.9-.2zm-12.6 3.1c-2.3 0-4.6.1-6.9.2 2.3-.1 4.6-.2 6.9-.2zm-12.6 3.1c-2.3 0-4.6.1-6.9.2 2.3-.1 4.6-.2 6.9-.2zm-12.6 3.1c-2.3 0-4.6.1-6.9.2 2.3-.1 4.6-.2 6.9-.2zm-12.6 3.1c-2.3 0-4.6.1-6.9.2 2.3-.1 4.6-.2 6.9-.2z"/>
    </svg>
);

interface InstitutionalDonorsMapProps {
    donors: InstitutionalDonor[];
}

export const InstitutionalDonorsMap: React.FC<InstitutionalDonorsMapProps> = ({ donors }) => {
    const { t, language } = useLocalization(['common', 'institutional_donors']);
    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

    const donorsByCountry = useMemo(() => {
        return donors.reduce((acc, donor) => {
          if (!acc[donor.country]) {
            acc[donor.country] = [];
          }
          acc[donor.country].push(donor);
          return acc;
        }, {} as Record<string, InstitutionalDonor[]>);
    }, [donors]);

    const hoveredData = hoveredCountry ? donorsByCountry[hoveredCountry] : null;

    return (
        <div className="bg-card dark:bg-dark-card p-4 rounded-xl shadow-inner h-full min-h-[600px] relative overflow-hidden">
            <h2 className="text-xl font-bold mb-4">{t('institutional_donors.mapView')}</h2>
            <div className="absolute inset-0 flex items-center justify-center">
                <WorldMapSvg className="w-full h-full object-contain text-gray-200 dark:text-slate-700" />
            </div>
            {Object.keys(donorsByCountry).map((country) => {
                const countryDonors = donorsByCountry[country];
                const coords = countryCoordinates[country];
                if (!coords) return null;

                const totalFunding = countryDonors.reduce((sum, d) => sum + d.totalGrantsAwarded, 0);
                const size = 20 + Math.log(totalFunding + 1) * 2;

                return (
                <div
                    key={country}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
                    style={{ top: coords.top, left: coords.left }}
                    onMouseEnter={() => setHoveredCountry(country)}
                    onMouseLeave={() => setHoveredCountry(null)}
                >
                    <div
                    className="rounded-full bg-primary/80 border-2 border-white/50 flex items-center justify-center text-white font-bold text-sm shadow-lg animate-pulse-glow"
                    style={{ width: `${size}px`, height: `${size}px` }}
                    >
                    {countryDonors.length}
                    </div>
                </div>
                );
            })}
            {hoveredData && (
                <div className="absolute top-4 right-4 bg-white/80 dark:bg-dark-card/80 p-3 rounded-lg shadow-xl backdrop-blur-sm max-w-xs animate-fade-in-fast">
                    <h4 className="font-bold">{hoveredCountry}</h4>
                    <p className="text-sm">{hoveredData.length} organization(s)</p>
                    <p className="text-sm font-semibold">{formatCurrency(hoveredData.reduce((s,d) => s + d.totalGrantsAwarded, 0), language)} total funding</p>
                </div>
            )}
        </div>
    );
};
