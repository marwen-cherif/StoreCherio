"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    User,
    Package,
    MapPin,
    Heart,
    LogOut,
    ChevronRight,
} from "lucide-react";

interface AccountSidebarProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

const menuItems = [
    { href: "/account", label: "Mon compte", icon: User },
    { href: "/account/orders", label: "Mes commandes", icon: Package },
    { href: "/account/addresses", label: "Mes adresses", icon: MapPin },
    { href: "/account/wishlist", label: "Ma wishlist", icon: Heart },
];

export default function AccountSidebar({ user }: AccountSidebarProps) {
    const pathname = usePathname();

    return (
        <div className="glass rounded-2xl p-6 border border-white/10">
            {/* User Info */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                {user.image ? (
                    <Image
                        src={user.image}
                        alt={user.name || "Avatar"}
                        width={56}
                        height={56}
                        className="rounded-full"
                    />
                ) : (
                    <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-violet-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {user.name?.charAt(0) || "U"}
                    </div>
                )}
                <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{user.name}</p>
                    <p className="text-sm text-gray-400 truncate">{user.email}</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? "bg-pink-500/20 text-pink-400"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <Icon size={20} />
                            <span className="flex-1">{item.label}</span>
                            <ChevronRight
                                size={16}
                                className={isActive ? "opacity-100" : "opacity-0"}
                            />
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="mt-6 pt-6 border-t border-white/10">
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                >
                    <LogOut size={20} />
                    <span>Déconnexion</span>
                </button>
            </div>
        </div>
    );
}
