# 📋 Product Requirements Document (PRD)

## Eva Accessories - Boutique en ligne d'accessoires pour cheveux

**Version:** 1.0  
**Date:** 7 Février 2026  
**Auteur:** Équipe Produit  
**Statut:** Draft

---

## 📌 1. Résumé Exécutif

### 1.1 Vision du Produit
Eva Accessories est une boutique e-commerce spécialisée dans la vente d'accessoires pour cheveux destinés aux **petites filles de 3 ans et plus**. La plateforme offre une expérience d'achat fluide, sécurisée et visuellement attrayante, avec un système d'authentification moderne et une interface d'administration complète pour la gestion des commandes.

### 1.2 Objectifs Clés
- 🎀 Proposer des accessoires tendance à **prix mini** pour que chaque fille puisse assortir ses tenues
- 🚚 Offrir la **livraison gratuite dans toute l'Europe**
- 🔐 Assurer une authentification sécurisée (Google OAuth + création de compte)
- 💳 Intégrer un système de paiement fiable (Stripe)
- 📦 Fournir un tableau de bord admin pour la gestion des commandes

### 1.3 Public Cible
| Segment | Description |
|---------|-------------|
| **Acheteurs Principaux** | Parents (majoritairement mamans) de filles âgées de 3 à 12 ans |
| **Utilisateurs Secondaires** | Grand-parents, membres de la famille offrant des cadeaux |
| **Démographie** | **Toute l'Europe** (France, Belgique, Suisse, Luxembourg, Allemagne, Espagne, Italie, etc.) |

---

## 🎯 2. Problème & Opportunité

### 2.1 Problème Identifié
Les parents veulent que leurs filles soient stylées et assorties à leurs tenues, mais:
- Les accessoires de qualité sont souvent trop chers
- Acheter en magasin prend du temps et le choix est limité
- Les frais de livraison découragent les petits achats
- Difficile de trouver une variété de styles pour matcher chaque tenue

### 2.2 Solution Proposée
Une boutique en ligne proposant des **accessoires tendance à prix mini** avec **livraison gratuite en Europe**, pour que chaque petite fille puisse:
- Avoir un accessoire assorti à chaque tenue
- Varier les styles sans se ruiner
- Recevoir ses commandes rapidement et sans frais

**Notre promesse:** Des accessoires mignons, tendance et abordables pour que votre fille soit toujours au top ! 🎀

La boutique offre:
- Un catalogue bien organisé par catégories
- Des images produits de haute qualité
- Un processus d'achat simplifié
- Une gestion des commandes efficace côté admin

---

## 👥 3. Personas Utilisateurs

### 3.1 Persona 1: Sophie, 34 ans (Cliente)
**Profil:** Maman active de 2 filles (4 et 7 ans)  
**Besoins:**
- Trouver rapidement des accessoires adaptés à l'âge de ses filles
- Payer de manière sécurisée
- Suivre sa commande
- Créer un compte pour retrouver son historique

**Frustrations:**
- Produits mal adaptés aux enfants
- Processus de paiement complexe
- Manque de filtres par âge/type de cheveux

### 3.2 Persona 2: Marie, 45 ans (Administratrice)
**Profil:** Gérante de la boutique Eva Accessories  
**Besoins:**
- Visualiser toutes les commandes en temps réel
- Accéder aux adresses de livraison pour l'expédition
- Marquer les commandes comme traitées/expédiées
- Avoir une vue d'ensemble du business

**Frustrations:**
- Interfaces admin complexes
- Informations dispersées
- Manque de notifications

---

## ⚙️ 4. Spécifications Fonctionnelles

