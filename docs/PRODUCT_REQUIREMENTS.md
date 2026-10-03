# NoWait-Print — Product Requirements Document (PRD)

**Document Status:** Baseline Approved / Scope Frozen  
**Version:** 1.0 (Phase 0)  
**Date:** October 2026  
**Authors:** Senior Software Architect, Security Engineer, Product Lead  

---

## 1. Executive Summary & Vision

**NoWait-Print** is a cloud-based, multi-tenant print-ordering and shop-queue management platform. It addresses the operational bottlenecks of traditional print and xerox shops (university campuses, legal centers, commercial print hubs) by providing a contactless, pre-arrival ordering experience.

Customers scan a physical QR code or open a shop-specific public URL (`/s/{shop-slug}`), upload supported documents, configure exact print specifications (copies, color mode, duplex, paper size, finishing), receive an immediate server-calculated price, submit their order, and track fulfillment in real-time. Document handover is protected by a cryptographically hashed pickup One-Time Password (OTP).

Shop operators manage incoming orders through a real-time digital queue, review job parameters, download preflighted print-ready documents, record payments, and verify OTPs at the counter.

---

## 2. Problem Statement & Market Context

In conventional print shop environments:
1. **Waiting Lines & Congestion:** Customers wait in physical lines while shop staff manually inspect files, discuss configurations, calculate prices, and transfer files via insecure USB drives or unstructured WhatsApp chats.
2. **Security & Malware Risks:** Plugging untrusted customer USB drives into counter PCs exposes print shop systems to malware, ransomware, and file corruption.
3. **Queue & Payment Confusion:** Verbal orders, scribbled paper slips, and informal manual UPI screenshots lead to print job mix-ups, unpaid jobs, and abandoned prints.
4. **Time Inefficiency:** Shop staff spend significant time on configuration and pricing rather than operating machines.

NoWait-Print eliminates these frictions by establishing a structured, automated, and secure digital bridge between customers and print shop counters.

---

## 3. Product Goals & Non-Goals for V1

### 3.1 Primary Goals (In Scope for V1)
- **Frictionless Customer Access:** Instant access via QR code without mandatory customer account creation.
- **Multi-Tenant Shop Isolation:** Complete data, pricing, and file separation across independent print shops.
- **Safe Document Preflight & Conversion:** Strict validation of PDFs, Office documents, and images; server-side inspection and conversion before page-based pricing.
- **Server-Authoritative Pricing:** Exact, non-manipulable calculations in integer currency units (paise).
- **Atomic & Idempotent Order Creation:** Prevention of duplicate submissions and accidental double-charges.
- **Capability-Based Order Tracking:** Unguessable, cryptographically random tracking tokens.
- **Protected Handover via OTP:** Salted, hashed pickup OTPs revealed only upon order readiness.
- **Real-Time Shop Queue:** Digital queue with authorized state transitions and payment verification.
- **Low-Cost / Free-Tier Friendly Deployment:** Architecture structured as a modular monolith leveraging serverless/managed infrastructure.

### 3.2 Explicit Non-Goals (Out of Scope for V1)
- **Direct Physical Printer Control:** No direct CUPS/IPP spooling, automated hardware dispatch, or printer hardware health telemetry. Printing is performed manually by shop operators using existing printer drivers.
- **Automated UPI Payment Verification:** No automated payment gateway or automated bank statement scraping. Manual UPI is verified manually by staff before release.
- **Native Mobile Apps:** No iOS or Android native packages; the platform is built as a responsive Progressive Web Application (PWA).
- **Marketplace & Cross-Shop Discovery:** Customers cannot search or compare prices across different shops; each storefront is shop-isolated.
- **SMS/WhatsApp Automation:** No automated messaging gateway integrations in V1 (scheduled for Phase C). Notifications rely on the active web tracking interface.
- **Automated Refunds:** No automated digital money returns; manual reconciliation is required for rejected/cancelled paid orders.

---

## 4. User Personas & Permissions

| Persona | Primary Goal | Key Privileges | Restrictions |
| :--- | :--- | :--- | :--- |
| **Customer** | Submit print jobs remotely and collect them without waiting. | Open shop page, upload files, configure works, view quotes, submit orders, view tracking page, view pickup OTP when ready. | Cannot view other orders, access shop dashboards, manipulate prices, or access raw storage objects. |
| **Shop Operator** | Process queue, print files, verify payments, and hand over completed jobs. | View active shop queue, inspect file details, download print-ready files, transition states (Accept, Prepare, Ready, Complete, Reject), verify OTP. | Cannot change shop pricing rules, alter shop slug, delete the shop, or invite other staff. |
| **Shop Manager** | Oversee daily shop operations and staff workflows. | All Operator privileges plus: configure shop hours, adjust upload limits, modify print options, view operational metrics. | Cannot delete the shop or reassign primary ownership. |
| **Shop Owner** | Full administrative and business control of the shop tenant. | All Manager privileges plus: manage shop profile & public slug, invite/remove staff, publish pricing rules, configure payment credentials. | Scoped strictly to their own shop tenant. Cannot access other shops. |
| **Platform Admin** | Platform maintenance, support, and tenant lifecycle (Future Phase). | Manage tenant provisioning, system health, and compliance. | Governed by strict audit logging; cannot silently bypass tenant privacy boundaries. |

