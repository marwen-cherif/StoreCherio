"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Plus, Loader2 } from "lucide-react";
import AddressCard from "@/components/AddressCard";
import AddressForm, { AddressFormData } from "@/components/AddressForm";

interface Address {
    id: string;
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
    isDefault: boolean;
}

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const res = await fetch("/api/addresses");
            if (res.ok) {
                const data = await res.json();
                setAddresses(data);
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddAddress = async (data: AddressFormData) => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/addresses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                await fetchAddresses();
                setShowForm(false);
            }
        } catch (error) {
            console.error("Error adding address:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateAddress = async (data: AddressFormData) => {
        if (!editingAddress) return;
        setIsSaving(true);
        try {
            const res = await fetch(`/api/addresses/${editingAddress.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                await fetchAddresses();
                setEditingAddress(null);
            }
        } catch (error) {
            console.error("Error updating address:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAddress = async (address: Address) => {
        if (!confirm("Supprimer cette adresse ?")) return;

        try {
            const res = await fetch(`/api/addresses/${address.id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                await fetchAddresses();
            }
        } catch (error) {
            console.error("Error deleting address:", error);
        }
    };

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
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-white">Mes adresses</h1>
                    <p className="text-gray-400 mt-1">
                        {addresses.length} adresse{addresses.length !== 1 ? "s" : ""} enregistrée{addresses.length !== 1 ? "s" : ""}
                    </p>
                </div>
                {!showForm && !editingAddress && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 btn-primary px-4 py-2"
                    >
                        <Plus size={18} />
                        Ajouter
                    </button>
                )}
            </motion.div>

            {/* Add Form */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-6 rounded-xl border border-white/10"
                >
                    <h2 className="text-lg font-semibold text-white mb-4">
                        Nouvelle adresse
                    </h2>
                    <AddressForm
                        onSubmit={handleAddAddress}
                        onCancel={() => setShowForm(false)}
                        isLoading={isSaving}
                    />
                </motion.div>
            )}

            {/* Edit Form */}
            {editingAddress && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-6 rounded-xl border border-white/10"
                >
                    <h2 className="text-lg font-semibold text-white mb-4">
                        Modifier l&apos;adresse
                    </h2>
                    <AddressForm
                        initialData={{
                            firstName: editingAddress.firstName,
                            lastName: editingAddress.lastName,
                            address1: editingAddress.address1,
                            address2: editingAddress.address2 || "",
                            city: editingAddress.city,
                            postalCode: editingAddress.postalCode,
                            country: editingAddress.country,
                            phone: editingAddress.phone || "",
                            isDefault: editingAddress.isDefault,
                        }}
                        onSubmit={handleUpdateAddress}
                        onCancel={() => setEditingAddress(null)}
                        isLoading={isSaving}
                    />
                </motion.div>
            )}

            {/* Addresses List */}
            {!showForm && !editingAddress && (
                <>
                    {addresses.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass p-12 rounded-xl border border-white/10 text-center"
                        >
                            <MapPin size={64} className="text-gray-600 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-white mb-2">
                                Aucune adresse
                            </h2>
                            <p className="text-gray-500 mb-6">
                                Ajoutez une adresse pour faciliter vos prochaines commandes.
                            </p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="btn-primary px-6 py-2 inline-flex items-center gap-2"
                            >
                                <Plus size={18} />
                                Ajouter une adresse
                            </button>
                        </motion.div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {addresses.map((address, index) => (
                                <motion.div
                                    key={address.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <AddressCard
                                        address={address}
                                        onEdit={() => setEditingAddress(address)}
                                        onDelete={() => handleDeleteAddress(address)}
                                        showActions={true}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
