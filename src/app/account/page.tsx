"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Package,
    MapPin,
    ChevronRight,
    Loader2,
} from "lucide-react";

interface UserProfile {
    name: string;
    email: string;
    createdAt: string;
    orderCount: number;
    addressCount: number;
}

interface RecentOrder {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    itemCount: number;
    createdAt: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
    PENDING: { label: "En attente", color: "text-yellow-400" },
    PAID: { label: "Payée", color: "text-blue-400" },
    PROCESSING: { label: "En préparation", color: "text-indigo-400" },
    SHIPPED: { label: "Expédiée", color: "text-purple-400" },
    DELIVERED: { label: "Livrée", color: "text-green-400" },
    COMPLETED: { label: "Terminée", color: "text-emerald-400" },
    CANCELLED: { label: "Annulée", color: "text-red-400" },
};

export default function AccountPage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, ordersRes] = await Promise.all([
                    fetch("/api/user/profile"),
                    fetch("/api/user/orders"),
                ]);

                if (profileRes.ok) {
                    const data = await profileRes.json();
                    setProfile(data);
                }

                if (ordersRes.ok) {
                    const data = await ordersRes.json();
                    setRecentOrders(data.orders.slice(0, 3)); // Only show last 3
                }
            } catch (error) {
                console.error("Error fetching account data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <Loader2 size={32} className="animate-spin text-pink-400" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold text-white mb-2">
                    Bonjour {profile?.name?.split(" ")[0]} ! 👋
                </h1>
                <p className="text-gray-400">
                    Bienvenue sur votre espace personnel Eva Accessories.
                </p>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Link href="/account/orders" className="block">
                        <div className="glass p-6 rounded-xl border border-white/10 hover:border-pink-500/30 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
                                    <Package className="text-pink-400" size={24} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">
                                        {profile?.orderCount || 0}
                                    </p>
                                    <p className="text-sm text-gray-400">Commandes</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 mt-4 text-sm text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                Voir mes commandes
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link href="/account/addresses" className="block">
                        <div className="glass p-6 rounded-xl border border-white/10 hover:border-violet-500/30 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center">
                                    <MapPin className="text-violet-400" size={24} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">
                                        {profile?.addressCount || 0}
                                    </p>
                                    <p className="text-sm text-gray-400">Adresses</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 mt-4 text-sm text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                Gérer mes adresses
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </div>

            {/* Recent Orders */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass p-6 rounded-xl border border-white/10"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">
                        Commandes récentes
                    </h2>
                    <Link
                        href="/account/orders"
                        className="text-sm text-pink-400 hover:text-pink-300 flex items-center gap-1"
                    >
                        Tout voir
                        <ChevronRight size={16} />
                    </Link>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="text-center py-8">
                        <Package size={48} className="text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500">Aucune commande pour le moment</p>
                        <Link
                            href="/shop"
                            className="inline-block mt-4 px-6 py-2 btn-primary text-sm"
                        >
                            Découvrir nos produits
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/account/orders/${order.id}`}
                                className="block"
                            >
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                                    <div>
                                        <p className="font-medium text-white">{order.orderNumber}</p>
                                        <p className="text-sm text-gray-500">
                                            {order.itemCount} article{order.itemCount > 1 ? "s" : ""} •{" "}
                                            {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-white">
                                            €{(order.total / 100).toFixed(2)}
                                        </p>
                                        <p
                                            className={`text-sm ${statusLabels[order.status]?.color || "text-gray-400"
                                                }`}
                                        >
                                            {statusLabels[order.status]?.label || order.status}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Member Since */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center text-gray-500 text-sm"
            >
                Membre depuis{" "}
                {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString("fr-FR", {
                        month: "long",
                        year: "numeric",
                    })
                    : "..."}
            </motion.div>
        </div>
    );
}
