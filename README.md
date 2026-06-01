# Floor Access — Luxury Showroom Sidecar & Triage Hub

A high-performance digital utility layer ("sidecar") built for **Asian Barn NYC**. This application bridges the high-friction gap between discovering unique, one-of-a-kind luxury antiques and securing them immediately. It bypasses legacy static page updates to provide real-time inventory drop synchronization and an AI-assisted text-concierge triage workspace.

# Shop OS: Floor Access

An enterprise-level realtime showroom "Sidecar" platform for boutique furniture retail.

🔗 **[Live Showroom Demo (Customer View)](https://floor-access.vercel.app)**  
🔗 **[Live Triage Hub (Owner Dashboard)](https://floor-access.vercel.app/admin)** no password needed, click enter

---


---

## 🏛️ Project Architecture: The Dual-Flow Sidecar

Rather than altering the foundational e-commerce store, **Floor Access** operates as an agile sidecar consisting of two primary spaces mapped directly to a Supabase backend:
┌─────────────── Global FAB ──────────────┐
              │                                         ▼
[Public Showroom: /floor] ───► Product Drawer ───► [Supabase DB] ───► [Owner Triage Hub: /admin]
▲                                         ▲
└─────────── Supabase Realtime ───────────┘


### 1. Flow A: The Global Concierge (Text the Floor)
* **Entry Point:** Accesses via a permanent, brushed gold Floating Action Button (FAB) or high-profile footer placements ("IG Bio / Missed Call replacement").
* **Context:** Store-wide, non-product requests (e.g., store hours, shipping logistics, lost items).
* **Database Mapping:** Defaults to `item_of_interest: 'General Concierge'` and `item_id: null`.

### 2. Flow B: Product-Specific Inquiries
* **Entry Point:** Triggered by selecting a piece on the Live Floor, opening an interactive slide-out details drawer.
* **Context:** Transactional, high-ticket intent focused on a specific inventory asset.
* **Database Mapping:** Automatically links directly to the explicit `item_id` and item name in the database.

---

## 🛠️ Tech Stack & Optimization Details

* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS (Dark Editorial Archive Palette: #1a1a1a, Matte Charcoal, Brushed Gold accents)
* **Database & Realtime:** Supabase (PostgreSQL) tracking `floor_items` and `inquiries`.
* **AI Intelligence Layer:** OpenAI API processing text input to evaluate customer sentiment tone (`Positive`, `Neutral`, `Frustrated`) and parsing operational priority rankings.

### Cache Bypassing & Realtime State
To prevent build-time caching of rapid inventory drops, the public floor utilizes explicit dynamic server headers:
```typescript
export const dynamic = 'force-dynamic';
export const revalidate = 0;
The UI leverages supabase.channel() to create client-side listeners on postgres_changes. When an item's status is toggled in the Admin Hub, the public gallery badge flips instantly (Available ◄► Pending) without triggering a browser refresh.

🎛️ Database Schema Reference
floor_items
Tracks live physical inventory on the showroom floor.

id (uuid, Primary Key)

name (text)

description (text)

price (numeric)

image_url (text) — Scaled via WebP patterns; features automated local fallback styling.

status (text) — available or pending.

inquiries
Captures inbound customer interaction across both channels.

id (uuid, Primary Key)

customer_name / customer_phone / customer_message (text)

category (text) — e.g., Availability, Delivery, Lost & Found, Pricing

item_id (uuid, Foreign Key nullable)

item_of_interest (text) — Populated with item name or 'General Concierge'

intent_tag (text) — AI-generated classification (High Intent, Medium Intent, Low Intent)

sentiment (text) — AI-parsed tone analysis

ai_reply_draft / sms_reply (text) — Generated communication boilerplate

status (text) — new or replied
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_public_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_secret

# OpenAI Engine Configuration
OPENAI_API_KEY=your_openai_api_secret_key
Local Development
To launch the studio environment locally:
Open http://localhost:3000 to view the application.