### 4.1 Architecture Globale

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                        │
├──────────────────────┬──────────────────────────────────────────┤
│    Boutique Client   │           Admin Dashboard                 │
│  ┌────────────────┐  │  ┌────────────────────────────────────┐  │
│  │ • Catalogue    │  │  │ • Gestion des commandes            │  │
│  │ • Panier       │  │  │ • Visualisation des adresses       │  │
│  │ • Checkout     │  │  │ • Statuts des commandes            │  │
│  │ • Compte       │  │  │ • Statistiques                     │  │
│  └────────────────┘  │  └────────────────────────────────────┘  │
└──────────────────────┴──────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND / API                            │
├─────────────────────────────────────────────────────────────────┤
│  • Next.js API Routes                                            │
│  • Authentication (NextAuth.js)                                  │
│  • Stripe Integration                                            │
│  • Database ORM (Prisma/Drizzle)                                │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVICES EXTERNES                         │
├─────────────────┬─────────────────┬─────────────────────────────┤
│  Google OAuth   │     Stripe      │      Base de données        │
│                 │   (Paiements)   │   (PostgreSQL/MySQL)        │
└─────────────────┴─────────────────┴─────────────────────────────┘
```

---

### 4.2 Module: Authentification

#### 4.2.1 Connexion Google OAuth
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Login Google | Connexion en 1 clic via compte Google | 🔴 P0 |
| Récupération profil | Email, nom, photo de profil | 🔴 P0 |
| Session persistante | Maintien de la session 30 jours | 🟡 P1 |

#### 4.2.2 Création de Compte Email/Mot de passe
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Inscription | Email, mot de passe, nom, prénom | 🔴 P0 |
| Validation email | Email de confirmation avec lien | 🔴 P0 |
| Mot de passe oublié | Réinitialisation par email | 🔴 P0 |
| Force mot de passe | Min 8 chars, 1 majuscule, 1 chiffre | 🟡 P1 |

#### 4.2.3 Gestion du Profil Utilisateur
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Modifier profil | Nom, prénom, téléphone | 🟡 P1 |
| Adresses | Ajouter/modifier adresses de livraison | 🔴 P0 |
| Historique commandes | Liste des commandes passées | 🟡 P1 |
| Suppression compte | Conformité RGPD | 🟢 P2 |

---

### 4.3 Module: Catalogue Produits

#### 4.3.1 Structure des Produits
```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;                    // Prix en centimes
  compareAtPrice?: number;          // Prix barré (promotions)
  images: string[];
  category: Category;
  ageRange: '3-5' | '5-8' | '8-12' | 'all';
  hairType?: 'straight' | 'curly' | 'all';
  colors: string[];
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}
```

#### 4.3.2 Catégories de Produits
| Catégorie | Description | Icône |
|-----------|-------------|-------|
| 🎀 Nœuds & Rubans | Nœuds papillon, rubans décoratifs | ribbon |
| 📍 Barrettes | Barrettes clips, pinces | clip |
| 👑 Serre-têtes | Bandeaux, serre-têtes décorés | crown |
| 💫 Élastiques | Chouchous, élastiques fantaisie | elastic |
| 🌸 Accessoires Occasion | Mariages, fêtes, déguisements | flower |
| ✨ Coffrets Cadeaux | Sets d'accessoires assortis | gift |

#### 4.3.3 Fonctionnalités Catalogue
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Liste produits | Affichage grille avec pagination | 🔴 P0 |
| Filtres | Par catégorie, âge, couleur, prix | 🔴 P0 |
| Tri | Par prix, nouveauté, popularité | 🟡 P1 |
| Recherche | Recherche full-text avec suggestions | 🟡 P1 |
| Page produit | Images zoomables, description, avis | 🔴 P0 |
| Produits similaires | Recommandations intelligentes | 🟢 P2 |

---

### 4.4 Module: Panier & Checkout

#### 4.4.1 Panier
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Ajouter au panier | Avec animation feedback | 🔴 P0 |
| Modifier quantité | Incrémenter/décrémenter | 🔴 P0 |
| Supprimer article | Avec confirmation | 🔴 P0 |
| Panier persistant | Sauvegardé en localStorage + DB si connecté | 🔴 P0 |
| Récapitulatif | Sous-total, frais livraison, total | 🔴 P0 |
| Codes promo | Application et validation | 🟢 P2 |

#### 4.4.2 Processus de Checkout
```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Panier  │───▶│ Adresse  │───▶│ Paiement │───▶│ Confirm. │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                     │               │
                     │               ▼
                     │          ┌──────────┐
                     │          │  Stripe  │
                     │          └──────────┘
                     ▼
              ┌─────────────┐
              │ Livraison   │
              │ Standard/   │
              │ Express     │
              └─────────────┘
