import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET a specific address
export async function GET(req: Request, { params }: RouteParams) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const address = await prisma.address.findFirst({
            where: {
                id,
                userId: session.user.id
            },
        });

        if (!address) {
            return NextResponse.json({ error: "Adresse non trouvée" }, { status: 404 });
        }

        return NextResponse.json(address);
    } catch (error) {
        console.error("Error fetching address:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération de l'adresse" },
            { status: 500 }
        );
    }
}

// PUT update an address
export async function PUT(req: Request, { params }: RouteParams) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        // Check ownership
        const existing = await prisma.address.findFirst({
            where: { id, userId: session.user.id },
        });

        if (!existing) {
            return NextResponse.json({ error: "Adresse non trouvée" }, { status: 404 });
        }

        const data = await req.json();

        // If setting as default, update other addresses
        if (data.isDefault && !existing.isDefault) {
            await prisma.address.updateMany({
                where: { userId: session.user.id, id: { not: id } },
                data: { isDefault: false },
            });
        }

        const address = await prisma.address.update({
            where: { id },
            data: {
                label: data.label,
                firstName: data.firstName,
                lastName: data.lastName,
                address1: data.address1,
                address2: data.address2,
                city: data.city,
                postalCode: data.postalCode,
                country: data.country,
                phone: data.phone,
                isDefault: data.isDefault,
            },
        });

        return NextResponse.json(address);
    } catch (error) {
        console.error("Error updating address:", error);
        return NextResponse.json(
            { error: "Erreur lors de la mise à jour de l'adresse" },
            { status: 500 }
        );
    }
}

// DELETE an address
export async function DELETE(req: Request, { params }: RouteParams) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        // Check ownership
        const existing = await prisma.address.findFirst({
            where: { id, userId: session.user.id },
        });

        if (!existing) {
            return NextResponse.json({ error: "Adresse non trouvée" }, { status: 404 });
        }

        await prisma.address.delete({
            where: { id },
        });

        // If deleted address was default, make the most recent one default
        if (existing.isDefault) {
            const newDefault = await prisma.address.findFirst({
                where: { userId: session.user.id },
                orderBy: { createdAt: 'desc' },
            });

            if (newDefault) {
                await prisma.address.update({
                    where: { id: newDefault.id },
                    data: { isDefault: true },
                });
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting address:", error);
        return NextResponse.json(
            { error: "Erreur lors de la suppression de l'adresse" },
            { status: 500 }
        );
    }
}
