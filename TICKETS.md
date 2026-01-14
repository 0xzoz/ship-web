# TICKETS — Ship Web Application

> **Generated from:** SYSTEM_PLAN.md | Milestone M1: Foundation
> **Last updated:** 2026-01-13

---

## Batching Rules
- 2–3 tickets max per batch, then stop and report
- Commit after each batch to keep changes readable
- After completion, archive `logs/verify.log` into `logs/archive/` and ticket snapshots into `docs/archive/tickets/`
- Run `dev verify` after each batch

---

## Batch 1: Project Foundation Setup

### T1: Initialize monorepo structure with Next.js frontend and Node.js backend

**Files/folders:**
- `/` (root)
  - `package.json` (workspace root)
  - `turbo.json` or similar for monorepo
- `/apps/web/` (Next.js frontend)
  - `package.json`
  - `next.config.js`
  - `tsconfig.json`
  - `tailwind.config.js`
  - `app/layout.tsx`
  - `app/page.tsx` (basic landing)
- `/apps/api/` (Node.js backend)
  - `package.json`
  - `tsconfig.json`
  - `src/server.ts`
- `/packages/shared/` (shared types/schemas)
  - `package.json`
  - `tsconfig.json`
  - `src/index.ts`

**Acceptance:**
- [ ] Monorepo structure with pnpm workspaces or npm workspaces
- [ ] Next.js 14+ with App Router initialized
- [ ] Backend Express/Hono server runs on port 3001
- [ ] Frontend runs on port 3000
- [ ] TypeScript strict mode enabled on both
- [ ] Tailwind CSS configured with DESIGN.md tokens (colors, fonts)
- [ ] Basic landing page shows "Ship" branding
- [ ] `pnpm dev` or `npm run dev` starts both frontend and backend

**Output shape:**
```
Root:
- package.json (workspaces defined)
- turbo.json (optional)
- pnpm-workspace.yaml or similar

Frontend (apps/web):
- Next.js 14+ running
- Tailwind configured with Ship design tokens
- Landing page accessible at localhost:3000

Backend (apps/api):
- Express/Hono server running
- Health check endpoint: GET /api/health → { status: "ok" }
- Accessible at localhost:3001
```

---

### T2: Set up PostgreSQL database with Prisma ORM and initial schema

**Files/folders:**
- `/apps/api/prisma/`
  - `schema.prisma`
  - `migrations/` (auto-generated)
- `/apps/api/src/config/`
  - `database.ts` (Prisma client singleton)
  - `env.ts` (environment validation with Zod)
- `/apps/api/.env.example`
- `/apps/api/.env` (gitignored)

**Acceptance:**
- [ ] Prisma installed and configured
- [ ] Database schema matches SYSTEM_PLAN.md tables:
  - `users` (id, email, password_hash, name, created_at, updated_at, last_login_at)
  - `sessions` (id, user_id, token_hash, expires_at, created_at)
  - `oauth_accounts` (id, user_id, provider, provider_user_id, email, created_at)
  - `projects` (id, user_id, name, description, current_phase, status, deploy_url, created_at, updated_at, last_activity_at)
  - `api_connections` (id, user_id, service, encrypted_api_key, status, last_tested_at, created_at, updated_at)
- [ ] Indexes created as specified
- [ ] `.env.example` has DATABASE_URL placeholder
- [ ] Migration applied successfully to local Postgres
- [ ] Prisma client generated and importable

**Output shape:**
```
Database:
- All tables created with correct schemas
- Foreign keys and indexes in place
- Prisma client ready for queries

Code:
- apps/api/prisma/schema.prisma (complete schema)
- apps/api/src/config/database.ts exports prisma client
- apps/api/.env.example has DATABASE_URL
```

---

### T3: Implement authentication service (signup, login, logout) with bcrypt and JWT

**Files/folders:**
- `/apps/api/src/routes/`
  - `auth.routes.ts`
- `/apps/api/src/services/`
  - `auth.service.ts`
- `/apps/api/src/middleware/`
  - `auth.middleware.ts` (JWT verification)
  - `validate.middleware.ts` (Zod validation)
