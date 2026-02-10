import { NextResponse } from "next/server";
import productsData from "@/data/products.json";

interface RouteParams {
    params: Promise<{ slug: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
    try {
        const { slug } = await params;

        const product = productsData.products.find(
            (p) => p.slug === slug || p.id === slug
        );

        if (!product) {
            return NextResponse.json(
                { error: "Produit non trouvé" },
                { status: 404 }
            );
        }

        // Get related products from same category
        const relatedProducts = productsData.products
            .filter(
                (p) =>
                    p.category === product.category &&
                    p.id !== product.id &&
                    p.isActive
            )
            .slice(0, 4);

        return NextResponse.json({
            product,
            relatedProducts,
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération du produit" },
            { status: 500 }
        );
    }
}
