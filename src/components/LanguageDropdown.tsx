import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import type { Language } from '../i18n/LanguageContext';

const options: { value: Language; label: string }[] = [
    { value: 'en', label: 'EN' },
    { value: 'zh-CN', label: '中' },
    { value: 'zh-TW', label: '繁' },
];

export const LanguageDropdown = () => {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLabel = options.find((o) => o.value === language)?.label || 'EN';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative z-50 text-[12px]" ref={dropdownRef}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute bottom-full right-0 mb-2 w-14 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 overflow-hidden flex flex-col items-center py-1.5 font-bold"
                    >
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => {
                                    setLanguage(opt.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full py-2 hover:bg-gray-50 transition-colors ${language === opt.value ? 'text-gray-900' : 'text-gray-400'}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 bg-gray-900 text-white hover:bg-gray-800 transition-colors px-3 py-1.5 rounded-full shadow-sm cursor-pointer font-bold select-none"
            >
                <span>{currentLabel}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={12} strokeWidth={2.5}/>
                </motion.div>
            </div>
        </div>
    );
};
