# NoWait-Print --- Product & Solution Specification (V1)

**Document status:** Baseline for architecture review and phased implementation  
**Version:** 1.0  
**Date:** 3 October 2026  
**Product:** NoWait-Print  
**Primary objective:** Let customers submit print jobs to a participating print shop before arriving, while giving shop staff a reliable digital order queue.

---

## 1. Executive Summary

NoWait-Print is a multi-tenant, mobile-friendly print-ordering and shop-queue management platform. Each participating shop receives a public shop page and QR code. A customer scans the code, selects one or more supported documents, configures print options, reviews a server-calculated price, submits the order, chooses an available payment method, and receives a secure order-tracking link and pickup OTP. Shop staff manage incoming orders, confirm payment where necessary, prepare the print job, update its status, and verify the OTP at pickup.

**V1 is a digital print-ordering and shop-operations system. It does not directly control a physical printer.** Printing is performed by shop staff using their existing workflow. Printer discovery, automated dispatch, print-status feedback, and CUPS/IPP integration belong to a later local print-agent phase.

### 1.1 Supported file types

V1 must support customer uploads of:

- PDF (`.pdf`)
- Word documents (`.doc`, `.docx`)
- Excel spreadsheets (`.xls`, `.xlsx`, with other spreadsheet formats added only if the chosen conversion pipeline supports them)
- PowerPoint presentations (`.ppt`, `.pptx`)
- Images (`.jpg`, `.jpeg`, `.png`, `.webp`, and other explicitly enabled image formats)

The system must **not assume every uploaded format can be priced by counting pages immediately**. Office documents may paginate differently depending on fonts, page setup, application and conversion engine. Before a customer can submit an order, each file must pass through a supported preflight process that produces a reliable printable preview/PDF or a verified page count. Unsupported or unprocessable files must be rejected with a useful explanation rather than assigned a guessed price.

### 1.2 V1 principles

1. The server is authoritative for prices, permissions, order state and payment state.
2. Shop data and files are private by default.
3. Tenant isolation is enforced in both application authorization and database policies.
4. Every price shown before submission is recalculated and validated on the server.
5. An order preserves a snapshot of its file metadata, print settings, applicable pricing and calculated total.
6. Customer tracking links use unguessable tokens; sequential IDs alone never grant access.
7. File processing is isolated, resource-limited and treated as untrusted input.
8. The architecture starts with a modular monolith, not microservices.
9. The first release targets free/low-cost tiers where practical, while documenting limits and upgrade triggers.
10. Features must never display fake printer, payment or notification statuses.

---

## 2. Problem Statement

Customers visiting print shops often need to wait while staff inspect files, clarify print settings, calculate prices and enter jobs into a queue. Shop owners may manage jobs informally through messages, paper notes or memory, which can cause confusion about job order, payment and pickup.

NoWait-Print reduces this friction by collecting print requirements in advance and providing a shared order workflow for customers and shop staff.

### 2.1 Goals

- Let a customer open a shop-specific page from a QR code without creating a full account.
- Accept supported document and image uploads safely.
- Let customers configure supported print options per file or work item.
- Calculate and display an itemized, shop-configured price.
- Submit and track orders securely.
- Provide pickup verification using an OTP.
- Give shop staff a queue, status controls, order details and basic operational metrics.
- Support multiple independent shops with strict tenant separation.
- Keep the initial deployment simple and affordable.

### 2.2 Non-goals for V1

- Direct printer control or automatic print dispatch.
- Guaranteed printer availability or printer-health monitoring.
- Automatic payment verification from a manually displayed UPI QR.
- Native mobile apps.
- Marketplace discovery and cross-shop ordering.
- Campus wallet, RFID, loyalty points or credit accounts.
- AI document interpretation.
- Automatic conversion of every possible file type.
- Advanced warehouse, inventory or accounting features.
- Microservices, Kubernetes, Kafka or mandatory Redis.
- SMS/WhatsApp delivery unless separately enabled through a real provider integration.

---

## 3. Users, Roles and Permissions

### 3.1 Customer

A customer can:
- Open a shop's public ordering page.
- Create a temporary customer session scoped to that shop.
- Upload supported files and remove them before submission.
- Configure available print options.
- See server-calculated pricing and validation errors.
- Submit an order.
- View order status using a secure tracking capability.
- View payment instructions and payment state.
- Retrieve or use the pickup OTP according to the defined release rules.

