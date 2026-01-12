# SYSTEM PLAN — Ship Web Application

> **Last updated:** 2026-01-11
> **Status:** Draft → Awaiting CEO approval

---

## One-liner

Ship is a web app that guides non-coders through building real software using AI agents (Claude + Codex) while teaching them how it works — users remain captain while AI does the heavy lifting.

---

## Users + Problem

**Who:** Domain experts (like Josh the surveyor) and vibe coders (like Maya) who have ideas for software but can't code.

**Problem:** Existing AI tools (Bolt/Lovable) build things users can't modify. Traditional coding requires years of learning. The gap between domain expertise and execution is insurmountable.

**Solution:** Ship orchestrates Claude (planning) and Codex (building) through a guided voyage from idea → deployed app, with phases that teach understanding while producing working software.

---

## Core Flows

### Flow 1: New User First Project (Primary Flow)
1. **Landing** → Sign up → Connect AI accounts (Claude + Codex API keys)
2. **Create Project** → Name + description
3. **Discovery Phase** → Chat with Claude to clarify vision (generates DISCOVERY.md)
4. **Requirements Phase** → Review/edit feature list (generates REQUIREMENTS.md)
5. **Build Phase** → Watch Claude plan + Codex build in real-time (progress bar, logs)
6. **Review Phase** → Preview app, verify features, run tests
7. **Deploy** → One-click deploy to Vercel/Netlify → "You did it!"

### Flow 2: Connect AI Accounts
- Settings → AI Connections → Enter Claude API key → Enter Codex API key → Test connections → Both connected ✓

### Flow 3: Resume Existing Project
- Dashboard → Click project card → Opens to current phase → Continue where left off

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Ship Web App                             │
│                   (Next.js 14 Frontend)                         │
│                                                                 │
│  Routes:                                                        │
│  - / (landing, public)                                          │
│  - /login, /signup (auth, public)                               │
│  - /dashboard (projects list, protected)                        │
│  - /project/[id] (project view, protected)                      │
│  - /settings (account + API connections, protected)             │
│                                                                 │
│  State Management:                                              │
│  - React Query (server state, API calls)                        │
│  - Zustand (client state, UI state)                             │
│                                                                 │
│  UI Components:                                                 │
│  - Radix UI (primitives)                                        │
│  - Tailwind CSS (styling)                                       │
│  - Framer Motion (animations)                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/WebSocket
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Ship API Server                           │
│                        (Node.js/Bun)                            │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Auth Service │  │ Project Svc  │  │ Orchestration Engine │  │
│  │              │  │              │  │                      │  │
│  │ - Signup     │  │ - CRUD ops   │  │ - State machine      │  │
│  │ - Login      │  │ - Phases     │  │ - Claude API client  │  │
│  │ - Sessions   │  │ - Files      │  │ - Codex API client   │  │
│  │ - OAuth      │  │ - Dashboard  │  │ - Queue management   │  │
│  │ - Password   │  │              │  │ - Error recovery     │  │
│  │   reset      │  │              │  │ - Uses user's keys   │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Credential   │  │ Real-time    │  │  Deploy Service      │  │
│  │ Vault        │  │ Comms        │  │                      │  │
│  │              │  │              │  │ - Vercel integration │  │
│  │ - AES-256    │  │ - WebSocket  │  │ - Netlify option     │  │
│  │   encryption │  │ - SSE backup │  │ - Git push           │  │
│  │ - Key mgmt   │  │ - Build logs │  │ - Domain setup       │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
           ▼                 ▼                 ▼
    ┌────────────┐    ┌────────────┐    ┌────────────┐
    │  Database  │    │   Claude   │    │   Codex    │
    │ (Postgres) │    │    API     │    │    API     │
    │            │    │ (Anthropic)│    │  (OpenAI)  │
    │ - users    │    │            │    │            │
    │ - projects │    │ Uses user's│    │ Uses user's│
    │ - sessions │    │  API key   │    │  API key   │
    │ - api_keys │    │            │    │            │
    └────────────┘    └────────────┘    └────────────┘
