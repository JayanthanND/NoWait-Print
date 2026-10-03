# NoWait-Print — 16-Phase Implementation Roadmap & Engineering Plan

**Document Status:** Baseline Approved / Roadmap Frozen  
**Version:** 1.0 (Phase 0)  
**Date:** October 2026  
**Authors:** Technical Lead, Software Architect  

---

## 1. Development Principles for Every Phase (Phases 1–15)

Every subsequent phase must strictly adhere to the following 10-step protocol:
1. **Scope Inspection:** Read the approved Phase 0 specifications and prior phase notes before modifying code.
2. **Repository Baseline:** Verify Git status and ensure working tree clean.
3. **Strict Scope Confinement:** Implement only the specific deliverables assigned to the active phase. Do not jump ahead.
4. **Preserve Established Architecture:** Follow the Modular Monolith structure and conventions laid out in Phase 0.
5. **Add Automated Tests:** Write unit and integration tests alongside implementation.
6. **Execute Verification Commands:** Run linting, formatting, type checking, and test suites.
7. **Zero Fabricated Tests:** Never claim a test passed unless verified with genuine shell output.
8. **Documentation Updates:** Update environment variables catalog, API schemas, and architecture docs as code evolves.
9. **Phase Report:** Report changed files, exact test execution results, design decisions, and known limitations.
10. **Hard Blocker Stop:** If a security or infrastructure blocker emerges, stop and report rather than bypassing controls.

---

## 2. 16-Phase Breakdown & Milestones

```
Phase 0 ──► Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 4 ──► Phase 5 ──► Phase 6
Analysis    Tooling     Database    Auth/Shops  Storage     PDF Engine  Office Conv
                                                                         │
Phase 13 ◄── Phase 12 ◄── Phase 11 ◄── Phase 10 ◄── Phase 9 ◄── Phase 8 ◄── Phase 7
OTP Handover Payments    Queue/Dash   Tracking    Orders      Pricing     Work Builder
    │
    ▼
Phase 14 ──► Phase 15
Resilience   Hardening / V1 Release
```

---

### Phase 0: Requirements Analysis, Architecture & Scope Freeze (Current)
- **Objective:** Establish the complete architectural and security baseline; resolve open product decisions; lock V1 scope.
- **Deliverables:** Complete `docs/` architecture artifacts suite; Product Specification; confirmed Decision Register.
- **Exit Criteria:** All 12 architectural documents reviewed and reconciled; key product choices signed off; Phase 1 ready.

### Phase 1: Workspace, Monorepo Baseline & Tooling Setup
- **Objective:** Initialize monorepo directory layout, TypeScript configs, Tailwind CSS v4, shadcn/ui components, and CI quality gates.
- **Dependencies:** Phase 0.
- **Deliverables:** Next.js App Router workspace, root configuration, Vitest setup, ESLint/Prettier configs.
- **Exit Criteria:** `npm run lint` and `npm run typecheck` execute cleanly with zero errors.

### Phase 2: Database Schema & Row-Level Security (RLS)
- **Objective:** Provision Supabase PostgreSQL schema with primary tables, constraints, indexes, and RLS policies.
- **Dependencies:** Phase 1.
- **Deliverables:** Migration scripts in `supabase/migrations/`; RLS policy tests for cross-tenant isolation.
- **Exit Criteria:** Schema applies cleanly; automated RLS tests prove Shop A cannot read Shop B records.

### Phase 3: Authentication & Shop Multi-Tenant Memberships
- **Objective:** Implement Supabase GoTrue authentication for staff; shop registration and public slug resolution.
- **Dependencies:** Phase 2.
- **Deliverables:** Login screen, staff session validation, `/s/[slug]` storefront resolution, anonymous customer session cookies.
- **Exit Criteria:** Staff can authenticate; non-staff redirected; anonymous customer sessions scoped to target shop.

### Phase 4: Storage Infrastructure & Document Upload Intake
- **Objective:** Configure private S3 storage bucket; build client upload dropzone and secure server pre-signed upload URLs.
- **Dependencies:** Phase 3.
- **Deliverables:** Private bucket setup, upload API route, magic-byte validator, client drag-and-drop UI.
- **Exit Criteria:** Ingests files up to 25MB; stores with random UUID keys; blocks unlisted MIME types and corrupt headers.

### Phase 5: PDF Inspection & Document Processing Worker Baseline
- **Objective:** Implement native PDF preflight parsing and establish the asynchronous `document_jobs` queue.
- **Dependencies:** Phase 4.
- **Deliverables:** `pdf-lib` inspection routine; worker polling daemon; job locking (`SKIP LOCKED`).
- **Exit Criteria:** Accurately extracts page counts from valid PDFs; rejects password-protected PDFs immediately.

