
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import { useToast } from '../../../hooks/useToast';
import type { Language } from '../../../types';
import { Download, Search, Sparkles } from 'lucide-react';
import Spinner from '../../common/Spinner';
import { GoogleGenAI, Type } from "@google/genai";

// Helper functions for nested objects
const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : undefined, obj);
};

const setNestedValue = (obj: any, path: string, value: any) => {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        if (typeof current[keys[i]] !== 'object' || current[keys[i]] === null) {
            current[keys[i]] = {};
        }
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    return obj;
};

const getNestedKeys = (obj: any, prefix = ''): string[] => {
    if (!obj) return [];
    return Object.keys(obj).reduce((acc: string[], key) => {
        const pre = prefix.length ? prefix + '.' : '';
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            const isPlural = ['zero', 'one', 'two', 'few', 'many', 'other'].some(p => p in obj[key]);
            if (isPlural) {
                 acc.push(pre + key);
            } else {
                acc.push(...getNestedKeys(obj[key], pre + key));
            }
        } else {
            acc.push(pre + key);
        }
        return acc;
    }, []);
};


const TranslationManagement: React.FC = () => {
    const { t } = useLocalization();
    const toast = useToast();
    const [translations, setTranslations] = useState<Record<Language, any>>({ en: {}, ar: {} });
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [namespaceFilter, setNamespaceFilter] = useState('all');
    const [showMissingOnly, setShowMissingOnly] = useState(false);
    const [translating, setTranslating] = useState<Record<string, boolean>>({});
    const [translatingAll, setTranslatingAll] = useState(false);

    useEffect(() => {
        const fetchAll = async () => {
            setIsLoading(true);
            try {
                const [en, ar] = await Promise.all([
                    fetch('/lib/locales/en.json').then(res => res.json()),
                    fetch('/lib/locales/ar.json').then(res => res.json())
                ]);
                setTranslations({ en, ar });
            } catch (e) {
                toast.showError('Failed to load translation files.');
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAll();
    }, [toast]);
    
    const masterKeys = useMemo(() => getNestedKeys(translations.en).sort(), [translations.en]);
    const namespaces = useMemo(() => ['all', ...Object.keys(translations.en).sort()], [translations.en]);

    const filteredKeys = useMemo(() => {
        return masterKeys.filter(key => {
            const enValue = getNestedValue(translations.en, key);
            if (typeof enValue === 'object' && enValue !== null) return false;

            const matchesSearch = key.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesNamespace = namespaceFilter === 'all' || key.startsWith(namespaceFilter);
            const isMissing = showMissingOnly 
                ? !getNestedValue(translations.ar, key)
                : true;
            return matchesSearch && matchesNamespace && isMissing;
        });
    }, [masterKeys, searchTerm, namespaceFilter, showMissingOnly, translations]);
    
    const handleTranslationChange = (lang: Language, key: string, value: string) => {
        setTranslations(prev => {
            const newTranslations = JSON.parse(JSON.stringify(prev));
            setNestedValue(newTranslations[lang], key, value);
            return newTranslations;
        });
    };
    
    const handleAutoTranslate = async (key: string, isBatch = false) => {
        setTranslating(prev => ({ ...prev, [key]: true }));
        try {
            const enValue = getNestedValue(translations.en, key);
            if (!enValue || typeof enValue !== 'string') {
                if (!isBatch) toast.showWarning("Can only translate string values.");
                return false;
            }
    
            const needsAr = !getNestedValue(translations.ar, key);
            if (!needsAr) {
                if (!isBatch) toast.showInfo("No missing translations for this key.");
                return false;
            }
    
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const systemInstruction = `You are a translation expert for a non-profit ERP system. You will be given an English string to translate. Your response MUST be a JSON object with an 'ar' key containing only the translated string. Preserve any placeholders like {variable}. Do not add any explanations.`;
            const userPrompt = JSON.stringify({ en: enValue });
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: userPrompt,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            ar: { type: Type.STRING }
                        },
                        required: ['ar']
                    }
                }
            });
            
            const { ar } = JSON.parse(response.text.trim());
    
            setTranslations(prev => {
                const newTranslations = JSON.parse(JSON.stringify(prev));
                if (needsAr) setNestedValue(newTranslations.ar, key, ar);
                return newTranslations;
            });
            
            if (!isBatch) toast.showSuccess(`Auto-translated key: ${key}`);
            return true;
    
        } catch (err) {
            console.error("Auto-translation error:", err);
            if (!isBatch) toast.showError("Failed to auto-translate.");
            return false;
        } finally {
            setTranslating(prev => ({ ...prev, [key]: false }));
        }
    };
    
    const handleAutoTranslateAll = async () => {
        setTranslatingAll(true);
        let successCount = 0;
        const keysToTranslate = filteredKeys.filter(key => {
            const enValue = getNestedValue(translations.en, key);
            if (typeof enValue !== 'string' || !enValue) return false;
            return !getNestedValue(translations.ar, key);
        });
        
        if (keysToTranslate.length === 0) {
            toast.showInfo("No missing translations to process.");
            setTranslatingAll(false);
            return;
        }
        
        for (const key of keysToTranslate) {
            const success = await handleAutoTranslate(key, true);
            if (success) successCount++;
            await new Promise(res => setTimeout(res, 250)); // Delay to avoid rate limiting
        }
        
        setTranslatingAll(false);
        toast.showSuccess(`Translated ${successCount} of ${keysToTranslate.length} missing keys.`);
    };

    const handleExport = (lang: Language) => {
        const dataStr = JSON.stringify(translations[lang], null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `${lang}.json`;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        toast.showSuccess(`Exported ${lang}.json`);
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Spinner text={t('common.loading')} /></div>;
    }
    
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">{t('settings.categories.translations')}</h2>
            <div className="p-4 bg-card dark:bg-dark-card rounded-xl shadow-soft border dark:border-slate-700/50 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Search className="w-4 h-4 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                        <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder={t('translations.searchKeys')} className="w-full p-2 pl-10 border rounded-lg bg-gray-50 dark:bg-slate-800 dark:border-slate-600" />
                    </div>
                    <select value={namespaceFilter} onChange={e => setNamespaceFilter(e.target.value)} className="p-2 border rounded-lg bg-gray-50 dark:bg-slate-800 dark:border-slate-600">
                        {namespaces.map(ns => <option key={ns} value={ns}>{ns === 'all' ? t('translations.allNamespaces') : ns}</option>)}
                    </select>
                </div>
                 <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={showMissingOnly} onChange={e => setShowMissingOnly(e.target.checked)} className="w-4 h-4 text-primary rounded" />
                        {t('translations.showMissingOnly')}
                    </label>
                    <div className="flex gap-2">
                         <button onClick={() => handleAutoTranslateAll()} disabled={translatingAll} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-white bg-secondary rounded-lg disabled:bg-gray-400">
                            {translatingAll ? <Spinner size="w-4 h-4" /> : <Sparkles size={16} />}
                            {t('translations.translateAll')}
                        </button>
                        <button onClick={() => handleExport('ar')} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold border rounded-lg"><Download size={16} /> AR</button>
                    </div>
                </div>
            </div>

            <div className="bg-card dark:bg-dark-card rounded-xl shadow-soft border dark:border-slate-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left text-xs uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-dark-card/50">
                            <tr>
                                <th className="p-2 w-1/3">Key</th>
                                <th className="p-2 w-1/3">English (Source)</th>
                                <th className="p-2 w-1/3">Arabic</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredKeys.map(key => {
                                const enValue = getNestedValue(translations.en, key);
                                const arValue = getNestedValue(translations.ar, key);
                                return (
                                    <tr key={key} className="border-t dark:border-slate-700">
                                        <td className="p-2 font-mono text-xs text-gray-500 align-top">{key}</td>
                                        <td className="p-2 align-top">{typeof enValue === 'object' ? JSON.stringify(enValue) : enValue}</td>
                                        <td className="p-2 align-top">
                                            <div className="flex items-start gap-1">
                                                <textarea
                                                    value={arValue || ''}
                                                    onChange={e => handleTranslationChange('ar', key, e.target.value)}
                                                    dir="rtl"
                                                    className={`w-full p-1 text-sm border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-600 ${!arValue ? 'border-red-500' : ''}`}
                                                    rows={2}
                                                />
                                                <button onClick={() => handleAutoTranslate(key)} disabled={translating[key]} className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50">
                                                    {translating[key] ? <Spinner size="w-4 h-4" /> : <Sparkles size={16} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TranslationManagement;
