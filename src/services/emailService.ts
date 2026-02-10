import { resend, emailConfig } from '@/lib/email';
import OrderConfirmationEmail from '@/emails/OrderConfirmationEmail';
import ShippingNotificationEmail from '@/emails/ShippingNotificationEmail';

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    image?: string;
}

interface ShippingAddress {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    postalCode: string;
    country: string;
}

interface SendOrderConfirmationParams {
    to: string;
    orderNumber: string;
    customerName: string;
    items: OrderItem[];
    subtotal: number;
    shippingCost: number;
    total: number;
    shippingAddress: ShippingAddress;
}

interface SendShippingNotificationParams {
    to: string;
    orderNumber: string;
    customerName: string;
    trackingNumber: string;
    trackingUrl: string;
    carrier: string;
    shippingAddress: ShippingAddress;
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(params: SendOrderConfirmationParams) {
    if (!resend) {
        console.warn('Email service not configured. Skipping order confirmation email.');
        return { success: false, error: 'Email service not configured' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: emailConfig.from,
            to: params.to,
            replyTo: emailConfig.replyTo,
            subject: `Confirmation de commande #${params.orderNumber} 🎀`,
            react: OrderConfirmationEmail({
                orderNumber: params.orderNumber,
                customerName: params.customerName,
                items: params.items,
                subtotal: params.subtotal,
                shippingCost: params.shippingCost,
                total: params.total,
                shippingAddress: params.shippingAddress,
            }),
        });

        if (error) {
            console.error('Failed to send order confirmation email:', error);
            return { success: false, error: error.message };
        }

        console.log(`Order confirmation email sent to ${params.to} (ID: ${data?.id})`);
        return { success: true, id: data?.id };
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        return { success: false, error: 'Failed to send email' };
    }
}

/**
 * Send shipping notification email to customer
 */
export async function sendShippingNotificationEmail(params: SendShippingNotificationParams) {
    if (!resend) {
        console.warn('Email service not configured. Skipping shipping notification email.');
        return { success: false, error: 'Email service not configured' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: emailConfig.from,
            to: params.to,
            replyTo: emailConfig.replyTo,
            subject: `Votre commande #${params.orderNumber} est en route ! 🚚`,
            react: ShippingNotificationEmail({
                orderNumber: params.orderNumber,
                customerName: params.customerName,
                trackingNumber: params.trackingNumber,
                trackingUrl: params.trackingUrl,
                carrier: params.carrier,
                shippingAddress: params.shippingAddress,
            }),
        });

        if (error) {
            console.error('Failed to send shipping notification email:', error);
            return { success: false, error: error.message };
        }

        console.log(`Shipping notification email sent to ${params.to} (ID: ${data?.id})`);
        return { success: true, id: data?.id };
    } catch (error) {
        console.error('Error sending shipping notification email:', error);
        return { success: false, error: 'Failed to send email' };
    }
}
