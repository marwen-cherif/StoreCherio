// Site-wide SEO configuration
export const siteConfig = {
    name: "Eva Accessories",
    shortName: "Eva",
    description:
        "Boutique en ligne d'accessoires pour cheveux pour enfants. Nœuds, barrettes, chouchous, serre-têtes et coffrets cadeaux. Livraison gratuite en Europe.",
    url: process.env.NEXT_PUBLIC_URL || "https://eva-accessories.com",
    ogImage: "/og-image.jpg",
    locale: "fr_FR",
    type: "website",

    // Business info
    business: {
        name: "Eva Accessories",
        email: "contact@eva-accessories.com",
        phone: "+33 1 23 45 67 89",
        address: {
            streetAddress: "123 Rue de la Mode",
            addressLocality: "Paris",
            postalCode: "75001",
            addressCountry: "FR",
        },
    },

    // Social media
    social: {
        instagram: "https://instagram.com/eva_accessories",
        facebook: "https://facebook.com/evaaccessories",
        pinterest: "https://pinterest.com/evaaccessories",
        tiktok: "https://tiktok.com/@evaaccessories",
    },

    // SEO keywords
    keywords: [
        "accessoires cheveux enfant",
        "noeud cheveux fille",
        "barrettes enfant",
        "chouchou enfant",
        "serre-tête fille",
        "accessoires cheveux petite fille",
        "bijoux cheveux enfant",
        "élastiques cheveux enfant",
        "cadeau fille 3 ans",
        "cadeau anniversaire fille",
        "accessoires mode enfant",
        "eva accessories",
    ],

    // Categories for structured data
    productCategories: [
        "Nœuds",
        "Chouchous",
        "Barrettes",
        "Bandeaux",
        "Élastiques",
        "Serre-têtes",
        "Pinces",
        "Coffrets cadeaux",
    ],
};

// Page-specific metadata templates
export const pageMetadata = {
    home: {
        title: "Eva Accessories - Accessoires Cheveux pour Petites Filles",
        description:
            "Découvrez notre collection d'accessoires pour cheveux adorables pour enfants. Nœuds, barrettes, chouchous et plus. Livraison gratuite en Europe !",
    },
    shop: {
        title: "Boutique | Eva Accessories",
        description:
            "Explorez notre collection complète d'accessoires pour cheveux pour enfants. Filtrez par catégorie et trouvez l'accessoire parfait pour votre petite princesse.",
    },
    cart: {
        title: "Panier | Eva Accessories",
        description: "Finalisez votre commande d'accessoires pour cheveux.",
    },
    checkout: {
        title: "Paiement | Eva Accessories",
        description: "Paiement sécurisé par carte bancaire.",
    },
    account: {
        title: "Mon Compte | Eva Accessories",
        description: "Gérez votre compte, vos commandes et vos adresses.",
    },
    about: {
        title: "À Propos | Eva Accessories",
        description:
            "Découvrez l'histoire d'Eva Accessories, notre passion pour les accessoires pour enfants et notre engagement qualité.",
    },
    contact: {
        title: "Contact | Eva Accessories",
        description:
            "Contactez-nous pour toute question. Notre équipe est là pour vous aider !",
    },
};

// Generate product structured data (JSON-LD)
export function generateProductJsonLd(product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    compareAtPrice?: number | null;
    images: string[];
    stock: number;
    category: string;
}) {
    const url = `${siteConfig.url}/shop/${product.slug}`;

    return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.images.map((img) =>
            img.startsWith("http") ? img : `${siteConfig.url}${img}`
        ),
        url,
        sku: product.id,
        brand: {
            "@type": "Brand",
            name: siteConfig.name,
        },
        category: product.category,
        offers: {
            "@type": "Offer",
            url,
            priceCurrency: "EUR",
            price: (product.price / 100).toFixed(2),
            priceValidUntil: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
            availability:
                product.stock > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
            seller: {
                "@type": "Organization",
                name: siteConfig.name,
            },
        },
        ...(product.compareAtPrice && {
            priceSpecification: {
                "@type": "PriceSpecification",
                price: (product.compareAtPrice / 100).toFixed(2),
                priceCurrency: "EUR",
                valueAddedTaxIncluded: true,
            },
        }),
    };
}

// Generate organization structured data
export function generateOrganizationJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteConfig.business.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo.png`,
        sameAs: Object.values(siteConfig.social),
        contactPoint: {
            "@type": "ContactPoint",
            email: siteConfig.business.email,
            telephone: siteConfig.business.phone,
            contactType: "customer service",
            availableLanguage: ["French", "English"],
        },
        address: {
            "@type": "PostalAddress",
            ...siteConfig.business.address,
        },
    };
}

// Generate breadcrumb structured data
export function generateBreadcrumbJsonLd(
    items: { name: string; url: string }[]
) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url.startsWith("http") ? item.url : `${siteConfig.url}${item.url}`,
        })),
    };
}

// Generate website structured data with search
export function generateWebsiteJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${siteConfig.url}/shop?search={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };
}