```

#### 4.4.3 Intégration Stripe
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Checkout Session | Stripe Checkout intégré | 🔴 P0 |
| Cartes bancaires | Visa, Mastercard, CB | 🔴 P0 |
| Apple Pay / Google Pay | Paiement mobile rapide | 🟡 P1 |
| 3D Secure | Authentification forte (SCA) | 🔴 P0 |
| Webhooks | Confirmation paiement async | 🔴 P0 |
| Remboursements | Via interface admin | 🟡 P1 |

#### 4.4.4 Options de Livraison

> [!TIP]
> 🚚 **Livraison 100% GRATUITE dans toute l'Europe !** Aucun minimum d'achat requis.

| Option | Délai | Prix | Zone |
|--------|-------|------|------|
| Standard | 3-5 jours ouvrés | **GRATUIT** | 🇪🇺 Toute l'Europe |
| Express | 1-2 jours ouvrés | **GRATUIT** | 🇫🇷 France uniquement |
| Point Relais | 4-6 jours ouvrés | **GRATUIT** | 🇫🇷 🇧🇪 France & Belgique |

**Pays couverts:** France, Belgique, Luxembourg, Suisse, Allemagne, Espagne, Italie, Portugal, Pays-Bas, Autriche, et plus encore.

---

### 4.5 Module: Gestion des Commandes (Client)

#### 4.5.1 Suivi de Commande
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Historique | Liste de toutes les commandes | 🔴 P0 |
| Détail commande | Produits, prix, adresse, statut | 🔴 P0 |
| Timeline statut | En préparation → Expédié → Livré | 🟡 P1 |
| N° de suivi | Lien vers transporteur | 🟡 P1 |
| Email notifications | Confirmation, expédition, livraison | 🔴 P0 |

#### 4.5.2 Statuts de Commande
```
PENDING ──▶ PAID ──▶ PROCESSING ──▶ SHIPPED ──▶ DELIVERED
   │          │           │             │            │
   │          │           │             │            ▼
   │          │           │             │        COMPLETED
   │          │           │             │
   ▼          ▼           ▼             ▼
CANCELLED  REFUNDED   CANCELLED    RETURNED
```

---

### 4.6 Module: Interface Super Admin 🔐

#### 4.6.1 Accès et Sécurité
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Route protégée | /admin accessible uniquement aux admins | 🔴 P0 |
| Rôles | SUPER_ADMIN, ADMIN, VIEWER | 🔴 P0 |
| 2FA | Authentification deux facteurs | 🟢 P2 |
| Logs d'activité | Traçabilité des actions admin | 🟡 P1 |

#### 4.6.2 Dashboard Principal
```
┌─────────────────────────────────────────────────────────────────┐
│                     📊 DASHBOARD ADMIN                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────┐ │
│  │ 💰 CA Jour  │ │ 📦 Nouvelles│ │ 🚚 À expédier│ │ 👥 Clients │ │
│  │   245,00€   │ │ Commandes:12│ │      8      │ │    156     │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────────┘ │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    📈 Graphique CA (7 jours)               │  │
│  │  ████                                                      │  │
│  │  ████  ████                    ████                        │  │
│  │  ████  ████  ████        ████  ████  ████                  │  │
│  │  ████  ████  ████  ████  ████  ████  ████  ████            │  │
│  │   Lu    Ma    Me    Je    Ve    Sa    Di                   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### 4.6.3 Gestion des Commandes
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Liste commandes | Tableau avec pagination, tri, filtres | 🔴 P0 |
| Recherche | Par n° commande, client, email | 🔴 P0 |
| Filtres statut | Pending, Paid, Processing, Shipped, etc. | 🔴 P0 |
| Détail commande | Produits, quantités, prix, notes client | 🔴 P0 |
| **Adresse livraison** | Affichage clair pour copie/impression | 🔴 P0 |
| Modifier statut | Dropdown pour changer le statut | 🔴 P0 |
| Ajouter n° suivi | Saisie du numéro de tracking | 🟡 P1 |
| Imprimer bon | PDF avec adresse et contenu commande | 🟡 P1 |
| Notes internes | Commentaires non visibles par le client | 🟡 P1 |

