import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET all addresses for the current user
export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const addresses = await prisma.address.findMany({
            where: { userId: session.user.id },
            orderBy: [
                { isDefault: 'desc' },
                { createdAt: 'desc' }
            ],
        });

        return NextResponse.json(addresses);
    } catch (error) {
        console.error("Error fetching addresses:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération des adresses" },
            { status: 500 }
        );
    }
}

// POST create a new address
export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const data = await req.json();

        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'address1', 'city', 'postalCode'];
        for (const field of requiredFields) {
            if (!data[field]) {
                return NextResponse.json(
                    { error: `Le champ ${field} est requis` },
                    { status: 400 }
                );
            }
        }

        // If this is the first address or marked as default, update other addresses
        if (data.isDefault) {
            await prisma.address.updateMany({
                where: { userId: session.user.id },
                data: { isDefault: false },
            });
        }

        // Check if user has any addresses
        const existingCount = await prisma.address.count({
            where: { userId: session.user.id },
        });

        const address = await prisma.address.create({
            data: {
                userId: session.user.id,
                label: data.label || null,
                firstName: data.firstName,
                lastName: data.lastName,
                address1: data.address1,
                address2: data.address2 || null,
                city: data.city,
                postalCode: data.postalCode,
                country: data.country || "France",
                phone: data.phone || null,
                isDefault: existingCount === 0 ? true : (data.isDefault || false),
            },
        });

        return NextResponse.json(address, { status: 201 });
    } catch (error) {
        console.error("Error creating address:", error);
        return NextResponse.json(
            { error: "Erreur lors de la création de l'adresse" },
            { status: 500 }
        );
    }
}
