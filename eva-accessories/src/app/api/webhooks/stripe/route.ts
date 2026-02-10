import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    // @ts-expect-error - Stripe types may be slightly behind
    apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const headersList = await headers();
        const signature = headersList.get('stripe-signature');

        if (!signature) {
            console.error('No Stripe signature found');
            return NextResponse.json({ error: 'No signature' }, { status: 400 });
        }

        if (!webhookSecret) {
            console.error('STRIPE_WEBHOOK_SECRET not configured');
            return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
        }

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err) {
            console.error('Webhook signature verification failed:', err);
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                await handleCheckoutCompleted(session);
                break;
            }

            case 'checkout.session.expired': {
                const session = event.data.object as Stripe.Checkout.Session;
                console.log(`Checkout session expired: ${session.id}`);
                break;
            }

            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log(`Payment succeeded: ${paymentIntent.id}`);
                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log(`Payment failed: ${paymentIntent.id}`);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const metadata = session.metadata;

    if (!metadata) {
        console.error('No metadata found in session');
        return;
    }

    const {
        userId,
        orderNumber,
        itemsJson,
        subtotal,
        shippingCost,
        total,
        shippingFirstName,
        shippingLastName,
        shippingAddress1,
        shippingAddress2,
        shippingCity,
        shippingPostalCode,
        shippingCountry,
        shippingPhone,
    } = metadata;

    // Check if order already exists (idempotency)
    const existingOrder = await prisma.order.findFirst({
        where: { stripeSessionId: session.id },
    });

    if (existingOrder) {
        console.log(`Order already exists for session ${session.id}`);
        return;
    }

    // Parse items
    let items: Array<{
        productId: string;
        name: string;
        price: number;
        quantity: number;
        image?: string;
    }>;

    try {
        items = JSON.parse(itemsJson || '[]');
    } catch {
        console.error('Failed to parse items JSON');
        return;
    }

    // Create order with items
    try {
        const order = await prisma.order.create({
            data: {
                orderNumber,
                userId: userId || null,
                status: 'PAID',

                // Shipping address snapshot
                shippingFirstName,
                shippingLastName,
                shippingAddress1,
                shippingAddress2: shippingAddress2 || null,
                shippingCity,
                shippingPostalCode,
                shippingCountry,
                shippingPhone: shippingPhone || null,

                // Amounts
                subtotal: parseInt(subtotal || '0'),
                shippingCost: parseInt(shippingCost || '0'),
                total: parseInt(total || '0'),

                // Stripe info
                stripeSessionId: session.id,
                stripePaymentIntentId: session.payment_intent as string,

                // Timestamps
                paidAt: new Date(),

                // Order items
                items: {
                    create: items.map((item) => ({
                        productId: item.productId,
                        productName: item.name,
                        productImage: item.image || null,
                        unitPrice: item.price,
                        quantity: item.quantity,
                        total: item.price * item.quantity,
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        console.log(`Order created: ${order.orderNumber} (${order.id})`);

        // Update product stock (decrement)
        for (const item of items) {
            if (item.productId) {
                await prisma.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { decrement: item.quantity },
                    },
                }).catch((err) => {
                    console.error(`Failed to update stock for product ${item.productId}:`, err);
                });
            }
        }

        // Send confirmation email
        if (session.customer_email) {
            const { sendOrderConfirmationEmail } = await import('@/services/emailService');
            await sendOrderConfirmationEmail({
                to: session.customer_email,
                orderNumber: order.orderNumber,
                customerName: shippingFirstName,
                items: items.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    image: item.image,
                })),
                subtotal: order.subtotal,
                shippingCost: order.shippingCost,
                total: order.total,
                shippingAddress: {
                    firstName: shippingFirstName,
                    lastName: shippingLastName,
                    address1: shippingAddress1,
                    address2: shippingAddress2 || undefined,
                    city: shippingCity,
                    postalCode: shippingPostalCode,
                    country: shippingCountry,
                },
            });
        }

    } catch (error) {
        console.error('Failed to create order:', error);
        throw error; // Re-throw to return 500 and let Stripe retry
    }
}
