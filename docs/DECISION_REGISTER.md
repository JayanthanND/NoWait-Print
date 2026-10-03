# NoWait-Print — Product Decision Register

**Document Status:** Baseline Approved / Decisions Locked  
**Version:** 1.0 (Phase 0)  
**Date:** October 2026  
**Authors:** Technical Lead, Product Architect  

---

## 1. Decision Log Overview

This register documents every significant product and engineering decision made during Phase 0. Decisions are categorized by status:
- ✅ **APPROVED** — Locked; implementation may proceed.
- ⚠️ **DEFAULT** — Approved recommended default; owner may override before Phase 1.
- 🔴 **OPEN** — Unresolved; implementation blocked until confirmed.

---

## 2. Customer Interaction Decisions

| # | Decision Topic | Approved Decision | Alternatives | Consequences | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **D-01** | Customer Contact Collection | Phone number is **optional by default**; shop settings can mark it **mandatory** per shop. | Always require phone; always anonymous. | Shops needing customer tracking for notifications can enable the mandatory flag. Anonymous customers may be harder to contact about reprints. | ✅ APPROVED |
| **D-02** | Customer Account Requirement | Customers use **shop-scoped anonymous sessions**; no full platform account required. | Full account registration with email/password. | Lower friction for first-time customers; no cross-shop identity graph. | ✅ APPROVED |
| **D-03** | Customer Session Expiration | Anonymous sessions expire after **24 hours** from creation. | 1 hour; 48 hours; indefinite until order. | Balances abandonment recovery against storage accumulation from stale sessions. | ✅ APPROVED |

---

## 3. File Format & Processing Decisions

| # | Decision Topic | Approved Decision | Alternatives | Consequences | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **D-04** | Supported File Types (V1 Pilot) | PDF, DOCX, XLSX, PPTX, JPG/JPEG, PNG, WebP. | PDF and images only (simplest); add Office formats in a later phase. | Office support requires a conversion worker but eliminates the most common customer friction point. | ✅ APPROVED |
| **D-05** | Office Conversion Engine | **LibreOffice Headless** in an isolated, resource-limited Docker container. | Google Drive API, Microsoft Graph API, Pandoc. | LibreOffice is open-source with no per-conversion API cost. Requires a containerized worker host (~$5–7/month on Fly.io). | ✅ APPROVED |
| **D-06** | Conversion Worker Hosting | **Dedicated always-on lightweight container** (Fly.io / Railway / Render). | Serverless function (Lambda, Vercel Function). | Serverless functions cannot reliably run LibreOffice due to 10–15 second execution limits and binary size constraints. An always-on container ensures no cold-start failures. | ✅ APPROVED |
| **D-07** | Maximum File Size | **25 MB** per file; configurable per shop between 5 MB and 50 MB via `shop_settings`. | 10 MB fixed; 100 MB. | 25 MB handles multi-page reports, academic theses, and project documents without placing excessive memory demands on the worker. | ✅ APPROVED |
| **D-08** | Maximum Page Count | **250 pages** per file (after conversion). | 100 pages; 500 pages. | Keeps worker execution below 45-second timeout for typical LibreOffice conversion. Shops with thesis-printing workloads should note this limit. | ✅ APPROVED |
| **D-09** | Encrypted / Password-Protected PDFs | **Immediately rejected** with error code `FILE_PASSWORD_PROTECTED`. | Prompt customer for password. | Prompting for passwords would require storing the customer's password in memory during processing — a significant security and architectural risk. Rejection with a clear error is the safe approach. | ✅ APPROVED |
| **D-10** | Excel Print Behavior | All sheets converted using LibreOffice `FitToPagesWide = 1`. Customers cannot select individual sheets in V1. | Per-sheet selection UI; print active sheet only. | Per-sheet selection requires significant additional UI complexity and LibreOffice API parameter management. Deferred to Phase E. | ✅ APPROVED |
| **D-11** | Image-to-Print Behavior | 1 image = 1 printed page. Image is **scaled to fit A4 with a 15mm printable margin**, centered, with aspect ratio preserved. | Fill entire page; crop to fit. | Centering with margins preserves the full image without unexpected cropping, matching typical customer expectations. | ✅ APPROVED |

---

## 4. Pricing Decisions

| # | Decision Topic | Approved Decision | Alternatives | Consequences | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **D-12** | Pricing Unit Model | **Per-printed-side rate**. Simplex and Duplex have independently configurable rates (e.g., ₹2.00/side Simplex vs ₹1.50/side Duplex). | Per-physical-sheet pricing; per-document pricing. | Per-side pricing is the most transparent model for customers and aligns with how most Indian print shops set rates on print-on-demand boards. | ✅ APPROVED |
| **D-13** | Currency Representation | All monetary values stored as **integer Indian Paise** (`BIGINT` or `INTEGER`). | Store as DECIMAL(10,2); store as float. | Floating-point arithmetic on money causes precision errors that compound across high-volume orders. Integer paise is the only safe approach. | ✅ APPROVED |
| **D-14** | Quote Expiration | Pricing quotes expire after **15 minutes**. If a quote expires, the server recalculates and requires customer reconfirmation only if the price changed. | 5 minutes; 30 minutes; no expiry. | 15 minutes gives customers time to review while preventing shops from being locked into rates from earlier in the day if they change prices frequently. | ✅ APPROVED |
| **D-15** | Minimum Order Amount | No platform-level minimum. Shops may configure a minimum order total in settings if needed (future enhancement). | ₹10 fixed minimum. | Flexibility is preferred for pilot shops with varying volume profiles. | ⚠️ DEFAULT |

