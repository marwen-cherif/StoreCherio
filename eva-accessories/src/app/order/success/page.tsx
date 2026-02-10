"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight, ShoppingBag, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import confetti from "canvas-confetti";

interface OrderDetails {
    orderNumber: string;
    total: number;
    itemCount: number;
}

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const { clearCart } = useCart();

    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasCleared, setHasCleared] = useState(false);

    useEffect(() => {
        // Clear cart only once
        if (!hasCleared) {
            clearCart();
            setHasCleared(true);
        }

        // Trigger confetti
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ["#ec4899", "#a855f7", "#f59e0b"],
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ["#ec4899", "#a855f7", "#f59e0b"],
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    }, [clearCart, hasCleared]);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!sessionId) {
                setIsLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/orders/by-session?sessionId=${sessionId}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrderDetails(data);
                }
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderDetails();
    }, [sessionId]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-lg w-full text-center"
            >
                {/* Success Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
                >
                    <CheckCircle size={48} className="text-white" />
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-bold text-white mb-4"
                >
                    Merci pour votre commande !
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-400 mb-8"
                >
                    Votre paiement a été accepté. Vous recevrez un email de confirmation
                    avec les détails de votre commande.
                </motion.p>

                {/* Order Details Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass p-6 rounded-2xl mb-8 border border-white/10"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center py-4">
                            <Loader2 size={24} className="animate-spin text-pink-400" />
                        </div>
                    ) : orderDetails ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Numéro de commande</span>
                                <span className="font-mono font-bold text-pink-400">
                                    {orderDetails.orderNumber}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Articles</span>
                                <span className="font-medium text-white">
                                    {orderDetails.itemCount} article{orderDetails.itemCount > 1 ? "s" : ""}
                                </span>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                <span className="text-gray-400">Total payé</span>
                                <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                                    €{(orderDetails.total / 100).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 text-green-400">
                            <CheckCircle size={20} />
                            <span>Paiement confirmé</span>
                        </div>
                    )}
                </motion.div>

                {/* Shipping Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-3 justify-center text-gray-400 mb-8"
                >
                    <Package size={20} className="text-violet-400" />
                    <span>Livraison estimée : 3-7 jours ouvrés</span>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link
                        href="/shop"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                    >
                        <ShoppingBag size={18} />
                        Continuer mes achats
                    </Link>
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 btn-primary"
                    >
                        Retour à l&apos;accueil
                        <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-[70vh] flex items-center justify-center">
                    <Loader2 size={48} className="animate-spin text-pink-400" />
                </div>
            }
        >
            <OrderSuccessContent />
        </Suspense>
    );
}
