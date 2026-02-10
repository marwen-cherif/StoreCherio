"use client";

import { motion } from "framer-motion";
import { MapPin, Check, Edit2, Trash2 } from "lucide-react";

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

interface AddressCardProps {
    address: Address;
    isSelected?: boolean;
    onSelect?: (address: Address) => void;
    onEdit?: (address: Address) => void;
    onDelete?: (address: Address) => void;
    showActions?: boolean;
}

export default function AddressCard({
    address,
    isSelected = false,
    onSelect,
    onEdit,
    onDelete,
    showActions = true,
}: AddressCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onSelect?.(address)}
            className={`glass p-5 rounded-xl border-2 transition-all cursor-pointer ${isSelected
                    ? "border-pink-500 bg-pink-500/10"
                    : "border-transparent hover:border-white/20"
                }`}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                    <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-pink-500" : "bg-white/10"
                            }`}
                    >
                        {isSelected ? (
                            <Check size={18} className="text-white" />
                        ) : (
                            <MapPin size={18} className="text-gray-400" />
                        )}
                    </div>

                    <div>
                        {/* Label and Default Badge */}
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-white">
                                {address.label || `${address.firstName} ${address.lastName}`}
                            </span>
                            {address.isDefault && (
                                <span className="text-xs px-2 py-0.5 bg-violet-500/20 text-violet-400 rounded-full">
                                    Par défaut
                                </span>
                            )}
                        </div>

                        {/* Full Name if label is set */}
                        {address.label && (
                            <p className="text-sm text-gray-300 mb-1">
                                {address.firstName} {address.lastName}
                            </p>
                        )}

                        {/* Address */}
                        <p className="text-sm text-gray-400">
                            {address.address1}
                            {address.address2 && `, ${address.address2}`}
                        </p>
                        <p className="text-sm text-gray-400">
                            {address.postalCode} {address.city}, {address.country}
                        </p>

                        {/* Phone */}
                        {address.phone && (
                            <p className="text-sm text-gray-500 mt-1">{address.phone}</p>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                {showActions && (onEdit || onDelete) && (
                    <div className="flex gap-2">
                        {onEdit && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(address);
                                }}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                title="Modifier"
                            >
                                <Edit2 size={16} className="text-gray-400 hover:text-white" />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(address);
                                }}
                                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Supprimer"
                            >
                                <Trash2 size={16} className="text-gray-400 hover:text-red-400" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
