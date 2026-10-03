# NoWait-Print — Screen Wireframes & Application Route Map

**Document Status:** Baseline Approved / Navigation Frozen  
**Version:** 1.0 (Phase 0)  
**Date:** October 2026  
**Authors:** Senior Product Designer, Frontend Architect  

---

## 1. Application Route Hierarchy & Access Guards

```
/ (Root Landing Page) ────────────────────── Public / Marketing
│
├── /s/[slug] ────────────────────────────── Public Customer Kiosk Storefront (Scoped Session)
│   ├── /upload ──────────────────────────── File Upload & Preflight Inspection
│   ├── /configure ───────────────────────── Work Item Builder & Settings
│   └── /checkout ────────────────────────── Price Review, Payment Choice & Submission
│
├── /track/[token] ───────────────────────── Capability-Protected Customer Order Tracking
│
└── /admin ───────────────────────────────── Protected Staff Portal (GoTrue Auth Guard)
    ├── /login ───────────────────────────── Staff Authentication
    ├── /(dashboard)
    │   ├── / ────────────────────────────── Live Dashboard Overview & KPI Metrics
    │   ├── /orders ──────────────────────── Real-time Order Queue & Drawer Handover
    │   ├── /pricing ─────────────────────── Pricing Matrix & Addon Rates (Owner Only)
    │   ├── /settings ────────────────────── Shop Hours, QR Code & Upload Boundaries (Manager/Owner)
    │   └── /staff ───────────────────────── Staff Memberships & Role Invites (Owner Only)
```

---

## 2. Customer Journey Screens & Wireframes

### 2.1 Storefront & File Upload (`/s/[slug]`)
- **Layout:** Mobile-optimized vertical stack.
- **Components:**
  - Header with shop logo, name, operating status badge (Green: Accepting Orders; Amber: Paused).
  - Drag-and-drop / Tap-to-select upload dropzone supporting PDF, Office, and Images.
  - Preflight progress list showing each file's processing status (`Uploading -> Validating -> Converting -> Ready (X pages)`).
  - Error callout cards for rejected files with actionable guidance (e.g. "Password-protected PDFs cannot be processed").

### 2.2 Work Builder (`/s/[slug]/configure`)
- **Layout:** Card-per-document configuration list.
- **Controls per Work Item:**
  - File thumbnail preview and verified page count badge.
  - Copy count stepper (`-` `[ 1 ]` `+`).
  - Toggle buttons for Color Mode (`B&W` / `Color`).
  - Toggle buttons for Print Sides (`Single-sided` / `Double-sided`).
  - Paper Size dropdown (`A4`, `A3`, `Letter`).
  - Page Range selector (`All Pages` or custom input `1-5, 8`).
  - Accordion for "Paper & Binding Options" (GSM selection, Spiral/Hardcover toggle).

### 2.3 Review & Checkout (`/s/[slug]/checkout`)
- **Components:**
  - Itemized cost breakdown (Base print cost, Paper surcharge, Finishing fees).
  - Optional customer phone input (or required if shop settings enforce it).
  - Customer special instructions / notes box.
  - Payment method selector:
    - `Pay at Counter (Cash / UPI)`
    - `Pay via Shop UPI QR Code` (renders shop's dynamic UPI QR).
  - Sticky bottom action bar with Grand Total in INR and "Place Order" button.

### 2.4 Capability Tracking Page (`/track/[token]`)
- **Layout:** Real-time fulfillment status card.
- **Components:**
  - Status stepper: `SUBMITTED -> ACCEPTED -> PREPARING -> READY -> COMPLETED`.
  - Estimated pickup time banner.
  - **Pickup OTP Reveal Card:**
    - If status `< READY`: Displays locked badge with "OTP will unlock when your print is ready."
    - If status `== READY`: Displays high-contrast, large-font 6-digit OTP code (`482 910`) and instruction to present at counter.
  - Itemized order summary with shop address and Google Maps directions button.

---

## 3. Staff Console Screens & Wireframes

### 3.1 Live Order Queue (`/admin/orders`)
- **Layout:** Responsive multi-column Kanban or tabbed table (`Active Queue`, `Ready for Pickup`, `Completed`, `Cancelled`).
- **Row Elements:** Order number, time elapsed badge, customer phone, page count, total amount, payment status pill (`Unpaid`, `Verification Pending`, `Paid`), quick-action buttons.
- **Realtime Integration:** Subscribes to Supabase postgres_changes for instant updates without page refresh.

### 3.2 Order Detail & Handover Drawer
- Triggered by clicking any order in the queue.
- **Sections:**
  1. **Customer & Payment Panel:** Displays payment method, collected amount, and "Verify Payment" button for manual UPI.
  2. **Work Items & File Access:** Direct button to download the preflighted ready PDF via short-lived signed URL.
  3. **Workflow Controls:** One-click transition buttons (`Accept Order`, `Start Printing`, `Mark Ready`).
  4. **Pickup Verification Dialog:** Appears when order is ready. Operator enters the customer's 6-digit OTP. On match, triggers order completion and prints receipt/receipt slip.

### 3.3 Pricing Matrix Editor (`/admin/pricing`)
- Accessible only to users holding the `owner` role.
- Intuitive grid allowing direct modification of per-printed-side rates for A4/A3/Letter, BW/Color, Simplex/Duplex.
- Addon management tab for Paper Types, GSM values, and Binding prices.
- All input fields enforce integer paise validation.
