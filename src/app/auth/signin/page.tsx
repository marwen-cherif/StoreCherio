"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Chrome, Mail, ArrowLeft, Loader2 } from "lucide-react";

function SignInContent() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const error = searchParams.get("error");

    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formError, setFormError] = useState("");

    const handleGoogleSignIn = async () => {
        setIsLoading("google");
        await signIn("google", { callbackUrl });
    };

    const handleCredentialsSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading("credentials");
        setFormError("");

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl,
        });

        if (result?.error) {
            setFormError("Email ou mot de passe incorrect");
            setIsLoading(null);
        } else if (result?.url) {
            window.location.href = result.url;
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
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
                        Connexion
                    </h1>
                    <p className="text-gray-400">
                        Connectez-vous pour finaliser votre commande
                    </p>
                </div>

                {/* Error message */}
                {(error || formError) && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                        {formError || "Une erreur est survenue. Veuillez réessayer."}
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

                    {/* Email/Password Form */}
                    <form onSubmit={handleCredentialsSignIn} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Email</label>
                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading !== null}
                            className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50"
                        >
                            {isLoading === "credentials" ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                "Se connecter"
                            )}
                        </button>
                    </form>

                    {/* Sign up link */}
                    <p className="text-center text-gray-400 text-sm mt-6">
                        Pas encore de compte ?{" "}
                        <Link
                            href={`/auth/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                            className="text-pink-400 hover:underline"
                        >
                            Créer un compte
                        </Link>
                    </p>
                </div>

                {/* Security note */}
                <p className="text-center text-gray-500 text-xs mt-6">
                    🔒 Connexion sécurisée • Vos données sont protégées
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

export default function SignInPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <SignInContent />
        </Suspense>
    );
}