### Phase 6: Office & Image Conversion Pipeline
- **Objective:** Deploy sandboxed LibreOffice container for converting DOCX, XLSX, PPTX, and normalizing images into printable PDFs.
- **Dependencies:** Phase 5.
- **Deliverables:** Dockerized LibreOffice worker, conversion script, memory/timeout limits, image centering routine.
- **Exit Criteria:** Converts Word and PowerPoint to PDF; fits Excel sheets to single-page width; centers images on A4.

### Phase 7: Work Builder & Print Configuration Engine
- **Objective:** Build the customer-facing Work Builder UI for configuring copies, color, duplex, paper size, and finishing.
- **Dependencies:** Phase 6.
- **Deliverables:** Work builder UI components, copy steppers, duplex toggles, page range parsers, Zod validation schema.
- **Exit Criteria:** Customers can bundle multiple files with distinct configurations into an order payload.

### Phase 8: Authoritative Pricing Engine & Quote Management
- **Objective:** Implement backend pricing calculations in integer paise; enforce quote generation and expiration.
- **Dependencies:** Phase 7.
- **Deliverables:** `pricing-service.ts`, pricing matrix administration UI, quote calculation API with 15-minute expiry.
- **Exit Criteria:** Unit tests verify 100% pricing accuracy across simplex/duplex/GSM permutations without floating-point errors.

### Phase 9: Order Submission, Atomic Transactions & Idempotency
- **Objective:** Wire order submission through atomic PostgreSQL transactions; capture immutable pricing and file snapshots.
- **Dependencies:** Phase 8.
- **Deliverables:** `order-service.ts`, order creation route handler, idempotency key validation.
- **Exit Criteria:** Concurrency tests prove duplicate submissions create exactly one order; snapshot retains frozen totals.

### Phase 10: Customer Secure Order Tracking & Capability Tokens
- **Objective:** Implement unguessable tracking URLs (`/track/[token]`) with live fulfillment status updates.
- **Dependencies:** Phase 9.
- **Deliverables:** Tracking page UI, 256-bit token generator, HMAC-SHA256 token verification, Supabase Realtime subscription.
- **Exit Criteria:** Tracking URL displays real-time status transitions; sequential order IDs reject direct access.

### Phase 11: Shop Operator Queue & Order Management Dashboard
- **Objective:** Build the real-time shop queue dashboard, status transition controls, and print-ready PDF downloader.
- **Dependencies:** Phase 10.
- **Deliverables:** `/admin/orders` queue table, order drawer, signed download URL generator, status transition buttons.
- **Exit Criteria:** Operators can accept, print, and mark orders ready; signed download URLs expire after 300 seconds.

### Phase 12: Manual Payment Workflows & Audit Logs
- **Objective:** Implement Counter Cash recording and manual UPI verification flows with immutable audit logging.
- **Dependencies:** Phase 11.
- **Deliverables:** Dynamic shop UPI QR renderer, payment verification action, `order_status_history` and `audit_events` logger.
- **Exit Criteria:** Manual UPI orders remain pending until staff verification; audit records log all financial actions.

### Phase 13: Pickup OTP Security & Handover Verification
- **Objective:** Implement secure OTP generation, salted HMAC storage, counter verification dialog, and attempt rate-limiting.
- **Dependencies:** Phase 12.
- **Deliverables:** 6-digit OTP crypto module, conditional release logic on tracking screen, operator verification drawer.
- **Exit Criteria:** OTP unlocks on customer screen only when status reaches `READY`; locks after 5 invalid attempts.

### Phase 14: Error Handling, Resilience & Monitoring
- **Objective:** Add structured application logging, heartbeat fallback polling, graceful error boundaries, and health checks.
- **Dependencies:** Phase 13.
- **Deliverables:** Global error handlers, recovery fallback for dropped WebSockets, worker health check route.
- **Exit Criteria:** System handles worker crashes and network interruptions gracefully without data loss.

### Phase 15: Comprehensive Test Suite, Security Hardening & V1 Release
- **Objective:** Execute full Playwright E2E suite, perform penetration testing on multi-tenancy, and finalize deployment documentation.
- **Dependencies:** Phase 14.
- **Deliverables:** End-to-end smoke test suite, production environment configuration guide, pilot rollout runbook.
- **Exit Criteria:** All CI tests pass; zero high-severity audit issues; system verified ready for pilot deployment.