A customer must not:
- Read another customer's order or file.
- Access shop staff pages.
- Change an order's authoritative price or status.
- Access storage objects using predictable paths.
- Reuse an expired or revoked tracking token.

### 3.2 Shop Owner

The owner can manage the shop profile, public slug, staff, pricing, work types, operating settings and all shop orders. Ownership changes must use a protected administrative workflow.

### 3.3 Shop Manager

A manager can manage operational settings and orders according to permissions granted by the owner. The owner can restrict sensitive actions such as staff management or pricing publication.

### 3.4 Shop Operator

An operator can view the active queue and perform permitted order workflow actions, such as accepting, starting preparation, marking ready, and verifying pickup. Operators cannot manage shop ownership or other staff by default.

### 3.5 Platform Administrator

A future platform-level administrator may handle abuse, support and tenant lifecycle. Platform-admin access is not required for the first shop pilot. Any later implementation must be audited and must not silently bypass tenant boundaries.

### 3.6 Authorization rules

- Every staff action checks the authenticated user, active staff membership, target shop and permission.
- Never rely only on hidden buttons or client-side route guards.
- The shop identifier in a request is not proof of membership.
- Database row-level security (RLS) must prevent cross-shop reads and writes.
- Privileged server credentials must never be exposed to the browser.
- Role changes and sensitive operations should be recorded in an audit/status history.

---

## 4. Core Customer Journey

1. Customer scans a shop QR code or opens `/shop/{slug}`.
2. Server resolves the active shop by its public slug.
3. Customer starts or resumes a short-lived anonymous session scoped to that shop.
4. Customer uploads one or more files.
5. Server validates file size, extension, MIME type and actual file signature where applicable.
6. A controlled preflight process inspects each file and creates a printable representation/page metadata where supported.
7. Customer chooses available print options, such as copies, color mode, paper size, single/double-sided printing, orientation and finishing options when enabled.
8. Server validates configuration and calculates an itemized estimate.
9. Customer reviews files, settings, price, payment method and shop-specific terms.
10. Customer submits the order. The server revalidates all files, settings, shop configuration and price, then creates the order atomically.
11. The system issues a secure tracking capability and pickup OTP. Secrets are shown only according to the release policy and are not stored in plaintext.
12. Shop staff see the order in the queue and accept or reject it using permitted transitions.
13. Staff prepare the job using the shop's existing printing workflow.
14. Staff mark the job ready when it is actually ready.
15. At pickup, staff verify the OTP. The system records verification and completion.
16. Customer tracking shows current status and relevant payment/pickup instructions without exposing private staff data.

---

## 5. Shop Onboarding and Management

Each shop has:
- Internal immutable ID.
- Display name and public slug.
- Contact details and address as needed.
- Active/inactive state.
- Time zone and operating hours, if configured.
- Public ordering settings.
- Supported file types and maximum upload limits.
- Available print options and work types.
- Published pricing rules.
- Payment instructions and accepted payment methods.
- Staff memberships and roles.
- Created/updated timestamps.

### 5.1 Slug and QR behavior

- Public shop URLs use a stable, unique slug, for example `/shop/greenleaf-prints`.
- QR codes encode the canonical public URL, not private credentials.
- Slug changes must be owner-authorized and should provide a redirect or an explicit inactive-page response where appropriate.
- QR codes do not grant staff privileges or access to private order data.
- A shop can pause new orders without losing access to its existing orders.

---

## 6. File Support and Document Preflight

This is a key requirement and must be designed before implementation.

### 6.1 Supported formats and handling

| Type | Extensions | V1 handling |
| :--- | :--- | :--- |
| **PDF** | `.pdf` | Validate and inspect; preserve original; render/preview or normalize when required |
| **Word** | `.doc`, `.docx` | Convert through a controlled document-conversion service/worker to PDF before final page-based pricing |
| **Excel** | `.xls`, `.xlsx` | Convert through a controlled spreadsheet conversion pipeline; account for print areas, scaling and multiple sheets |
| **PowerPoint** | `.ppt`, `.pptx` | Convert through a controlled presentation conversion pipeline |
| **Images** | `.jpg`, `.jpeg`, `.png`, `.webp` | Validate and normalize to a printable page using shop-defined fit, orientation, paper and margin rules |
| **Other formats** | Configurable | Reject unless explicitly supported and verified by the active pipeline |

