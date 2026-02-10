import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
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

        // Get date ranges
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Total revenue (all time, completed/paid orders)
        const totalRevenueResult = await prisma.order.aggregate({
            where: {
                status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED"] },
            },
            _sum: { total: true },
        });
        const totalRevenue = totalRevenueResult._sum.total || 0;

        // This month's revenue
        const monthRevenueResult = await prisma.order.aggregate({
            where: {
                status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED"] },
                createdAt: { gte: startOfMonth },
            },
            _sum: { total: true },
        });
        const monthRevenue = monthRevenueResult._sum.total || 0;

        // Last month's revenue (for comparison)
        const lastMonthRevenueResult = await prisma.order.aggregate({
            where: {
                status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED"] },
                createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
            },
            _sum: { total: true },
        });
        const lastMonthRevenue = lastMonthRevenueResult._sum.total || 0;

        // Calculate revenue growth
        const revenueGrowth = lastMonthRevenue > 0
            ? ((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
            : monthRevenue > 0 ? 100 : 0;

        // Total orders
        const totalOrders = await prisma.order.count();

        // Orders this month
        const monthOrders = await prisma.order.count({
            where: { createdAt: { gte: startOfMonth } },
        });

        // Orders last month
        const lastMonthOrders = await prisma.order.count({
            where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
        });

        // Order growth
        const orderGrowth = lastMonthOrders > 0
            ? ((monthOrders - lastMonthOrders) / lastMonthOrders) * 100
            : monthOrders > 0 ? 100 : 0;

        // Pending orders (need attention)
        const pendingOrders = await prisma.order.count({
            where: { status: { in: ["PENDING", "PAID", "PROCESSING"] } },
        });

        // Total customers
        const totalCustomers = await prisma.user.count({
            where: { role: "CUSTOMER" },
        });

        // New customers this month
        const newCustomersMonth = await prisma.user.count({
            where: {
                role: "CUSTOMER",
                createdAt: { gte: startOfMonth },
            },
        });

        // New customers last month
        const newCustomersLastMonth = await prisma.user.count({
            where: {
                role: "CUSTOMER",
                createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
            },
        });

        // Customer growth
        const customerGrowth = newCustomersLastMonth > 0
            ? ((newCustomersMonth - newCustomersLastMonth) / newCustomersLastMonth) * 100
            : newCustomersMonth > 0 ? 100 : 0;

        // Total products
        const totalProducts = await prisma.product.count();

        // Low stock products
        const lowStockProducts = await prisma.product.count({
            where: { stock: { lte: 5 } },
        });

        // Recent orders (last 5)
        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { name: true, email: true } },
                items: { include: { product: { select: { name: true } } } },
            },
        });

        // Orders by status
        const ordersByStatus = await prisma.order.groupBy({
            by: ["status"],
            _count: { id: true },
        });

        return NextResponse.json({
            revenue: {
                total: totalRevenue,
                thisMonth: monthRevenue,
                growth: Math.round(revenueGrowth * 10) / 10,
            },
            orders: {
                total: totalOrders,
                thisMonth: monthOrders,
                pending: pendingOrders,
                growth: Math.round(orderGrowth * 10) / 10,
                byStatus: ordersByStatus.reduce((acc, item) => {
                    acc[item.status] = item._count.id;
                    return acc;
                }, {} as Record<string, number>),
            },
            customers: {
                total: totalCustomers,
                newThisMonth: newCustomersMonth,
                growth: Math.round(customerGrowth * 10) / 10,
            },
            products: {
                total: totalProducts,
                lowStock: lowStockProducts,
            },
            recentOrders: recentOrders.map((order) => ({
                id: order.id,
                orderNumber: order.orderNumber,
                customer: order.user?.name || "Client invité",
                email: order.user?.email,
                total: order.total,
                status: order.status,
                itemCount: order.items.length,
                createdAt: order.createdAt,
            })),
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération des statistiques" },
            { status: 500 }
        );
    }
}