```

---

## Technology Stack

### Frontend (Ship Web App)
- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v3+
- **UI Components:** Radix UI (headless primitives)
- **Animation:** Framer Motion
- **State Management:**
  - Server state: TanStack React Query (formerly React Query)
  - Client state: Zustand
- **Forms:** React Hook Form + Zod validation
- **Real-time:** Socket.io client
- **Fonts:**
  - Display: Fraunces (Google Fonts)
  - UI: Inter (Google Fonts)
  - Mono: JetBrains Mono
- **Icons:** Lucide React or Radix Icons
- **Hosting:** Vercel

### Backend (Ship API Server)
- **Runtime:** Node.js 20+ or Bun (TBD)
- **Framework:** Express or Hono (lightweight, fast)
- **Language:** TypeScript
- **Database:** PostgreSQL 15+
- **ORM:** Prisma or Drizzle ORM
- **Authentication:**
  - Passwords: bcrypt
  - Sessions: JWT in HTTP-only cookies
  - OAuth: Passport.js or next-auth
- **Encryption:** Node crypto (AES-256-GCM for API keys)
- **Real-time:** Socket.io server
- **Validation:** Zod (shared schemas with frontend)
- **AI Clients:**
  - Anthropic SDK (@anthropic-ai/sdk)
  - OpenAI SDK (openai)
- **Deployment Client:**
  - Vercel SDK (@vercel/client)
  - Netlify SDK (netlify)
- **Queue:** BullMQ or pg-boss (Postgres-based)
- **Logging:** Pino or Winston
- **Hosting:** Railway, Render, or self-hosted

### Database (PostgreSQL)
- **Provider:** Supabase (managed) or self-hosted Postgres
- **Migrations:** Prisma Migrate or Drizzle Kit
- **Backups:** Automated daily backups

### External Services
- **AI Services:**
  - Claude API (Anthropic) — user provides API key
  - Codex API (OpenAI) — user provides API key
- **OAuth Providers:**
  - Google OAuth 2.0
  - GitHub OAuth
- **Deployment Platforms:**
  - Vercel (primary)
  - Netlify (secondary option)
- **File Storage (future):**
  - S3 or R2 for project files (optional, can use filesystem initially)

---

## Data Model

### Database Schema

#### `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255), -- nullable if OAuth only
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);
```

#### `oauth_accounts`
```sql
CREATE TABLE oauth_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- 'google', 'github'
  provider_user_id VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(provider, provider_user_id)
);
```

#### `sessions`
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

#### `api_connections`
```sql
CREATE TABLE api_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service VARCHAR(50) NOT NULL, -- 'claude', 'codex'
  encrypted_api_key TEXT NOT NULL, -- AES-256 encrypted
  status VARCHAR(50) DEFAULT 'connected', -- 'connected', 'error', 'disconnected'
  last_tested_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, service)
);
CREATE INDEX idx_api_connections_user_id ON api_connections(user_id);
```

#### `projects`
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  current_phase VARCHAR(50) DEFAULT 'discovery',
    -- 'discovery', 'requirements', 'design', 'build', 'review', 'deployed'
  status VARCHAR(50) DEFAULT 'in_progress',
    -- 'in_progress', 'paused', 'live', 'needs_attention'
  deploy_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_activity_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
```

#### `project_files`
```sql
CREATE TABLE project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  file_type VARCHAR(50) NOT NULL, -- 'discovery', 'requirements', 'design', 'code'
  file_path VARCHAR(500) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_project_files_project_id ON project_files(project_id);
```

#### `build_logs`
```sql
CREATE TABLE build_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  phase VARCHAR(50) NOT NULL,
  log_level VARCHAR(20) DEFAULT 'info', -- 'info', 'warn', 'error', 'debug'
  message TEXT NOT NULL,
  metadata JSONB, -- additional structured data
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_build_logs_project_id ON build_logs(project_id);
CREATE INDEX idx_build_logs_created_at ON build_logs(created_at);
-- Auto-delete logs older than 30 days (setup as cron job)
```