The product should display the supported formats and current limits on the upload screen. Do not advertise a format until the deployed pipeline can process it reliably.

### 6.2 Why conversion is necessary

The number of pages in DOCX, XLSX and PPTX files is not a dependable property of the original upload alone. Page count can vary based on fonts, page size, margins, sheet print areas, scaling, hidden sheets/slides and conversion software. The server must generate or inspect a printable representation before producing a final page-based price.

### 6.3 Recommended processing approach

Use a dedicated, isolated document-processing worker/service for Office conversions. A LibreOffice-based conversion pipeline is a candidate, subject to deployment compatibility and testing. The web application should enqueue a preflight job and record its state rather than block a web request during a long conversion.

For a constrained early pilot, it is acceptable to deploy the web application and worker in the same repository while running the worker as a separate process/service. The conversion worker must not receive broad database or storage privileges it does not need.

### 6.4 Preflight states

A file can move through states such as:

`UPLOADED → VALIDATING → PROCESSING → READY`

Failure states include `REJECTED`, `PROCESSING_FAILED` and `EXPIRED`.

Only files in `READY` state with verified page/print metadata can be submitted for pricing when the selected pricing method depends on that metadata.

### 6.5 File safety requirements

- Private storage bucket; no permanent public file URLs.
- Configurable per-file and per-order size limits.
- Allowlist extensions and MIME types; do not trust browser-supplied MIME alone.
- Check file signatures and parse files with maintained libraries/tools.
- Protect against malformed files, decompression bombs, path traversal, macro-enabled documents and resource exhaustion.
- Reject encrypted/password-protected files unless an explicit safe workflow is implemented.
- Limit conversion time, memory, CPU, page count and output size.
- Store original and generated printable files separately with clear ownership and retention rules.
- Generate storage paths server-side; do not use user filenames as paths.
- Escape/sanitize filenames when displayed.
- Use short-lived signed URLs only after authorization checks.
- Keep file-processing logs free of document contents and sensitive data.
- Define retention and deletion behavior for abandoned uploads, rejected files, completed orders and account/shop closure.
- Add malware scanning before broad public launch where feasible; document the risk if unavailable during a limited pilot.

### 6.6 File records

Each file record should track:
- ID and tenant/shop ID.
- Customer session or order association.
- Original filename and normalized display name.
- Declared and detected media type.
- Original storage key and generated output key, if any.
- File size and checksum such as SHA-256.
- Preflight status and safe error code/message.
- Page count and relevant metadata when available.
- Processing pipeline/version.
- Created and expiry/deletion timestamps.

A checksum helps identify accidental duplication or integrity changes; it is not a substitute for authorization.

---

## 7. Print Configuration and Work Builder

The UI should support a clear "work item" concept. A work item is a file plus its selected print settings and quantity. An order can contain multiple work items.

Possible settings, enabled per shop:
- Copies.
- Color: black-and-white or color.
- Paper size: A4, A3, Letter or shop-configured sizes.
- Sides: simplex or duplex.
- Orientation: portrait or landscape, where relevant.
- Page range, if safely supported and validated.
- Paper/media type.
- Finishing options such as stapling, binding or lamination, only if offered.
- Excel-specific options such as selected sheets or fit-to-page, only when the conversion pipeline supports the semantics.

The UI must show only options that the shop has enabled. Unsupported options must not be silently ignored.

### 7.1 Snapshotting

At order submission, store an immutable snapshot of:
- File reference and printable output version.
- Original filename and detected format.
- Page/sheet/slide metadata used for pricing.
- Print configuration.
- Copy count.
- Pricing rule/version used.
- Itemized price components.
- Final quantity calculations.

If a shop changes pricing or available options later, existing orders retain their original snapshots unless staff explicitly perform a controlled repricing flow with an audit trail and customer agreement where required.

---

## 8. Pricing Engine

### 8.1 General rule

The client may display estimates, but the server is the authority. Every price is recalculated during estimate requests and again during order submission. The server must reject invalid, stale or unsupported configurations.

### 8.2 Pricing dimensions

