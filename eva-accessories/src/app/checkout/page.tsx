"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    ArrowRight,
    MapPin,
    CreditCard,
    Plus,
    Loader2,
    Package,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import AddressForm from "@/components/AddressForm";
import AddressCard from "@/components/AddressCard";

interface Address {
    id: string;
    label?: string | null;
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string | null;
    city: string;
    postalCode: string;
    country: string;
    phone?: string | null;
    isDefault: boolean;
}

type Step = "address" | "payment";

export default function CheckoutPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { cart, total, clearCart } = useCart();

    const [currentStep, setCurrentStep] = useState<Step>("address");
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect if not authenticated or empty cart
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin?callbackUrl=/checkout");
        }
        if (cart.length === 0 && status !== "loading") {
            router.push("/cart");
        }
    }, [status, cart, router]);

    // Fetch addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            if (status !== "authenticated") return;

            try {
                const res = await fetch("/api/addresses");
                if (res.ok) {
                    const data = await res.json();
                    setAddresses(data);
                    // Auto-select default address
                    const defaultAddr = data.find((a: Address) => a.isDefault);
                    if (defaultAddr) setSelectedAddress(defaultAddr);
                }
            } catch (error) {
                console.error("Error fetching addresses:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAddresses();
    }, [status]);

    const handleAddAddress = async (data: Omit<Address, "id">) => {
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/addresses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                const newAddress = await res.json();
                setAddresses((prev) => [newAddress, ...prev]);
                setSelectedAddress(newAddress);
                setShowAddressForm(false);
            }
        } catch (error) {
            console.error("Error adding address:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditAddress = async (data: Address) => {
        if (!editingAddress) return;
        setIsSubmitting(true);

        try {
            const res = await fetch(`/api/addresses/${editingAddress.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                const updated = await res.json();
                setAddresses((prev) =>
                    prev.map((a) => (a.id === updated.id ? updated : a))
                );
                if (selectedAddress?.id === updated.id) {
                    setSelectedAddress(updated);
                }
                setEditingAddress(null);
            }
        } catch (error) {
            console.error("Error updating address:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteAddress = async (address: Address) => {
        if (!confirm("Voulez-vous vraiment supprimer cette adresse ?")) return;

        try {
            const res = await fetch(`/api/addresses/${address.id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setAddresses((prev) => prev.filter((a) => a.id !== address.id));
                if (selectedAddress?.id === address.id) {
                    setSelectedAddress(null);
                }
            }
        } catch (error) {
            console.error("Error deleting address:", error);
        }
    };

    const handleProceedToPayment = () => {
        if (!selectedAddress) {
            alert("Veuillez sélectionner une adresse de livraison");
            return;
        }
        setCurrentStep("payment");
    };

    const handleCheckout = async () => {
        if (!selectedAddress) return;
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/checkout_sessions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cart,
                    userId: session?.user?.id,
                    addressId: selectedAddress.id,
                }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                alert("Erreur lors de la création du paiement");
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Erreur réseau. Veuillez réessayer.");
            setIsSubmitting(false);
        }
    };

    if (status === "loading" || isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 size={48} className="animate-spin text-pink-400" />
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-6xl py-8 px-4">
            {/* Back Link */}
            <Link
                href="/cart"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-pink-400 transition-colors mb-8"
            >
                <ArrowLeft size={18} />
                Retour au panier
            </Link>

            {/* Header */}
            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                Finaliser ma commande
            </h1>

            {/* Progress Steps */}
            <div className="flex items-center gap-4 mb-12">
                <div
                    className={`flex items-center gap-2 ${currentStep === "address" ? "text-pink-400" : "text-gray-500"
                        }`}
                >
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "address"
                            ? "bg-pink-500 text-white"
                            : selectedAddress
                                ? "bg-green-500 text-white"
                                : "bg-white/10"
                            }`}
                    >
                        <MapPin size={16} />
                    </div>
                    <span className="font-medium">Livraison</span>
                </div>

                <div className="flex-1 h-px bg-white/10" />

                <div
                    className={`flex items-center gap-2 ${currentStep === "payment" ? "text-pink-400" : "text-gray-500"
                        }`}
                >
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "payment" ? "bg-pink-500 text-white" : "bg-white/10"
                            }`}
                    >
                        <CreditCard size={16} />
                    </div>
                    <span className="font-medium">Paiement</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        {currentStep === "address" && (
                            <motion.div
                                key="address"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold flex items-center gap-2">
                                        <MapPin size={20} className="text-pink-400" />
                                        Adresse de livraison
                                    </h2>
                                    {!showAddressForm && !editingAddress && (
                                        <button
                                            onClick={() => setShowAddressForm(true)}
                                            className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors"
                                        >
                                            <Plus size={18} />
                                            Ajouter une adresse
                                        </button>
                                    )}
                                </div>

                                {/* Address Form */}
                                {(showAddressForm || editingAddress) && (
                                    <div className="mb-6">
                                        <AddressForm
                                            initialData={editingAddress ? {
                                                id: editingAddress.id,
                                                label: editingAddress.label ?? "",
                                                firstName: editingAddress.firstName,
                                                lastName: editingAddress.lastName,
                                                address1: editingAddress.address1,
                                                address2: editingAddress.address2 ?? "",
                                                city: editingAddress.city,
                                                postalCode: editingAddress.postalCode,
                                                country: editingAddress.country,
                                                phone: editingAddress.phone ?? "",
                                                isDefault: editingAddress.isDefault,
                                            } : undefined}
                                            onSubmit={async (data) => {
                                                if (editingAddress) {
                                                    await handleEditAddress({ ...data, id: editingAddress.id } as Address);
                                                } else {
                                                    await handleAddAddress(data as Omit<Address, "id">);
                                                }
                                            }}
                                            onCancel={() => {
                                                setShowAddressForm(false);
                                                setEditingAddress(null);
                                            }}
                                            isLoading={isSubmitting}
                                        />
                                    </div>
                                )}

                                {/* Address List */}
                                {!showAddressForm && !editingAddress && (
                                    <div className="space-y-4">
                                        {addresses.length === 0 ? (
                                            <div className="glass p-8 rounded-2xl text-center">
                                                <MapPin
                                                    size={48}
                                                    className="mx-auto text-gray-600 mb-4"
                                                />
                                                <p className="text-gray-400 mb-4">
                                                    Vous n&apos;avez pas encore d&apos;adresse enregistrée
                                                </p>
                                                <button
                                                    onClick={() => setShowAddressForm(true)}
                                                    className="btn-primary px-6 py-3"
                                                >
                                                    Ajouter une adresse
                                                </button>
                                            </div>
                                        ) : (
                                            addresses.map((address) => (
                                                <AddressCard
                                                    key={address.id}
                                                    address={address}
                                                    isSelected={selectedAddress?.id === address.id}
                                                    onSelect={setSelectedAddress}
                                                    onEdit={setEditingAddress}
                                                    onDelete={handleDeleteAddress}
                                                />
                                            ))
                                        )}
                                    </div>
                                )}

                                {/* Continue Button */}
                                {addresses.length > 0 && !showAddressForm && !editingAddress && (
                                    <button
                                        onClick={handleProceedToPayment}
                                        disabled={!selectedAddress}
                                        className="w-full mt-8 btn-primary py-4 text-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        Continuer vers le paiement
                                        <ArrowRight size={20} />
                                    </button>
                                )}
                            </motion.div>
                        )}

                        {currentStep === "payment" && (
                            <motion.div
                                key="payment"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <button
                                    onClick={() => setCurrentStep("address")}
                                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                                >
                                    <ArrowLeft size={18} />
                                    Modifier l&apos;adresse
                                </button>

                                <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
                                    <CreditCard size={20} className="text-pink-400" />
                                    Récapitulatif et paiement
                                </h2>

                                {/* Selected Address Summary */}
                                {selectedAddress && (
                                    <div className="glass p-4 rounded-xl mb-6">
                                        <p className="text-sm text-gray-400 mb-2">
                                            Livraison à :
                                        </p>
                                        <p className="font-medium">
                                            {selectedAddress.firstName} {selectedAddress.lastName}
                                        </p>
                                        <p className="text-gray-300 text-sm">
                                            {selectedAddress.address1}, {selectedAddress.postalCode}{" "}
                                            {selectedAddress.city}
                                        </p>
                                    </div>
                                )}

                                {/* Cart Items */}
                                <div className="space-y-4 mb-8">
                                    {cart.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-4 glass p-4 rounded-xl"
                                        >
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-gray-400">
                                                    Quantité: {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-semibold text-pink-400">
                                                €{((item.price * item.quantity) / 100).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Pay Button */}
                                <button
                                    onClick={handleCheckout}
                                    disabled={isSubmitting}
                                    className="w-full btn-primary py-4 text-lg font-bold shadow-xl shadow-pink-500/20 hover:shadow-pink-500/40 relative overflow-hidden"
                                >
                                    {isSubmitting ? (
                                        <Loader2 size={24} className="animate-spin mx-auto" />
                                    ) : (
                                        <>Payer €{(total / 100).toFixed(2)}</>
                                    )}
                                </button>

                                <p className="text-center text-xs text-gray-500 mt-4">
                                    🔒 Paiement sécurisé par Stripe
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-1">
                    <div className="glass p-6 rounded-2xl sticky top-24 border border-white/10">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Package size={18} className="text-pink-400" />
                            Votre commande
                        </h3>

                        <div className="space-y-3 mb-6">
                            {cart.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-gray-400">
                                        {item.name} × {item.quantity}
                                    </span>
                                    <span>€{((item.price * item.quantity) / 100).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-white/10 pt-4 space-y-2">
                            <div className="flex justify-between text-sm text-gray-400">
                                <span>Sous-total</span>
                                <span>€{(total / 100).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-400">
                                <span>Livraison</span>
                                <span className="text-green-400">Gratuite</span>
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-4 mt-4">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">Total</span>
                                <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                                    €{(total / 100).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
