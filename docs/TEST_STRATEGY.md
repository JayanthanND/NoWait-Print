# NoWait-Print — Comprehensive Test Strategy & Quality Assurance Plan

**Document Status:** Baseline Approved / Test Framework Frozen  
**Version:** 1.0 (Phase 0)  
**Date:** October 2026  
**Authors:** Senior QA Architect, Security Engineer  

---

## 1. Multi-Tier Testing Pyramid

NoWait-Print enforces quality and security across five distinct testing tiers:

```
        ▲
       / \         Tier 5: End-to-End User Journeys (Playwright)
      /   \        ---------------------------------------------
     /     \       Tier 4: Document Worker & Conversion Integration
    /       \      --------------------------------------------------
   /         \     Tier 3: Database & Row-Level Security (RLS) Isolation
  /           \    -------------------------------------------------------
 /             \   Tier 2: Application Service Integration & State Machines
/               \  ---------------------------------------------------------
─────────────────  Tier 1: Unit Tests (Pricing, Math, Crypto, Schemas)
```

---

## 2. Test Specifications by Tier

### 2.1 Tier 1: Unit Tests (Vitest)
- **Authoritative Pricing Engine:**
  - Standard A4 BW Simplex vs Duplex calculations across 1 to 100 pages.
  - Surcharge calculations for GSM (75, 80, 100) and paper finishes.
  - Multi-copy multiplication and odd-page duplex ceiling calculations.
  - Minor currency unit conversion, preventing any floating-point truncation.
- **State Machine Transitions:**
  - Valid transitions succeed and update state history.
  - Illegal transitions (e.g. `SUBMITTED -> COMPLETED` without OTP) throw `ILLEGAL_STATE_TRANSITION`.
- **Cryptographic & Token Routines:**
  - OTP generation entropy and range checks ($100000 - 999999$).
  - HMAC-SHA256 verification and `timingSafeEqual` resistance to timing attacks.
  - Tracking token generation and hash verification.
- **Schema Validation (Zod):**
  - Validation of phone numbers, shop slugs, file sizes, and work configurations.

### 2.2 Tier 2: Database & RLS Multi-Tenant Isolation Tests
- **Cross-Tenant Breach Simulation:**
  - Create two independent test shops: `Shop Alpha` and `Shop Beta`.
  - Authenticate as an operator of `Shop Alpha`.
  - Attempt to `SELECT * FROM orders WHERE shop_id = 'beta_id'`; assert zero rows returned.
  - Attempt to `UPDATE files SET shop_id = 'alpha_id' WHERE shop_id = 'beta_id'`; assert failure.
  - Attempt to download a signed file URL belonging to `Shop Beta`; assert HTTP 403 Forbidden.
- **Atomic Transactions & Idempotency:**
  - Trigger simultaneous concurrent order submission requests with the same idempotency key; assert exactly one order row created.

### 2.3 Tier 3: Document Processing & Worker Tests
- **Valid Conversion Fixtures:**
  - Ingest sample `.pdf`, `.docx`, `.xlsx`, `.pptx`, `.png` files; verify generated PDF layout and accurate page count.
- **Adversarial & Corrupt Inputs:**
  - Ingest 0-byte file; assert immediate `REJECTED` state.
  - Ingest password-protected PDF; assert `FILE_PASSWORD_PROTECTED` rejection.
  - Ingest DOCX containing macro (`vbaProject.bin`); assert macro stripped and conversion safely completed.
  - Ingest oversized 50MB file; assert upload blocked at edge.
  - Ingest infinite-loop spreadsheet; assert worker process killed at 45 seconds with `TIMED_OUT`.

### 2.4 Tier 4: End-to-End User Journeys (Playwright)
- **Journey 1: Happy Path Customer Ordering & Counter Pickup:**
  1. Customer visits `/s/alpha-prints`.
  2. Uploads 5-page PDF document.
  3. Configures 2 copies, Color, Duplex, Staple.
  4. Reviews quote and submits order with Pay at Counter.
  5. Tracking page shows `SUBMITTED`.
  6. Operator logs into `/admin/orders` and accepts order -> Customer view updates to `ACCEPTED`.
  7. Operator marks ready -> Customer view updates to `READY` and displays OTP.
  8. Operator enters OTP in dashboard drawer -> Order transitions to `COMPLETED`.
- **Journey 2: Price Change Reconfirmation:**
  1. Customer generates quote.
  2. Shop owner alters pricing matrix.
  3. Customer submits order.
  4. System prompts customer with updated price; order completes upon customer approval.

---

## 3. Release Quality Gates & CI Pipeline

No pull request may be merged to `main` unless:
1. `npm run lint` passes with zero ESLint warnings or errors.
2. `npm run typecheck` passes with zero TypeScript diagnostic errors.
3. Vitest unit and integration test suites pass with 100% success.
4. Database RLS test suite verifies tenant isolation across all operational tables.
5. Zero high/critical vulnerabilities reported by `npm audit`.
