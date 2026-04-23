
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { useToast } from '../../hooks/useToast';
import { SearchIcon } from '../icons/GenericIcons';
import { MicrophoneIcon } from '../icons/AiIcons';

// Add SpeechRecognition type definition
interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onstart: () => void;
  onend: () => void;
  onerror: (event: any) => void;
  onresult: (event: any) => void;
}
declare global {
    interface Window {
        SpeechRecognition: { new(): SpeechRecognition; };
        webkitSpeechRecognition: { new(): SpeechRecognition; };
    }
}

const GlobalSearch: React.FC = () => {
    const { t, language, dir } = useLocalization();
    const [searchTerm, setSearchTerm] = useState('');

    // Voice Search State
    const [isListening, setIsListening] = useState(false);
    const [micError, setMicError] = useState<string | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const toast = useToast();

    // Speech Recognition Setup Effect
    useEffect(() => {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) {
            setMicError("Speech recognition is not supported in this browser.");
            return;
        }
        
        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = false;
        recognition.interimResults = true;
        
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event) => {
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                const errorMsg = "Microphone permission was denied. Please enable it in your browser settings.";
                setMicError(errorMsg);
                toast.showError(errorMsg);
            }
            setIsListening(false);
        };
        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            setSearchTerm(transcript);
        };
        
        recognitionRef.current = recognition;
    }, [toast]);

    const handleListen = useCallback(() => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
            return;
        }
        setMicError(null); // Reset error on new attempt
        const langCode = { en: 'en-US', ar: 'ar-SA' }[language];
        recognitionRef.current.lang = langCode;
        try {
            recognitionRef.current.start();
        } catch (e) {
            console.error("Speech recognition start error:", e);
            const errorMsg = "Could not start listening. Please try again.";
            setMicError(errorMsg);
            toast.showError(errorMsg);
        }
    }, [isListening, language, toast]);

    return (
        <div className="relative w-full">
            <div className={`absolute inset-y-0 flex items-center ${dir === 'ltr' ? 'ps-3' : 'pe-3'} pointer-events-none`}>
                <SearchIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isListening ? t('common.listening') : t('common.searchPlaceholder')}
                className={`block w-full p-2 ${dir === 'ltr' ? 'ps-10 pe-12' : 'pe-10 ps-12'} text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 focus:ring-primary focus:border-primary placeholder-gray-400`}
            />
             <div className={`absolute inset-y-0 flex items-center ${dir === 'ltr' ? 'right-0 pe-3' : 'left-0 ps-3'}`}>
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
    );
};

export default GlobalSearch;