#### `chat_messages`
```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  phase VARCHAR(50) NOT NULL, -- 'discovery', 'requirements', etc.
  role VARCHAR(20) NOT NULL, -- 'user', 'assistant'
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_chat_messages_project_id_phase ON chat_messages(project_id, phase);
```

---

## Key Technical Decisions

### ADR-001: Next.js App Router vs Pages Router
**Decision:** Use Next.js 14+ App Router

**Rationale:**
- Modern, future-proof approach
- Better streaming and suspense support
- Server components reduce client JS bundle
- Cleaner file-based routing

**Tradeoffs:**
- Steeper learning curve
- Less ecosystem maturity than Pages Router

---

### ADR-002: PostgreSQL vs MongoDB
**Decision:** PostgreSQL

**Rationale:**
- Relational data (users → projects → files)
- Strong consistency needed for auth/sessions
- JSONB support for flexible metadata
- Mature ecosystem (Prisma, Supabase)

**Tradeoffs:**
- Slightly more complex schema than NoSQL

---

### ADR-003: React Query + Zustand vs Redux
**Decision:** React Query (server) + Zustand (client)

**Rationale:**
- React Query handles server state, caching, invalidation automatically
- Zustand is lightweight for UI state (modals, accordions)
- Simpler than Redux, less boilerplate
- Better DX for async operations

**Tradeoffs:**
- Two state libraries instead of one
- Team needs to learn boundary between them

---

### ADR-004: Real-time Updates — WebSocket vs SSE vs Polling
**Decision:** WebSocket (Socket.io) with SSE fallback

**Rationale:**
- Build phase needs real-time progress updates (<500ms latency)
- Bidirectional communication for pause/resume commands
- Socket.io handles reconnection, fallbacks automatically

**Tradeoffs:**
- More complex than polling
- Requires WebSocket support on hosting platform

---

### ADR-005: API Key Storage — Client vs Server
**Decision:** Server-side only, encrypted at rest (AES-256)

**Rationale:**
- Security: Keys never exposed to client
- Control: Server makes all AI API calls on user's behalf
- Auditability: Can log usage, detect abuse

**Tradeoffs:**
- Server becomes SPOF for AI calls
- More backend complexity

---

### ADR-006: Monorepo vs Separate Repos
**Decision:** Monorepo (frontend + backend in one repo)

**Rationale:**
- Share TypeScript types between FE/BE
- Single deployment process
- Easier local development
- Smaller team, less overhead

**Tradeoffs:**
- Larger repo size
- Need tooling (Turborepo or Nx) for larger scale

---

### ADR-007: Deployment Platform (User Apps)
**Decision:** Vercel (primary), Netlify (secondary)

**Rationale:**
- Vercel has best Next.js integration (made by same team)
- One-click deploy experience
- Generous free tier for users
- Netlify as backup option for non-Next.js projects

**Tradeoffs:**
- Vendor lock-in to Vercel ecosystem
- Users may prefer self-hosting (add later)

---

### ADR-008: Authentication — Build vs Use Library
**Decision:** Use next-auth (Auth.js) or Clerk

**Rationale:**
- Don't reinvent auth (high security risk)
- OAuth integration out of the box
- Session management handled
- Well-tested, production-ready

**Tradeoffs:**
- Dependency on external library
- Less control over auth flow

**CEO Decision Needed:** Which library? next-auth (self-hosted) vs Clerk (managed)?

---

### ADR-009: File Storage for Project Code
**Decision:** Start with local filesystem, migrate to S3/R2 later

**Rationale:**
- Simpler for MVP
- No S3 costs initially
- Can migrate later without changing API

**Tradeoffs:**
- Not scalable long-term
- Can't easily run multiple backend instances

---

### ADR-010: Queue System for Build Jobs
**Decision:** BullMQ with Redis or pg-boss (Postgres-based)

