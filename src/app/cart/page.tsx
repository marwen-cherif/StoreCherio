"use client";
import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useI18n } from '@/i18n';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, total } = useCart();
    const { t } = useI18n();
    const { data: session, status } = useSession();
    const router = useRouter();

    const handleCheckout = () => {
        // Amazon/AliExpress pattern: require auth only at checkout
        if (status !== 'authenticated') {
            // Redirect to signin with callback to checkout
            router.push('/auth/signin?callbackUrl=/checkout');
            return;
        }
        // Redirect to checkout page (with address selection)
        router.push('/checkout');
    };

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-8 p-8 bg-white/5 rounded-full"
                >
                    <ShoppingBag size={64} className="text-gray-600" />
                </motion.div>
                <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">{t('cart.empty.title')}</h1>
                <p className="text-gray-400 mb-8 max-w-md">{t('cart.empty.description')}</p>
                <Link href="/" className="btn-primary px-8 py-3 text-lg hover:shadow-lg hover:shadow-pink-500/20 transition-all">
                    {t('cart.empty.cta')}
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-5xl py-12 px-4">
            <h1 className="text-4xl font-bold mb-12 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{t('cart.title')}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items List */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {cart.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="glass p-6 rounded-2xl flex gap-6 items-center flex-col sm:flex-row shadow-lg shadow-black/20 hover:border-pink-500/30 transition-colors"
                        >
                            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>

                            <div className="flex-grow flex flex-col gap-2 text-center sm:text-left w-full">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-xl text-white">{item.name}</h3>
                                    <p className="font-bold text-pink-400 text-lg">${(item.price / 100).toFixed(2)}</p>
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>

                                <div className="flex items-center justify-between mt-auto pt-4">
                                    <div className="flex items-center gap-4 bg-white/5 rounded-full px-4 py-2 border border-white/5">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="text-gray-400 hover:text-white transition-colors"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="font-medium w-4 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="text-gray-400 hover:text-white transition-colors"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-full transition-colors group"
                                        title={t('cart.remove')}
                                    >
                                        <Trash2 size={20} className="group-hover:text-red-300" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="glass p-8 rounded-2xl sticky top-24 border border-white/10 shadow-2xl shadow-black/40">
                        <h2 className="text-2xl font-bold mb-6">{t('cart.summary.title')}</h2>

                        <div className="flex flex-col gap-4 mb-8 text-gray-300">
                            <div className="flex justify-between">
                                <span>{t('cart.summary.subtotal')}</span>
                                <span>${(total / 100).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t('cart.summary.shipping')}</span>
                                <span className="text-green-400">{t('cart.summary.free')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t('cart.summary.tax')}</span>
                                <span className="text-gray-500 text-sm italic">{t('cart.summary.taxNote')}</span>
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-6 mb-8">
                            <div className="flex justify-between items-end">
                                <span className="text-lg font-medium">{t('cart.summary.total')}</span>
                                <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                                    ${(total / 100).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* User Status */}
                        {status === 'authenticated' && session?.user && (
                            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                                    <User size={16} className="text-green-400" />
                                </div>
                                <div className="text-sm">
                                    <p className="text-green-400 font-medium">{session.user.name}</p>
                                    <p className="text-gray-400 text-xs">{session.user.email}</p>
                                </div>
                            </div>
                        )}

                        {status !== 'authenticated' && (
                            <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                <p className="text-amber-400 text-sm text-center">
                                    Connexion requise pour finaliser la commande
                                </p>
                            </div>
                        )}

                        <button
                            onClick={handleCheckout}
                            className="w-full btn-primary py-4 text-lg font-bold shadow-xl shadow-pink-500/20 hover:shadow-pink-500/40 relative overflow-hidden group"
                        >
                            {status === 'authenticated' ? t('cart.summary.checkout') : 'Se connecter pour commander'}
                        </button>

                        <p className="text-center text-xs text-gray-500 mt-6 flex items-center justify-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            {t('cart.summary.secure')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
