"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useI18n } from '@/i18n';
import { Plus, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const { t } = useI18n();
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/10 transition-all group h-full flex flex-col"
        >
            <div className="relative aspect-square overflow-hidden bg-white/5">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6">
                    <button
                        onClick={handleAdd}
                        className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold hover:bg-pink-500 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-lg shadow-pink-900/50 flex items-center justify-center gap-2"
                    >
                        {added ? <Check size={20} /> : <Plus size={20} />}
                        {added ? t('products.added') : t('products.addToBasket')}
                    </button>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white leading-tight">{product.name}</h3>
                    <span className="text-lg font-bold text-pink-400 bg-pink-500/10 px-2 py-1 rounded">
                        {(product.price / 100).toFixed(2)} €
                    </span>
                </div>
                <p className="text-gray-400 text-sm flex-grow line-clamp-3 leading-relaxed">{product.description}</p>

                {/* Mobile View Add Button */}
                <div className="mt-4 md:hidden">
                    <button
                        onClick={handleAdd}
                        className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        {added ? t('products.added') : t('products.addToBasket')}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
