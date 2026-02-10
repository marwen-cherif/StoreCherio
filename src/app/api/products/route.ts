import { NextResponse } from "next/server";
import productsData from "@/data/products.json";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const search = searchParams.get("search");
        const featured = searchParams.get("featured");
        const limit = searchParams.get("limit");

        let products = productsData.products.filter((p) => p.isActive);

        // Filter by category
        if (category) {
            products = products.filter((p) => p.category === category);
        }

        // Filter by search
        if (search) {
            const searchLower = search.toLowerCase();
            products = products.filter(
                (p) =>
                    p.name.toLowerCase().includes(searchLower) ||
                    p.description.toLowerCase().includes(searchLower) ||
                    p.tags.some((t) => t.toLowerCase().includes(searchLower))
            );
        }

        // Filter featured only
        if (featured === "true") {
            products = products.filter((p) => p.isFeatured);
        }

        // Limit results
        if (limit) {
            products = products.slice(0, parseInt(limit));
        }

        return NextResponse.json({
            products,
            categories: productsData.categories,
            total: products.length,
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération des produits" },
            { status: 500 }
        );
    }
}
