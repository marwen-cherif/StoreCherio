"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Clock,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface Stats {
    revenue: {
        total: number;
        thisMonth: number;
        growth: number;
    };
    orders: {
        total: number;
        thisMonth: number;
        pending: number;
        growth: number;
        byStatus: Record<string, number>;
    };
    customers: {
        total: number;
        newThisMonth: number;
        growth: number;
    };
    products: {
        total: number;
        lowStock: number;
    };
    recentOrders: Array<{
        id: string;
        orderNumber: string;
        customer: string;
        email?: string;
        total: number;
        status: string;
        itemCount: number;
        createdAt: string;
    }>;
}

const statusColors: Record<string, { bg: string; text: string }> = {
    PENDING: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
    PAID: { bg: "bg-blue-500/20", text: "text-blue-400" },
    PROCESSING: { bg: "bg-indigo-500/20", text: "text-indigo-400" },
    SHIPPED: { bg: "bg-purple-500/20", text: "text-purple-400" },
    DELIVERED: { bg: "bg-green-500/20", text: "text-green-400" },
    COMPLETED: { bg: "bg-emerald-500/20", text: "text-emerald-400" },
    CANCELLED: { bg: "bg-red-500/20", text: "text-red-400" },
    REFUNDED: { bg: "bg-gray-500/20", text: "text-gray-400" },
};

const statusLabels: Record<string, string> = {
    PENDING: "En attente",
    PAID: "Payée",
    PROCESSING: "En préparation",
    SHIPPED: "Expédiée",
    DELIVERED: "Livrée",
    COMPLETED: "Terminée",
    CANCELLED: "Annulée",
    REFUNDED: "Remboursée",
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/admin/stats");
                if (!res.ok) throw new Error("Failed to fetch stats");
                const data = await res.json();
                setStats(data);
            } catch (err) {
                setError("Erreur lors du chargement des statistiques");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <AlertTriangle size={48} className="text-red-400 mb-4" />
                <p className="text-red-400">{error}</p>
            </div>
        );
    }

    const kpiCards = [
        {
            title: "Chiffre d'affaires",
            value: `€${(stats.revenue.total / 100).toLocaleString("fr-FR", { minimumFractionDigits: 2 })}`,
            subValue: `€${(stats.revenue.thisMonth / 100).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} ce mois`,
            growth: stats.revenue.growth,
            icon: DollarSign,
            color: "from-green-500 to-emerald-500",
        },
        {
            title: "Commandes",
            value: stats.orders.total.toString(),
            subValue: `${stats.orders.thisMonth} ce mois`,
            growth: stats.orders.growth,
            icon: ShoppingCart,
            color: "from-blue-500 to-indigo-500",
            alert: stats.orders.pending > 0 ? `${stats.orders.pending} en attente` : undefined,
        },
        {
            title: "Clients",
            value: stats.customers.total.toString(),
            subValue: `${stats.customers.newThisMonth} nouveaux ce mois`,
            growth: stats.customers.growth,
            icon: Users,
            color: "from-violet-500 to-purple-500",
        },
        {
            title: "Produits",
            value: stats.products.total.toString(),
            subValue: `${stats.products.lowStock} stock faible`,
            icon: Package,
            color: "from-pink-500 to-rose-500",
            alert: stats.products.lowStock > 0 ? "Stock faible" : undefined,
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400 mt-1">Vue d&apos;ensemble de votre boutique</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {kpiCards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass p-6 rounded-2xl border border-white/10"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                                <card.icon size={24} className="text-white" />
                            </div>
                            {card.growth !== undefined && (
                                <div className={`flex items-center gap-1 text-sm ${card.growth >= 0 ? "text-green-400" : "text-red-400"}`}>
                                    {card.growth >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                    <span>{Math.abs(card.growth)}%</span>
                                </div>
                            )}
                        </div>
                        <h3 className="text-gray-400 text-sm mb-1">{card.title}</h3>
                        <p className="text-2xl font-bold text-white">{card.value}</p>
                        <p className="text-sm text-gray-500 mt-1">{card.subValue}</p>
                        {card.alert && (
                            <div className="mt-3 flex items-center gap-2 text-amber-400 text-xs">
                                <AlertTriangle size={14} />
                                {card.alert}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Recent Orders & Quick Stats */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="xl:col-span-2 glass p-6 rounded-2xl border border-white/10"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <Clock size={20} className="text-pink-400" />
                            Commandes récentes
                        </h2>
                        <Link
                            href="/admin/orders"
                            className="text-pink-400 hover:text-pink-300 text-sm flex items-center gap-1"
                        >
                            Voir tout <ArrowRight size={16} />
                        </Link>
                    </div>

                    {stats.recentOrders.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            Aucune commande pour le moment
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-gray-500 text-sm border-b border-white/10">
                                        <th className="pb-3 font-medium">Commande</th>
                                        <th className="pb-3 font-medium">Client</th>
                                        <th className="pb-3 font-medium">Total</th>
                                        <th className="pb-3 font-medium">Statut</th>
                                        <th className="pb-3 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {stats.recentOrders.map((order) => (
                                        <tr key={order.id} className="text-sm">
                                            <td className="py-4">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="text-pink-400 hover:text-pink-300 font-medium"
                                                >
                                                    {order.orderNumber}
                                                </Link>
                                            </td>
                                            <td className="py-4">
                                                <div>
                                                    <p className="text-white">{order.customer}</p>
                                                    {order.email && (
                                                        <p className="text-gray-500 text-xs">{order.email}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 text-white font-medium">
                                                €{(order.total / 100).toFixed(2)}
                                            </td>
                                            <td className="py-4">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]?.bg} ${statusColors[order.status]?.text}`}
                                                >
                                                    {statusLabels[order.status] || order.status}
                                                </span>
                                            </td>
                                            <td className="py-4 text-gray-400">
                                                {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>

                {/* Order Status Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass p-6 rounded-2xl border border-white/10"
                >
                    <h2 className="text-xl font-semibold text-white mb-6">
                        Statuts des commandes
                    </h2>

                    <div className="space-y-4">
                        {Object.entries(stats.orders.byStatus).map(([status, count]) => (
                            <div key={status} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`w-3 h-3 rounded-full ${statusColors[status]?.bg.replace("/20", "")}`}
                                    />
                                    <span className="text-gray-300">
                                        {statusLabels[status] || status}
                                    </span>
                                </div>
                                <span className="font-semibold text-white">{count}</span>
                            </div>
                        ))}

                        {Object.keys(stats.orders.byStatus).length === 0 && (
                            <p className="text-gray-500 text-center py-4">
                                Aucune commande
                            </p>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <h3 className="text-sm text-gray-400 mb-4">Actions rapides</h3>
                        <div className="space-y-2">
                            <Link
                                href="/admin/orders?status=PENDING"
                                className="block w-full py-2 px-4 bg-yellow-500/10 text-yellow-400 rounded-xl text-sm hover:bg-yellow-500/20 transition-colors"
                            >
                                Voir les commandes en attente
                            </Link>
                            <Link
                                href="/admin/products?lowStock=true"
                                className="block w-full py-2 px-4 bg-red-500/10 text-red-400 rounded-xl text-sm hover:bg-red-500/20 transition-colors"
                            >
                                Produits en rupture de stock
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
