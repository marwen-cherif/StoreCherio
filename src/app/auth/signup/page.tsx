"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Chrome, Mail, User, Lock, ArrowLeft, Loader2 } from "lucide-react";

function SignUpContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [formError, setFormError] = useState("");

    const handleGoogleSignIn = async () => {
        setIsLoading("google");
        await signIn("google", { callbackUrl });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");

        if (formData.password !== formData.confirmPassword) {
            setFormError("Les mots de passe ne correspondent pas");
            return;
        }

        if (formData.password.length < 8) {
            setFormError("Le mot de passe doit contenir au moins 8 caractères");
            return;
        }

        setIsLoading("credentials");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setFormError(data.error || "Une erreur est survenue");
                setIsLoading(null);
                return;
            }

            // Auto sign in after registration
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
                callbackUrl,
            });

            if (result?.url) {
                router.push(result.url);
            }
        } catch {
            setFormError("Une erreur est survenue");
            setIsLoading(null);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Back to cart link */}
                <Link
                    href="/cart"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-pink-400 transition-colors mb-8"
                >
                    <ArrowLeft size={18} />
                    Retour au panier
                </Link>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent mb-3">
                        Créer un compte
                    </h1>
                    <p className="text-gray-400">
                        Inscrivez-vous pour finaliser votre commande
                    </p>
                </div>

                {/* Error message */}
                {formError && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                        {formError}
                    </div>
                )}

                {/* Card */}
                <div className="glass p-8 rounded-2xl border border-white/10">
                    {/* Google Sign In */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={isLoading !== null}
                        className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-medium py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        {isLoading === "google" ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <Chrome size={20} />
                        )}
                        Continuer avec Google
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-gray-500 text-sm">ou</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Prénom</label>
                            <div className="relative">
                                <User
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    placeholder="Marie"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Email</label>
                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    placeholder="votre@email.com"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Minimum 8 caractères</p>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                Confirmer le mot de passe
                            </label>
                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                />
                                <input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) =>
                                        setFormData({ ...formData, confirmPassword: e.target.value })
                                    }
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading !== null}
                            className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50"
                        >
                            {isLoading === "credentials" ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                "Créer mon compte"
                            )}
                        </button>
                    </form>

                    {/* Sign in link */}
                    <p className="text-center text-gray-400 text-sm mt-6">
                        Déjà un compte ?{" "}
                        <Link
                            href={`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                            className="text-pink-400 hover:underline"
                        >
                            Se connecter
                        </Link>
                    </p>
                </div>

                {/* Security note */}
                <p className="text-center text-gray-500 text-xs mt-6">
                    🔒 Inscription sécurisée • Vos données sont protégées
                </p>
            </motion.div>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <Loader2 size={32} className="animate-spin text-pink-400" />
        </div>
    );
}

export default function SignUpPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <SignUpContent />
        </Suspense>
    );
}
