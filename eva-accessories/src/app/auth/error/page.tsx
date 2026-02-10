"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Suspense } from "react";

const errorMessages: Record<string, { title: string; description: string }> = {
    Configuration: {
        title: "Erreur de configuration",
        description: "Il y a un problème avec la configuration du serveur d'authentification. Veuillez contacter l'administrateur.",
    },
    AccessDenied: {
        title: "Accès refusé",
        description: "Vous n'avez pas la permission d'accéder à cette ressource.",
    },
    Verification: {
        title: "Erreur de vérification",
        description: "Le lien de vérification a expiré ou a déjà été utilisé.",
    },
    OAuthSignin: {
        title: "Erreur de connexion OAuth",
        description: "Impossible de démarrer le processus de connexion avec le fournisseur.",
    },
    OAuthCallback: {
        title: "Erreur de rappel OAuth",
        description: "Erreur lors de la communication avec le fournisseur d'authentification.",
    },
    OAuthCreateAccount: {
        title: "Erreur de création de compte",
        description: "Impossible de créer un compte avec ce fournisseur.",
    },
    EmailCreateAccount: {
        title: "Erreur de création de compte",
        description: "Impossible de créer un compte avec cette adresse email.",
    },
    Callback: {
        title: "Erreur de rappel",
        description: "Erreur lors du traitement de la demande d'authentification.",
    },
    OAuthAccountNotLinked: {
        title: "Compte non lié",
        description: "Cette adresse email est déjà associée à un autre compte. Connectez-vous avec la méthode originale.",
    },
    EmailSignin: {
        title: "Erreur d'envoi d'email",
        description: "Impossible d'envoyer l'email de connexion.",
    },
    CredentialsSignin: {
        title: "Erreur de connexion",
        description: "Identifiants incorrects. Vérifiez votre email et mot de passe.",
    },
    SessionRequired: {
        title: "Session requise",
        description: "Vous devez être connecté pour accéder à cette page.",
    },
    Default: {
        title: "Erreur d'authentification",
        description: "Une erreur inattendue s'est produite. Veuillez réessayer.",
    },
};

function AuthErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error") || "Default";
    const errorInfo = errorMessages[error] || errorMessages.Default;

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full text-center"
            >
                <div className="glass p-8 rounded-2xl border border-white/10">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-2">
                        {errorInfo.title}
                    </h1>
                    <p className="text-gray-400 mb-6">
                        {errorInfo.description}
                    </p>

                    {error === "Configuration" && (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6 text-left">
                            <p className="text-yellow-400 text-sm">
                                <strong>Pour les développeurs :</strong> Vérifiez que les variables d'environnement <code className="bg-black/30 px-1 rounded">GOOGLE_CLIENT_ID</code> et <code className="bg-black/30 px-1 rounded">GOOGLE_CLIENT_SECRET</code> sont correctement configurées.
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/auth/signin"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-medium transition-colors"
                        >
                            <RefreshCw size={18} />
                            Réessayer
                        </Link>
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors"
                        >
                            <ArrowLeft size={18} />
                            Accueil
                        </Link>
                    </div>
                </div>

                <p className="text-gray-500 text-sm mt-6">
                    Code d'erreur : <code className="text-gray-400">{error}</code>
                </p>
            </motion.div>
        </div>
    );
}

export default function AuthErrorPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full" />
                </div>
            }
        >
            <AuthErrorContent />
        </Suspense>
    );
}
