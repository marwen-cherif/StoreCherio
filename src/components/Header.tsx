"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useI18n, Locale, localeNames } from '../i18n';
import { ShoppingBag, Menu, X, Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
    const context = useCart();
    const { locale, setLocale, t } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const itemCount = mounted && context.cart ? context.cart.reduce((acc, item) => acc + item.quantity, 0) : 0;

    const locales: Locale[] = ['en', 'fr', 'ar'];

    return (
        <header className="fixed top-0 w-full z-50 glass border-b border-white/10 transition-all duration-300">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                    Eva Accessories
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                    <Link href="/" className="hover:text-pink-400 transition-colors">{t('nav.home')}</Link>
                    <Link href="/#products" className="hover:text-pink-400 transition-colors">{t('nav.shop')}</Link>

                    {/* Language Switcher */}
                    <div className="relative">
                        <button
                            onClick={() => setLangOpen(!langOpen)}
                            className="flex items-center gap-2 hover:text-pink-400 transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                        >
                            <Globe size={18} />
                            <span>{localeNames[locale]}</span>
                            <ChevronDown size={14} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {langOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute top-full right-0 mt-2 glass rounded-xl overflow-hidden min-w-[140px] shadow-2xl shadow-black/50"
                                >
                                    {locales.map((l) => (
                                        <button
                                            key={l}
                                            onClick={() => { setLocale(l); setLangOpen(false); }}
                                            className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex items-center justify-between ${locale === l ? 'text-pink-400 bg-white/5' : 'text-gray-300'}`}
                                        >
                                            {localeNames[l]}
                                            {locale === l && <span className="w-2 h-2 bg-pink-500 rounded-full" />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Link href="/cart" className="relative p-2 hover:bg-white/10 rounded-full transition-colors group">
                        <ShoppingBag className="group-hover:text-pink-400 transition-colors" />
                        {itemCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-lg shadow-pink-500/50"
                            >
                                {itemCount}
                            </motion.span>
                        )}
                    </Link>
                </nav>

                {/* Mobile Menu Button */}
                <button className="md:hidden p-2 text-white" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass absolute top-20 w-full overflow-hidden border-b border-white/10"
                    >
                        <div className="flex flex-col p-4 gap-4 text-gray-300">
                            <Link href="/" onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded transition-colors">{t('nav.home')}</Link>
                            <Link href="/#products" onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded transition-colors">{t('nav.shop')}</Link>
                            <Link href="/cart" onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded flex justify-between items-center transition-colors">
                                <span>{t('nav.cart')}</span>
                                <span className="bg-pink-500 px-2 rounded-full text-xs text-white">{itemCount}</span>
                            </Link>

                            {/* Mobile Language Switcher */}
                            <div className="border-t border-white/10 pt-4 mt-2">
                                <p className="text-xs text-gray-500 mb-2 px-2">Language</p>
                                <div className="flex gap-2">
                                    {locales.map((l) => (
                                        <button
                                            key={l}
                                            onClick={() => { setLocale(l); setIsOpen(false); }}
                                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${locale === l ? 'bg-pink-500 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                                        >
                                            {l.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