**Rationale:**
- Build jobs need queue (long-running, async)
- Retry logic for failed builds
- Job status tracking

**CEO Decision Needed:** BullMQ (Redis dependency) vs pg-boss (no Redis, uses Postgres)?

---

## Component Structure

### Frontend Component Hierarchy

```
app/
├── (public)/
│   ├── page.tsx                    # Landing page
│   ├── login/
│   │   └── page.tsx                # Login page
│   └── signup/
│       └── page.tsx                # Signup page
│
├── (protected)/
│   ├── layout.tsx                  # Protected layout (auth check)
│   ├── dashboard/
│   │   └── page.tsx                # Project dashboard
│   ├── project/
│   │   └── [id]/
│   │       ├── page.tsx            # Project view (redirects to current phase)
│   │       ├── discovery/
│   │       │   └── page.tsx        # Discovery chat interface
│   │       ├── requirements/
│   │       │   └── page.tsx        # Requirements editor
│   │       ├── build/
│   │       │   └── page.tsx        # Build progress monitor
│   │       ├── review/
│   │       │   └── page.tsx        # Review & preview
│   │       └── deployed/
│   │           └── page.tsx        # Success screen
│   └── settings/
│       ├── page.tsx                # Settings overview
│       ├── account/
│       │   └── page.tsx            # Account settings
│       └── connections/
│           └── page.tsx            # AI connections
│
├── api/
│   ├── auth/
│   │   ├── [...nextauth]/route.ts # Auth.js routes
│   │   └── logout/route.ts         # Logout endpoint
│   └── [proxy routes to backend API]
│
└── components/
    ├── ui/                          # Radix UI wrappers
    │   ├── Button.tsx
    │   ├── Card.tsx
    │   ├── Input.tsx
    │   ├── Modal.tsx
    │   └── ...
    ├── forms/
    │   ├── LoginForm.tsx
    │   ├── SignupForm.tsx
    │   └── ProjectForm.tsx
    ├── project/
    │   ├── ProjectCard.tsx
    │   ├── PhaseIndicator.tsx
    │   ├── ChatInterface.tsx
    │   └── BuildProgress.tsx
    ├── connections/
    │   └── APIConnectionCard.tsx
    └── layout/
        ├── Navbar.tsx
        ├── Sidebar.tsx
        └── Footer.tsx
```

### Backend API Structure

```
src/
├── server.ts                       # Main entry point
├── config/
│   ├── database.ts                 # DB connection
│   └── env.ts                      # Environment vars
│
├── routes/
│   ├── auth.routes.ts              # POST /auth/signup, /auth/login, etc.
│   ├── connections.routes.ts       # GET/POST /connections
│   ├── projects.routes.ts          # CRUD /projects
│   └── phases.routes.ts            # /projects/:id/discovery, /build, etc.
│
├── services/
│   ├── auth.service.ts             # Authentication logic
│   ├── project.service.ts          # Project CRUD
│   ├── orchestration.service.ts    # Claude + Codex orchestration
│   ├── credential-vault.service.ts # API key encryption/decryption
│   └── deploy.service.ts           # Vercel/Netlify integration
│
├── clients/
│   ├── claude.client.ts            # Anthropic SDK wrapper
│   ├── codex.client.ts             # OpenAI SDK wrapper
│   └── vercel.client.ts            # Vercel SDK wrapper
│
├── middleware/
│   ├── auth.middleware.ts          # JWT verification
│   ├── error.middleware.ts         # Error handling
│   └── validate.middleware.ts      # Zod validation
│
├── models/
│   ├── user.model.ts
│   ├── project.model.ts
│   └── ...
│
├── websocket/
│   └── build.socket.ts             # Socket.io handlers
│
└── utils/
    ├── crypto.ts                   # Encryption helpers
    ├── logger.ts                   # Pino logger
    └── queue.ts                    # Job queue wrapper
```

---

## Milestones

### M1: Foundation (Batch 1-2)
**Goal:** Basic auth + project CRUD + dashboard

