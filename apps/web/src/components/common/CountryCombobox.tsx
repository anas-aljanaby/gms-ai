import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { buildCountryComboboxOptions, normalizeCountrySearchTerm, resolveCountryToCanonical } from '../../lib/countryOptions';
import { useLocalization } from '../../hooks/useLocalization';

interface CountryComboboxProps {
    value: string;
    onChange: (value: string) => void;
    existingCountries?: string[];
    placeholder?: string;
    noResultsText?: string;
    className?: string;
    id?: string;
}

const inputClass =
    'w-full p-2 border rounded-lg bg-gray-50 dark:bg-slate-800 dark:border-slate-700 text-sm focus:ring-primary focus:border-primary';

const CountryCombobox: React.FC<CountryComboboxProps> = ({
    value,
    onChange,
    existingCountries = [],
    placeholder,
    noResultsText,
    className,
    id,
}) => {
    const { language } = useLocalization(['common']);
    const [open, setOpen] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const options = useMemo(
        () => buildCountryComboboxOptions(existingCountries, language === 'ar' ? 'ar' : 'en'),
        [existingCountries, language]
    );

    const filtered = useMemo(() => {
        const term = normalizeCountrySearchTerm(value);
        if (!term) return options;
        return options.filter((country) =>
            country.searchTerms.some((searchTerm) => normalizeCountrySearchTerm(searchTerm).includes(term))
        );
    }, [options, value]);

    useEffect(() => {
        setHighlightIndex(0);
    }, [value, open]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!open || !listRef.current) return;
        const item = listRef.current.children[highlightIndex] as HTMLElement | undefined;
        item?.scrollIntoView({ block: 'nearest' });
    }, [highlightIndex, open]);

    const containsArabic = (text: string) => /[\u0600-\u06FF]/.test(text);

    const getSelectedOptionValue = (country: (typeof options)[number]) => {
        const trimmedInput = value.trim();
        if (!trimmedInput) return language === 'ar' ? (country.arLabel ?? country.enLabel) : country.enLabel;
        if (containsArabic(trimmedInput)) return country.arLabel ?? country.enLabel;
        return country.enLabel;
    };

    const selectCountry = (country: (typeof options)[number]) => {
        onChange(getSelectedOptionValue(country));
        setOpen(false);
    };

    const normalizeKnownCountryVariant = (raw: string) => {
        const canonical = resolveCountryToCanonical(raw);
        if (!canonical) return null;
        const matched = options.find((option) => option.canonical === canonical);
        if (!matched) return canonical;
        return containsArabic(raw) ? (matched.arLabel ?? matched.enLabel) : matched.enLabel;
    };

    const handleInputBlur = () => {
        const normalized = normalizeKnownCountryVariant(value);
        if (normalized && normalized !== value) onChange(normalized);
        setOpen(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
            setOpen(true);
            return;
        }

        if (!open) return;

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setHighlightIndex((prev) => Math.min(prev + 1, Math.max(filtered.length - 1, 0)));
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setHighlightIndex((prev) => Math.max(prev - 1, 0));
        } else if (event.key === 'Enter' && filtered.length > 0) {
            event.preventDefault();
            selectCountry(filtered[highlightIndex] ?? filtered[0]);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    };

    return (
        <div ref={containerRef} className={`relative ${className ?? ''}`}>
            <div className="relative">
                <input
                    id={id}
                    type="text"
                    value={value}
                    onChange={(event) => {
                        onChange(event.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    onBlur={handleInputBlur}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className={`${inputClass} pe-8`}
                    role="combobox"
                    aria-expanded={open}
                    aria-autocomplete="list"
                    autoComplete="off"
                />
                <ChevronDown
                    className={`pointer-events-none absolute end-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </div>

            {open && (
                <ul
                    ref={listRef}
                    role="listbox"
                    className="absolute z-30 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-card py-1 shadow-lg dark:border-slate-700 dark:bg-dark-card"
                >
                    {filtered.length > 0 ? (
                        filtered.map((country, index) => (
                            <li key={`${country.canonical}-${index}`} role="option" aria-selected={country.enLabel === value || country.arLabel === value}>
                                <button
                                    type="button"
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => selectCountry(country)}
                                    className={`w-full px-3 py-2 text-start text-sm transition-colors hover:bg-gray-100 dark:hover:bg-slate-800 ${
                                        index === highlightIndex ? 'bg-primary/10 text-primary dark:text-secondary' : ''
                                    }`}
                                >
                                    <span className="block font-semibold">
                                        {language === 'ar' ? (country.arLabel ?? country.enLabel) : country.enLabel}
                                    </span>
                                    {country.arLabel && (
                                        <span className="block text-xs text-gray-500 dark:text-gray-400">
                                            {language === 'ar' ? country.enLabel : country.arLabel}
                                        </span>
                                    )}
                                </button>
                            </li>
                        ))
                    ) : (
                        <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                            {noResultsText}
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default CountryCombobox;
