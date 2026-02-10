import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get("sessionId");

        if (!sessionId) {
            return NextResponse.json({ error: "Session ID required" }, { status: 400 });
        }

        const order = await prisma.order.findFirst({
            where: { stripeSessionId: sessionId },
            select: {
                orderNumber: true,
                total: true,
                items: {
                    select: { id: true },
                },
            },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({
            orderNumber: order.orderNumber,
            total: order.total,
            itemCount: order.items.length,
        });
    } catch (error) {
        console.error("Error fetching order by session:", error);
        return NextResponse.json(
            { error: "Failed to fetch order" },
            { status: 500 }
        );
    }
}