The first version can support shop-configurable rates for:
- Black-and-white and color printing.
- Per printed side or per sheet, explicitly chosen by the shop.
- Paper size.
- Simplex/duplex behavior.
- Copies.
- Optional fixed fees and finishing charges.
- Minimum order charge or rounding rules, if configured.

Keep the initial pricing model understandable. Do not add a generic formula builder unless a real shop workflow requires it.

### 8.3 Units and calculation

Use integer minor currency units (for INR, paise) for monetary values. Never use binary floating-point values as the stored source of truth.

Distinguish:
- **Document pages:** pages in the printable representation before copies.
- **Printed sides:** page images sent to printed sides, accounting for page range, copies and duplex semantics.
- **Physical sheets:** paper sheets consumed; duplex printing may use fewer sheets than printed sides.
- **Copies:** number of times the configured work item is reproduced.

The shop's pricing policy must clearly say whether a rate is per side, per sheet or per document page. Avoid ambiguous "per page" labels.

### 8.4 Quote lifecycle

- Quotes have a creation time, expiry time and pricing/configuration version.
- At submit time, the server recalculates the quote.
- If the price changed beyond an allowed threshold or the quote expired, return the updated price and require customer confirmation rather than silently charging a different amount.
- Persist the exact price components and total in the order snapshot.
- Record discounts, taxes or fees only when explicitly configured and legally reviewed for the shop's jurisdiction.

### 8.5 Edge cases

Define and test behavior for:
- Empty files, corrupt files and zero-page output.
- Page ranges outside the verified page count.
- Very large page counts.
- Zero, negative or excessive copies.
- Excel workbooks with multiple sheets, print areas or blank pages.
- Duplex printing with odd page counts.
- Images with unusual dimensions or orientation metadata.
- A shop changing prices between quote and submission.
- Conversion output differing from a prior preview.

---

## 9. Orders and State Machine

### 9.1 Order creation

Order submission should be atomic: either the order, its item snapshots, initial status history and required tracking/pickup records are all created, or none are. Use database transactions where supported.

Use a client-generated idempotency key or equivalent server mechanism to prevent double-taps/network retries from creating duplicate orders.

### 9.2 Suggested order states

- `SUBMITTED` --- customer submitted the order.
- `ACCEPTED` --- shop accepted the job.
- `PREPARING` --- staff are preparing/printing it manually.
- `READY` --- staff confirm it is ready for pickup.
- `COMPLETED` --- pickup was verified and the order is handed over.
- `REJECTED` --- shop declined the job, with a safe reason code.
- `CANCELLED` --- cancelled under defined rules.
- `FAILED` --- an operational failure prevented completion.

Do not let the client set arbitrary state strings. The server validates each transition against the current state, actor role, payment requirements and cancellation policy.

### 9.3 State transition policy

- Only authorized staff may accept, prepare, reject or mark ready.
- Completion requires pickup verification, except for an explicitly audited owner override.
- Cancellation rules depend on the current state; once physical work has started, cancellation may require staff approval and a recorded reason.
- Rejection/cancellation after payment requires a defined refund/manual-settlement process. V1 must not imply a refund has occurred when only a status change was made.
- Every transition records actor, timestamp, old state, new state, reason/code and relevant metadata.
- Maintain an append-only status history even though the order row stores its current state.

### 9.4 Queue ordering

Use server-side ordering, usually by submitted time and a stable tie-breaker. Do not rely on browser-local ordering. Filters should include active, ready, completed and cancelled/rejected orders as appropriate.

### 9.5 Tracking

- Never expose an order through a sequential ID alone.
- Generate a cryptographically random tracking token with sufficient entropy; store a hash where practical.
- Allow token rotation/revocation and expiry.
- Rate-limit invalid tracking attempts.
- Show only the minimum information needed to the customer.
- Avoid exposing other customers' names, phone numbers, internal notes or staff details.

---

## 10. Payments

### 10.1 V1 payment methods

- **Pay at counter:** order can be accepted and printed according to shop policy; payment is recorded by staff.
- **Manual UPI:** display shop-provided UPI details/QR and clearly tell the customer that payment is not automatically verified. Staff confirm payment after checking their payment app/bank record.

### 10.2 Important payment rule

