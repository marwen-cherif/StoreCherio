"use client";
import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useI18n } from '@/i18n';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SuccessPage() {
    const { clearCart } = useCart();
    const { t } = useI18n();

    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-green-500/50 border-4 border-green-300/20"
            >
                <CheckCircle size={64} className="text-white drop-shadow-md" />
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-6"
            >
                {t('success.title')}
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-400 text-lg mb-10 max-w-lg leading-relaxed"
            >
                {t('success.description')}
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <Link href="/" className="inline-block bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-3 rounded-full transition-all border border-white/10 hover:border-white/30 backdrop-blur-sm">
                    {t('success.cta')}
                </Link>
            </motion.div>
        </div>
    );
}