**Scope:**
- Project setup (Next.js, backend, DB)
- Database schema + migrations
- User authentication (signup, login, logout)
- Protected routes
- Dashboard with project list (empty state)
- Create/delete project
- Settings page (account info)

**Success Criteria:**
- User can sign up, log in, create project, see dashboard
- No AI integration yet

**Estimated batches:** 2

---

### M2: AI Integration (Batch 3-5)
**Goal:** Connect AI accounts + Discovery phase working

**Scope:**
- AI connection UI (Claude + Codex cards)
- API key storage (encrypted)
- Connection testing
- Discovery phase chat interface
- Claude API integration for discovery
- DISCOVERY.md generation
- WebSocket for real-time chat

**Success Criteria:**
- User can connect Claude, have discovery conversation, generate DISCOVERY.md
- No build phase yet

**Estimated batches:** 3

---

### M3: Build Orchestration (Batch 6-9)
**Goal:** Full build pipeline from requirements → deployed app

**Scope:**
- Requirements phase UI
- Build phase progress UI
- Orchestration engine (Claude + Codex workflow)
- State machine for build phases
- Job queue for async builds
- Error handling and recovery
- Review phase (preview)
- Deployment integration (Vercel)
- Deployed/success screen

**Success Criteria:**
- User can complete full flow: discovery → requirements → build → deploy
- End-to-end working for simple app

**Estimated batches:** 4

---

### M4: Polish & Launch Prep (Batch 10-12)
**Goal:** Production-ready, polished UX

**Scope:**
- Error states and messaging
- Loading states and animations
- Empty states
- Accessibility improvements
- Performance optimization
- Security audit
- Analytics/monitoring
- Documentation (user guide)
- Onboarding improvements

**Success Criteria:**
- WCAG AA compliance
- Lighthouse score >80
- No critical security issues
- User can self-serve without support

**Estimated batches:** 3

---

## Open Questions for CEO

1. **Authentication library:** next-auth (self-hosted) vs Clerk (managed)?
   - Trade-off: Control/cost vs ease of use

2. **Queue system:** BullMQ (requires Redis) vs pg-boss (Postgres-only)?
   - Trade-off: Performance vs simplicity

3. **File storage:** Start with filesystem or go straight to S3/R2?
   - Trade-off: Speed to MVP vs scalability

4. **Backend runtime:** Node.js vs Bun?
   - Trade-off: Ecosystem maturity vs performance

5. **ORM:** Prisma vs Drizzle?
   - Trade-off: DX vs performance/control

6. **Deployment platform priority:** Vercel only or support both Vercel + Netlify from start?
   - Trade-off: Focus vs flexibility

---

## Implementation Notes

### Phase Sequencing
Each milestone should be implemented in batches:
- Batch 1: Backend foundation
- Batch 2: Frontend foundation
- Batch 3: AI connections backend
- Batch 4: AI connections frontend
- Batch 5: Discovery phase
- ...and so on

### Testing Strategy
- **Unit tests:** Jest for business logic
- **Integration tests:** Supertest for API endpoints
- **E2E tests:** Playwright for critical flows (signup, create project, deploy)
- **Manual QA:** Each batch reviewed before merge

### Security Checklist
- [ ] All API keys encrypted at rest (AES-256)
- [ ] Passwords hashed with bcrypt (cost factor 12+)
- [ ] SQL injection prevention (parameterized queries via ORM)
- [ ] XSS prevention (React escapes by default, validate server-side)
- [ ] CSRF protection (SameSite cookies)
- [ ] Rate limiting on auth endpoints
- [ ] Input validation on all endpoints (Zod schemas)
- [ ] HTTPS only (redirect HTTP → HTTPS)
- [ ] Security headers (helmet.js)
- [ ] Dependency scanning (npm audit, Snyk)

---

## Change Log

- 2026-01-11: Initial system plan created from DESIGN.md and REQUIREMENTS.md

---

**Status:** Awaiting CEO approval
