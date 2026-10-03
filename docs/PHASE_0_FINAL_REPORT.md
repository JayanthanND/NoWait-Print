# NoWait-Print — Phase 0 Final Report

**Status:** ✅ Phase 0 COMPLETE — V1 Scope Frozen  
**Date:** October 2026  
**Report Type:** Architecture Review & Scope Freeze Declaration  

---

## 1. Repository Findings

The repository at `/Users/jayanthannd/Projects/NoWait-Print` was newly created and contained no prior source code. A companion repository (`NoWait-Print-Project`) exists at the sibling path and is the **active prior implementation** connected to `github.com/JayanthanND/NoWait-Print`. It contains:

| Finding | Details |
| :--- | :--- |
| **Framework** | Next.js 16.2.1 with React 19, TypeScript 5 |
| **UI Layer** | Tailwind CSS v4, shadcn/ui (full Radix UI set), Lucide Icons, Motion |
| **Backend** | Supabase JS client v2.100, `@supabase/ssr` v0.9, `pdf-lib` v1.17 |
| **State** | Single modified file (`orders-table.tsx`) — whitespace-only diff |
| **Existing Schema** | A partial schema exists at `supabase/schema.sql` covering shops, orders, works, files, pricing, printers, notifications. **Critical Security Finding: RLS policies are overly permissive (e.g., `USING (true)` on all orders; public bucket `print-files = true`)** — these must be replaced before any production data is handled. |
| **Missing** | No document conversion worker; no anonymous customer session system; no cryptographic tracking tokens; no OTP hashing; no audit logs; no idempotency enforcement. |

**The prior implementation is a working prototype with real security gaps.** Phase 1 will use the existing Next.js/Supabase foundation but will remediate the schema and RLS before adding new features.

---

## 2. Agreed V1 Product Scope

NoWait-Print V1 is a **digital print order management system**. Customers pre-submit orders online; shop staff fulfill them manually and verify pickup with OTP.

**What V1 is:** Multi-tenant shop storefronts, file intake with LibreOffice conversion, server-authoritative pricing, atomic order creation, real-time queue, and secured handover.

**What V1 is not:** Automated printer control, payment gateway integration, SMS/WhatsApp automation, or marketplace discovery.

---

## 3. Recommended Architecture & Reasoning

| Component | Decision | Key Reason |
| :--- | :--- | :--- |
| **Web App** | Next.js 16 App Router (existing) | Already deployed; no migration needed |
| **Database** | Supabase PostgreSQL with RLS | Multi-tenancy isolation without separate databases |
| **Auth** | Supabase GoTrue for staff | Integrated with existing Supabase project |
| **Customer Sessions** | Anonymous, shop-scoped, HMAC-signed cookies | Zero friction; no account required |
| **Storage** | Private Supabase bucket + signed URLs | Prevents all direct public file access |
| **Worker** | LibreOffice on Fly.io/Railway container | Only engine that handles DOCX/XLSX/PPTX at low cost |
| **Pricing** | Integer paise, per-printed-side | No floating-point errors; transparent to customers |

---

## 4. Critical Security Fixes Required in Phase 2

> [!CAUTION]
> The existing `supabase/schema.sql` contains the following **production-dangerous** patterns that must be fully replaced:
> 1. `USING (true)` on `orders`, `files`, `works` — allows any anonymous user to read all orders and download all files for all shops.
> 2. `print-files` bucket set to `public = true` — all uploaded customer documents are publicly accessible via predictable URLs.
> 3. No tracking token system — orders are directly addressed by UUID.
> 4. Plaintext storage assumed for file paths — no signed URL requirement enforced.

---

## 5. All Decisions Locked (29 Total)

All critical product decisions have been confirmed and recorded in [`docs/DECISION_REGISTER.md`](./docs/DECISION_REGISTER.md). Key decisions:

| Topic | Decision |
| :--- | :--- |
| Customer contact | Optional phone; shop-configurable |
| Formats | PDF, DOCX, XLSX, PPTX, Images |
| Pricing model | Per-printed-side, integer paise |
| Quote expiry | 15 minutes with reconfirmation |
| OTP release | Only when status = `READY` |
| OTP lockout | 5 attempts |
| Payment V1 | Counter cash + manual UPI |
| Worker | LibreOffice container (Fly.io) |
| File retention | 48h post-pickup, 24h abandoned |
| Onboarding | Manual by platform operator (pilot) |

---

## 6. Documents Created

| Document | Path | Purpose |
| :--- | :--- | :--- |
| Product Specification V1 | `Documentation/product-and-solution-specification-v1.md` | Source specification |
| Product Requirements (PRD) | `docs/PRODUCT_REQUIREMENTS.md` | Goals, users, requirements, traceability |
| System Architecture | `docs/ARCHITECTURE.md` | Components, stack decisions, diagrams |
| Database Design | `docs/DATABASE_DESIGN.md` | Full schema with SQL, ERD, RLS |
| Security Model | `docs/SECURITY_MODEL.md` | Threat model, RBAC matrix, RLS policies |
| Order & Payment Flows | `docs/ORDER_AND_PAYMENT_FLOWS.md` | State machines, atomic creation, OTP lifecycle |
| Document Processing | `docs/DOCUMENT_PROCESSING.md` | Conversion pipeline, worker, retention |
| Pricing Specification | `docs/PRICING_SPECIFICATION.md` | Paise math, formulas, worked example |
| Screen & Route Map | `docs/SCREEN_AND_ROUTE_MAP.md` | All customer and staff screens |
| Test Strategy | `docs/TEST_STRATEGY.md` | 5-tier test plan with CI gates |
| Implementation Roadmap | `docs/IMPLEMENTATION_ROADMAP.md` | 16-phase plan with exit criteria |
| Decision Register | `docs/DECISION_REGISTER.md` | 29 locked decisions |
| Environment & Deployment | `docs/ENVIRONMENT_AND_DEPLOYMENT.md` | Env var catalog, service map |

---

## 7. Phase 0 Exit Criteria Checklist

| Criteria | Status |
| :--- | :--- |
| Repository inspected and existing code catalogued | ✅ |
| Critical security gaps in existing schema identified | ✅ |
| V1 product scope explicitly frozen | ✅ |
| All 12 architecture documents drafted | ✅ |
| Multi-tenant isolation strategy documented | ✅ |
| Database schema with full RLS designed | ✅ |
| Order state machine with guard policies defined | ✅ |
| Pricing engine with integer paise math specified | ✅ |
| Document conversion pipeline and worker design complete | ✅ |
| Cryptographic security model specified | ✅ |
| 29 product decisions confirmed and locked | ✅ |
| Threat model with STRIDE analysis complete | ✅ |
| 16-phase implementation roadmap defined | ✅ |
| Phase 1 prerequisites clear | ✅ |

**Phase 0 is complete. The scope is frozen. V1 implementation is authorized to proceed.**

---

## 8. Phase 1 Prerequisites & Entry Conditions

Phase 1 (**Workspace, Monorepo Baseline & Tooling Setup**) may begin immediately. Before writing any feature code:

1. Confirm which repository will be used for implementation — the existing `NoWait-Print-Project` directory or a fresh workspace.
2. Run `npm install` and verify Next.js 16 dev server starts cleanly.
3. Confirm Supabase project credentials are available for local development.
4. Review `supabase/schema.sql` — **do not run the existing schema on any production or shared database** until Phase 2 replaces it with the secure version.
5. Set up local Supabase CLI with `npx supabase start`.

---

*Phase 0 completed by Antigravity Technical Architecture Team · October 2026*