---

## 5. Functional Requirements Specification

### 5.1 Customer Ordering Experience (REQ-CUST)
- **REQ-CUST-01 (Storefront Access):** Accessing `/s/{shop-slug}` resolves the active shop, loads shop branding, accepted formats, and available print options. Inactive shops display a clear, non-submittable status.
- **REQ-CUST-02 (Anonymous Session):** A cryptographically secure, random session token (`session_token`) is generated in the customer's browser cookie/storage, scoped to the current shop with a 24-hour expiration.
- **REQ-CUST-03 (Contact Collection):** Customer phone number is optional by default, but shop settings can designate phone number collection as mandatory prior to submission.
- **REQ-CUST-04 (File Intake & Preflight):** Customers upload one or more files. Each file is validated for format, magic bytes, and size, then dispatched to preflight inspection.
- **REQ-CUST-05 (Work Builder):** For each uploaded document, customers configure:
  - Copy count (minimum 1, maximum configurable per shop, default 100).
  - Color mode: Black & White or Color.
  - Sides: Simplex (single-sided) or Duplex (double-sided).
  - Paper Size: A4, A3, Letter (as enabled by shop).
  - Page range: All pages or validated custom range (e.g., `1-10, 15`).
  - Addon finishing: Paper type (Regular, Glossy), GSM weight (75, 80, 100), Binding (None, Spiral, Hardcover, Staple).
- **REQ-CUST-06 (Price Calculation):** The client requests a server-validated estimate. The server recalculates pricing using active shop rules and returns an itemized breakdown.
- **REQ-CUST-07 (Atomic Submission):** Order submission requires an idempotency key. The order, work item snapshots, initial status history, and payment record are created atomically.
- **REQ-CUST-08 (Order Tracking):** Customers receive a permanent tracking URL containing a 32-byte cryptographic capability token (`/track/{tracking_token}`). No sequential order IDs grant access.
- **REQ-CUST-09 (Pickup OTP):** A 6-digit numeric OTP is generated, hashed, and stored. The plaintext OTP is released on the tracking page **only when the order status reaches `READY`**.

### 5.2 Document Ingestion & Conversion Pipeline (REQ-DOC)
- **REQ-DOC-01 (Supported Formats):** V1 supports PDF (`.pdf`), Microsoft Word (`.doc`, `.docx`), Microsoft Excel (`.xls`, `.xlsx`), Microsoft PowerPoint (`.ppt`, `.pptx`), and Images (`.jpg`, `.jpeg`, `.png`, `.webp`).
- **REQ-DOC-02 (Preflight Pipeline):** Office documents cannot be priced based on client claims. They must pass through a dedicated conversion worker that generates a normalized PDF representation and verified page count.
- **REQ-DOC-03 (Preflight State Machine):** Each uploaded file progresses through `UPLOADED -> VALIDATING -> PROCESSING -> READY`. Failure states are `REJECTED`, `PROCESSING_FAILED`, and `EXPIRED`.
- **REQ-DOC-04 (Storage Privacy):** Files are stored in private object storage using random UUID keys (`tenants/{shop_id}/files/{file_id}`). No public read access is permitted.
- **REQ-DOC-05 (Download Security):** Staff and conversion workers access files via short-lived signed URLs (maximum 5 minutes validity).
- **REQ-DOC-06 (Resource Limits):** Maximum file size: 25MB. Maximum page count: 250 pages. Maximum worker conversion timeout: 45 seconds. Memory limit: 512MB per job.