---

## 5. Order Management & Lifecycle Decisions

| # | Decision Topic | Approved Decision | Alternatives | Consequences | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **D-16** | Order Idempotency Mechanism | **Client-generated UUIDv4 idempotency key** with a unique database constraint on `(shop_id, idempotency_key)`. Valid for 60 minutes after submission. | Server-generated idempotency nonce; rely solely on unique order ID generation. | A client-generated key prevents duplicate orders even if the network request is retried after a timeout. The server ignores duplicate keys within 60 minutes. | ✅ APPROVED |
| **D-17** | Customer Self-Cancellation Window | Customers may cancel their own order within **2 minutes** of submission, provided the operator has not yet accepted it. | No self-cancel; 5 minutes; any time until PREPARING. | A 2-minute window prevents impulsive last-second cancellations from disrupting active print shop workflow while still protecting customers from immediate checkout errors. | ✅ APPROVED |
| **D-18** | Pickup OTP Release Policy | OTP is revealed to the customer **only after the order status reaches `READY`**. | Release OTP at submission; release at `ACCEPTED`. | Releasing OTP only at `READY` prevents customers from arriving at the shop before their order is physically prepared, reducing counter congestion. | ✅ APPROVED |
| **D-19** | OTP Failed Attempt Lockout | After **5 consecutive failed OTP entries**, the credential is locked. Unlocking requires a Shop Manager or Owner override with an audited reason. | 3 attempts; 10 attempts; no lockout. | 5 attempts provides a reasonable user-error tolerance (e.g. misread handwriting) while preventing brute-force enumeration of the 6-digit space. | ✅ APPROVED |
| **D-20** | OTP Expiration | OTP expires **48 hours** after the order reaches `READY`. After expiration, the staff must regenerate a new OTP with an audited reason. | 24 hours; 7 days; no expiration. | 48 hours accommodates extended shop hours and overnight-ready orders without leaving credentials permanently valid. | ✅ APPROVED |

---

## 6. Payment Decisions

| # | Decision Topic | Approved Decision | Alternatives | Consequences | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **D-21** | V1 Payment Methods | **Pay-at-Counter (Cash)** and **Manual UPI QR Code** (payment verified by staff). | Integrated UPI gateway; online prepayment only. | Minimal technical overhead for pilot. Staff must be trained to verify actual bank credit before clicking "Confirm Payment". | ✅ APPROVED |
| **D-22** | Automated Payment Verification | **Not implemented in V1.** Displaying a UPI QR code or customer screenshot does not confirm payment. | Webhook-verified UPI gateway (Razorpay/Cashfree). | Gateway integration requires GSTIN, business account verification, and webhook security implementation. Deferred to Phase D. | ✅ APPROVED |
| **D-23** | Refund Process | **Manual counter cash refund** recorded by staff. No automated digital transfers in V1. | Automated bank reversal. | Refunds for a pilot shop volume are expected to be infrequent. Staff records the refund in the dashboard, which updates `payment_status = 'REFUNDED'` for audit purposes. | ✅ APPROVED |

---

## 7. Infrastructure & Deployment Decisions

| # | Decision Topic | Approved Decision | Alternatives | Consequences | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **D-24** | Web Application Host | **Vercel Hobby Tier** for development and initial pilot. | Netlify; Railway; self-hosted VPS. | Vercel provides zero-config Next.js deployments with automated preview branches. Note: 10-second serverless function timeout on Hobby requires client-side direct-to-storage uploads. | ✅ APPROVED |
| **D-25** | Database & Auth Host | **Supabase (Free Tier)** for development; upgrade to Supabase Pro ($25/month) at pilot scale. | AWS RDS; PlanetScale; Neon. | Supabase provides PostgreSQL with RLS, GoTrue Auth, Storage, and Realtime in one managed platform, significantly reducing operational surface area. | ✅ APPROVED |
| **D-26** | File Storage | **Supabase Storage (Private Bucket)** with programmatically issued signed URLs. | AWS S3 directly; Cloudflare R2. | Integrated within Supabase ecosystem; eliminates separate storage vendor credentials and simplifies RLS extension to storage objects. | ✅ APPROVED |
| **D-27** | Worker Deployment Host | **Fly.io or Railway** ($5–7/month) with an always-on micro-container running LibreOffice. | Serverless function; AWS Fargate; self-hosted. | Always-on prevents cold starts during busy shop hours. Container keeps costs predictable and low at pilot scale. | ✅ APPROVED |
| **D-28** | File Retention Policy | Raw uploaded files: deleted **24 hours after session expiry** (if no order submitted). Completed order files: deleted **48 hours after pickup verification**. Order metadata, pricing snapshots, and audit logs: **retained indefinitely**. | Delete immediately on completion; retain files indefinitely. | 48-hour post-pickup window allows staff to reprint on dispute. Indefinite metadata retention satisfies accounting/audit requirements without indefinitely storing customer documents. | ✅ APPROVED |
| **D-29** | Shop Onboarding Model | For the V1 pilot, **shops are created manually by the platform operator** (i.e., the developer inserts records). No self-service shop registration UI in V1. | Full self-service marketplace onboarding. | Self-service onboarding requires email verification, shop verification, payment credential validation, and terms-of-service acceptance flows. Out of scope for a controlled pilot. | ✅ APPROVED |
