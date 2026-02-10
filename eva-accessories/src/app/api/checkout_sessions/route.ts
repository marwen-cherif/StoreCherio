import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    // @ts-expect-error - Stripe types may be slightly behind
    apiVersion: '2024-12-18.acacia',
});

export async function POST(req: Request) {
    try {
        const session = await auth();
        const { items, addressId } = await req.json();

        // Validate
        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Panier vide" }, { status: 400 });
        }

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
        }

        if (!addressId) {
            return NextResponse.json({ error: "Adresse requise" }, { status: 400 });
        }

        // Validate Stripe key
        if (!process.env.STRIPE_SECRET_KEY) {
            console.error("STRIPE_SECRET_KEY not configured");
            return NextResponse.json({ error: "Paiement non configuré" }, { status: 500 });
        }

        // Get the shipping address
        const address = await prisma.address.findUnique({
            where: { id: addressId, userId: session.user.id },
        });

        if (!address) {
            return NextResponse.json({ error: "Adresse non trouvée" }, { status: 404 });
        }

        // Calculate totals
        const subtotal = items.reduce(
            (sum: number, item: { price: number; quantity: number }) =>
                sum + item.price * item.quantity,
            0
        );
        const shippingCost = 0; // Free shipping
        const total = subtotal + shippingCost;

        // Generate order number
        const year = new Date().getFullYear();
        const orderCount = await prisma.order.count();
        const orderNumber = `EVA-${year}-${String(orderCount + 1).padStart(5, '0')}`;

        // Store order data in metadata (Stripe limits: 500 chars per value, 50 keys)
        const metadata = {
            userId: session.user.id,
            addressId: addressId,
            orderNumber: orderNumber,
            itemsJson: JSON.stringify(items.map((item: { id: string; name: string; price: number; quantity: number; image?: string }) => ({
                productId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
            }))),
            subtotal: subtotal.toString(),
            shippingCost: shippingCost.toString(),
            total: total.toString(),
            // Shipping address snapshot
            shippingFirstName: address.firstName,
            shippingLastName: address.lastName,
            shippingAddress1: address.address1,
            shippingAddress2: address.address2 || '',
            shippingCity: address.city,
            shippingPostalCode: address.postalCode,
            shippingCountry: address.country,
            shippingPhone: address.phone || '',
        };

        // Create Stripe Checkout Session
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: session.user.email || undefined,
            line_items: items.map((item: { name: string; description?: string; price: number; quantity: number; image?: string; currency?: string }) => ({
                price_data: {
                    currency: item.currency || 'eur',
                    product_data: {
                        name: item.name,
                        description: item.description || undefined,
                        images: item.image ? [`${process.env.NEXT_PUBLIC_URL}${item.image}`] : undefined,
                    },
                    unit_amount: item.price,
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            metadata,
            success_url: `${process.env.NEXT_PUBLIC_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout`,
            shipping_options: shippingCost === 0 ? [{
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: { amount: 0, currency: 'eur' },
                    display_name: 'Livraison gratuite',
                    delivery_estimate: {
                        minimum: { unit: 'business_day', value: 3 },
                        maximum: { unit: 'business_day', value: 7 },
                    },
                },
            }] : undefined,
        });

        return NextResponse.json({
            url: checkoutSession.url,
            sessionId: checkoutSession.id,
        });
    } catch (err: unknown) {
        console.error('Checkout session error:', err);
        const message = err instanceof Error ? err.message : 'Erreur de paiement';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
