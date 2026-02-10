"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    MapPin,
    Package,
    User,
    Mail,
    Phone,
    Truck,
    Calendar,
    CreditCard,
    Edit2,
    Save,
    X,
    Loader2,
} from "lucide-react";

interface OrderItem {
    id: string;
    productId?: string;
    productName: string;
    unitPrice: number;
    quantity: number;
    product?: {
        images?: string[];
    };
}

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    user?: {
        id: string;
        name: string;
        email: string;
        phone?: string;
    };
    shippingFirstName: string;
    shippingLastName: string;
    shippingAddress1: string;
    shippingAddress2?: string;
    shippingCity: string;
    shippingPostalCode: string;
    shippingCountry: string;
    shippingPhone?: string;
    subtotal: number;
    shippingCost: number;
    discount: number;
    total: number;
    trackingNumber?: string;
    trackingUrl?: string;
    customerNote?: string;
    internalNote?: string;
    paidAt?: string;
    shippedAt?: string;
    deliveredAt?: string;
    createdAt: string;
    items: OrderItem[];
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
    PENDING: { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/50" },
    PAID: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/50" },
    PROCESSING: { bg: "bg-indigo-500/20", text: "text-indigo-400", border: "border-indigo-500/50" },
    SHIPPED: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/50" },
    DELIVERED: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/50" },
    COMPLETED: { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/50" },
    CANCELLED: { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/50" },
    REFUNDED: { bg: "bg-gray-500/20", text: "text-gray-400", border: "border-gray-500/50" },
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

const statusFlow = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED"];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();

    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({
        status: "",
        trackingNumber: "",
        trackingUrl: "",
        internalNote: "",
    });

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/admin/orders/${resolvedParams.id}`);
                if (!res.ok) throw new Error("Failed to fetch order");
                const data = await res.json();
                setOrder(data);
                setEditData({
                    status: data.status,
                    trackingNumber: data.trackingNumber || "",
                    trackingUrl: data.trackingUrl || "",
                    internalNote: data.internalNote || "",
                });
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [resolvedParams.id]);

    const handleSave = async () => {
        if (!order) return;
        setIsSaving(true);

        try {
            const res = await fetch(`/api/admin/orders/${order.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editData),
            });

            if (res.ok) {
                const updated = await res.json();
                setOrder(updated);
                setEditMode(false);
            }
        } catch (error) {
            console.error("Error updating order:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-20">
                <p className="text-red-400">Commande non trouvée</p>
                <Link href="/admin/orders" className="text-pink-400 mt-4 inline-block">
                    Retour aux commandes
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/orders"
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} className="text-gray-400" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            {order.orderNumber}
                            <span
                                className={`px-3 py-1 rounded-full text-sm ${statusColors[order.status]?.bg} ${statusColors[order.status]?.text}`}
                            >
                                {statusLabels[order.status]}
                            </span>
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Créée le {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {!editMode ? (
                        <button
                            onClick={() => setEditMode(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <Edit2 size={18} />
                            Modifier
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => setEditMode(false)}
                                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X size={18} />
                                Annuler
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-4 py-2 btn-primary"
                            >
                                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                Enregistrer
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-6 rounded-xl border border-white/10"
                    >
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Package size={20} className="text-pink-400" />
                            Produits ({order.items.length})
                        </h2>

                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4 p-3 bg-white/5 rounded-lg"
                                >
                                    <div className="w-16 h-16 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                                        {item.product?.images?.[0] ? (
                                            <Image
                                                src={item.product.images[0]}
                                                alt={item.productName}
                                                width={64}
                                                height={64}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package size={24} className="text-gray-500" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-white">{item.productName}</p>
                                        <p className="text-sm text-gray-400">
                                            €{(item.unitPrice / 100).toFixed(2)} × {item.quantity}
                                        </p>
                                    </div>
                                    <p className="font-semibold text-white">
                                        €{((item.unitPrice * item.quantity) / 100).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                            <div className="flex justify-between text-gray-400">
                                <span>Sous-total</span>
                                <span>€{(order.subtotal / 100).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Livraison</span>
                                <span>{order.shippingCost === 0 ? "Gratuite" : `€${(order.shippingCost / 100).toFixed(2)}`}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-green-400">
                                    <span>Réduction</span>
                                    <span>-€{(order.discount / 100).toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-xl font-bold pt-2 border-t border-white/10">
                                <span>Total</span>
                                <span className="text-pink-400">€{(order.total / 100).toFixed(2)}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Status & Tracking */}
                    {editMode && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass p-6 rounded-xl border border-white/10"
                        >
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Truck size={20} className="text-pink-400" />
                                Statut & Expédition
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Statut</label>
                                    <select
                                        value={editData.status}
                                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                                    >
                                        {statusFlow.map((status) => (
                                            <option key={status} value={status} className="bg-gray-900">
                                                {statusLabels[status]}
                                            </option>
                                        ))}
                                        <option value="CANCELLED" className="bg-gray-900">Annulée</option>
                                        <option value="REFUNDED" className="bg-gray-900">Remboursée</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Numéro de suivi</label>
                                    <input
                                        type="text"
                                        value={editData.trackingNumber}
                                        onChange={(e) => setEditData({ ...editData, trackingNumber: e.target.value })}
                                        placeholder="Colissimo 6X123456789"
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">URL de suivi</label>
                                    <input
                                        type="text"
                                        value={editData.trackingUrl}
                                        onChange={(e) => setEditData({ ...editData, trackingUrl: e.target.value })}
                                        placeholder="https://www.laposte.fr/outils/suivre-vos-envois..."
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Note interne</label>
                                    <textarea
                                        value={editData.internalNote}
                                        onChange={(e) => setEditData({ ...editData, internalNote: e.target.value })}
                                        placeholder="Notes de traitement..."
                                        rows={3}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 resize-none"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass p-6 rounded-xl border border-white/10"
                    >
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <User size={20} className="text-pink-400" />
                            Client
                        </h2>

                        {order.user ? (
                            <div className="space-y-3">
                                <p className="text-white font-medium">{order.user.name}</p>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Mail size={16} />
                                    <span className="text-sm">{order.user.email}</span>
                                </div>
                                {order.user.phone && (
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Phone size={16} />
                                        <span className="text-sm">{order.user.phone}</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500">Client invité</p>
                        )}
                    </motion.div>

                    {/* Shipping Address */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass p-6 rounded-xl border border-white/10"
                    >
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <MapPin size={20} className="text-pink-400" />
                            Adresse de livraison
                        </h2>

                        <div className="space-y-1 text-gray-300">
                            <p className="font-medium text-white">
                                {order.shippingFirstName} {order.shippingLastName}
                            </p>
                            <p>{order.shippingAddress1}</p>
                            {order.shippingAddress2 && <p>{order.shippingAddress2}</p>}
                            <p>
                                {order.shippingPostalCode} {order.shippingCity}
                            </p>
                            <p>{order.shippingCountry}</p>
                            {order.shippingPhone && (
                                <p className="text-gray-400 pt-2">{order.shippingPhone}</p>
                            )}
                        </div>
                    </motion.div>

                    {/* Timeline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass p-6 rounded-xl border border-white/10"
                    >
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Calendar size={20} className="text-pink-400" />
                            Historique
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-gray-400" />
                                <div>
                                    <p className="text-sm text-white">Commande créée</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(order.createdAt).toLocaleString("fr-FR")}
                                    </p>
                                </div>
                            </div>
                            {order.paidAt && (
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                                    <div>
                                        <p className="text-sm text-white">Payée</p>
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
                                        <p className="text-sm text-white">Expédiée</p>
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
                                        <p className="text-sm text-white">Livrée</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(order.deliveredAt).toLocaleString("fr-FR")}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