### 5.3 Shop Administration & Queue Management (REQ-SHOP)
- **REQ-SHOP-01 (Shop Configuration):** Manage public name, unique slug, address, contact details, operating status (active/paused), and operating hours.
- **REQ-SHOP-02 (QR Generation):** Generate high-resolution SVG and PNG QR codes encoding the public canonical storefront URL.
- **REQ-SHOP-03 (Pricing Management):** Configure per-printed-side base rates for BW/Color and Simplex/Duplex across paper sizes, plus addon fees for GSM, paper types, and binding. All values stored in integer paise.
- **REQ-SHOP-04 (Order Queue):** Real-time queue view categorized by status (`SUBMITTED`, `ACCEPTED`, `PREPARING`, `READY`, `COMPLETED`, `CANCELLED/REJECTED`).
- **REQ-SHOP-05 (Order Detail Drawer):** Inspect customer work parameters, download preflighted print-ready PDFs, review payment status, and trigger state transitions.
- **REQ-SHOP-06 (Pickup Verification):** Operators enter customer-presented OTP. The server hashes the input and compares it against the stored hash. Upon verification, the order transitions to `COMPLETED`.

### 5.4 Payment & Reconciliation (REQ-PAY)
- **REQ-PAY-01 (V1 Payment Methods):** Pay-at-counter and Manual UPI QR.
- **REQ-PAY-02 (Manual UPI Safeguard):** Displaying a UPI QR code or receiving a customer screenshot does not mark an order as paid. The payment remains in `PENDING_MANUAL_VERIFICATION` until verified by staff.
- **REQ-PAY-03 (Payment State Machine):** `UNPAID -> PENDING_MANUAL_VERIFICATION -> PAID`. Exception states: `PAYMENT_FAILED`, `REFUND_PENDING`, `REFUNDED`.

---

## 6. Acceptance Criteria for V1 Release

A build is certified for V1 pilot deployment when:
1. **Multi-Tenant Integrity:** An authenticated operator of Shop A attempting to read, update, or download files from Shop B receives a 404 or 403 response; database RLS verifies isolation across all tables.
2. **File Processing Accuracy:** Uploaded PDFs, DOCX, XLSX, and images are accurately converted or parsed; page counts match the generated printable representation.
3. **Price Invariance:** Changing shop pricing rules does not alter totals of previously submitted orders; quotes validate server-side and reject stale prices.
4. **Idempotent Order Creation:** Rapid double-clicks or duplicate API calls produce exactly one order.
5. **Secure Pickup:** OTP verification succeeds only with the correct code, locks after 5 failed attempts, and records operator ID and timestamp.
6. **No Leaked Secrets:** Zero service-role keys, private storage URLs, or database passwords present in client-side bundles.

---

## 7. Requirements Traceability Matrix

| Requirement ID | Description | Implementation Phase | Verification & Test Plan |
| :--- | :--- | :--- | :--- |
| **REQ-CUST-01** | Shop storefront resolution & inactive handling | Phase 3 (Auth/Shops) | E2E test verifying valid and invalid slugs |
| **REQ-CUST-02** | Scoped anonymous customer sessions | Phase 3 (Auth/Shops) | Unit test on cookie generation & shop scoping |
| **REQ-CUST-03** | Configurable contact requirement | Phase 7 (Work Builder) | Form validation test under shop settings |
| **REQ-CUST-04** | File validation & preflight dispatch | Phase 4 (Storage/Intake) | Integration test with valid and malicious files |
| **REQ-CUST-05** | Work configuration builder | Phase 7 (Work Builder) | Component and integration unit tests |
| **REQ-CUST-06** | Authoritative server price engine | Phase 8 (Pricing) | Unit tests with 50+ pricing matrix permutations |
| **REQ-CUST-07** | Atomic & idempotent order submission | Phase 9 (Orders) | Concurrency & duplicate submission tests |
| **REQ-CUST-08** | Unguessable token tracking | Phase 10 (Tracking) | Penetration test & token entropy validation |
| **REQ-CUST-09** | Salted/hashed pickup OTP lifecycle | Phase 13 (OTP) | Crypto unit tests & brute-force rate-limit tests |
| **REQ-DOC-01** | Multi-format upload support | Phase 4 & Phase 6 | Upload tests for PDF, DOCX, XLSX, PPTX, Images |
| **REQ-DOC-02** | Isolated document conversion pipeline | Phase 5 & Phase 6 | Conversion worker integration test suite |
| **REQ-DOC-04** | Private bucket & signed URLs | Phase 4 (Storage) | Storage security and signed URL expiry tests |
| **REQ-SHOP-01** | Shop settings & slug management | Phase 3 (Shops) | Shop profile update & slug uniqueness tests |
| **REQ-SHOP-03** | Integer paise pricing configuration | Phase 8 (Pricing) | Schema constraint and currency math tests |
| **REQ-SHOP-04** | Real-time queue view | Phase 11 (Queue) | Real-time subscription & queue sorting tests |
| **REQ-SHOP-06** | Counter OTP verification | Phase 13 (OTP) | Handover flow test with operator audit logging |
| **REQ-PAY-01** | Pay-at-counter & Manual UPI | Phase 12 (Payments) | Payment transition & state machine tests |
