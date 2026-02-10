"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Filter, X, Loader2, ShoppingBag } from "lucide-react";
import ProductCard from "@/components/ProductCard";

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    compareAtPrice?: number | null;
    images: string[];
    category: string;
    stock: number;
    isFeatured?: boolean;
}

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
}

function ShopContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedCategory) params.set("category", selectedCategory);
            if (searchTerm) params.set("search", searchTerm);

            const res = await fetch(`/api/products?${params}`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data.products);
                setCategories(data.categories || []);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setIsLoading(false);
        }
    }, [selectedCategory, searchTerm]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const updateParams = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        router.push(`/shop?${params.toString()}`);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateParams({ search: searchTerm || null });
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        updateParams({ category: category || null });
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("");
        router.push("/shop");
    };

    const hasFilters = searchTerm || selectedCategory;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Notre Collection 🎀
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Découvrez nos accessoires pour cheveux adorables, conçus avec amour pour les petites princesses.
                </p>
            </motion.div>

            {/* Filters Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass p-4 rounded-2xl border border-white/10 mb-8"
            >
                <div className="flex flex-wrap items-center gap-4">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Rechercher un produit..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-pink-500/50"
                            />
                        </div>
                    </form>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleCategoryChange("")}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${!selectedCategory
                                ? "bg-pink-500 text-white"
                                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                                }`}
                        >
                            Tout
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryChange(category.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === category.id
                                    ? "bg-pink-500 text-white"
                                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {/* Clear Filters */}
                    {hasFilters && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-1 px-3 py-2 text-gray-400 hover:text-white text-sm"
                        >
                            <X size={16} />
                            Effacer
                        </button>
                    )}
                </div>
            </motion.div>

            {/* Results Count */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-between mb-6"
            >
                <p className="text-gray-400">
                    {products.length} produit{products.length !== 1 ? "s" : ""}
                    {selectedCategory && categories.find(c => c.id === selectedCategory) && (
                        <span> dans {categories.find(c => c.id === selectedCategory)?.name}</span>
                    )}
                </p>
            </motion.div>

            {/* Products Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={48} className="animate-spin text-pink-400" />
                </div>
            ) : products.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20"
                >
                    <ShoppingBag size={64} className="text-gray-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-white mb-2">
                        Aucun produit trouvé
                    </h2>
                    <p className="text-gray-500 mb-6">
                        Essayez d&apos;ajuster vos filtres ou votre recherche.
                    </p>
                    <button
                        onClick={clearFilters}
                        className="btn-primary px-6 py-2"
                    >
                        Voir tous les produits
                    </button>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                        <ProductCard
                            key={product.id}
                            product={{
                                id: product.id,
                                slug: product.slug,
                                name: product.name,
                                price: product.price,
                                description: product.description,
                                image: product.images[0] || "/placeholder-product.jpg",
                                currency: "eur",
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 size={48} className="animate-spin text-pink-400" />
                </div>
            }
        >
            <ShopContent />
        </Suspense>
    );
}
