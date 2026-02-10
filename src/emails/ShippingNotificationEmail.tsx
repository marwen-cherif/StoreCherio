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
} from '@react-email/components';
import * as React from 'react';

interface ShippingNotificationEmailProps {
    orderNumber: string;
    customerName: string;
    trackingNumber: string;
    trackingUrl: string;
    carrier: string;
    shippingAddress: {
        firstName: string;
        lastName: string;
        address1: string;
        city: string;
        postalCode: string;
        country: string;
    };
}

export default function ShippingNotificationEmail({
    orderNumber = 'EVA-2026-00001',
    customerName = 'Marie',
    trackingNumber = '6X123456789',
    trackingUrl = 'https://www.laposte.fr/outils/suivre-vos-envois?code=6X123456789',
    carrier = 'Colissimo',
    shippingAddress = {
        firstName: 'Marie',
        lastName: 'Dupont',
        address1: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
    },
}: ShippingNotificationEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>
                Votre commande #{orderNumber} est en route ! 🚚
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
                        Votre colis est en route ! 🚚
                    </Heading>

                    <Text style={text}>
                        Bonjour {customerName},
                    </Text>

                    <Text style={text}>
                        Bonne nouvelle ! Votre commande <strong>#{orderNumber}</strong> a été expédiée
                        et est en route vers vous.
                    </Text>

                    <Hr style={hr} />

                    {/* Tracking Info */}
                    <Section style={trackingBox}>
                        <Text style={trackingTitle}>📦 Suivi de votre colis</Text>
                        <Text style={trackingCarrier}>
                            Transporteur : <strong>{carrier}</strong>
                        </Text>
                        <Text style={trackingNum}>
                            Numéro de suivi : <strong>{trackingNumber}</strong>
                        </Text>
                        <Link href={trackingUrl} style={trackButton}>
                            Suivre mon colis →
                        </Link>
                    </Section>

                    <Hr style={hr} />

                    {/* Shipping Address */}
                    <Heading as="h2" style={subtitle}>
                        Livraison à
                    </Heading>

                    <Text style={addressText}>
                        {shippingAddress.firstName} {shippingAddress.lastName}<br />
                        {shippingAddress.address1}<br />
                        {shippingAddress.postalCode} {shippingAddress.city}<br />
                        {shippingAddress.country}
                    </Text>

                    <Hr style={hr} />

                    {/* Delivery Estimate */}
                    <Section style={infoBox}>
                        <Text style={infoTitle}>🗓️ Livraison estimée</Text>
                        <Text style={infoText}>
                            Votre colis devrait arriver dans 3-5 jours ouvrés.
                            Vous pouvez suivre son parcours en temps réel avec le lien ci-dessus.
                        </Text>
                    </Section>

                    {/* Footer */}
                    <Hr style={hr} />

                    <Text style={footer}>
                        Si vous avez des questions, contactez-nous à{' '}
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

const trackingBox = {
    backgroundColor: '#ecfdf5',
    padding: '24px',
    borderRadius: '12px',
    textAlign: 'center' as const,
    margin: '24px 0',
};

const trackingTitle = {
    color: '#1f2937',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 16px',
};

const trackingCarrier = {
    color: '#4b5563',
    fontSize: '14px',
    margin: '8px 0',
};

const trackingNum = {
    color: '#4b5563',
    fontSize: '14px',
    margin: '8px 0 16px',
};

const trackButton = {
    backgroundColor: '#10b981',
    borderRadius: '8px',
    color: '#ffffff',
    display: 'inline-block',
    fontSize: '14px',
    fontWeight: '600',
    padding: '12px 24px',
    textDecoration: 'none',
    marginTop: '8px',
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
