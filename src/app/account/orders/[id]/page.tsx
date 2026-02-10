"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Package,
    MapPin,
    Calendar,
    ExternalLink,
    Loader2,
    CheckCircle,
    Clock,
    Truck,
} from "lucide-react";

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
}

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    items: OrderItem[];
    trackingNumber?: string;
    trackingUrl?: string;
    createdAt: string;
    paidAt?: string;
    shippedAt?: string;
    deliveredAt?: string;
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
    PENDING: { label: "En attente", bg: "bg-yellow-500/20", text: "text-yellow-400" },
    PAID: { label: "Payée", bg: "bg-blue-500/20", text: "text-blue-400" },
    PROCESSING: { label: "En préparation", bg: "bg-indigo-500/20", text: "text-indigo-400" },
    SHIPPED: { label: "Expédiée", bg: "bg-purple-500/20", text: "text-purple-400" },
    DELIVERED: { label: "Livrée", bg: "bg-green-500/20", text: "text-green-400" },
    COMPLETED: { label: "Terminée", bg: "bg-emerald-500/20", text: "text-emerald-400" },
    CANCELLED: { label: "Annulée", bg: "bg-red-500/20", text: "text-red-400" },
    REFUNDED: { label: "Remboursée", bg: "bg-gray-500/20", text: "text-gray-400" },
};

const statusSteps = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch("/api/user/orders");
                if (res.ok) {
                    const data = await res.json();
                    const found = data.orders.find((o: Order) => o.id === resolvedParams.id);
                    setOrder(found || null);
                }
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [resolvedParams.id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <Loader2 size={32} className="animate-spin text-pink-400" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-12">
                <p className="text-red-400 mb-4">Commande non trouvée</p>
                <Link href="/account/orders" className="text-pink-400">
                    Retour aux commandes
                </Link>
            </div>
        );
    }

    const currentStepIndex = statusSteps.indexOf(order.status);

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link
                href="/account/orders"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
                <ArrowLeft size={20} />
                Retour aux commandes
            </Link>

            {/* Order Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-start justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        {order.orderNumber}
                        <span
                            className={`px-3 py-1 rounded-full text-sm ${statusConfig[order.status]?.bg
                                } ${statusConfig[order.status]?.text}`}
                        >
                            {statusConfig[order.status]?.label || order.status}
                        </span>
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Commandé le{" "}
                        {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>
                <p className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                    €{(order.total / 100).toFixed(2)}
                </p>
            </motion.div>

            {/* Progress Tracker */}
            {!["CANCELLED", "REFUNDED", "PENDING"].includes(order.status) && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass p-6 rounded-xl border border-white/10"
                >
                    <div className="flex items-center justify-between">
                        {statusSteps.map((step, index) => {
                            const isPast = index <= currentStepIndex;
                            const isCurrent = index === currentStepIndex;

                            const icons: Record<string, React.ReactNode> = {
                                PAID: <CheckCircle size={20} />,
                                PROCESSING: <Clock size={20} />,
                                SHIPPED: <Truck size={20} />,
                                DELIVERED: <Package size={20} />,
                            };

                            return (
                                <div key={step} className="flex-1 flex items-center">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${isPast
                                                    ? "bg-pink-500 text-white"
                                                    : "bg-white/10 text-gray-500"
                                                } ${isCurrent ? "ring-4 ring-pink-500/30" : ""}`}
                                        >
                                            {icons[step]}
                                        </div>
                                        <p
                                            className={`text-xs mt-2 ${isPast ? "text-white" : "text-gray-500"
                                                }`}
                                        >
                                            {statusConfig[step]?.label}
                                        </p>
                                    </div>
                                    {index < statusSteps.length - 1 && (
                                        <div
                                            className={`flex-1 h-1 mx-2 rounded ${index < currentStepIndex
                                                    ? "bg-pink-500"
                                                    : "bg-white/10"
                                                }`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* Tracking Info */}
            {order.trackingNumber && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass p-6 rounded-xl border border-purple-500/30 bg-purple-500/5"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                                <Truck className="text-purple-400" size={20} />
                            </div>
                            <div>
                                <p className="font-medium text-white">Suivi de colis</p>
                                <p className="text-sm text-gray-400">
                                    Numéro: {order.trackingNumber}
                                </p>
                            </div>
                        </div>
                        {order.trackingUrl && (
                            <a
                                href={order.trackingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                            >
                                Suivre
                                <ExternalLink size={16} />
                            </a>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Order Items */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass p-6 rounded-xl border border-white/10"
            >
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Package className="text-pink-400" size={20} />
                    Articles ({order.items.length})
                </h2>

                <div className="space-y-4">
                    {order.items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-4 p-4 bg-white/5 rounded-lg"
                        >
                            <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center text-2xl">
                                🎀
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-white">{item.name}</p>
                                <p className="text-sm text-gray-500">
                                    €{(item.price / 100).toFixed(2)} × {item.quantity}
                                </p>
                            </div>
                            <p className="font-semibold text-white">
                                €{((item.price * item.quantity) / 100).toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-pink-400">
                            €{(order.total / 100).toFixed(2)}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Timeline */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass p-6 rounded-xl border border-white/10"
            >
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Calendar className="text-pink-400" size={20} />
                    Historique
                </h2>

                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                        <div>
                            <p className="text-sm text-white">Commande passée</p>
                            <p className="text-xs text-gray-500">
                                {new Date(order.createdAt).toLocaleString("fr-FR")}
                            </p>
                        </div>
                    </div>
                    {order.paidAt && (
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-400" />
                            <div>
                                <p className="text-sm text-white">Paiement confirmé</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(order.paidAt).toLocaleString("fr-FR")}
                                </p>
                            </div>
                        </div>
                    )}
                    {order.shippedAt && (
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-purple-400" />
                            <div>
                                <p className="text-sm text-white">Colis expédié</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(order.shippedAt).toLocaleString("fr-FR")}
                                </p>
                            </div>
                        </div>
                    )}
                    {order.deliveredAt && (
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            <div>
                                <p className="text-sm text-white">Livré</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(order.deliveredAt).toLocaleString("fr-FR")}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
