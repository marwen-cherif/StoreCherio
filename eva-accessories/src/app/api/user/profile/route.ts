import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                image: true,
                createdAt: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
        }

        // Get counts separately
        const [orderCount, addressCount] = await Promise.all([
            prisma.order.count({ where: { userId: session.user.id } }),
            prisma.address.count({ where: { userId: session.user.id } }),
        ]);

        return NextResponse.json({
            ...user,
            ...user,
            // image is already in user object as image
            orderCount,
            addressCount,
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération du profil" },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const data = await req.json();

        // Only allow updating certain fields
        const updateData: Record<string, unknown> = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.phone !== undefined) updateData.phone = data.phone;

        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                image: true,
            },
        });

        return NextResponse.json({
            ...user,
            image: user.image,
        });
    } catch (error) {
        console.error("Error updating user profile:", error);
        return NextResponse.json(
            { error: "Erreur lors de la mise à jour du profil" },
            { status: 500 }
        );
    }
}
