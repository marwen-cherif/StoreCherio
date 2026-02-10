"use client";
import { useI18n } from '@/i18n';
import Link from 'next/link';

export default function Footer() {
    const { t } = useI18n();

    return (
        <footer className="glass mt-20 py-8 border-t border-white/10">
            <div className="container mx-auto px-4 text-center text-gray-400">
                <p>&copy; {new Date().getFullYear()} Eva Accessories. {t('footer.rights')}</p>
                <div className="flex justify-center gap-6 mt-4 text-sm font-medium">
                    <Link href="/legal/terms" className="hover:text-pink-400 transition-colors">
                        {t('legal.terms.title')}
                    </Link>
                    <Link href="/legal/privacy" className="hover:text-pink-400 transition-colors">
                        {t('legal.privacy.title')}
                    </Link>
                </div>
                <div className="flex justify-center gap-4 mt-2 text-xs text-gray-500">
                    <a href="#" className="hover:text-pink-400 transition-colors">Instagram</a>
                    <a href="#" className="hover:text-pink-400 transition-colors">Twitter</a>
                    <a href="#" className="hover:text-pink-400 transition-colors">Contact</a>
                </div>
            </div>
        </footer>
    );
}
