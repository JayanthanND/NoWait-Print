# NoWait-Print — Security Model & Tenant Isolation Specification

**Document Status:** Baseline Approved / Security Frozen  
**Version:** 1.0 (Phase 0)  
**Date:** October 2026  
**Authors:** Senior Security Engineer, Software Architect  

---

## 1. Multi-Tenant Isolation Strategy & Defense-in-Depth

NoWait-Print adopts a **pooled database, shared schema, multi-tenant isolation model** enforced using Defense-in-Depth:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Layer 1: Network & Edge                         │
│  - Cloudflare / Vercel Edge: TLS 1.3, DDoS Mitigation, Rate Limiting   │
├────────────────────────────────────────────────────────────────────────┤
│                   Layer 2: Application Authorization                   │
│  - Service layer checks: active shop membership, role, status          │
│  - Request scoping: session token hash, unguessable tracking token     │
├────────────────────────────────────────────────────────────────────────┤
│                 Layer 3: Database Row-Level Security                   │
│  - PostgreSQL RLS enabled on all tables                                │
│  - Policies evaluate auth.uid() against staff_profiles.shop_id         │
├────────────────────────────────────────────────────────────────────────┤
│                    Layer 4: Isolated File Storage                      │
│  - Private bucket, non-enumerable UUID keys (tenants/{shop_id}/...)    │
│  - Short-lived HMAC signed URLs (300s expiration)                      │
└────────────────────────────────────────────────────────────────────────┘
```

A compromised or buggy API route cannot read or modify another tenant's records because the database RLS policies enforce isolation independently at the SQL execution layer.

---

## 2. Role-Permission Matrix (RBAC)

| Resource / Action | Customer (Anonymous) | Operator | Manager | Owner | Service Role (Worker) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **View Public Shop Storefront** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Upload File / Enqueue Preflight** | ✅ (Scoped Session) | ❌ | ❌ | ❌ | ❌ |
| **Read Ready PDF File** | ❌ (Raw) | ✅ (Signed URL) | ✅ (Signed URL) | ✅ (Signed URL) | ✅ (Direct) |
| **Calculate Price Quote** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Submit New Order** | ✅ (Atomic) | ❌ | ❌ | ❌ | ❌ |
| **Track Order Status** | ✅ (Via Token) | ✅ (Queue) | ✅ (Queue) | ✅ (Queue) | ❌ |
| **View Pickup OTP** | ✅ (Only if READY)| ❌ (Hashed) | ❌ (Hashed) | ❌ (Hashed) | ❌ |
| **Update Order State (Accept/Ready)**| ❌ | ✅ | ✅ | ✅ | ❌ |
| **Verify Counter OTP** | ❌ | ✅ | ✅ | ✅ | ❌ |
| **Verify Manual UPI Payment** | ❌ | ✅ | ✅ | ✅ | ❌ |
| **Edit Pricing Matrix** | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Manage Staff Memberships** | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Change Shop Slug / Profile** | ❌ | ❌ | ❌ | ✅ | ❌ |

---

## 3. Database Row-Level Security (RLS) Policies

All operational tables have `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` applied.

### 3.1 Staff Authorization Helper Function
A security definer function checks whether the authenticated user holds an active staff membership for the given shop:

```sql
CREATE OR REPLACE FUNCTION public.is_shop_staff(check_shop_id UUID, required_roles TEXT[] DEFAULT ARRAY['owner', 'manager', 'operator'])
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.staff_profiles
        WHERE user_id = auth.uid()
          AND shop_id = check_shop_id
          AND status = 'active'
          AND role = ANY(required_roles)
    );
$$;
```

### 3.2 Table-Specific Policy Definitions

#### `shops` Table
- **SELECT:** Public can view active shops (`status = 'active'`).
- **UPDATE:** Owners can update their owned shop.
```sql
CREATE POLICY "Public can view active shops" ON public.shops
    FOR SELECT USING (status = 'active');

CREATE POLICY "Owners can update their shop" ON public.shops
    FOR UPDATE USING (owner_id = auth.uid());
```

#### `orders` Table
- **SELECT (Staff):** Staff members of the shop can view all shop orders.
- **SELECT (Customer):** Customers can select their specific order using `tracking_token_hash`.
- **INSERT (Customer):** Anyone can insert an order matching their active session.
- **UPDATE (Staff):** Authorized staff can transition order status.
```sql
CREATE POLICY "Staff can view shop orders" ON public.orders
    FOR SELECT USING (public.is_shop_staff(shop_id));

CREATE POLICY "Customer can view order by tracking hash" ON public.orders
    FOR SELECT USING (tracking_token_hash = current_setting('request.headers', true)::json->>'x-tracking-hash');

CREATE POLICY "Staff can update shop orders" ON public.orders
    FOR UPDATE USING (public.is_shop_staff(shop_id));
```

#### `files` Table
- **SELECT (Staff):** Staff can view files belonging to their shop.
- **SELECT (Customer):** Customers can view file metadata linked to their active session ID.
- **INSERT (Customer):** Customer can insert files linked to their active session.
```sql
CREATE POLICY "Staff can view shop files" ON public.files
    FOR SELECT USING (public.is_shop_staff(shop_id));

