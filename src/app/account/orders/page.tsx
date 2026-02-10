"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, ExternalLink, ChevronRight, Loader2 } from "lucide-react";

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
    itemCount: number;
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

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch("/api/user/orders");
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data.orders);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <Loader2 size={32} className="animate-spin text-pink-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold text-white">Mes commandes</h1>
                <p className="text-gray-400 mt-1">
                    {orders.length} commande{orders.length !== 1 ? "s" : ""}
                </p>
            </motion.div>

            {/* Orders List */}
            {orders.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-12 rounded-xl border border-white/10 text-center"
                >
                    <Package size={64} className="text-gray-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-white mb-2">
                        Aucune commande
                    </h2>
                    <p className="text-gray-500 mb-6">
                        Vous n&apos;avez pas encore passé de commande.
                    </p>
                    <Link href="/shop" className="btn-primary px-8 py-3 inline-block">
                        Découvrir nos produits
                    </Link>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order, index) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link href={`/account/orders/${order.id}`}>
                                <div className="glass p-6 rounded-xl border border-white/10 hover:border-pink-500/30 transition-all">
                                    {/* Order Header */}
                                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-semibold text-white">
                                                    {order.orderNumber}
                                                </h3>
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[order.status]?.bg
                                                        } ${statusConfig[order.status]?.text}`}
                                                >
                                                    {statusConfig[order.status]?.label || order.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-white">
                                                €{(order.total / 100).toFixed(2)}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {order.itemCount} article{order.itemCount > 1 ? "s" : ""}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Tracking Info */}
                                    {order.trackingNumber && (
                                        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-purple-500/10 rounded-lg">
                                            <Package size={16} className="text-purple-400" />
                                            <span className="text-sm text-purple-400">
                                                Suivi: {order.trackingNumber}
                                            </span>
                                            {order.trackingUrl && (
                                                <a
                                                    href={order.trackingUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="ml-auto text-purple-400 hover:text-purple-300"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                            )}
                                        </div>
                                    )}

                                    {/* Order Items Preview */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {order.items.slice(0, 3).map((item, i) => (
                                                <div
                                                    key={item.id}
                                                    className="w-10 h-10 bg-white/10 rounded-lg border-2 border-gray-900 flex items-center justify-center text-xs"
                                                    title={item.name}
                                                >
                                                    🎀
                                                </div>
                                            ))}
                                            {order.items.length > 3 && (
                                                <div className="w-10 h-10 bg-pink-500/20 rounded-lg border-2 border-gray-900 flex items-center justify-center text-xs text-pink-400 font-medium">
                                                    +{order.items.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-gray-500 text-sm ml-2">
                                            {order.items
                                                .slice(0, 2)
                                                .map((i) => i.name)
                                                .join(", ")}
                                            {order.items.length > 2 && "..."}
                                        </span>
                                        <ChevronRight
                                            size={20}
                                            className="ml-auto text-gray-500"
                                        />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