Displaying a UPI QR code, opening a UPI app or receiving a customer screenshot does not prove payment. V1 must label manual UPI as pending until an authorized staff member records verification.

### 10.3 Payment data

Track method, amount, currency, state, recorded/verified actor, timestamps, external reference where supplied, and audit events. Never store UPI PINs, banking passwords, card details or other payment credentials.

Possible states include:
- `UNPAID`
- `PENDING_MANUAL_VERIFICATION`
- `PAID`
- `PAYMENT_FAILED`
- `REFUND_PENDING`
- `REFUNDED` (only when a refund is actually confirmed/recorded)

For the initial release, avoid claiming automated refunds. Payment gateway integration and webhook verification are a later phase.

---

## 11. Pickup OTP

- Generate a cryptographically secure, short numeric code with an appropriate length and expiration policy.
- Store a keyed hash or secure hash of the code, not plaintext.
- Reveal the OTP only to the authorized customer view and at the intended stage, preferably after the order is accepted or ready according to shop policy.
- Rate-limit attempts and lock or delay verification after repeated failures.
- Do not let an operator retrieve the original OTP from storage.
- Verify the OTP server-side and record `verified_at`, verifying staff member and attempt metadata.
- A successful OTP should be bound to the correct order and shop.
- Define regeneration, expiry and recovery rules. OTP regeneration invalidates the previous code.
- Avoid putting the OTP in public URLs, analytics, logs or push notification payloads.
- Completion should be recorded only after successful verification or an audited exception.

---

## 12. Notifications and Realtime

### 12.1 V1

Use the application dashboard and customer tracking page as the source of current status. Realtime updates may be used for the staff queue and customer tracking where the selected platform supports them.

### 12.2 Limits

- Realtime connectivity is not a durable notification guarantee.
- The UI must recover by refetching current state after reconnect.
- Do not display a notification as "sent" unless the provider confirms it.
- Do not promise SMS or WhatsApp delivery before integrating a real provider.
- Avoid putting private document links, OTPs or unnecessary customer details in notification messages.

### 12.3 Later

Add email, SMS or WhatsApp only after selecting a provider, securing credentials, handling consent/opt-out, defining templates, recording delivery states and budgeting for per-message costs.

---

## 13. Technical Architecture

### 13.1 Recommended stack

- **Web application:** Next.js App Router, TypeScript.
- **UI:** Tailwind CSS, shadcn/ui and Lucide icons.
- **Database and authentication:** Supabase Postgres and Supabase Auth, subject to availability and the user's region/terms.
- **Object storage:** private Supabase Storage bucket or an equivalent private object store.
- **Server logic:** Next.js Server Actions and/or Route Handlers with a clearly defined service layer.
- **Document processing:** isolated worker/service, likely using LibreOffice or another validated conversion engine for Office formats, plus format-specific validation.
- **PDF/image processing:** maintained server-side libraries; use pdf-lib where suitable, but do not assume it replaces Office document conversion.
- **Testing:** unit tests for pricing/state transitions, integration tests for database/RLS, end-to-end tests for customer and staff journeys.
- **Deployment:** web app on a suitable Next.js host; document worker on a compatible worker/container host. Confirm persistent storage, execution limits and free-tier restrictions before choosing providers.

### 13.2 Architectural style

Use a **modular monolith** with explicit modules:
- Identity and access
- Shops and staff
- Customer sessions
- File intake and preflight
- Work configuration
- Pricing
- Orders and status history
- Payments
- Pickup verification
- Notifications/realtime
- Audit and retention

Keep domain rules in server-side services instead of scattering them across UI components. The document worker is a separate execution boundary because file conversion has different CPU, memory and timeout requirements.

### 13.3 Request flow

1. Browser calls an authenticated or scoped server endpoint.
2. Server validates input schema and request size.
3. Server resolves the user/customer session and shop context.
4. Server checks tenant authorization and current record state.
5. Server performs domain logic and calls the database/storage using the least privilege available.
6. The server returns a minimal response.
7. The browser refreshes/revalidates state; it never becomes the authority for permissions or prices.

### 13.4 Free-tier-first constraints

Free tiers are suitable for development and a small pilot, not a guarantee of production capacity. Before launch, check current quotas, cold starts, storage/egress limits, worker runtime restrictions, database pause policies, backup/restore options and commercial terms.