CREATE POLICY "Customer can view own session files" ON public.files
    FOR SELECT USING (session_id = (current_setting('request.headers', true)::json->>'x-session-id')::uuid);
```

#### `pickup_credentials` Table
- **SELECT / UPDATE (Staff):** Staff can select and update (verify OTP) credentials for their shop.
- **Plaintext OTP:** The plaintext OTP is never returned by SELECT queries.
```sql
CREATE POLICY "Staff can access pickup credentials" ON public.pickup_credentials
    FOR ALL USING (public.is_shop_staff(shop_id));
```

---

## 4. Capability-Based Security & Cryptographic Tokens

### 4.1 Anonymous Customer Sessions
- Generated using `crypto.randomBytes(32).toString('hex')`.
- Persisted in an `HttpOnly`, `SameSite=Lax`, `Secure` browser cookie.
- The database stores only `SHA-256(session_token)`.

### 4.2 Order Tracking Capabilities
- Tracking URLs take the format: `https://nowaitprint.com/track/{tracking_token}`.
- `tracking_token` is 256 bits (32 random bytes) represented as a URL-safe Base64 string.
- Brute-forcing a 256-bit token is mathematically infeasible ($2^{256}$ space).
- The database stores only `HMAC-SHA256(tracking_token, SERVER_SECRET)`. Sequential order UUIDs or auto-incrementing integers are never exposed in URLs.

### 4.3 Pickup OTP Cryptography
- A 6-digit numeric code ($100,000$ to $999,999$) is generated using a cryptographically secure pseudorandom number generator (`crypto.randomInt(100000, 1000000)`).
- Stored as `HMAC-SHA256(order_id + ":" + otp, OTP_SECRET)`.
- **Release Invariant:** The plaintext OTP is returned to the customer **only when the order status is `READY`**. Prior to this state, the API omits the OTP field.
- **Lockout Rule:** If an operator enters an incorrect OTP 5 times, `failed_attempts` reaches 5 and the credential locks. Verification requires owner manual override.

---

## 5. Storage Security & Signed URLs

1. **Private S3 Bucket:** The `print-files` bucket is strictly private (`public = false`). Direct HTTP access returns 403 Forbidden.
2. **Key Partitioning:**
   - Raw uploads: `tenants/{shop_id}/raw/{file_id}/{sanitized_filename}`
   - Ready PDFs: `tenants/{shop_id}/ready/{file_id}.pdf`
3. **Signed Download URLs:**
   - Generated by server actions using service-role credentials with a strict expiration of **300 seconds (5 minutes)**.
   - Issued only after verifying the requesting user's active staff membership in `{shop_id}`.
4. **Content-Disposition Enforcement:** File downloads serve headers `Content-Disposition: attachment; filename="..."` and `X-Content-Type-Options: nosniff` to prevent browser inline script execution.

---

## 6. Threat Modeling (STRIDE Analysis)

| Threat Category | Specific Attack Vector | System Countermeasure & Mitigation |
| :--- | :--- | :--- |
| **Spoofing** | Attacker impersonates shop staff to access queue or files. | Supabase GoTrue JWT authentication with secure session cookies; RLS validates `auth.uid()` against active staff profile. |
| **Tampering** | Customer modifies price estimate before submission. | The client price estimate is untrusted. At order submission, the server independently recalculates all rates from database rules. |
| **Tampering** | Malicious file payload (macro-enabled DOCX or PDF exploit). | Ingestion parses magic bytes; files are processed in an unprivileged, isolated container jail (no network, memory ceiling 512MB, CPU limit 1.0). Macros are stripped during conversion. |
| **Repudiation** | Staff falsely claims customer picked up order; or customer denies pickup. | Append-only `order_status_history` and `audit_events` log exact timestamps, operator IDs, and OTP verification records. |
| **Information Disclosure** | IDOR: Attacker changes order ID in URL to view another customer's document. | Orders cannot be accessed by ID. Only unguessable 256-bit tracking tokens grant access, returning only minimal fulfillment status. |
| **Information Disclosure** | Cross-tenant leak: Shop A queries Shop B's orders or files. | Database RLS enforces `shop_id` filtering unconditionally on all reads and writes. |
| **Denial of Service** | Decompression bomb / huge 500-page file upload. | Enforce file size limit (25MB) at edge; worker aborts parsing if page count exceeds 250 or memory exceeds 512MB. |
| **Elevation of Privilege** | Operator elevates self to Shop Owner or alters pricing. | Role checks in `staff-service.ts` reject non-owner actors; database triggers reject non-owner updates to `pricing_rules`. |

---

## 7. Residual Risks & Operational Controls

1. **Counterfeit UPI Screenshots:** Because V1 relies on manual UPI verification, a customer might show a forged payment screenshot at pickup.  
   *Mitigation:* Staff training protocol stipulates that operators must verify credit in their own UPI app / bank notification before clicking "Confirm Payment" in the dashboard.
2. **Zero-Day PDF / LibreOffice Parser Vulnerability:** A weaponized document could exploit a parser bug in the conversion worker.  
   *Mitigation:* The worker container runs as a non-root unprivileged user with read-only root filesystem, dropped Linux capabilities, and no outbound internet access.
