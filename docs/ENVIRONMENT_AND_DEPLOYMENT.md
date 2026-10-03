# NoWait-Print — Environment Variables, Services & Deployment Guide

**Document Status:** Baseline Approved / Deployment Frozen  
**Version:** 1.0 (Phase 0)  
**Date:** October 2026  
**Authors:** Senior Infrastructure Architect, Security Engineer  

> [!CAUTION]
> This document lists environment variable **names only**. Real secret values must **never** be committed to version control, printed to logs, or included in error messages. Rotate any accidentally exposed credentials immediately.

---

## 1. Environment Variable Catalog

### 1.1 Web Application (`apps/web/.env.local`)

| Variable Name | Required | Description | Example Format |
| :--- | :---: | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Public Supabase project URL, safe to expose to browser. | `https://{PROJECT_REF}.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous public key, safe to expose. Subject to RLS enforcement. | `eyJhbGciOiJIUzI1NiIs...` |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | **Server-side only.** Full-privilege service role JWT. Never expose to browser or logs. | `eyJhbGciOiJIUzI1NiIs...` |
| `SUPABASE_JWT_SECRET` | ✅ | **Server-side only.** Used to verify staff session tokens server-side. | `super-secret-jwt-key...` |
| `SESSION_SECRET` | ✅ | **Server-side only.** 64-character hex key for HMAC-SHA256 signing of anonymous customer session tokens. | `[64-char hex string]` |
| `TRACKING_TOKEN_SECRET` | ✅ | **Server-side only.** 64-character hex key for HMAC-SHA256 hashing of order tracking capabilities. | `[64-char hex string]` |
| `OTP_SECRET` | ✅ | **Server-side only.** 64-character hex key for HMAC-SHA256 hashing of pickup OTPs. | `[64-char hex string]` |
| `NEXT_PUBLIC_APP_URL` | ✅ | Public canonical base URL of the deployed web application. Used for QR code generation. | `https://app.nowaitprint.com` |
| `STORAGE_BUCKET_NAME` | ✅ | Name of the private Supabase Storage bucket for print files. | `print-files` |
| `SIGNED_URL_EXPIRY_SECONDS` | ⚠️ Optional | Signed file URL expiry in seconds. Defaults to 300 (5 minutes). | `300` |
| `MAX_FILE_SIZE_MB` | ⚠️ Optional | Global maximum upload file size in megabytes. Defaults to 25. | `25` |

### 1.2 Document Conversion Worker (`worker/.env`)

| Variable Name | Required | Description | Example Format |
| :--- | :---: | :--- | :--- |
| `SUPABASE_URL` | ✅ | Supabase project URL for job queue and file record updates. | `https://{PROJECT_REF}.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | **Service-side only.** Worker requires privileged access to update file records and job status. | `eyJhbGciOiJIUzI1NiIs...` |
| `STORAGE_BUCKET_NAME` | ✅ | Name of the private storage bucket. | `print-files` |
| `WORKER_POLL_INTERVAL_MS` | ⚠️ Optional | Interval in milliseconds between job polling cycles. Defaults to 2000 (2 seconds). | `2000` |
| `JOB_MAX_ATTEMPTS` | ⚠️ Optional | Maximum conversion retries per job before marking `PROCESSING_FAILED`. Defaults to 3. | `3` |
| `CONVERSION_TIMEOUT_SECONDS` | ⚠️ Optional | Maximum seconds allowed for a single LibreOffice subprocess execution. Defaults to 45. | `45` |
| `WORKER_TEMP_DIR` | ⚠️ Optional | Writable temporary directory for conversion staging. Defaults to `/tmp/nowait-worker`. | `/tmp/nowait-worker` |

---

## 2. Service Responsibilities Summary

```
┌────────────────────────────┬──────────────────────────────────────────────────────────────────────┐
│ Service                    │ Responsibility                                                       │
├────────────────────────────┼──────────────────────────────────────────────────────────────────────┤
│ Next.js Web App (Vercel)   │ HTTP routing, customer sessions, pricing, order transactions,        │
│                            │ staff authentication, admin dashboard, signed URL generation.        │
├────────────────────────────┼──────────────────────────────────────────────────────────────────────┤
│ Supabase PostgreSQL        │ Multi-tenant relational data storage, RLS policy enforcement,        │
│                            │ job queue (document_jobs), immutable audit logs.                    │
├────────────────────────────┼──────────────────────────────────────────────────────────────────────┤
│ Supabase Auth (GoTrue)     │ Staff JWT issuance, session validation, secure cookie management.   │
├────────────────────────────┼──────────────────────────────────────────────────────────────────────┤
│ Supabase Storage           │ Private S3-compatible bucket storing raw uploads and ready PDFs.    │
│                            │ Access enforced via server-side signed URLs, never direct public.   │
├────────────────────────────┼──────────────────────────────────────────────────────────────────────┤
│ Supabase Realtime          │ PostgreSQL WAL-based real-time push to staff queues and customer    │
│                            │ tracking screens. WebSocket fallback via 30-second polling.         │
├────────────────────────────┼──────────────────────────────────────────────────────────────────────┤
│ Document Worker (Fly.io)   │ Polls document_jobs queue, downloads raw files, runs LibreOffice    │
│                            │ in an unprivileged sandbox, uploads ready PDFs, updates file status.│
└────────────────────────────┴──────────────────────────────────────────────────────────────────────┘
```

---

## 3. Deployment Architecture & Environments

| Environment | Web App | Database | Worker | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Local Development** | `next dev` (port 3000) | Local Supabase CLI (`supabase start`) | Worker run manually with `node worker/index.js` | Use `.env.local` files. Never use production credentials locally. |
| **Preview / Staging** | Vercel Preview Deployments (auto on PRs) | Separate Supabase project (`nowait-staging`) | Worker deployed to Fly.io `nowait-worker-staging` app | All environment variables scoped to staging Supabase project. |
| **Production** | Vercel Production Deployment | Supabase Pro project (`nowait-production`) | Worker deployed to Fly.io `nowait-worker-prod` app | Secrets stored in Vercel Environment Variables & Fly.io secrets. |

---

## 4. Local Development Setup (Variable Names Only)

Create `apps/web/.env.local` and `worker/.env` from the `.env.example` template files that will be created in Phase 1:

```bash
# Start local Supabase stack
npx supabase start

# Copy example files (never commit the filled versions)
cp apps/web/.env.example apps/web/.env.local
cp worker/.env.example worker/.env

# Fill in values from: npx supabase status
```

---

## 5. Secret Rotation Policy

| Secret Type | Rotation Trigger | Affected Services |
| :--- | :--- | :--- |
| `SESSION_SECRET` | Any breach or credential exposure | Web App — invalidates all active customer sessions |
| `TRACKING_TOKEN_SECRET` | Any breach or credential exposure | Web App — all existing tracking URLs become invalid |
| `OTP_SECRET` | Any breach or credential exposure | Web App — all active OTP hashes invalidated; orders require staff OTP regeneration |
| `SUPABASE_SERVICE_ROLE_KEY` | Staff departure, breach, or quarterly rotation | Web App, Worker — both services must receive new value simultaneously |
| `SUPABASE_JWT_SECRET` | Supabase project migration or security incident | Web App — invalidates all staff login sessions |

> [!IMPORTANT]
> After rotating `SESSION_SECRET`, `TRACKING_TOKEN_SECRET`, or `OTP_SECRET` in production, immediately redeploy all affected services. Customer tracking URLs and OTPs from before rotation will return 404 or fail verification until the next OTP regeneration by staff.