- `/apps/api/src/utils/`
  - `crypto.ts` (bcrypt helpers, JWT signing/verifying)
- `/packages/shared/src/schemas/`
  - `auth.schema.ts` (Zod schemas for signup/login)

**Acceptance:**
- [ ] POST /api/auth/signup
  - Validates email format and password length (min 8 chars)
  - Hashes password with bcrypt (cost factor 12)
  - Creates user in database
  - Returns JWT in HTTP-only, Secure, SameSite cookie
  - Returns user object (without password_hash)
- [ ] POST /api/auth/login
  - Validates credentials
  - Compares password with bcrypt
  - Creates session in database
  - Returns JWT in HTTP-only cookie
  - Updates last_login_at
- [ ] POST /api/auth/logout
  - Requires valid JWT
  - Deletes session from database
  - Clears cookie
- [ ] Auth middleware protects routes requiring authentication
- [ ] Password validation: min 8 chars, rejects common weak passwords
- [ ] Error messages generic for security: "Invalid email or password"
- [ ] All schemas shared between frontend and backend via /packages/shared

**Output shape:**
```
API Endpoints:
- POST /api/auth/signup → { user: { id, email, name, created_at } }
- POST /api/auth/login → { user: { id, email, name, last_login_at } }
- POST /api/auth/logout → { success: true }
- GET /api/auth/me (protected) → { user: {...} }

Security:
- Passwords bcrypt hashed (cost 12)
- JWT in HTTP-only, Secure, SameSite=Strict cookie
- Token expiration: 30 days
- Sessions tracked in database
```

---

## Batch 2: Frontend Authentication & Dashboard

### T4: Create authentication UI (login, signup pages) with form validation

**Files/folders:**
- `/apps/web/app/(public)/`
  - `login/page.tsx`
  - `signup/page.tsx`
- `/apps/web/components/forms/`
  - `LoginForm.tsx`
  - `SignupForm.tsx`
- `/apps/web/components/ui/`
  - `Button.tsx` (Radix UI + Tailwind)
  - `Input.tsx`
  - `Label.tsx`
  - `FormError.tsx`
- `/apps/web/lib/`
  - `api-client.ts` (fetch wrapper for API calls)
  - `auth.ts` (client-side auth utilities)

**Acceptance:**
- [ ] Login page at /login with LoginForm component
- [ ] Signup page at /signup with SignupForm component
- [ ] Forms use React Hook Form + Zod validation (shared schemas from /packages/shared)
- [ ] Visual states per DESIGN.md:
  - Default, Hover, Focus (amber ring), Loading, Error, Success
- [ ] Error messages match DESIGN.md specifications
- [ ] Form submission calls backend API
- [ ] On success: redirect to /dashboard
- [ ] On error: show error message, keep form data
- [ ] "Forgot password?" link (non-functional, placeholder)
- [ ] "Don't have an account? Sign up" / "Already have an account? Log in" links work
- [ ] Tailwind styling matches Ship design tokens (Beacon Amber, Deep Navy, etc.)
- [ ] Accessible: keyboard navigation, screen reader labels, focus indicators

**Output shape:**
```
Pages:
- /login → Login page with email/password form
- /signup → Signup page with email/password/name form

UI:
- Matches DESIGN.md visual style (dark theme, amber accents)
- Forms validate client-side before submission
- Clear error messages on validation failure
- Loading states during API calls
```

---

### T5: Create protected layout and dashboard page with empty state

**Files/folders:**
- `/apps/web/app/(protected)/`
  - `layout.tsx` (protected layout wrapper)
  - `dashboard/page.tsx`
- `/apps/web/components/layout/`
  - `Navbar.tsx`
- `/apps/web/components/project/`
  - `ProjectCard.tsx` (stub for later)
  - `EmptyState.tsx`
- `/apps/web/lib/`
  - `auth-provider.tsx` (client context for auth state)
- `/apps/web/middleware.ts` (Next.js middleware for route protection)