#### 4.6.4 Vue Détail Commande Admin
```
┌─────────────────────────────────────────────────────────────────┐
│  Commande #EVA-2026-00042                    Statut: [PAID ▼]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📅 Date: 07/02/2026 14:32          💳 Paiement: Stripe ✓       │
│                                                                  │
│  ──────────────────────────────────────────────────────────────  │
│                                                                  │
│  👤 CLIENT                          📍 ADRESSE DE LIVRAISON     │
│  ─────────                          ────────────────────────     │
│  Sophie Martin                      Sophie Martin                │
│  sophie.m@email.com                 12 Rue des Lilas            │
│  +33 6 12 34 56 78                  Apt 3B                       │
│                                     75011 Paris                  │
│                                     France                       │
│                                                                  │
│                                     [📋 Copier] [🖨️ Imprimer]   │
│                                                                  │
│  ──────────────────────────────────────────────────────────────  │
│                                                                  │
│  🛒 ARTICLES COMMANDÉS                                          │
│  ─────────────────────                                          │
│  ┌────────┬───────────────────────────────┬─────┬───────────┐   │
│  │ Image  │ Produit                       │ Qté │ Prix      │   │
│  ├────────┼───────────────────────────────┼─────┼───────────┤   │
│  │ [img]  │ Nœud Satin Rose XL            │  2  │ 12,00€    │   │
│  │ [img]  │ Set Barrettes Papillon (x6)   │  1  │ 8,50€     │   │
│  │ [img]  │ Serre-tête Couronne Dorée     │  1  │ 14,90€    │   │
│  └────────┴───────────────────────────────┴─────┴───────────┘   │
│                                                                  │
│  ──────────────────────────────────────────────────────────────  │
│                                                                  │
│  📊 RÉCAPITULATIF                                               │
│                                           Sous-total: 35,40€    │
│                                           Livraison:   0,00€    │
│                                           ─────────────────     │
│                                           TOTAL:      35,40€    │
│                                                                  │
│  ──────────────────────────────────────────────────────────────  │
│                                                                  │
│  📝 NOTES INTERNES                                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Ajouter une note...                                       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [💾 Sauvegarder] [📧 Envoyer Email] [🖨️ Bon de Livraison]     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### 4.6.5 Fonctionnalités Avancées Admin
| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| Export CSV | Export des commandes avec tous les détails | 🟡 P1 |
| Statistiques | CA, panier moyen, produits populaires | 🟡 P1 |
| Gestion produits | CRUD produits depuis l'admin | 🟢 P2 |
| Gestion stocks | Alertes stock bas | 🟡 P1 |
| Clients | Liste et détail clients | 🟢 P2 |

---

## 🗄️ 5. Modèle de Données

### 5.1 Schéma Base de Données

```sql
-- Utilisateurs
CREATE TABLE users (
  id            UUID PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),        -- NULL si connexion OAuth
  name          VARCHAR(255) NOT NULL,
  phone         VARCHAR(20),
  role          ENUM('CUSTOMER', 'ADMIN', 'SUPER_ADMIN') DEFAULT 'CUSTOMER',
  email_verified BOOLEAN DEFAULT FALSE,
  google_id     VARCHAR(255) UNIQUE, -- ID Google OAuth
  avatar_url    TEXT,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