Do not introduce Redis, Kafka, Kubernetes or multiple microservices at the start. Use a database-backed job table or a managed queue only if it provides sufficient reliability for preflight jobs. If the chosen host cannot run a secure conversion worker within its execution limits, use a separate worker service rather than forcing conversion into a short web request.

---

## 14. Initial Data Model

Names are conceptual and may be refined in the database design phase.

### 14.1 Core tables

- `shops`
- `staff_profiles` or `shop_memberships`
- `customer_sessions`
- `files`
- `works` or `order_items`
- `pricing_rules`
- `orders`
- `order_status_history`
- `payment_records`
- `pickup_credentials`
- `audit_events` (or an equivalent auditable event model)

### 14.2 Likely supporting tables

- `document_jobs` --- conversion/preflight queue and result state.
- `shop_settings` --- upload limits, accepted formats, options and payment instructions.
- `pricing_versions` --- if pricing rules need publication/version history.
- `idempotency_keys` --- if idempotency is not handled by a suitable unique key on existing records.
- `notification_events` --- only when notification integration is introduced.
- `printers` and `print_jobs` --- later, for actual hardware integration.

### 14.3 Data design requirements

- Use UUIDs or similarly unguessable internal identifiers where appropriate; do not treat obscurity as authorization.
- Include `shop_id` on tenant-owned records and enforce consistent foreign keys.
- Use unique constraints for public slugs and other uniqueness requirements.
- Add indexes for queue queries, shop ownership, order status, creation time and active document jobs.
- Store currency amounts as integer minor units.
- Store timestamps in UTC and display in the shop's configured time zone.
- Use explicit enums/check constraints for status values where practical.
- Avoid storing derived totals without also storing the inputs and rule snapshot needed to explain them.
- Keep original and converted file records related but distinct.
- Define deletion/retention and foreign-key behavior before launch.

---

## 15. Security and Privacy Requirements

Security is a release requirement, not a final cosmetic phase.

### 15.1 Authentication and authorization

- Staff login must use a supported authentication mechanism.
- Customer anonymous sessions must be random, scoped to a shop and expiring.
- Staff access requires active membership in the target shop.
- Server-side authorization applies to every sensitive operation.
- RLS policies must be tested using users from different shops, anonymous users and privileged service contexts.
- Service-role secrets and conversion-worker credentials must never reach the client.
- Do not trust client-supplied `shop_id`, `user_id`, price, status, page count, MIME type or storage key.

### 15.2 Web security

- Validate every request with schemas.
- Apply rate limits to login, upload initialization, quote creation, order submission, tracking lookup and OTP verification.
- Use secure cookie/session configuration and CSRF protections appropriate to the authentication flow.
- Set restrictive CORS and security headers where relevant.
- Avoid open redirects and unsafe user-generated URLs.
- Sanitize displayed filenames and notes.
- Prevent IDOR by checking ownership/tenant authorization on every record access.
- Use secrets management and rotate exposed credentials.
- Log security-relevant events without recording OTPs, tokens or document contents.

### 15.3 Privacy

- Collect only the customer information necessary to fulfil orders.
- Provide clear retention and deletion rules.
- Limit staff access to customer contact information by role and operational need.
- Avoid displaying customer phone numbers in broad queue views unless necessary.
- Do not use uploaded files for unrelated purposes.
- Provide a way to delete expired abandoned uploads.
- Define how order records are retained for operational, tax or legal reasons before implementing automatic deletion.

### 15.4 Abuse and resource protection

- Set upload count, size, page count, conversion time and order submission limits.
- Prevent repeated expensive conversion attempts.
- Expire incomplete customer sessions and abandoned uploads.
- Use backpressure and clear failure states when the worker queue is overloaded.
- Add malware scanning or an equivalent risk-control step before scaling beyond a controlled pilot.
- Keep the system usable when the conversion worker, realtime channel or notification provider is unavailable.

---

## 16. User Interface and Screen Map

### 16.1 Public/customer

- Shop landing page
- File upload and preflight status
- Work configuration
- Price review and confirmation
- Order submission result
- Payment instructions/payment state
- Secure order tracking
- Pickup OTP view
- Clear empty, loading, expired-session, unsupported-file and processing-failure states

