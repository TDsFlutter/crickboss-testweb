# CrickBoss.live — Design & Prototype Documentation

> **Purpose:** This document is the single source of truth for the CrickBoss web app's design system. Use it as a reference when building prototypes in **Stitch**, **Figma**, or any design tool.

---

## 🚀 Local Development Commands

### Start Dev Server (Background / Minimized)
```powershell
Start-Process cmd -ArgumentList '/c cd /d "d:\Android Studio\CrickBoss\projects\crickboss-web" && npm run dev' -WindowStyle Minimized
```

### Start Dev Server (Interactive Terminal)
```powershell
cd "d:\Android Studio\CrickBoss\projects\crickboss-web"; npm run dev
```
> Runs at: **http://localhost:5173**

### Build for Production
```powershell
cd "d:\Android Studio\CrickBoss\projects\crickboss-web"; node_modules/.bin/vite build 2>&1
```

### Preview Production Build
```powershell
Start-Process cmd -ArgumentList '/c cd /d "d:\Android Studio\CrickBoss\projects\crickboss-web" && node_modules/.bin/vite preview --port 4173' -WindowStyle Minimized
```
> Runs at: **http://localhost:4173**

### Build + Commit + Push to GitHub
```powershell
cd "d:\Android Studio\CrickBoss\projects\crickboss-web"; node_modules/.bin/vite build 2>&1; git add .; git commit -m "chore: production build update"; git push origin main
```

---

