import { Metadata } from "next";
import productsData from "@/data/products.json";
import { siteConfig, generateProductJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
    params: Promise<{ slug: string }>;
}

// Generate metadata for product pages
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = productsData.products.find(
        (p) => p.slug === slug || p.id === slug
    );

    if (!product) {
        return {
            title: "Produit non trouvé",
            description: "Ce produit n'existe pas ou a été supprimé.",
        };
    }

    const productUrl = `${siteConfig.url}/shop/${product.slug}`;
    const productImage = product.images[0]
        ? product.images[0].startsWith("http")
            ? product.images[0]
            : `${siteConfig.url}${product.images[0]}`
        : `${siteConfig.url}/og-image.jpg`;

    return {
        title: product.name,
        description: product.description,
        keywords: [
            product.name,
            product.category,
            ...product.tags,
            "accessoires cheveux enfant",
            "eva accessories",
        ],
        openGraph: {
            title: `${product.name} | Eva Accessories`,
            description: product.description,
            url: productUrl,
            siteName: siteConfig.name,
            images: [
                {
                    url: productImage,
                    width: 800,
                    height: 800,
                    alt: product.name,
                },
            ],
            locale: siteConfig.locale,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `${product.name} | Eva Accessories`,
            description: product.description,
            images: [productImage],
        },
        alternates: {
            canonical: productUrl,
        },
    };
}

// Generate static params for all products
export async function generateStaticParams() {
    return productsData.products
        .filter((p) => p.isActive)
        .map((product) => ({
            slug: product.slug,
        }));
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;
    const product = productsData.products.find(
        (p) => p.slug === slug || p.id === slug
    );

    // Prepare JSON-LD structured data
    const jsonLd = product
        ? generateProductJsonLd({
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            images: product.images,
            stock: product.stock,
            category: product.category,
        })
        : null;

    const breadcrumbJsonLd = generateBreadcrumbJsonLd([
        { name: "Accueil", url: "/" },
        { name: "Boutique", url: "/shop" },
        ...(product
            ? [{ name: product.category, url: `/shop?category=${product.category}` }]
            : []),
        ...(product ? [{ name: product.name, url: `/shop/${product.slug}` }] : []),
    ]);

    return (
        <>
            {/* Product Structured Data */}
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            {/* Breadcrumb Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <ProductDetailClient params={params} />
        </>
    );
}
