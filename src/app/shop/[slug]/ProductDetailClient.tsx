"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    ShoppingCart,
    Heart,
    Minus,
    Plus,
    Truck,
    Shield,
    RotateCcw,
    Loader2,
    Star,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";

interface ProductVariant {
    id: string;
    name: string;
    price: number;
    stock: number;
}

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
    variants?: ProductVariant[];
    metadata?: {
        material?: string;
        size?: string;
        ageRange?: string;
        careInstructions?: string;
        quantity?: number;
        includes?: string;
    };
}

export default function ProductDetailClient({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const resolvedParams = use(params);
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${resolvedParams.slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data.product);
                    setRelatedProducts(data.relatedProducts || []);
                    if (data.product.variants?.length > 0) {
                        setSelectedVariant(data.product.variants[0]);
                    }
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [resolvedParams.slug]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 size={48} className="animate-spin text-pink-400" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold text-white mb-4">Produit non trouvé</h1>
                <Link href="/shop" className="text-pink-400 hover:text-pink-300">
                    Retour à la boutique
                </Link>
            </div>
        );
    }

    const currentPrice = selectedVariant?.price || product.price;
    const currentStock = selectedVariant?.stock ?? product.stock;
    const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
    const discountPercent = hasDiscount
        ? Math.round((1 - product.price / product.compareAtPrice!) * 100)
        : 0;

    const handleAddToCart = () => {
        // Add item multiple times based on quantity selected
        for (let i = 0; i < quantity; i++) {
            addToCart({
                id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
                slug: product.slug,
                name: selectedVariant ? `${product.name} - ${selectedVariant.name}` : product.name,
                price: currentPrice,
                description: product.description,
                image: product.images[0] || "/placeholder-product.jpg",
                currency: "eur",
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
            >
                <ArrowLeft size={20} />
                Retour à la boutique
            </Link>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Images */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="relative aspect-square bg-white/5 rounded-2xl overflow-hidden mb-4">
                        {product.images[activeImageIndex] ? (
                            <Image
                                src={product.images[activeImageIndex]}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-8xl">
                                🎀
                            </div>
                        )}

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {hasDiscount && (
                                <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-lg">
                                    -{discountPercent}%
                                </span>
                            )}
                            {product.isFeatured && (
                                <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-violet-500 text-white text-sm font-bold rounded-lg flex items-center gap-1">
                                    <Star size={14} fill="white" />
                                    Top produit
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Thumbnail Gallery */}
                    {product.images.length > 1 && (
                        <div className="flex gap-3">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImageIndex(index)}
                                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImageIndex === index
                                            ? "border-pink-500"
                                            : "border-white/10 hover:border-white/30"
                                        }`}
                                >
                                    <Image src={image} alt="" fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Product Info */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <p className="text-pink-400 text-sm uppercase tracking-wide mb-2">
                        {product.category}
                    </p>

                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {product.name}
                    </h1>

                    <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                        {product.description}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-3 mb-6">
                        <span className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                            €{(currentPrice / 100).toFixed(2)}
                        </span>
                        {hasDiscount && (
                            <span className="text-xl text-gray-500 line-through">
                                €{(product.compareAtPrice! / 100).toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* Variants */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="mb-6">
                            <p className="text-sm text-gray-400 mb-2">Variante</p>
                            <div className="flex flex-wrap gap-2">
                                {product.variants.map((variant) => (
                                    <button
                                        key={variant.id}
                                        onClick={() => setSelectedVariant(variant)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedVariant?.id === variant.id
                                                ? "bg-pink-500 text-white"
                                                : "bg-white/10 text-gray-300 hover:bg-white/20"
                                            }`}
                                    >
                                        {variant.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity */}
                    <div className="mb-6">
                        <p className="text-sm text-gray-400 mb-2">Quantité</p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                            >
                                <Minus size={18} />
                            </button>
                            <span className="w-12 text-center text-lg font-semibold">
                                {quantity}
                            </span>
                            <button
                                onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                                className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                            >
                                <Plus size={18} />
                            </button>
                            <span className="text-sm text-gray-500 ml-2">
                                {currentStock > 0 ? `${currentStock} en stock` : "Rupture de stock"}
                            </span>
                        </div>
                    </div>

                    {/* Add to Cart */}
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={handleAddToCart}
                            disabled={currentStock === 0}
                            className="flex-1 flex items-center justify-center gap-2 py-4 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-600 text-white font-bold rounded-xl transition-colors"
                        >
                            <ShoppingCart size={20} />
                            Ajouter au panier
                        </button>
                        <button className="p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                            <Heart size={24} />
                        </button>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="text-center p-4 bg-white/5 rounded-xl">
                            <Truck size={24} className="mx-auto mb-2 text-pink-400" />
                            <p className="text-xs text-gray-400">Livraison gratuite</p>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-xl">
                            <Shield size={24} className="mx-auto mb-2 text-pink-400" />
                            <p className="text-xs text-gray-400">Paiement sécurisé</p>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-xl">
                            <RotateCcw size={24} className="mx-auto mb-2 text-pink-400" />
                            <p className="text-xs text-gray-400">Retour 30 jours</p>
                        </div>
                    </div>

                    {/* Details */}
                    {product.metadata && Object.keys(product.metadata).length > 0 && (
                        <div className="border-t border-white/10 pt-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Caractéristiques</h3>
                            <dl className="grid grid-cols-2 gap-4 text-sm">
                                {product.metadata.material && (
                                    <>
                                        <dt className="text-gray-500">Matière</dt>
                                        <dd className="text-white">{product.metadata.material}</dd>
                                    </>
                                )}
                                {product.metadata.size && (
                                    <>
                                        <dt className="text-gray-500">Taille</dt>
                                        <dd className="text-white">{product.metadata.size}</dd>
                                    </>
                                )}
                                {product.metadata.ageRange && (
                                    <>
                                        <dt className="text-gray-500">Âge recommandé</dt>
                                        <dd className="text-white">{product.metadata.ageRange}</dd>
                                    </>
                                )}
                                {product.metadata.careInstructions && (
                                    <>
                                        <dt className="text-gray-500">Entretien</dt>
                                        <dd className="text-white">{product.metadata.careInstructions}</dd>
                                    </>
                                )}
                            </dl>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="mt-20">
                    <h2 className="text-2xl font-bold text-white mb-8">
                        Vous aimerez aussi
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((related) => (
                            <ProductCard
                                key={related.id}
                                product={{
                                    id: related.id,
                                    slug: related.slug,
                                    name: related.name,
                                    price: related.price,
                                    description: related.description,
                                    image: related.images[0] || "/placeholder-product.jpg",
                                    currency: "eur",
                                }}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