## 📑 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Site Map & Routes](#2-site-map--routes)
3. [Design Tokens — Colors](#3-design-tokens--colors)
4. [Design Tokens — Typography](#4-design-tokens--typography)
5. [Design Tokens — Spacing](#5-design-tokens--spacing)
6. [Design Tokens — Radius, Shadows & Z-Index](#6-design-tokens--radius-shadows--z-index)
7. [Layout System](#7-layout-system)
8. [Component Library](#8-component-library)
9. [Page Blueprints](#9-page-blueprints)
10. [Stitch Prototyping Guide](#10-stitch-prototyping-guide)

---

## 1. Project Overview

| Property | Value |
|---|---|
| **Product Name** | CrickBoss.live |
| **Tagline** | The World's Most Trusted Cricket Auction Platform |
| **Tech Stack** | React 19 + TypeScript + Vite + framer-motion |
| **Theme Support** | Light mode & Dark mode (toggle in header) |
| **Supported Languages** | English |
| **Primary Market** | India + 20+ countries |

### Brand Personality
- **Trustworthy** — Deep navy blue as the core identity color
- **Energetic** — Vibrant emerald accent for CTAs and highlights
- **Premium** — Clean layouts, shadow depth, smooth animations

---

## 2. Site Map & Routes

```
/ ─────────────────────── Home Page
├── /auctions/today ──── Today's Auctions
├── /auctions/upcoming ─ Upcoming Auctions
├── /features ─────────── Features Page
├── /pricing ──────────── Pricing Page
├── /blog ─────────────── Blog List Page
│   └── /blog/:slug ──── Blog Post Page
├── /about ─────────────── About Page
├── /contact ───────────── Contact Page
├── /faq ───────────────── FAQ Page
├── /clients ───────────── Clients & Partners
├── /video-gallery ─────── Video Gallery
├── /privacy ───────────── Privacy Policy (placeholder)
├── /terms ─────────────── Terms & Conditions (placeholder)
├── /cancellation ──────── Cancellation & Refund (placeholder)
├── /shipping ──────────── Shipping & Delivery (placeholder)
└── * ──────────────────── 404 Not Found Page
```

### Navigation Bar Links (Desktop)
| Label | Route |
|---|---|
| Home | `/` |
| Today's Auctions | `/auctions/today` |
| Upcoming | `/auctions/upcoming` |
| Features | `/features` |
| Pricing | `/pricing` |
| Blog | `/blog` |
| About | `/about` |
| Contact | `/contact` |

---

## 3. Design Tokens — Colors

### Primary Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#1F3C88` | Buttons, links, logo, nav active state |
| `--color-primary-soft` | `#2C4DA7` | Hover state of primary |
| `--color-accent` | `#3DBE8B` | CTA highlights, badges, overlines, dividers |
| `--color-warning` | `#FF9F43` | Pricing highlights, alerts |

### Text Colors

| Token | Light Value | Dark Value |
|---|---|---|
| `--color-heading` | `#0F1E3D` | `#EDF2F7` |
| `--color-body` | `#4A5568` | `#A0AEC0` |
| `--color-muted` | `#9AA4B2` | `#718096` |

### Background Colors

| Token | Light Value | Dark Value |
|---|---|---|
| `--color-bg-light` | `#F7FAFC` | `#111827` |
| `--color-bg-dark` | `#0E1A2B` | `#0A1120` |
| `--color-white` | `#FFFFFF` | `#1A2535` (card surface) |

### Border Colors

| Token | Light Value | Dark Value |
|---|---|---|
| `--color-border` | `#E2E8F0` | `rgba(255,255,255,0.08)` |
| `--color-border-dark` | `rgba(255,255,255,0.1)` | `rgba(255,255,255,0.05)` |

### Semantic Overlay Colors

| Token | Value | Usage |
|---|---|---|
| `--color-accent-bg` | `rgba(61,190,139,0.12)` | Accent badge background |
| `--color-accent-border` | `rgba(61,190,139,0.3)` | Accent badge border |
| `--color-primary-bg` | `rgba(31,60,136,0.08)` | Primary badge background |
| `--color-warning-bg` | `rgba(255,159,67,0.12)` | Warning badge background |

### Special Colors
| Name | Hex | Usage |
|---|---|---|
| Live / Error | `#EF4444` | Live badge dot, error states |
| CTA Button Text | `#0F2E1E` | Text on green accent buttons |

---

## 4. Design Tokens — Typography

### Font Families

| Role | Family | Fallback |
|---|---|---|
| **Headings** | Plus Jakarta Sans | Poppins → Inter → sans-serif |
| **Body** | Inter | Roboto → Source Sans 3 → sans-serif |

> **Google Fonts URL:**  
> `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap`

### Font Sizes (Fluid / Clamped)

| Token | Size | Usage |
|---|---|---|
| `--text-h1` | `clamp(32px, 4.5vw, 56px)` | Page hero headings |
| `--text-h2` | `clamp(24px, 3.5vw, 40px)` | Section headings |
| `--text-h3` | `clamp(20px, 2.5vw, 28px)` | Sub-section headings |
| `--text-h4` | `clamp(18px, 2vw, 22px)` | Card titles |
| `--text-h5` | `18px` | Small headings |
| `--text-h6` | `13px` | Labels, overlines |
| `--text-body-lg` | `18px` | Lead paragraph |
| `--text-body` | `16px` | Default body text |
| `--text-body-sm` | `14px` | Secondary body text |
| `--text-caption` | `12px` | Captions, fine print |
| `--text-btn` | `15px` | Button label |
| `--text-btn-sm` | `13px` | Small button label |

### Font Weights

| Token | Value |
|---|---|
| `--fw-regular` | 400 |
| `--fw-medium` | 500 |
| `--fw-semibold` | 600 |
| `--fw-bold` | 700 |
| `--fw-extrabold` | 800 |

### Line Heights

| Token | Value | Usage |
|---|---|---|
| `--lh-tight` | 1.15 | Large headings (H1, H2) |
| `--lh-snug` | 1.3 | H3, H4 |
| `--lh-normal` | 1.5 | General body text, labels |
| `--lh-relaxed` | 1.7 | Body text paragraphs |
| `--lh-loose` | 1.9 | Spacious reading contexts |

### Typography Utility Classes

| Class | Description |
|---|---|
| `.h1` — `.h6` | Heading styles |
| `.body-lg` / `.body` / `.body-sm` | Body text variants |
| `.caption` | Small muted text |
| `.overline` | Section label above a heading (uppercase, accent color, 11px, 0.12em tracking) |
| `.text-heading` / `.text-body` / `.text-muted` | Color utilities |
| `.text-primary` / `.text-accent` / `.text-warning` | Brand color text |
| `.fw-regular` / `.fw-medium` / `.fw-semibold` / `.fw-bold` / `.fw-extrabold` | Weight utilities |

---

## 5. Design Tokens — Spacing

Base unit: **4px**

| Token | Value |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |
| `--space-16` | 64px |
| `--space-20` | 80px |
| `--space-24` | 96px |

---

## 6. Design Tokens — Radius, Shadows & Z-Index

### Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 6px | Small elements (inputs, tags) |
| `--radius-md` | 12px | Cards, modals |
| `--radius-lg` | 16px | Large cards |
| `--radius-xl` | 24px | Hero cards, feature blocks |
| `--radius-full` | 9999px | Pills, badges, avatar circles |

### Shadows

| Token | Value | Usage |
|---|---|---|
| `--shadow-sm` | Subtle | Input focus, small cards |
| `--shadow-md` | Medium | Elevated cards |
| `--shadow-lg` | Large | Modals, dropdowns |
| `--shadow-xl` | Extra large | Feature spotlights |
| `--shadow-accent` | Green glow `rgba(61,190,139,.30)` | Accent CTA buttons |
| `--shadow-blue` | Blue glow `rgba(31,60,136,.25)` | Primary buttons |

### Transitions

| Token | Value |
|---|---|
| `--transition-fast` | 150ms ease |
| `--transition-normal` | 250ms ease |
| `--transition-slow` | 400ms cubic-bezier(0.4, 0, 0.2, 1) |

> ⚠️ All `background-color`, `border-color`, `color`, and `box-shadow` properties automatically animate between light ↔ dark at **200ms** globally.

### Z-Index Scale

| Token | Value | Layer |
|---|---|---|
| `--z-below` | -1 | Background decorations |
| `--z-base` | 0 | Normal flow |
| `--z-raised` | 10 | Slightly elevated (hover states) |
| `--z-dropdown` | 100 | Dropdowns, tooltips |
| `--z-sticky` | 200 | Header (sticky) |
| `--z-overlay` | 300 | Modals backdrop |
| `--z-modal` | 400 | Modal dialogs |
| `--z-toast` | 500 | Toast notifications |

---

## 7. Layout System

### Container

```
max-width: 1280px
padding-inline: 24px
margin: auto
```

### Section Padding

| Breakpoint | Padding |
|---|---|
| Desktop (≥1024px) | 96px top/bottom |
| Tablet (768–1024px) | 64px top/bottom |
| Mobile (<768px) | 48px top/bottom |

### Header
- **Height:** 72px
- **Behavior:** Transparent on Home hero, turns solid (dark navy) on scroll past 60px. Always solid on non-home pages.
- **Z-Index:** `--z-sticky` (200)

### Grid Utilities

| Class | Columns | Responsive Collapse |
|---|---|---|
| `.grid-4` | 4 cols | → 2 cols at 1024px → 1 col at 640px |
| `.grid-3` | 3 cols | → 2 cols at 1024px → 1 col at 640px |
| `.grid-2` | 2 cols | → 1 col at 640px |

Gap between grid items: `32px` (`--space-8`)

### Flex Utilities

| Class | Description |
|---|---|
| `.flex` | `display: flex` |
| `.flex-center` | Centered both axes |
| `.flex-between` | Space-between, vertically centered |
| `.flex-col` | Column direction |
| `.gap-2/4/6/8` | Gap shortcuts |

---

## 8. Component Library

### 8.1 Header

```
┌──────────────────────────────────────────────────────────────┐
│ [Logo]   Home  Today's Auctions  Upcoming  Features  Pricing  │
│          Blog  About  Contact     [☀/🌙]  [Register / Login]  │
│                                                  [≡ Hamburger]│
└──────────────────────────────────────────────────────────────┘
```

- **Logo:** SVG circle (navy `#1F3C88`) with cricket bat path (emerald `#3DBE8B`) + text "Crick**Boss**"
- **Active nav link:** Bottom underline using `--color-accent`
- **Theme Toggle:** Sun icon (light mode) / Moon icon (dark mode) — 17px icon
- **CTA Button:** "Register / Login" → links to `/auctions/today`
- **Mobile:** Hamburger → right-slide Drawer

### 8.2 Footer

Four columns:
1. **Brand column** — Logo + tagline + social icons (Twitter/X, Instagram, YouTube, LinkedIn, Facebook)
2. **Quick Links** — Home, Today's Auctions, Upcoming, Video Gallery, Blog, FAQ
3. **Company** — About Us, Clients & Partners, Features, Pricing, Contact Us
4. **Legal** — Privacy Policy, Terms & Conditions, Cancellation & Refund, Shipping & Delivery

Contact info: `support@crickboss.live`

### 8.3 Badges / Pills

| Class | Background | Text color | Border |
|---|---|---|---|
| `.badge-accent` | `rgba(61,190,139,0.12)` | `#3DBE8B` | `rgba(61,190,139,0.3)` |
| `.badge-primary` | `rgba(31,60,136,0.08)` | `#1F3C88` | — |
| `.badge-warning` | `rgba(255,159,67,0.12)` | `#FF9F43` | — |
| `.badge-live` | `rgba(239,68,68,0.12)` | `#EF4444` | `rgba(239,68,68,0.3)` |

Padding: `4px 10px` — Border-radius: `--radius-full` — Font: 12px semibold

### 8.4 Auction Card (AuctionCard component)

Fields displayed per card:
- Tournament name / Auction title
- Date & time
- Status badge (LIVE / Upcoming)
- Teams count
- Location / format

### 8.5 Live Pulse Dot

```css
.pulse-dot — 8px red circle (#EF4444), pulsing scale animation (1→1.4→1) at 1.5s loop
```

Used alongside `.badge-live` for real-time auction indicators.

### 8.6 Scroll Animation

```css
.fade-up — starts opacity:0 + translateY(24px), animates in at 0.6s ease when .visible is added
```

Used on section cards and content blocks.

### 8.7 Divider

```
48px wide · 3px tall · color: --color-accent · border-radius: full · centered
```

### 8.8 View All Link

Inline-flex with arrow icon. On hover: color shifts to `--color-accent`, gap increases for animated arrow effect.

---

## 9. Page Blueprints

### 9.1 Home Page (`/`)

**Sections (top → bottom):**

1. **HeroSection** — Full-width dark hero
2. **AuctionsSection** (variant: "today", limit: 4) — Today's live/upcoming auctions grid
3. **AuctionsSection** (variant: "upcoming", limit: 3) — Future auctions
4. **FeaturesSection** — Feature grid (12 features)
5. **PricingSection** — Pricing plan cards
6. **FAQSection** (limit: 6) — Frequently asked questions accordion

---

#### Hero Section Layout

```
┌────────────────────────────────────────────────────────────┐
│  [Dark stadium background + gradient overlay]              │
│  [Floating emoji elements: 🏏 🔴 🏆 ⭐ 🎯]               │
│  [Animated spotlight rings]                                │
│                                                            │
│  LEFT COLUMN                    RIGHT COLUMN               │
│  ─────────────────              ──────────────────         │
│  [Overline badge]               [Auction Banner Card]      │
│  "The World's Most Trusted..."   SVG Cricket Art           │
│                                  Live bid: ₹2,50,000       │
│  H1: Run Powerful               [Chip: 12 Teams Bidding]   │
│      Cricket Auctions —         [Chip: 10,000+ Auctions]   │
│      Anywhere, Anytime           [Chip: Real-Time Bids]    │
│                                                            │
│  Lead paragraph                                            │
│                                                            │
│  [Get Started Free →]  [▶ Watch Demo]                      │
│                                                            │
│  ✅ No credit card  ⚡ Setup 2min  🌍 20+ countries        │
│                                                            │
│  ──────── STATS STRIP ───────────────────────────────────  │
│  10,000+     5,000+    50,000+    5,00,000+    20+         │
│  Auctions  Organizers  Teams      Players    Countries     │
└────────────────────────────────────────────────────────────┘
```

**Hero background:** `--color-bg-dark` (`#0E1A2B`) with radial light rings
**H1 accent span:** `--color-accent` (`#3DBE8B`)
**Primary CTA:** Solid accent green button with shadow-accent
**Ghost CTA:** Outline/transparent button

---

### 9.2 Features Page (`/features`)

12-feature grid using `.grid-4` layout:

| # | Feature | Icon |
|---|---|---|
| 1 | Real-Time Live Bidding | 🎯 |
| 2 | Tournament & League Management | 🏆 |
| 3 | Team Builder & Roster Tools | 👥 |
| 4 | Player Profiles & Stats | 📊 |
| 5 | Live Streaming Integration | 📡 |
| 6 | Public Auction Sharing | 🔗 |
| 7 | Mobile App (iOS & Android) | 📲 |
| 8 | Customizable Auction Settings | ⚙️ |
| 9 | Secure Tournament Codes | 🔒 |
| 10 | Video Auction Replays | 📹 |
| 11 | Notifications & Alerts | 📧 |
| 12 | Multi-Sport Support | 🌍 |

---

### 9.3 Pricing Page (`/pricing`)

6 pricing tiers:

| Plan | Teams | Price | Popular? |
|---|---|---|---|
| Starter | 3 | Free | No |
| Basic | 4 | ₹1,999 | No |
| Standard | 6 | ₹2,499 | No |
| **Pro** | **8** | **₹2,999** | ✅ **Yes** |
| Advanced | 12 | ₹3,999 | No |
| Elite | 16 | ₹4,999 | No |

All plans are **per-auction** pricing.

---

### 9.4 Today's Auctions (`/auctions/today`)

- Full AuctionsSection with `variant="today"`, no limit
- Contains AuctionCard grid

### 9.5 Upcoming Auctions (`/auctions/upcoming`)

- Full AuctionsSection with `variant="upcoming"`, no limit

### 9.6 FAQ Page (`/faq`)

- Full FAQSection, no limit (accordion style)

### 9.7 Blog (`/blog`)

- Blog card list layout

### 9.8 Blog Post (`/blog/:slug`)

- Single post detail view

### 9.9 About (`/about`)

- Company story, team, mission section

### 9.10 Contact (`/contact`)

Contact details:
- Email: `support@crickboss.live`
- Phone: `+91 XXXXX XXXXX`
- WhatsApp link available
- Location: India

### 9.11 Clients & Partners (`/clients`)

Partner logos / testimonials grid

### 9.12 Video Gallery (`/video-gallery`)

Video grid of auction recordings

### 9.13 Placeholder Pages (`/privacy`, `/terms`, `/cancellation`, `/shipping`)

Legal pages — currently use `PlaceholderPage` template.

### 9.14 404 Page (`*`)

Custom Not Found page with navigation back to home.

---

## 10. Stitch Prototyping Guide

> Use [Google Stitch](https://stitch.withgoogle.com) to rapidly prototype screens. Below is the exact design system to apply.

### Step 1 — Set Up the Color Palette in Stitch

Add these as custom colors in your Stitch project:

```
Primary       #1F3C88
Primary Soft  #2C4DA7
Accent        #3DBE8B
Warning       #FF9F43
Heading       #0F1E3D
Body          #4A5568
Muted         #9AA4B2
Background    #F7FAFC
Dark BG       #0E1A2B
White/Card    #FFFFFF
Border        #E2E8F0
Live/Error    #EF4444
```

### Step 2 — Add Fonts

- **Heading font:** `Plus Jakarta Sans` (weights: 400, 600, 700, 800)
- **Body font:** `Inter` (weights: 400, 500, 600)

Both are available via Google Fonts.

### Step 3 — Describe Screens to Stitch

Use these prompts when generating screens:

#### Header Prompt
```
Design a sticky header for a cricket auction platform called CrickBoss.
Background: transparent on homepage hero, solid dark navy #1F3C88 after scroll.
Left: logo (SVG navy circle with green bat path) + text "Crick" (white) + "Boss" (green #3DBE8B).
Center: nav links — Home, Today's Auctions, Upcoming, Features, Pricing, Blog, About, Contact.
Active link has a green underline accent.
Right: sun/moon theme toggle icon + "Register / Login" button (green #3DBE8B background).
Mobile: show hamburger menu icon instead of nav.
Height: 72px. Font: Plus Jakarta Sans.
```

#### Hero Section Prompt
```
Design a full-width hero section for CrickBoss cricket auction platform.
Dark background #0E1A2B with faint animated glow rings.
Left column:
  - Small badge pill: green dot + "The World's Most Trusted Cricket Auction Platform"
  - H1 (56px, Plus Jakarta Sans, extrabold, white): "Run Powerful Cricket Auctions — " 
    with "Anywhere, Anytime" in green #3DBE8B
  - Lead text (18px, #A0AEC0): "CrickBoss makes live player bidding, team formation, 
    and tournament management effortless."
  - Two buttons: [Get Started Free →] solid green, [▶ Watch Demo] ghost outline
  - Trust row: "✅ No credit card" · "⚡ Setup in 2 minutes" · "🌍 20+ countries"
Right column:
  - Dark card (navy border, rounded-xl) showing a live auction bid of ₹2,50,000
  - Small floating chips: "12 Teams Bidding", "10,000+ Auctions", "Real-Time Bids"
Bottom: dark stats bar with 5 stats: 
  10,000+ Auctions | 5,000+ Organizers | 50,000+ Teams | 5,00,000+ Players | 20+ Countries
```

#### Features Section Prompt
```
Design a features section for CrickBoss.
Section heading (H2): "Everything You Need to Run a Perfect Auction"
Sub-heading overline (uppercase green, 11px): "PLATFORM FEATURES"
4-column card grid (3-column on tablet, 1-column on mobile).
Each card: large emoji icon (40px), feature title (H4 navy bold), description (body-sm grey).
Card style: white background, 12px border-radius, subtle shadow, 24px padding,
  with a thin green accent border-left on hover.
Features to include:
  🎯 Real-Time Live Bidding
  🏆 Tournament & League Management
  👥 Team Builder & Roster Tools
  📊 Player Profiles & Stats
  📡 Live Streaming Integration
  🔗 Public Auction Sharing
  📲 Mobile App (iOS & Android)
  ⚙️ Customizable Auction Settings
  🔒 Secure Tournament Codes
  📹 Video Auction Replays
  📧 Notifications & Alerts
  🌍 Multi-Sport Support
```

#### Pricing Section Prompt
```
Design a pricing section for CrickBoss cricket auction platform.
Section overline: "PRICING" (green uppercase)
Section heading (H2): "Choose Your Plan"
Subtitle: "All plans are per-auction — pay only when you run one."
6-card grid (3 cols on desktop, 2 on tablet, 1 on mobile).
Each card: plan name (H4), team count, price (H3 in primary navy or accent green if popular),
  "per auction" label, feature list with checkmarks, CTA button.
Highlight "Pro" plan card with: primary navy border, "Most Popular" badge (accent green),
  slightly taller and elevated (box-shadow-blue).
Plans: Starter (Free, 3 teams), Basic (₹1,999, 4), Standard (₹2,499, 6),
  Pro (₹2,999, 8) [highlighted], Advanced (₹3,999, 12), Elite (₹4,999, 16).
```

#### Auction Card Prompt
```
Design an auction listing card for CrickBoss.
Card: white background, 16px radius, box-shadow-md, 20px padding.
Top: status badge (green "LIVE" or grey "Upcoming") with live pulse dot for live.
Middle: Tournament name (H4 navy bold), date/time (caption muted), 
  team count with team icon, location tag.
Bottom: "View Auction →" link in primary blue with hover arrow animation.
```

### Step 4 — Key Design Rules

1. **Always use Plus Jakarta Sans for headings** — never default serif/sans
2. **Overlines always go above H2 headings** — green, uppercase, 11px, 0.12em tracking
3. **Section-header block** — centered, max-width 720px, `--space-16` margin below
4. **Cards** — white background, `--radius-md` (12px), `--shadow-md`, `--space-6` padding
5. **Primary buttons** — `--color-primary` bg with `--shadow-blue` glow
6. **CTA/accent buttons** — `--color-accent` bg with `--shadow-accent` glow, dark text `#0F2E1E`
7. **Dark sections** (Hero, footer) use `--color-bg-dark` (`#0E1A2B`)
8. **Alternating sections** — `.bg-white` and `.bg-light` for rhythm
9. **Fade-up animations** on all cards when they scroll into view (translate Y 24px → 0)
10. **Mobile breakpoints** — 1024px (tablet), 768px (landscape phone), 640px (small mobile)

---

## 11. Assets & Icons

### Logo Mark (SVG)
```svg
<svg width="28" height="28" viewBox="0 0 32 32" fill="none">
  <circle cx="16" cy="16" r="16" fill="#1F3C88" />
  <path d="M10 23 L16 9 L22 23" stroke="#3DBE8B" strokeWidth="2.5" 
        strokeLinecap="round" strokeLinejoin="round" />
  <line x1="12" y1="19" x2="20" y2="19" stroke="#3DBE8B" 
        strokeWidth="2.2" strokeLinecap="round" />
</svg>
```

### Icon Library
- **`lucide-react`** is used throughout (sun, moon, hamburger, arrow icons)
- Custom SVG icons for logo and cricket art in HeroSection

### Social Links
| Platform | URL |
|---|---|
| Twitter/X | https://x.com/crickboss |
| Instagram | https://instagram.com/crickboss |
| YouTube | https://youtube.com/@crickboss |
| LinkedIn | https://linkedin.com/company/crickboss |
| Facebook | https://facebook.com/crickboss |

---

*Last updated: February 2026 · CrickBoss.live*
