"use client";
import productsData from '@/data/products.json';
import ProductCard from '@/components/ProductCard';
import { useI18n } from '@/i18n';
import { motion } from 'framer-motion';

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '5s' }} />
        </div>

        <div className="z-10 max-w-4xl px-4 flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-pink-400 font-medium tracking-widest uppercase mb-4"
          >
            {t('hero.badge')}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-8xl font-black bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-transparent mb-6 tracking-tight"
          >
            {t('hero.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto font-light"
          >
            {t('hero.subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <a href="#products" className="btn-primary text-lg px-8 py-4 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition-all transform hover:-translate-y-1">
              {t('hero.cta')}
            </a>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">{t('products.title')}</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {productsData.products.map((product) => (
            // @ts-ignore
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-6 glass rounded-2xl"
          >
            <h3 className="text-xl font-bold mb-2 text-pink-400">{t('features.materials.title')}</h3>
            <p className="text-gray-400">{t('features.materials.description')}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 glass rounded-2xl"
          >
            <h3 className="text-xl font-bold mb-2 text-purple-400">{t('features.adorablePrices.title')}</h3>
            <p className="text-gray-400">{t('features.adorablePrices.description')}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 glass rounded-2xl"
          >
            <h3 className="text-xl font-bold mb-2 text-indigo-400">{t('features.shipping.title')}</h3>
            <p className="text-gray-400">{t('features.shipping.description')}</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