**Acceptance:**
- [ ] Protected layout checks auth status
  - If not authenticated: redirect to /login?redirect=[original-path]
  - If authenticated: render children
- [ ] Navbar component with:
  - "Ship" logo/wordmark
  - Account menu (dropdown): Settings, Log out
- [ ] Dashboard page shows:
  - Heading: "Your harbor"
  - Empty state (no projects): "Your harbor is empty. Every great voyage starts with an idea. What will you build?"
  - "New Project" button (prominent, Beacon Amber)
- [ ] Log out functionality in navbar
- [ ] Next.js middleware protects /dashboard, /project/*, /settings routes
- [ ] Unauthenticated access redirects to /login with return URL
- [ ] After login, user redirected to original destination

**Output shape:**
```
Protected Routes:
- /dashboard → Shows empty state initially
- Navbar present with logo and account menu
- "New Project" button visible (non-functional yet)

Auth Flow:
- Accessing /dashboard while logged out → redirect to /login
- After login → redirect back to /dashboard
- Log out → redirect to /
```

---

### T6: Implement project CRUD API and connect to dashboard

**Files/folders:**
- `/apps/api/src/routes/`
  - `projects.routes.ts`
- `/apps/api/src/services/`
  - `project.service.ts`
- `/packages/shared/src/schemas/`
  - `project.schema.ts`
- `/apps/web/app/(protected)/dashboard/page.tsx` (update)
- `/apps/web/components/project/`
  - `ProjectCard.tsx` (implement)
  - `CreateProjectModal.tsx`
- `/apps/web/lib/hooks/`
  - `useProjects.ts` (React Query hook)

**Acceptance:**
- [ ] Backend API endpoints:
  - GET /api/projects → List user's projects
  - POST /api/projects → Create new project (name, description)
  - GET /api/projects/:id → Get project details
  - DELETE /api/projects/:id → Delete project
- [ ] All endpoints require authentication (JWT)
- [ ] Validation with Zod schemas
- [ ] Dashboard fetches and displays projects
- [ ] "New Project" button opens modal
- [ ] CreateProjectModal:
  - Name field (required, max 255 chars)
  - Description field (optional, textarea)
  - "Create" button
  - On success: modal closes, project appears in grid
- [ ] ProjectCard component:
  - Shows project name, description (truncated)
  - Shows status indicator (🟡 In Progress default)
  - Shows current phase ("Discovery")
  - Shows last activity ("Just now")
  - Click card → navigate to /project/:id (placeholder page)
- [ ] React Query for data fetching, caching, mutations
- [ ] Optimistic updates on create/delete

**Output shape:**
```
API:
- GET /api/projects → { projects: [...] }
- POST /api/projects → { project: {...} }
- DELETE /api/projects/:id → { success: true }

Dashboard:
- Shows grid of project cards
- "New Project" button functional
- Can create and delete projects
- Projects persist across page refresh
```

---

## Batch 3: Settings & Foundation Polish

### T7: Create settings page with account management

**Files/folders:**
- `/apps/web/app/(protected)/settings/`
  - `page.tsx`
  - `account/page.tsx`
- `/apps/web/components/settings/`
  - `SettingsTabs.tsx`
  - `AccountForm.tsx`
- `/apps/api/src/routes/`
  - `users.routes.ts` (PATCH /api/users/me, etc.)

**Acceptance:**
- [ ] Settings page at /settings with tab navigation:
  - Account tab (default)
  - AI Connections tab (stub for Batch 4)
- [ ] Account tab shows:
  - Email (read-only, or editable with confirmation)
  - Name (editable)
  - Change password form (current password, new password, confirm)
  - "Delete account" button (danger zone, requires confirmation)
- [ ] Backend endpoints:
  - PATCH /api/users/me → Update name/email
  - POST /api/users/change-password → Change password
  - DELETE /api/users/me → Delete account (cascade deletes projects, sessions)
- [ ] Change password validates current password before updating
- [ ] Delete account shows confirmation modal: "Are you sure? All projects will be deleted."
- [ ] Success/error toast messages
- [ ] Accessible and styled per DESIGN.md

**Output shape:**
```
Settings:
- /settings/account → Account management form
- Can update name
- Can change password
- Can delete account (with confirmation)

API:
- PATCH /api/users/me → { user: {...} }
- POST /api/users/change-password → { success: true }
- DELETE /api/users/me → { success: true }
```

---

### T8: Add design tokens, global styles, and UI polish

**Files/folders:**
- `/apps/web/tailwind.config.js` (update with full token set)
- `/apps/web/app/globals.css` (update)
- `/apps/web/components/ui/` (add missing components)
  - `Toast.tsx`
  - `Modal.tsx`
  - `Dropdown.tsx`
- `/apps/web/public/fonts/` (if using local fonts)

**Acceptance:**
- [ ] Tailwind config includes all DESIGN.md tokens:
  - Colors: Beacon Amber (#f59e0b), Deep Navy (#0f172a), Warm White (#f8fafc), Slate shades, semantic colors (success, error, warning, info)
  - Fonts: Fraunces (display), Inter (UI), JetBrains Mono (code)
  - Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96
  - Component sizes: sm (32px), md (40px), lg (48px)
- [ ] Google Fonts loaded (Fraunces, Inter)
- [ ] Global styles set background (#0f172a), text color (#f8fafc)
- [ ] Toast notification component (for success/error messages)
- [ ] Modal component (Radix UI Dialog)
- [ ] Dropdown component (Radix UI DropdownMenu)
- [ ] All buttons, inputs, cards use consistent styling
- [ ] Focus states show amber ring
- [ ] Hover states implemented

**Output shape:**
```
Design System:
- All design tokens from DESIGN.md in Tailwind config
- Typography hierarchy established
- Consistent UI components across app
- Dark theme with amber accents throughout
- Accessible focus states
```

---

### T9: Set up logging, error handling, and basic monitoring

**Files/folders:**
- `/apps/api/src/middleware/`
  - `error.middleware.ts` (centralized error handler)
  - `logger.middleware.ts` (request logging)
- `/apps/api/src/utils/`
  - `logger.ts` (Pino or Winston setup)
  - `errors.ts` (custom error classes)
- `/apps/web/lib/`
  - `error-handler.ts` (client error boundary)
- `/apps/web/app/error.tsx` (Next.js error boundary)

**Acceptance:**
- [ ] Backend logging with Pino or Winston:
  - Logs all requests (method, path, status, duration)
  - Logs errors with stack traces (development) or message only (production)
  - JSON format for easy parsing
- [ ] Centralized error handler middleware:
  - Catches all errors
  - Returns consistent error format: { error: { message, code } }
  - Doesn't leak sensitive info in production
- [ ] Custom error classes: BadRequestError, UnauthorizedError, NotFoundError, etc.
- [ ] Frontend error boundary catches React errors
- [ ] Global error handler for API call failures
- [ ] User-friendly error messages shown (no raw stack traces)
- [ ] 404 page for unknown routes
- [ ] 500 page for server errors

**Output shape:**
```
Backend:
- All requests logged
- Errors caught and formatted consistently
- No sensitive data leaked in error responses

Frontend:
- Error boundaries prevent white screen
- Clear error messages for users
- Network errors handled gracefully
```

---

## Batch 4.5: NextAuth Migration (OAuth Support)

### T10: Update Prisma schema and migrate to NextAuth database model

**Files/folders:**
- `/apps/api/prisma/schema.prisma` (update)
- `/apps/api/prisma/migrations/` (new migration)

**Acceptance:**
- [ ] Add NextAuth required tables:
  - `Account` table (OAuth account linking)
  - `VerificationToken` table (email verification)
- [ ] Update `Session` table to NextAuth format:
  - Add `sessionToken` field (unique)
  - Add `expires` field
  - Update relationships
- [ ] Keep existing `users` table structure (compatible)
- [ ] Migration preserves existing user data
- [ ] Run migration successfully on local database
- [ ] Document breaking changes (if any)

**Output shape:**
```
Database:
- NextAuth-compatible Account table for OAuth providers
- NextAuth-compatible Session table
- Existing users table preserved
- All foreign keys and indexes correct

Migration:
- Existing users can still log in
- Sessions migrate gracefully (or require re-login)
```

---

### T11: Install NextAuth and configure providers

**Files/folders:**
- `/apps/web/app/api/auth/[...nextauth]/route.ts` (new)
- `/apps/web/lib/auth.ts` (new - NextAuth config)
- `/apps/api/.env.example` (update)
- `/apps/web/.env.example` (update)

**Acceptance:**
- [ ] Install `next-auth` package
- [ ] Configure NextAuth with:
  - Credentials provider (email/password, keep existing bcrypt)
  - Google OAuth provider
  - GitHub OAuth provider (optional but recommended)
- [ ] Set up Prisma adapter for NextAuth
- [ ] Configure session strategy (JWT)
- [ ] Set up callbacks for session/jwt
- [ ] Add required environment variables:
  - NEXTAUTH_URL
  - NEXTAUTH_SECRET
  - GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
  - GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET (if using)
- [ ] Update .env.example files with new vars

**Output shape:**
```
Auth API:
- /api/auth/signin → NextAuth sign-in page
- /api/auth/signout → NextAuth sign-out
- /api/auth/session → Get current session
- /api/auth/callback/google → Google OAuth callback
- /api/auth/callback/github → GitHub OAuth callback (optional)

Configuration:
- Credentials auth uses existing bcrypt password hashing
- OAuth providers ready for use
- Session management via NextAuth
```

---

### T12: Update login/signup pages and auth flows

**Files/folders:**
- `/apps/web/app/(public)/login/page.tsx` (update)
- `/apps/web/app/(public)/signup/page.tsx` (update or remove)
- `/apps/web/components/forms/LoginForm.tsx` (update)
- `/apps/web/components/forms/SignupForm.tsx` (update or remove)
- `/apps/web/app/(app)/layout.tsx` (update to use NextAuth session)
- `/apps/web/middleware.ts` (update to use NextAuth)
- `/apps/web/lib/auth-provider.tsx` (update or remove)

**Acceptance:**
- [ ] Login page shows:
  - "Sign in with Google" button (prominent)
  - "Sign in with GitHub" button (optional)
  - Divider: "Or continue with email"
  - Email/password form (existing, uses NextAuth credentials provider)
- [ ] Signup page:
  - Option A: Keep separate signup page for email/password
  - Option B: Merge into login (OAuth auto-creates accounts)
- [ ] Update middleware to use `getToken()` from next-auth/jwt
- [ ] Update protected layout to use `getServerSession()` from next-auth
- [ ] Update AccountMenu component to use NextAuth session
- [ ] Log out uses NextAuth signOut()
- [ ] All existing protected routes still work
- [ ] OAuth flow:
  - Click "Sign in with Google" → redirects to Google
  - After authorization → creates account if new, logs in if existing
  - Redirects to /dashboard
- [ ] Email/password flow still works (backward compatible)

**Output shape:**
```
Login Page:
- OAuth buttons at top (Google + GitHub)
- Email/password form below
- Smooth UX, matches DESIGN.md styling

Auth Flow:
- OAuth: Click → authorize → create/login → redirect to dashboard
- Email/password: Enter credentials → login → redirect to dashboard
- Logout: Click → sign out → redirect to /

Backward Compatibility:
- Existing users can still log in with email/password
- All protected routes work
- Sessions managed by NextAuth
```

---

### T13: Update backend API to use NextAuth sessions

**Files/folders:**
- `/apps/api/src/middleware/auth.middleware.ts` (update)
- `/apps/api/src/routes/*.routes.ts` (update if needed)
- `/apps/api/src/services/auth.service.ts` (update or deprecate)

**Acceptance:**
- [ ] Update auth middleware to verify NextAuth JWT tokens
- [ ] Keep API routes using same auth pattern (req.user)
- [ ] Deprecate old /api/auth/signup, /api/auth/login, /api/auth/logout endpoints (or keep for backward compatibility)
- [ ] Ensure all protected API routes work with NextAuth sessions
- [ ] Update user creation flow for OAuth (auto-create on first login)
- [ ] Test API endpoints with NextAuth session tokens

**Output shape:**
```
API:
- All protected routes work with NextAuth sessions
- Middleware validates NextAuth JWT tokens
- req.user populated correctly
- OAuth users auto-created on first login
- Existing email/password users still work

Backward Compatibility:
- API clients using NextAuth tokens work seamlessly
```

---

## Batch 6.5: AI Connections UX Polish (Mini-batch)

### T22: Add help content and API key guidance

**Files/folders:**
- `/apps/web/components/settings/ConnectionsPanel.tsx` (update)
- `/apps/web/components/settings/ConnectionHelp.tsx` (new)

**Acceptance:**
- [ ] Add help section for each service showing:
  - Claude: "Get your API key at console.anthropic.com/settings/keys"
  - Codex/OpenAI: "Get your API key at platform.openai.com/api-keys"
  - Direct links that open in new tab
- [ ] Add format examples:
  - Claude: `sk-ant-api03-...` (shows expected format)
  - OpenAI: `sk-...` (shows expected format)
- [ ] Add tooltip or info icon: "Why do I need this?" → explains API keys are required, Ship doesn't provide AI services
- [ ] Add visual guide (optional): Screenshot or diagram showing where to find keys
- [ ] Update modal with step-by-step instructions:
  1. Click link to provider console
  2. Create new API key
  3. Copy and paste here
  4. Test connection

**Output shape:**
```
Connection Modal:
- Header: "Connect Claude API"
- Help text: "Get your API key from console.anthropic.com"
- Link button: "Open API Keys Page →"
- Format hint below input: "Format: sk-ant-api03-..."
- Clear, friendly guidance throughout
```

---

### T23: Improve connection modal design and validation

**Files/folders:**
- `/apps/web/components/settings/ConnectionsPanel.tsx` (update)
- `/apps/web/lib/connections.ts` (update validation)

**Acceptance:**
- [ ] Add API key format validation (client-side):
  - Claude: Must start with `sk-ant-`
  - OpenAI: Must start with `sk-`
  - Show error if format is invalid before submitting
- [ ] Improve modal design:
  - Add provider logo/icon (Claude icon, OpenAI icon)
  - Better spacing and typography
  - Visual hierarchy: Help → Input → Actions
- [ ] Show validation states:
  - ✓ Valid format (green checkmark)
  - ✗ Invalid format (red error message)
  - Clear error messages: "Invalid format. Claude API keys start with sk-ant-"
- [ ] Disable "Save" button until format is valid
- [ ] Add character counter for debugging (optional)
- [ ] Better focus states and accessibility

**Output shape:**
```
Validation:
- Real-time format checking as user types
- Clear error messages
- Can't submit invalid format

Design:
- Professional, matches DESIGN.md
- Provider branding (icons/colors)
- Intuitive flow
```

---

### T24: Add masked key preview and better status indicators

**Files/folders:**
- `/apps/web/components/settings/ConnectionsPanel.tsx` (update)
- `/apps/api/src/routes/connections.routes.ts` (update to return partial key)

**Acceptance:**
- [ ] When connection exists, show masked key preview:
  - Claude: `sk-ant-***...xyz` (first 7 chars + last 3 chars, rest masked)
  - OpenAI: `sk-***...xyz` (first 3 chars + last 3 chars, rest masked)
- [ ] Improve status badges:
  - ✓ Connected (green badge with checkmark)
  - ⚠ Not tested (amber badge with warning)
  - ✗ Failed (red badge with error)
  - Show last test time: "Tested 2 hours ago"
- [ ] Add "last used" timestamp (if available):
  - "Last used: 5 minutes ago"
  - "Never used" if never called
- [ ] Better visual hierarchy in connection cards:
  - Service name (prominent)
  - Status badge (color-coded)
  - Key preview (subtle)
  - Last tested time (subtle)
- [ ] Add copy button for masked key preview (optional)

**Output shape:**
```
Connection Card:
┌─────────────────────────────────┐
│ Claude                          │
│ Planning and discovery partner  │
│                                 │
│ ✓ Connected  Tested 2h ago     │
│ Key: sk-ant-***...xyz          │
│                                 │
│ [Update] [Test] [Disconnect]   │
└─────────────────────────────────┘

Status Indicators:
- Color-coded badges (green/amber/red)
- Clear status text
- Timestamps for context
```

---

## Batch 5 and Beyond

**Batch 5:** AI Connections (M2 start) — COMPLETED in Batch 4
- T14: API key encryption/decryption service ✅
- T15: AI connection API endpoints (Claude, Codex) ✅
- T16: AI connection UI (Settings → AI Connections) ✅
- T17: Connection testing functionality ✅

**Batch 6:** Discovery Phase (M2 completion) — COMPLETED
- T18: Discovery chat interface (frontend) ✅
- T19: Claude API client integration ✅
- T20: WebSocket setup for real-time chat ✅
- T21: DISCOVERY.md generation ✅

**Batch 6.5:** AI Connections UX Polish (Mini-batch)
- T22: Add help content and API key guidance
- T23: Improve connection modal design and validation
- T24: Add masked key preview and better status indicators

**Batch 7:** Requirements Phase (M3 start) — Next after 6.5

**Batch 8:** Requirements Phase (M3 start)
- T25: Requirements editor UI
- T26: Feature list management (add, remove, prioritize)
- T27: REQUIREMENTS.md generation

**Batch 9-11:** Build Orchestration (M3 core)
- T28: Build progress UI with WebSocket updates
- T29: Orchestration engine (state machine)
- T30: Claude API integration for planning
- T31: Codex API integration for code generation
- T32: Job queue setup (BullMQ or pg-boss)
- T33: Error handling and recovery

**Batch 12-13:** Review & Deploy (M3 completion)
- T34: Review phase UI (preview, checklist)
- T35: Vercel deployment integration
- T36: Deployed success screen

**Batch 14-16:** Polish & Launch (M4)
- T37: Accessibility audit and fixes
- T38: Performance optimization
- T39: Security audit
- T40: User onboarding flow improvements
- T41: Analytics and monitoring
- T42: Documentation

---

## Status

**Completed:**
- ✅ Batch 1 (T1-T3): Foundation
- ✅ Batch 2 (T4-T6): Auth UI + Dashboard
- ✅ Batch 3 (T7-T9): Settings + Error Handling
- ✅ Batch 4 (T14-T17): AI Connections
- ✅ Batch 4.5 (T10-T13): NextAuth Migration
- ✅ Batch 6 (T18-T21): Discovery Phase

**Current Batch:** Batch 6.5 (T22-T24): AI Connections UX Polish
**Next Batch:** Batch 7 (T25-T27): Requirements Phase

**Milestone Progress:**
- M1: Foundation → Complete ✅ (Batch 1-3)
- M2: AI Integration → In Progress (Batch 4-7)
- M3: Build Orchestration → Planned (Batch 8-14)
- M4: Polish & Launch → Planned (Batch 15-17)

---

## Notes for Builder

1. **CEO Decisions Made:**
   - ✅ Auth library: NextAuth.js (migrating in Batch 4.5)
   - ✅ ORM: Prisma
   - ✅ Backend runtime: Node.js

2. **CEO Decisions Still Needed:**
   - Queue system: BullMQ vs pg-boss (impacts Batch 10+)

3. **Dependencies:**
   - T2 must complete before T3 (need database for auth)
   - T3 must complete before T4 (need auth API for forms)
   - T4-T5 must complete before T6 (need UI to display projects)

4. **Testing:**
   - Run `dev verify` after each batch
   - Manual testing of auth flows critical (signup → login → protected route)
   - Ensure database migrations work cleanly

5. **Security Reminders:**
   - Never commit .env files
   - API keys encrypted in database
   - Passwords bcrypt hashed (cost 12+)
   - JWT in HTTP-only cookies only
   - Validate all inputs server-side

---

**Last updated:** 2026-01-13
