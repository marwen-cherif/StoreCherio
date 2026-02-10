import { PrismaClient, AgeRange, HairType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: "postgresql://eva:eva_secret_2026@localhost:5432/eva_accessories?schema=public",
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Seeding database...');

    // Create categories
    const categories = await Promise.all([
        prisma.category.upsert({
            where: { slug: 'noeuds-rubans' },
            update: {},
            create: {
                name: 'Nœuds & Rubans',
                slug: 'noeuds-rubans',
                description: 'Nœuds papillon et rubans décoratifs pour cheveux',
                icon: 'ribbon',
                sortOrder: 1,
            },
        }),
        prisma.category.upsert({
            where: { slug: 'barrettes' },
            update: {},
            create: {
                name: 'Barrettes',
                slug: 'barrettes',
                description: 'Barrettes clips et pinces pour cheveux',
                icon: 'clip',
                sortOrder: 2,
            },
        }),
        prisma.category.upsert({
            where: { slug: 'serre-tetes' },
            update: {},
            create: {
                name: 'Serre-têtes',
                slug: 'serre-tetes',
                description: 'Bandeaux et serre-têtes décorés',
                icon: 'crown',
                sortOrder: 3,
            },
        }),
        prisma.category.upsert({
            where: { slug: 'elastiques' },
            update: {},
            create: {
                name: 'Élastiques',
                slug: 'elastiques',
                description: 'Chouchous et élastiques fantaisie',
                icon: 'elastic',
                sortOrder: 4,
            },
        }),
        prisma.category.upsert({
            where: { slug: 'occasions' },
            update: {},
            create: {
                name: 'Accessoires Occasion',
                slug: 'occasions',
                description: 'Pour mariages, fêtes et occasions spéciales',
                icon: 'flower',
                sortOrder: 5,
            },
        }),
        prisma.category.upsert({
            where: { slug: 'coffrets' },
            update: {},
            create: {
                name: 'Coffrets Cadeaux',
                slug: 'coffrets',
                description: "Sets d'accessoires assortis",
                icon: 'gift',
                sortOrder: 6,
            },
        }),
    ]);

    console.log(`✅ Created ${categories.length} categories`);

    // Get category IDs
    const categoryMap = categories.reduce((acc, cat) => {
        acc[cat.slug] = cat.id;
        return acc;
    }, {} as Record<string, string>);

    // Create products
    const products = await Promise.all([
        prisma.product.upsert({
            where: { slug: 'noeud-satin-rose' },
            update: {},
            create: {
                name: 'Nœud Satin Rose XL',
                slug: 'noeud-satin-rose',
                description: 'Magnifique nœud en satin rose, parfait pour les occasions spéciales.',
                price: 599,
                compareAtPrice: 899,
                categoryId: categoryMap['noeuds-rubans'],
                ageRange: AgeRange.ALL,
                hairType: HairType.ALL,
                colors: ['rose', 'pink'],
                images: ['/images/products/noeud-satin-rose.jpg'],
                stock: 50,
                isActive: true,
            },
        }),
        prisma.product.upsert({
            where: { slug: 'noeud-velours-bordeaux' },
            update: {},
            create: {
                name: 'Nœud Velours Bordeaux',
                slug: 'noeud-velours-bordeaux',
                description: 'Élégant nœud en velours bordeaux, doux au toucher.',
                price: 699,
                categoryId: categoryMap['noeuds-rubans'],
                ageRange: AgeRange.AGE_5_8,
                hairType: HairType.ALL,
                colors: ['bordeaux', 'marron'],
                images: ['/images/products/noeud-velours-bordeaux.jpg'],
                stock: 35,
                isActive: true,
            },
        }),
        prisma.product.upsert({
            where: { slug: 'set-barrettes-papillon' },
            update: {},
            create: {
                name: 'Set Barrettes Papillon (x6)',
                slug: 'set-barrettes-papillon',
                description: 'Lot de 6 barrettes en forme de papillon avec paillettes.',
                price: 850,
                compareAtPrice: 1200,
                categoryId: categoryMap['barrettes'],
                ageRange: AgeRange.AGE_3_5,
                hairType: HairType.ALL,
                colors: ['multicolore', 'rose', 'violet', 'bleu'],
                images: ['/images/products/barrettes-papillon.jpg'],
                stock: 100,
                isActive: true,
            },
        }),
        prisma.product.upsert({
            where: { slug: 'barrette-perle-elegante' },
            update: {},
            create: {
                name: 'Barrette Perle Élégante',
                slug: 'barrette-perle-elegante',
                description: 'Barrette ornée de perles nacrées.',
                price: 790,
                categoryId: categoryMap['barrettes'],
                ageRange: AgeRange.AGE_8_12,
                hairType: HairType.STRAIGHT,
                colors: ['blanc', 'nacre', 'or'],
                images: ['/images/products/barrette-perle.jpg'],
                stock: 45,
                isActive: true,
            },
        }),
        prisma.product.upsert({
            where: { slug: 'serre-tete-couronne-doree' },
            update: {},
            create: {
                name: 'Serre-tête Couronne Dorée',
                slug: 'serre-tete-couronne-doree',
                description: 'Serre-tête avec couronne dorée. Transformez votre princesse en vraie reine !',
                price: 1490,
                compareAtPrice: 1990,
                categoryId: categoryMap['serre-tetes'],
                ageRange: AgeRange.ALL,
                hairType: HairType.ALL,
                colors: ['or', 'doré'],
                images: ['/images/products/serre-tete-couronne.jpg'],
                stock: 25,
                isActive: true,
            },
        }),
        prisma.product.upsert({
            where: { slug: 'bandeau-velours-violet' },
            update: {},
            create: {
                name: 'Bandeau Velours Violet',
                slug: 'bandeau-velours-violet',
                description: 'Bandeau large en velours violet profond.',
                price: 890,
                categoryId: categoryMap['serre-tetes'],
                ageRange: AgeRange.AGE_5_8,
                hairType: HairType.ALL,
                colors: ['violet', 'purple'],
                images: ['/images/products/bandeau-velours.jpg'],
                stock: 40,
                isActive: true,
            },
        }),
        prisma.product.upsert({
            where: { slug: 'chouchou-soie-rose' },
            update: {},
            create: {
                name: 'Chouchou Soie Rose',
                slug: 'chouchou-soie-rose',
                description: 'Chouchou 100% soie qui protège les cheveux.',
                price: 690,
                categoryId: categoryMap['elastiques'],
                ageRange: AgeRange.ALL,
                hairType: HairType.CURLY,
                colors: ['rose', 'pink'],
                images: ['/images/products/chouchou-soie.jpg'],
                stock: 80,
                isActive: true,
            },
        }),
        prisma.product.upsert({
            where: { slug: 'set-elastiques-fantaisie' },
            update: {},
            create: {
                name: 'Set Élastiques Fantaisie (x10)',
                slug: 'set-elastiques-fantaisie',
                description: 'Lot de 10 élastiques avec différents motifs.',
                price: 590,
                categoryId: categoryMap['elastiques'],
                ageRange: AgeRange.AGE_3_5,
                hairType: HairType.ALL,
                colors: ['multicolore'],
                images: ['/images/products/elastiques-fantaisie.jpg'],
                stock: 150,
                isActive: true,
            },
        }),
        prisma.product.upsert({
            where: { slug: 'diademe-princesse' },
            update: {},
            create: {
                name: 'Diadème Princesse',
                slug: 'diademe-princesse',
                description: 'Magnifique diadème avec strass.',
                price: 1290,
                categoryId: categoryMap['occasions'],
                ageRange: AgeRange.ALL,
                hairType: HairType.ALL,
                colors: ['argent', 'cristal'],
                images: ['/images/products/diademe-princesse.jpg'],
                stock: 30,
                isActive: true,
            },
        }),
        prisma.product.upsert({
            where: { slug: 'coffret-princesse-deluxe' },
            update: {},
            create: {
                name: 'Coffret Princesse Deluxe',
                slug: 'coffret-princesse-deluxe',
                description: 'Coffret cadeau avec 10 accessoires assortis.',
                price: 2490,
                compareAtPrice: 3500,
                categoryId: categoryMap['coffrets'],
                ageRange: AgeRange.ALL,
                hairType: HairType.ALL,
                colors: ['rose', 'or', 'violet'],
                images: ['/images/products/coffret-princesse.jpg'],
                stock: 20,
                isActive: true,
            },
        }),
    ]);

    console.log(`✅ Created ${products.length} products`);

    // Create admin user
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@eva-accessories.com' },
        update: {},
        create: {
            email: 'admin@eva-accessories.com',
            name: 'Admin Eva',
            role: 'SUPER_ADMIN',
            emailVerified: new Date(),
        },
    });

    console.log(`✅ Created admin user: ${adminUser.email}`);
    console.log('🎉 Seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await pool.end();
        await prisma.$disconnect();
    });