### 16.2 Shop staff

- Staff login
- Shop dashboard
- Active order queue
- Order detail and file access
- Accept/reject/prepare/ready actions
- Payment verification
- Pickup OTP verification
- Order history and search
- Pricing configuration
- Work/print-option configuration
- Shop settings and QR code
- Staff and role management for authorized users
- Basic analytics

### 16.3 UX rules

- Mobile-first customer flow; most customers will scan a QR code on a phone.
- Make upload progress and conversion state visible.
- Explain why a file failed and what the customer can do next.
- Display price components and units clearly.
- Require confirmation if the final price differs from the quote.
- Make order status and payment status separate concepts.
- Prevent double submission and show a recoverable result after network errors.
- Use accessible labels, keyboard navigation, readable contrast and clear validation.
- Never show "printing" merely because an order is accepted; use the configured operational statuses accurately.

---

## 17. Error Handling and Resilience

Every module must define stable, user-safe error codes for:
- Invalid or expired customer session.
- Shop inactive or not accepting orders.
- Unsupported file type.
- File too large.
- Invalid or corrupt file.
- Conversion pending, failed or timed out.
- Unsupported print configuration.
- Quote expired or price changed.
- Duplicate submission.
- Order transition not allowed.
- Payment pending or not verified.
- Invalid/expired OTP or attempt limit reached.
- Unauthorized shop access.
- Temporary storage/database/worker outage.

Errors must not reveal stack traces, private storage paths, secrets or another customer's data. Use structured server logs and correlation/request IDs for diagnosis.

---

## 18. Testing Strategy

### 18.1 Unit tests

- Pricing arithmetic, rounding and currency handling.
- Page/side/sheet calculations for simplex and duplex.
- File configuration validation.
- Order state transitions and role permissions.
- Quote expiry and price-version handling.
- OTP generation, hashing, expiry and attempt limits.
- Idempotency behavior.

### 18.2 Integration tests

- Database constraints and RLS across two or more shops.
- Private storage access and signed URL authorization.
- Upload lifecycle and document job lifecycle.
- Conversion worker success, failure, timeout and retry behavior.
- Atomic order creation.
- Manual payment verification and audit history.
- Status history and pickup completion.

### 18.3 End-to-end tests

- Customer scans a shop link, uploads a PDF, configures it, gets a quote and submits.
- Customer uploads DOCX/XLSX/PPTX and receives a reliable processed preview/page count.
- Customer uploads an image and sees the shop's image-to-paper behavior.
- Unsupported/corrupt/encrypted file is handled safely.
- Shop staff accept, prepare, mark ready and verify pickup.
- Manual UPI remains pending until staff verification.
- Two shops cannot access each other's orders or files.
- Expired session/token and invalid OTP are rejected.
- Duplicate clicks/network retries do not create duplicate orders.
- Price changes between quote and submit require reconfirmation.
- Worker outage does not result in a falsely priced or submit-ready file.

### 18.4 Release gates

Do not launch until:
- Tenant isolation tests pass.
- RLS and private storage access are verified.
- No service secret is shipped to the client.
- Price calculations and order transitions are covered by tests.
- Supported file types have repeatable conversion tests.
- Upload and worker resource limits are enforced.
- Backup/restore and data retention are documented.
- A real deployment smoke test succeeds.
- Error states and operational recovery are tested.

---

## 19. Deployment and Operations

- Separate development, staging and production environments.
- Use distinct credentials and storage buckets per environment.
- Apply database migrations through version control and review.
- Never use production customer data in development without a lawful, controlled process.
- Set up logs, error monitoring and basic health checks.
- Monitor document-job queue depth, conversion failures, storage usage and order submission failures.
- Define backup and restore procedures for database records and critical configuration.
- Decide whether uploaded files are backed up and for how long.
- Keep a rollback plan for web deployments and schema migrations.
- Document how to pause new orders while allowing staff to finish existing orders.
- Review free-tier quotas and provider terms before each release.

---

## 20. Future Roadmap (Not V1)

### Phase A --- Local Print Agent
A shop-installed local agent authenticates to the cloud, polls or receives authorized jobs, downloads approved printable outputs, and interacts with local print infrastructure. Requires a secure device identity, job authorization, local spool handling, retries, duplicate-print protection and offline recovery.

