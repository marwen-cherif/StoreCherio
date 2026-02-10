"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en from './locales/en.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';

export type Locale = 'en' | 'fr' | 'ar';

const translations: Record<Locale, typeof en> = { en, fr, ar };

interface I18nContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
    dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('en');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('eva_locale') as Locale | null;
        if (saved && translations[saved]) {
            setLocaleState(saved);
        }
        setIsLoaded(true);
    }, []);

    const setLocale = useCallback((newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('eva_locale', newLocale);
        // Update html dir attribute for RTL support
        document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = newLocale;
    }, []);

    const t = useCallback((key: string): string => {
        const keys = key.split('.');
        let value: any = translations[locale];
        for (const k of keys) {
            value = value?.[k];
        }
        return typeof value === 'string' ? value : key;
    }, [locale]);

    const dir = locale === 'ar' ? 'rtl' : 'ltr';

    // Set initial dir
    useEffect(() => {
        if (isLoaded) {
            document.documentElement.dir = dir;
            document.documentElement.lang = locale;
        }
    }, [isLoaded, dir, locale]);

    return (
        <I18nContext.Provider value={{ locale, setLocale, t, dir }}>
            {children}
        </I18nContext.Provider>
    );
}

export const useI18n = () => {
    const context = useContext(I18nContext);
    if (!context) throw new Error("useI18n must be used within an I18nProvider");
    return context;
};

export const localeNames: Record<Locale, string> = {
    en: 'English',
    fr: 'Français',
    ar: 'العربية',
};
