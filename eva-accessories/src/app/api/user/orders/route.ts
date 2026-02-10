import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const orders = await prisma.order.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            include: {
                items: {
                    include: {
                        product: { select: { id: true, name: true, images: true } },
                    },
                },
            },
        });

        return NextResponse.json({
            orders: orders.map((order) => ({
                id: order.id,
                orderNumber: order.orderNumber,
                status: order.status,
                total: order.total,
                itemCount: order.items.length,
                items: order.items.map((item) => ({
                    id: item.id,
                    name: item.productName,
                    quantity: item.quantity,
                    price: item.unitPrice,
                    image: item.productImage || item.product?.images?.[0],
                })),
                trackingNumber: order.trackingNumber,
                trackingUrl: order.trackingUrl,
                createdAt: order.createdAt,
                paidAt: order.paidAt,
                shippedAt: order.shippedAt,
                deliveredAt: order.deliveredAt,
            })),
        });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération des commandes" },
            { status: 500 }
        );
    }
}
