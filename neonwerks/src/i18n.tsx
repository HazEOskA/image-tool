import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { copy, type Copy, type Lang } from './content/copy';

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Copy;
}

const LangContext = createContext<Ctx | null>(null);
const STORAGE_KEY = 'neonwerks.lang';

function readInitial(): Lang {
  if (typeof window === 'undefined') return 'en';
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === 'pl' || saved === 'en') return saved;
  return 'en';
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitial);

  const setLang = (l: Lang) => setLangState(l);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore quota / private mode */
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const value = useMemo<Ctx>(() => ({ lang, setLang, t: copy[lang] }), [lang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): Ctx {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>');
  return ctx;
}
