'use client';

import { useI18n } from '@/i18n';

export default function TermsPage() {
    const { t } = useI18n();

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('legal.terms.title')}
            </h1>
            <p className="text-sm text-gray-500 mb-8">
                {t('legal.terms.lastUpdated')}
            </p>

            <div className="prose prose-pink max-w-none text-gray-600 space-y-6">
                <section>
                    <p>{t('legal.terms.intro')}</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">1. {t('legal.terms.use')}</h2>
                    <p>{t('legal.terms.use')}</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">2. {t('legal.terms.products')}</h2>
                    <p>{t('legal.terms.products')}</p>
                </section>
            </div>
        </div>
    );
}
