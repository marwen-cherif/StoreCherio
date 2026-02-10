"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Eye,
    Truck,
    Package,
    X,
    Loader2,
} from "lucide-react";

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    customer: {
        id?: string;
        name: string;
        email?: string;
    };
    total: number;
    createdAt: string;
    items: Array<{
        name: string;
        quantity: number;
    }>;
}

interface Pagination {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
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

const allStatuses = Object.keys(statusLabels);

function OrdersContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [orders, setOrders] = useState<Order[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");
    const [showFilters, setShowFilters] = useState(false);

    const currentPage = parseInt(searchParams.get("page") || "1");

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: "20",
            });

            if (searchTerm) params.set("search", searchTerm);
            if (statusFilter) params.set("status", statusFilter);

            const res = await fetch(`/api/admin/orders?${params}`);
            if (!res.ok) throw new Error("Failed to fetch orders");

            const data = await res.json();
            setOrders(data.orders);
            setPagination(data.pagination);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchTerm, statusFilter]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const updateParams = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        // Reset to page 1 when filters change
        if (!updates.page) {
            params.set("page", "1");
        }

        router.push(`/admin/orders?${params.toString()}`);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateParams({ search: searchTerm || null });
    };

    const handleStatusFilter = (status: string) => {
        setStatusFilter(status);
        updateParams({ status: status || null });
        setShowFilters(false);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setStatusFilter("");
        router.push("/admin/orders");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Commandes</h1>
                    <p className="text-gray-400 mt-1">
                        {pagination ? `${pagination.totalCount} commandes au total` : "Chargement..."}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="glass p-4 rounded-xl border border-white/10">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Rechercher par n° commande, client..."
                                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-pink-500/50"
                            />
                        </div>
                    </form>

                    {/* Status Filter */}
                    <div className="relative">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${statusFilter
                                ? "bg-pink-500/20 border-pink-500/50 text-pink-400"
                                : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                                }`}
                        >
                            <Filter size={18} />
                            {statusFilter ? statusLabels[statusFilter] : "Statut"}
                        </button>

                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute top-full mt-2 right-0 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-xl z-10 overflow-hidden"
                            >
                                <button
                                    onClick={() => handleStatusFilter("")}
                                    className={`w-full px-4 py-2 text-left text-sm hover:bg-white/5 ${!statusFilter ? "text-pink-400" : "text-gray-300"
                                        }`}
                                >
                                    Tous les statuts
                                </button>
                                {allStatuses.map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusFilter(status)}
                                        className={`w-full px-4 py-2 text-left text-sm hover:bg-white/5 flex items-center gap-2 ${statusFilter === status ? "text-pink-400" : "text-gray-300"
                                            }`}
                                    >
                                        <span
                                            className={`w-2 h-2 rounded-full ${statusColors[status]?.bg.replace("/20", "")}`}
                                        />
                                        {statusLabels[status]}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </div>

                    {/* Clear Filters */}
                    {(searchTerm || statusFilter) && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-1 px-3 py-2 text-gray-400 hover:text-white text-sm"
                        >
                            <X size={16} />
                            Effacer
                        </button>
                    )}
                </div>
            </div>

            {/* Orders Table */}
            <div className="glass rounded-xl border border-white/10 overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <Package size={48} className="mb-4" />
                        <p>Aucune commande trouvée</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-white/5">
                            <tr className="text-left text-gray-400 text-sm">
                                <th className="px-6 py-4 font-medium">Commande</th>
                                <th className="px-6 py-4 font-medium">Client</th>
                                <th className="px-6 py-4 font-medium">Produits</th>
                                <th className="px-6 py-4 font-medium">Total</th>
                                <th className="px-6 py-4 font-medium">Statut</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {orders.map((order, index) => (
                                <motion.tr
                                    key={order.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.02 }}
                                    className="hover:bg-white/5"
                                >
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/admin/orders/${order.id}`}
                                            className="text-pink-400 hover:text-pink-300 font-medium"
                                        >
                                            {order.orderNumber}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-white">{order.customer.name}</p>
                                            {order.customer.email && (
                                                <p className="text-gray-500 text-xs">{order.customer.email}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">
                                        {order.items.length} article{order.items.length > 1 ? "s" : ""}
                                    </td>
                                    <td className="px-6 py-4 text-white font-medium">
                                        €{(order.total / 100).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]?.bg} ${statusColors[order.status]?.text}`}
                                        >
                                            {statusLabels[order.status] || order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">
                                        {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                title="Voir les détails"
                                            >
                                                <Eye size={18} className="text-gray-400 hover:text-white" />
                                            </Link>
                                            {order.status === "PAID" && (
                                                <button
                                                    className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors"
                                                    title="Marquer comme expédiée"
                                                >
                                                    <Truck size={18} className="text-gray-400 hover:text-purple-400" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
                        <p className="text-sm text-gray-400">
                            Page {pagination.page} sur {pagination.totalPages}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => updateParams({ page: (currentPage - 1).toString() })}
                                disabled={currentPage <= 1}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={18} className="text-gray-400" />
                            </button>
                            <button
                                onClick={() => updateParams({ page: (currentPage + 1).toString() })}
                                disabled={currentPage >= pagination.totalPages}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={18} className="text-gray-400" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="flex items-center justify-center py-20">
            <Loader2 size={48} className="animate-spin text-pink-400" />
        </div>
    );
}

export default function OrdersPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <OrdersContent />
        </Suspense>
    );
}
