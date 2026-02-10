"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, MapPin } from "lucide-react";

export interface AddressFormData {
    id?: string;
    label: string;
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
    isDefault: boolean;
}

interface AddressFormProps {
    initialData?: Partial<AddressFormData>;
    onSubmit: (data: AddressFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const COUNTRIES = [
    "France",
    "Belgique",
    "Suisse",
    "Luxembourg",
    "Canada",
    "Maroc",
    "Tunisie",
    "Algérie",
];

export default function AddressForm({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
}: AddressFormProps) {
    const [formData, setFormData] = useState<AddressFormData>({
        label: initialData?.label || "",
        firstName: initialData?.firstName || "",
        lastName: initialData?.lastName || "",
        address1: initialData?.address1 || "",
        address2: initialData?.address2 || "",
        city: initialData?.city || "",
        postalCode: initialData?.postalCode || "",
        country: initialData?.country || "France",
        phone: initialData?.phone || "",
        isDefault: initialData?.isDefault || false,
        id: initialData?.id,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) newErrors.firstName = "Prénom requis";
        if (!formData.lastName.trim()) newErrors.lastName = "Nom requis";
        if (!formData.address1.trim()) newErrors.address1 = "Adresse requise";
        if (!formData.city.trim()) newErrors.city = "Ville requise";
        if (!formData.postalCode.trim()) newErrors.postalCode = "Code postal requis";

        // Validate French postal code format
        if (formData.country === "France" && !/^\d{5}$/.test(formData.postalCode)) {
            newErrors.postalCode = "Code postal invalide (5 chiffres)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            await onSubmit(formData);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-2xl border border-white/10"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center">
                        <MapPin size={20} className="text-pink-400" />
                    </div>
                    <h3 className="text-xl font-semibold">
                        {initialData?.id ? "Modifier l'adresse" : "Nouvelle adresse"}
                    </h3>
                </div>
                <button
                    onClick={onCancel}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <X size={20} className="text-gray-400" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Label */}
                <div>
                    <label className="block text-sm text-gray-400 mb-2">
                        Nom de l&apos;adresse (optionnel)
                    </label>
                    <input
                        type="text"
                        name="label"
                        value={formData.label}
                        onChange={handleChange}
                        placeholder="Maison, Bureau, etc."
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all"
                    />
                </div>

                {/* Name Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Prénom *</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Marie"
                            className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all ${errors.firstName
                                ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
                                : "border-white/10 focus:border-pink-500/50 focus:ring-pink-500/20"
                                }`}
                        />
                        {errors.firstName && (
                            <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Nom *</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Dupont"
                            className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all ${errors.lastName
                                ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
                                : "border-white/10 focus:border-pink-500/50 focus:ring-pink-500/20"
                                }`}
                        />
                        {errors.lastName && (
                            <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
                        )}
                    </div>
                </div>

                {/* Address Lines */}
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Adresse *</label>
                    <input
                        type="text"
                        name="address1"
                        value={formData.address1}
                        onChange={handleChange}
                        placeholder="123 Rue de la Paix"
                        className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all ${errors.address1
                            ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
                            : "border-white/10 focus:border-pink-500/50 focus:ring-pink-500/20"
                            }`}
                    />
                    {errors.address1 && (
                        <p className="text-red-400 text-xs mt-1">{errors.address1}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-2">
                        Complément d&apos;adresse (optionnel)
                    </label>
                    <input
                        type="text"
                        name="address2"
                        value={formData.address2}
                        onChange={handleChange}
                        placeholder="Appartement, étage, bâtiment..."
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all"
                    />
                </div>

                {/* City and Postal Code */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Ville *</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Paris"
                            className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all ${errors.city
                                ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
                                : "border-white/10 focus:border-pink-500/50 focus:ring-pink-500/20"
                                }`}
                        />
                        {errors.city && (
                            <p className="text-red-400 text-xs mt-1">{errors.city}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">
                            Code postal *
                        </label>
                        <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            placeholder="75001"
                            className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all ${errors.postalCode
                                ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
                                : "border-white/10 focus:border-pink-500/50 focus:ring-pink-500/20"
                                }`}
                        />
                        {errors.postalCode && (
                            <p className="text-red-400 text-xs mt-1">{errors.postalCode}</p>
                        )}
                    </div>
                </div>

                {/* Country */}
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Pays *</label>
                    <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all"
                    >
                        {COUNTRIES.map((country) => (
                            <option key={country} value={country} className="bg-gray-900">
                                {country}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm text-gray-400 mb-2">
                        Téléphone (optionnel)
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+33 6 12 34 56 78"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all"
                    />
                </div>

                {/* Default Toggle */}
                <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-white/20 bg-white/5 text-pink-500 focus:ring-pink-500/20"
                    />
                    <span className="text-gray-300 group-hover:text-white transition-colors">
                        Définir comme adresse par défaut
                    </span>
                </label>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-3 px-4 border border-white/10 rounded-xl text-gray-300 hover:bg-white/5 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 btn-primary py-3 font-semibold disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin mx-auto" />
                        ) : initialData?.id ? (
                            "Mettre à jour"
                        ) : (
                            "Ajouter l'adresse"
                        )}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
