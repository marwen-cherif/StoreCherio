import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Row,
    Column,
} from '@react-email/components';
import * as React from 'react';

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    image?: string;
}

interface OrderConfirmationEmailProps {
    orderNumber: string;
    customerName: string;
    items: OrderItem[];
    subtotal: number;
    shippingCost: number;
    total: number;
    shippingAddress: {
        firstName: string;
        lastName: string;
        address1: string;
        address2?: string;
        city: string;
        postalCode: string;
        country: string;
    };
}

export default function OrderConfirmationEmail({
    orderNumber = 'EVA-2026-00001',
    customerName = 'Marie',
    items = [
        { name: 'Noeud Rose Satiné', quantity: 2, price: 1290 },
        { name: 'Chouchou Licorne', quantity: 1, price: 890 },
    ],
    subtotal = 3470,
    shippingCost = 0,
    total = 3470,
    shippingAddress = {
        firstName: 'Marie',
        lastName: 'Dupont',
        address1: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
    },
}: OrderConfirmationEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>
                Merci pour votre commande #{orderNumber} chez Eva Accessories ! 🎀
            </Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <Section style={header}>
                        <Img
                            src="https://eva-accessories.com/logo.png"
                            width="120"
                            height="40"
                            alt="Eva Accessories"
                            style={logo}
                        />
                    </Section>

                    {/* Title */}
                    <Heading style={title}>
                        Merci pour votre commande ! 🎀
                    </Heading>

                    <Text style={text}>
                        Bonjour {customerName},
                    </Text>

                    <Text style={text}>
                        Nous avons bien reçu votre commande <strong>#{orderNumber}</strong>.
                        Vous recevrez un email dès que votre colis sera expédié.
                    </Text>

                    <Hr style={hr} />

                    {/* Order Details */}
                    <Heading as="h2" style={subtitle}>
                        Récapitulatif de votre commande
                    </Heading>

                    {/* Items */}
                    <Section style={itemsSection}>
                        {items.map((item, index) => (
                            <Row key={index} style={itemRow}>
                                <Column style={itemImageCol}>
                                    <div style={itemImagePlaceholder}>
                                        🎀
                                    </div>
                                </Column>
                                <Column style={itemDetails}>
                                    <Text style={itemName}>{item.name}</Text>
                                    <Text style={itemQty}>Quantité : {item.quantity}</Text>
                                </Column>
                                <Column style={itemPrice}>
                                    €{(item.price * item.quantity / 100).toFixed(2)}
                                </Column>
                            </Row>
                        ))}
                    </Section>

                    <Hr style={hr} />

                    {/* Totals */}
                    <Section style={totalsSection}>
                        <Row>
                            <Column style={totalLabel}>Sous-total</Column>
                            <Column style={totalValue}>€{(subtotal / 100).toFixed(2)}</Column>
                        </Row>
                        <Row>
                            <Column style={totalLabel}>Livraison</Column>
                            <Column style={totalValue}>
                                {shippingCost === 0 ? 'Gratuite' : `€${(shippingCost / 100).toFixed(2)}`}
                            </Column>
                        </Row>
                        <Row style={totalRow}>
                            <Column style={grandTotalLabel}>Total</Column>
                            <Column style={grandTotalValue}>€{(total / 100).toFixed(2)}</Column>
                        </Row>
                    </Section>

                    <Hr style={hr} />

                    {/* Shipping Address */}
                    <Heading as="h2" style={subtitle}>
                        Adresse de livraison
                    </Heading>

                    <Text style={addressText}>
                        {shippingAddress.firstName} {shippingAddress.lastName}<br />
                        {shippingAddress.address1}<br />
                        {shippingAddress.address2 && <>{shippingAddress.address2}<br /></>}
                        {shippingAddress.postalCode} {shippingAddress.city}<br />
                        {shippingAddress.country}
                    </Text>

                    <Hr style={hr} />

                    {/* Delivery Info */}
                    <Section style={infoBox}>
                        <Text style={infoTitle}>📦 Délai de livraison</Text>
                        <Text style={infoText}>
                            Votre commande sera expédiée sous 1-2 jours ouvrés.
                            La livraison prend ensuite 3-5 jours ouvrés.
                        </Text>
                    </Section>

                    {/* CTA */}
                    <Section style={ctaSection}>
                        <Link href="https://eva-accessories.com/account/orders" style={button}>
                            Suivre ma commande
                        </Link>
                    </Section>

                    {/* Footer */}
                    <Hr style={hr} />

                    <Text style={footer}>
                        Une question ? Contactez-nous à{' '}
                        <Link href="mailto:contact@eva-accessories.com" style={link}>
                            contact@eva-accessories.com
                        </Link>
                    </Text>

                    <Text style={footerLight}>
                        Eva Accessories - Accessoires pour cheveux enfants<br />
                        © 2026 Eva Accessories. Tous droits réservés.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

// Styles
const main = {
    backgroundColor: '#f6f9fc',
    fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '40px 20px',
    maxWidth: '600px',
    borderRadius: '12px',
};

const header = {
    textAlign: 'center' as const,
    marginBottom: '24px',
};

const logo = {
    margin: '0 auto',
};

const title = {
    color: '#1f2937',
    fontSize: '28px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    margin: '24px 0',
};

const subtitle = {
    color: '#1f2937',
    fontSize: '18px',
    fontWeight: '600',
    margin: '24px 0 16px',
};

const text = {
    color: '#4b5563',
    fontSize: '16px',
    lineHeight: '24px',
    margin: '16px 0',
};

const hr = {
    borderColor: '#e5e7eb',
    margin: '24px 0',
};

const itemsSection = {
    padding: '0',
};

const itemRow = {
    marginBottom: '16px',
};

const itemImageCol = {
    width: '60px',
    verticalAlign: 'top' as const,
};

const itemImagePlaceholder = {
    width: '50px',
    height: '50px',
    backgroundColor: '#fdf2f8',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
};

const itemDetails = {
    verticalAlign: 'top' as const,
    paddingLeft: '12px',
};

const itemName = {
    color: '#1f2937',
    fontSize: '14px',
    fontWeight: '600',
    margin: '0 0 4px',
};

const itemQty = {
    color: '#6b7280',
    fontSize: '12px',
    margin: '0',
};

const itemPrice = {
    color: '#1f2937',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'right' as const,
    verticalAlign: 'top' as const,
};

const totalsSection = {
    padding: '0',
};

const totalLabel = {
    color: '#6b7280',
    fontSize: '14px',
    padding: '8px 0',
};

const totalValue = {
    color: '#1f2937',
    fontSize: '14px',
    textAlign: 'right' as const,
    padding: '8px 0',
};

const totalRow = {
    borderTop: '1px solid #e5e7eb',
    marginTop: '8px',
};

const grandTotalLabel = {
    color: '#1f2937',
    fontSize: '16px',
    fontWeight: '700',
    padding: '12px 0',
};

const grandTotalValue = {
    color: '#ec4899',
    fontSize: '20px',
    fontWeight: '700',
    textAlign: 'right' as const,
    padding: '12px 0',
};

const addressText = {
    color: '#4b5563',
    fontSize: '14px',
    lineHeight: '22px',
    margin: '0',
};

const infoBox = {
    backgroundColor: '#fdf2f8',
    padding: '16px',
    borderRadius: '8px',
    margin: '24px 0',
};

const infoTitle = {
    color: '#1f2937',
    fontSize: '14px',
    fontWeight: '600',
    margin: '0 0 8px',
};

const infoText = {
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '0',
};

const ctaSection = {
    textAlign: 'center' as const,
    margin: '32px 0',
};

const button = {
    backgroundColor: '#ec4899',
    borderRadius: '8px',
    color: '#ffffff',
    display: 'inline-block',
    fontSize: '14px',
    fontWeight: '600',
    padding: '12px 24px',
    textDecoration: 'none',
};

const link = {
    color: '#ec4899',
    textDecoration: 'underline',
};

const footer = {
    color: '#6b7280',
    fontSize: '14px',
    textAlign: 'center' as const,
    margin: '16px 0',
};

const footerLight = {
    color: '#9ca3af',
    fontSize: '12px',
    textAlign: 'center' as const,
    margin: '16px 0',
};
