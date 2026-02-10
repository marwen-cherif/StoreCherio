import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await auth();

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

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const status = searchParams.get("status");
        const search = searchParams.get("search");
        const sortBy = searchParams.get("sortBy") || "createdAt";
        const sortOrder = searchParams.get("sortOrder") || "desc";

        // Build where clause
        const where: Record<string, unknown> = {};

        if (status) {
            where.status = status;
        }

        if (search) {
            where.OR = [
                { orderNumber: { contains: search, mode: "insensitive" } },
                { user: { name: { contains: search, mode: "insensitive" } } },
                { user: { email: { contains: search, mode: "insensitive" } } },
                { shippingFirstName: { contains: search, mode: "insensitive" } },
                { shippingLastName: { contains: search, mode: "insensitive" } },
            ];
        }

        // Get total count
        const totalCount = await prisma.order.count({ where });

        // Get orders with pagination
        const orders = await prisma.order.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
            include: {
                user: { select: { id: true, name: true, email: true } },
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
                customer: {
                    id: order.user?.id,
                    name: order.user?.name || `${order.shippingFirstName} ${order.shippingLastName}`,
                    email: order.user?.email,
                },
                shippingAddress: {
                    firstName: order.shippingFirstName,
                    lastName: order.shippingLastName,
                    address1: order.shippingAddress1,
                    address2: order.shippingAddress2,
                    city: order.shippingCity,
                    postalCode: order.shippingPostalCode,
                    country: order.shippingCountry,
                    phone: order.shippingPhone,
                },
                items: order.items.map((item) => ({
                    id: item.id,
                    productId: item.productId,
                    name: item.productName,
                    price: item.unitPrice,
                    quantity: item.quantity,
                    image: item.product?.images?.[0],
                })),
                subtotal: order.subtotal,
                shippingCost: order.shippingCost,
                discount: order.discount,
                total: order.total,
                trackingNumber: order.trackingNumber,
                trackingUrl: order.trackingUrl,
                customerNote: order.customerNote,
                internalNote: order.internalNote,
                paidAt: order.paidAt,
                shippedAt: order.shippedAt,
                deliveredAt: order.deliveredAt,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
            })),
            pagination: {
                page,
                limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération des commandes" },
            { status: 500 }
        );
    }
}
