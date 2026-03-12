import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';

export const TranslateBtn = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'uk', label: 'UA', full: 'Ukrainian' },
    { code: 'en', label: 'EN', full: 'English' },
  ];

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 
          bg-white/5 hover:bg-white/10 
          border border-white/10 hover:border-indigo-500/50
          rounded-xl transition-all duration-200
          text-sm font-bold group
          ${isOpen ? 'border-indigo-500/50 bg-white/10' : ''}
        `}
      >
        <Globe size={16} className='text-indigo-400 group-hover:rotate-12 transition-transform' />
        <span className='text-slate-200'>{currentLang.label}</span>
        <ChevronDown
          size={14}
          className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className='
  absolute left-0 mt-2 w-40 
  bg-[#1e293b]/90 backdrop-blur-xl
  border border-white/10
  rounded-2xl shadow-2xl shadow-black/50
  overflow-hidden z-[100]
  animate-in fade-in zoom-in duration-200
'
        >
          <div className='py-1'>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => toggleLanguage(lang.code)}
                className={`
                  w-full flex items-center justify-between px-4 py-2.5 
                  text-sm transition-colors
                  ${
                    i18n.language === lang.code
                      ? 'text-indigo-400 bg-indigo-500/10'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <div className='flex flex-col items-start'>
                  <span className='font-bold leading-tight'>{lang.label}</span>
                  <span className='text-[10px] opacity-50'>{lang.full}</span>
                </div>
                {i18n.language === lang.code && <Check size={14} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
