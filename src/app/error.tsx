'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <h1 className="text-4xl font-bold text-red-500 mb-4">
                Une erreur est survenue
            </h1>
            <p className="text-gray-600 mb-8 max-w-md">
                Nous sommes désolés, mais quelque chose s'est mal passé de notre côté.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                    className="px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                >
                    Réessayer
                </button>
                <a
                    href="/"
                    className="px-6 py-3 bg-gray-100 text-gray-900 rounded-full font-medium hover:bg-gray-200 transition-colors"
                >
                    Retour à l'accueil
                </a>
            </div>
        </div>
    );
}
