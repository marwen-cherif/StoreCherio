import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET order details
export async function GET(req: Request, { params }: RouteParams) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        // Check admin role
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true },
        });

        if (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, name: true, email: true, phone: true } },
                items: {
                    include: {
                        product: { select: { id: true, name: true, images: true } },
                    },
                },
            },
        });

        if (!order) {
            return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error("Error fetching order:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération de la commande" },
            { status: 500 }
        );
    }
}

// PUT update order (status, tracking, notes)
export async function PUT(req: Request, { params }: RouteParams) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        // Check admin role
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true },
        });

        if (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

        const data = await req.json();

        // Build update data
        const updateData: Record<string, unknown> = {};

        if (data.status) {
            updateData.status = data.status;

            // Auto-set dates based on status
            if (data.status === "PAID" && !data.paidAt) {
                updateData.paidAt = new Date();
            }
            if (data.status === "SHIPPED" && !data.shippedAt) {
                updateData.shippedAt = new Date();
            }
            if (data.status === "DELIVERED" && !data.deliveredAt) {
                updateData.deliveredAt = new Date();
            }
        }

        if (data.trackingNumber !== undefined) {
            updateData.trackingNumber = data.trackingNumber;
        }
        if (data.trackingUrl !== undefined) {
            updateData.trackingUrl = data.trackingUrl;
        }
        if (data.internalNote !== undefined) {
            updateData.internalNote = data.internalNote;
        }

        // Get previous order state to check status change
        const previousOrder = await prisma.order.findUnique({
            where: { id },
            select: { status: true },
        });

        const order = await prisma.order.update({
            where: { id },
            data: updateData,
            include: {
                user: { select: { id: true, name: true, email: true } },
                items: {
                    include: {
                        product: { select: { id: true, name: true, images: true } },
                    },
                },
            },
        });

        // Send shipping notification email if status changed to SHIPPED
        if (
            data.status === "SHIPPED" &&
            previousOrder?.status !== "SHIPPED" &&
            order.user?.email &&
            order.trackingNumber
        ) {
            const { sendShippingNotificationEmail } = await import("@/services/emailService");
            await sendShippingNotificationEmail({
                to: order.user.email,
                orderNumber: order.orderNumber,
                customerName: order.shippingFirstName,
                trackingNumber: order.trackingNumber,
                trackingUrl: order.trackingUrl || `https://www.laposte.fr/outils/suivre-vos-envois?code=${order.trackingNumber}`,
                carrier: "Colissimo",
                shippingAddress: {
                    firstName: order.shippingFirstName,
                    lastName: order.shippingLastName,
                    address1: order.shippingAddress1,
                    city: order.shippingCity,
                    postalCode: order.shippingPostalCode,
                    country: order.shippingCountry,
                },
            });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error("Error updating order:", error);
        return NextResponse.json(
            { error: "Erreur lors de la mise à jour de la commande" },
            { status: 500 }
        );
    }
}