### Phase B --- Printer Integration
Integrate with supported printer systems through CUPS/IPP or vendor APIs. Track only real signals returned by the integration. Clearly distinguish "sent to printer," "accepted by spooler," and "physically printed"; these are not equivalent.

### Phase C --- Notifications
Add email/SMS/WhatsApp using a selected provider, customer consent, opt-out, delivery status and cost controls.

### Phase D --- Payment Gateway
Add a payment provider with signed webhook verification, idempotent payment events, reconciliation, refund workflows and appropriate compliance review.

### Phase E --- More Formats and Advanced Preflight
Add additional file formats, improved previews, richer page-range controls, font handling, image adjustments and robust spreadsheet print options after validating the conversion pipeline.

### Phase F --- Marketplace and Multi-Shop Discovery
Allow users to discover shops, compare supported services and submit orders across participating shops. This requires explicit privacy, ranking transparency, dispute and platform-operations design.

---

## 21. Key Decisions to Lock Before Coding

The following are product decisions that should be confirmed during Phase 0 rather than guessed during implementation:

1. **Initial deployment geography and currency:** assumed India/INR for examples; confirm tax and business requirements.
2. **Anonymous customer contact:** decide whether phone number is optional, required, or collected only when a shop needs it.
3. **Supported formats at launch:** PDF, DOC/DOCX, XLS/XLSX, PPT/PPTX and common images are the target; enable only formats proven by the chosen worker.
4. **Conversion hosting:** choose a worker host that can run the conversion software within acceptable resource limits.
5. **Pricing policy:** choose whether each shop prices per printed side, physical sheet or another explicit unit.
6. **Image behavior:** define default fit-to-page, margins, orientation and whether one image means one printed page.
7. **Excel behavior:** define which sheets are printed by default and whether customers can choose sheets.
8. **Payment policy:** launch with pay-at-counter and/or manually verified UPI; do not imply automatic verification.
9. **Cancellation/refund rules:** define when cancellation is allowed and how money is reconciled.
10. **OTP release:** choose whether the customer sees the OTP after acceptance or only when the order becomes ready.
11. **Retention:** define how long originals, converted outputs, abandoned uploads and completed-order files are retained.
12. **Shop onboarding:** decide whether shops self-register or are invited/created by a platform operator during the pilot.
13. **Worker reliability:** decide queue retry limits, failed-job recovery and whether a shop can manually resolve a failed preflight.
14. **Deployment budget:** confirm which services must remain on free tiers and which paid upgrades are acceptable if needed for safe document conversion.

If a decision is not confirmed, the implementation phase must record a documented default rather than silently inventing behavior.

---

## 22. Acceptance Criteria for NoWait-Print V1

V1 is ready for a controlled pilot when:

- A shop can be configured with a unique public URL and QR code.
- A customer can place an order without creating a full account, using a secure shop-scoped temporary session.
- Supported PDF, Office and image files are validated and processed through a verified pipeline before page-based pricing.
- Unsupported or failed files cannot be submitted as if they were ready.
- A customer can configure supported print options and receive a server-calculated itemized quote.
- Price changes between quote and submission are handled with reconfirmation.
- Order creation is atomic and idempotent.
- Customers can track their own order through a secure capability without exposing sequential-ID access.
- Staff can manage permitted state transitions and payment verification.
- Pickup is verified with a protected OTP or a documented audited exception.
- Shop tenants cannot read or modify one another's records or files.
- Pricing, state transitions, file handling, RLS and key user journeys have automated tests.
- The system has documented retention, deployment, backup, monitoring and recovery procedures.
- The interface never claims a file was printed, a payment was verified, a notification was delivered or a printer was available unless the system has real evidence for that claim.

---

## 23. Implementation Rule

Build this specification in explicit software-engineering phases. Each phase must:
1. State its objective and scope.
2. Identify dependencies and assumptions.
3. Implement only the approved phase scope.
4. Include tests and validation commands.
5. Update documentation and environment examples.
6. Report changed files, decisions, known limitations and exact test results.
7. Stop and report blockers rather than bypassing security or inventing unavailable integrations.

**Do not begin feature coding until Phase 0 has converted this specification into a reviewed product requirements document, confirmed the open decisions, and locked the V1 scope.**
