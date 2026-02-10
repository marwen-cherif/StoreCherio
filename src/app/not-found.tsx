import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <h1 className="text-9xl font-bold text-primary/20">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mt-4 mb-2">
                Oups ! Page introuvable
            </h2>
            <p className="text-gray-600 mb-8 max-w-md">
                Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            <Link
                href="/"
                className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
                Retour à l'accueil
            </Link>
        </div>
    );
}