-- Adresses
CREATE TABLE addresses (
  id          UUID PRIMARY KEY,
  user_id     UUID REFERENCES users(id),
  label       VARCHAR(50),           -- "Maison", "Bureau", etc.
  first_name  VARCHAR(100) NOT NULL,
  last_name   VARCHAR(100) NOT NULL,
  address1    VARCHAR(255) NOT NULL,
  address2    VARCHAR(255),
  city        VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country     VARCHAR(100) DEFAULT 'France',
  phone       VARCHAR(20),
  is_default  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Catégories
CREATE TABLE categories (
  id          UUID PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon        VARCHAR(50),
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE
);

-- Produits
CREATE TABLE products (
  id               UUID PRIMARY KEY,
  name             VARCHAR(255) NOT NULL,
  slug             VARCHAR(255) UNIQUE NOT NULL,
  description      TEXT,
  price            INT NOT NULL,            -- Prix en centimes
  compare_at_price INT,                     -- Prix barré
  category_id      UUID REFERENCES categories(id),
  age_range        ENUM('3-5', '5-8', '8-12', 'all') DEFAULT 'all',
  hair_type        ENUM('straight', 'curly', 'all') DEFAULT 'all',
  colors           JSONB,                   -- ["rose", "bleu", "blanc"]
  images           JSONB,                   -- ["url1", "url2"]
  stock            INT DEFAULT 0,
  is_active        BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMP DEFAULT NOW(),
  updated_at       TIMESTAMP DEFAULT NOW()
);

-- Commandes
CREATE TABLE orders (
  id                  UUID PRIMARY KEY,
  order_number        VARCHAR(50) UNIQUE NOT NULL,  -- EVA-2026-XXXXX
  user_id             UUID REFERENCES users(id),
  status              ENUM('PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'),
  
  -- Snapshot adresse (immutable)
  shipping_first_name VARCHAR(100) NOT NULL,
  shipping_last_name  VARCHAR(100) NOT NULL,
  shipping_address1   VARCHAR(255) NOT NULL,
  shipping_address2   VARCHAR(255),
  shipping_city       VARCHAR(100) NOT NULL,
  shipping_postal_code VARCHAR(20) NOT NULL,
  shipping_country    VARCHAR(100) NOT NULL,
  shipping_phone      VARCHAR(20),
  
  -- Montants
  subtotal            INT NOT NULL,
  shipping_cost       INT NOT NULL,
  discount            INT DEFAULT 0,
  total               INT NOT NULL,
  
  -- Livraison
  shipping_method     VARCHAR(50),
  tracking_number     VARCHAR(100),
  tracking_url        TEXT,
  
  -- Stripe
  stripe_session_id   VARCHAR(255),
  stripe_payment_intent VARCHAR(255),
  
  -- Notes
  customer_note       TEXT,
  internal_note       TEXT,
  
  -- Dates
  paid_at             TIMESTAMP,
  shipped_at          TIMESTAMP,
  delivered_at        TIMESTAMP,
  created_at          TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP DEFAULT NOW()
);

-- Lignes de commande
CREATE TABLE order_items (
  id          UUID PRIMARY KEY,
  order_id    UUID REFERENCES orders(id),
  product_id  UUID REFERENCES products(id),
  
  -- Snapshot produit (immutable)
  product_name  VARCHAR(255) NOT NULL,
  product_image TEXT,
  unit_price    INT NOT NULL,
  quantity      INT NOT NULL,
  total         INT NOT NULL,
  
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Paniers
CREATE TABLE carts (
  id          UUID PRIMARY KEY,
  user_id     UUID REFERENCES users(id),
  session_id  VARCHAR(255),           -- Pour visiteurs non connectés
  expires_at  TIMESTAMP,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- Articles panier
CREATE TABLE cart_items (
  id          UUID PRIMARY KEY,
  cart_id     UUID REFERENCES carts(id),
  product_id  UUID REFERENCES products(id),
  quantity    INT NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Codes promo (P2)
CREATE TABLE promo_codes (
  id              UUID PRIMARY KEY,
  code            VARCHAR(50) UNIQUE NOT NULL,
  discount_type   ENUM('PERCENTAGE', 'FIXED') NOT NULL,
  discount_value  INT NOT NULL,
  min_order       INT,
  max_uses        INT,
  used_count      INT DEFAULT 0,
  expires_at      TIMESTAMP,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMP DEFAULT NOW()
);
```

### 5.2 Relations

```
users ─────────┬───────────────────────────────────────────┐
               │                                           │
               ▼                                           │
           addresses (1:N)                                 │
                                                           │
products ◄────── categories (N:1)                          │
    │                                                      │
    │                                                      ▼
    └─────────────────────────────────────────────────► orders
                                                           │
                                                           ▼
                                                      order_items
```

---

## 🎨 6. Spécifications UI/UX

### 6.1 Charte Graphique

| Élément | Valeur | Usage |
|---------|--------|-------|
| **Couleur Primaire** | `#FF69B4` (Hot Pink) | CTA, accents |
| **Couleur Secondaire** | `#FFB6C1` (Light Pink) | Backgrounds, hover |
| **Couleur Accent** | `#FFC0CB` (Pink) | Éléments décoratifs |
| **Texte Principal** | `#333333` | Titres, contenu |
| **Texte Secondaire** | `#666666` | Descriptions |
| **Background** | `#FFF5F7` | Fond pages |
| **Succès** | `#4CAF50` | Confirmations |
| **Erreur** | `#FF5252` | Alertes |

### 6.2 Typographie

| Usage | Police | Taille | Weight |
|-------|--------|--------|--------|
| H1 | Poppins | 48px | 700 |
| H2 | Poppins | 36px | 600 |
| H3 | Poppins | 24px | 600 |
| Body | Inter | 16px | 400 |
| Small | Inter | 14px | 400 |
| Button | Poppins | 14px | 600 |

### 6.3 Composants UI Clés

#### Boutons
- **Primaire:** Fond rose vif, texte blanc, hover assombri
- **Secondaire:** Bordure rose, fond transparent, hover fond rose clair
- **Tertiaire:** Texte rose, souligné au hover

#### Cards Produit
- Coins arrondis (12px)
- Ombre subtile
- Image avec ratio 1:1
- Badge promo si applicable
- Animation scale au hover

#### Navigation
- Header sticky avec transparence/blur
- Logo centré ou gauche
- Icônes panier/compte avec badges

---

## 📱 7. Responsive Design

### 7.1 Breakpoints

| Breakpoint | Valeur | Appareils |
|------------|--------|-----------|
| Mobile | < 640px | Smartphones |
| Tablet | 640px - 1024px | Tablettes |
| Desktop | > 1024px | Ordinateurs |

### 7.2 Adaptations Mobile

- Navigation: Menu hamburger
- Grille produits: 2 colonnes → 1 colonne
- Checkout: Étapes empilées
- Admin: Navigation drawer latérale

---

## 🔒 8. Sécurité & Conformité

### 8.1 Sécurité

| Mesure | Description |
|--------|-------------|
| HTTPS | Certificat SSL obligatoire |
| Mots de passe | Hashage bcrypt (cost 12) |
| Sessions | JWT avec refresh tokens |
| CSRF | Protection via tokens |
| Rate limiting | API protégée contre abus |
| Validation | Sanitization de toutes les entrées |

### 8.2 Conformité RGPD

| Exigence | Implémentation |
|----------|----------------|
| Consentement cookies | Banner cookie avec options |
| Droit d'accès | Export données personnelles |
| Droit à l'oubli | Suppression compte et données |
| Politique confidentialité | Page dédiée accessible |
| Sécurité données | Chiffrement, accès limité |

### 8.3 Conformité PCI-DSS
- **Délégation à Stripe:** Aucune donnée carte stockée côté serveur
- **Stripe Checkout:** Interface de paiement hébergée par Stripe
- **Webhooks sécurisés:** Vérification signature Stripe

---

## 📊 9. Métriques & Analytics

### 9.1 KPIs Business

| Métrique | Objectif | Mesure |
|----------|----------|--------|
| Taux de conversion | > 2.5% | Visiteurs → Acheteurs |
| Panier moyen | > 28€ | Total / Nb commandes |
| Taux abandon panier | < 70% | Paniers non convertis |
| NPS | > 40 | Enquête satisfaction |
| Temps chargement | < 2s | Core Web Vitals |

### 9.2 Intégrations Analytics

- **Google Analytics 4:** Tracking comportement
- **Facebook Pixel:** Retargeting pub
- **Hotjar:** Heatmaps, recordings (P2)

---

## 🚀 10. Plan de Déploiement

### 10.1 Environnements

| Environnement | URL | Usage |
|---------------|-----|-------|
| Development | localhost:3000 | Dev local |
| Staging | staging.eva-accessories.com | Tests |
| Production | store.cherio.me | Live |

### 10.2 Infrastructure

```
                    ┌──────────────┐
                    │   Vercel     │
                    │  (Frontend)  │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   Vercel     │
                    │ (API Routes) │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼───────┐  ┌───────▼───────┐  ┌───────▼───────┐
│   PostgreSQL  │  │    Stripe     │  │    Google     │
│   (Neon/      │  │   (Payments)  │  │    OAuth      │
│    Supabase)  │  │               │  │               │
└───────────────┘  └───────────────┘  └───────────────┘
```

### 10.3 Roadmap

#### Phase 1: MVP (4 semaines)
- ✅ Setup projet Next.js
- 🔲 Authentification (Google + Email)
- 🔲 Catalogue produits
- 🔲 Panier
- 🔲 Checkout Stripe
- 🔲 Confirmation commande

#### Phase 2: Admin & Gestion (2 semaines)
- 🔲 Dashboard admin
- 🔲 Gestion commandes
- 🔲 Affichage adresses
- 🔲 Mise à jour statuts
- 🔲 Notifications email

#### Phase 3: Optimisation (2 semaines)
- 🔲 SEO
- 🔲 Performance
- 🔲 Analytics
- 🔲 Tests

#### Phase 4: Évolutions (ongoing)
- 🔲 Code promos
- 🔲 Avis produits
- 🔲 Programme fidélité
- 🔲 Application mobile

---

## 📝 11. Annexes

### 11.1 Glossaire

| Terme | Définition |
|-------|------------|
| SKU | Stock Keeping Unit - Référence unique produit |
| AOV | Average Order Value - Panier moyen |
| CTA | Call To Action - Bouton d'action |
| SCA | Strong Customer Authentication (3D Secure) |

### 11.2 Références

- [Stripe Documentation](https://stripe.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Vercel Documentation](https://vercel.com/docs)

### 11.3 Changelog

| Version | Date | Changements |
|---------|------|-------------|
| 1.0 | 07/02/2026 | Version initiale du PRD |

---

## ✅ 12. Validation

### Approuvé par:

| Rôle | Nom | Date | Signature |
|------|-----|------|-----------|
| Product Owner | | | |
| Tech Lead | | | |
| Designer | | | |

---

*Document généré le 7 Février 2026*
