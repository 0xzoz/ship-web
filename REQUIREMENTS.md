# REQUIREMENTS — Ship Web Application

> **Source:** Derived from DESIGN.md (approved 2026-01-11)

---

## 1. Product Vision

**One-sentence description:**
Ship is an AI development companion that guides domain experts through building real software while teaching them how it works — not by hiding complexity, but by making the voyage comprehensible.

**Core value proposition:**
Ship teaches you to fish while catching dinner tonight. Other AI tools give you a fish you can't replicate. Coding bootcamps teach you to fish over 6 months with no dinner. Ship does both — you ship real software AND understand how, one voyage at a time.

---

## 2. User Requirements

### Primary User Persona: Josh — The Domain Expert
- **Background:** Environmental surveyor with deep domain expertise, zero coding experience
- **Goal:** Ship a field data collection app AND understand how it works for future maintenance/extension
- **Need:** Feel like a captain steering the ship, not a passenger on autopilot

### Secondary Users
- **Maya — The Vibe Coder:** Can prompt AI to generate code but doesn't understand it; wants to level up
- **Sam — The Dev Curious:** (Future) Technical professionals who want to ship side projects

### Anti-Persona
- **Derek:** Wants AI to build everything with zero effort, won't engage with the process → Ship is not for Derek

---

## 3. Functional Requirements

### Core Features (Must Have)

#### FR-1: User Authentication
**Priority:** MUST HAVE (MVP)

- Users SHALL be able to sign up with email/password
- Users SHALL be able to log in with email/password
- Users SHALL be able to log in with OAuth (Google, GitHub)
- Users SHALL be able to reset forgotten passwords
- Users SHALL remain logged in for 30 days (remember me) or session duration
- Users SHALL be able to log out
- System SHALL hash passwords with bcrypt and salt
- System SHALL use HTTP-only, Secure cookies with JWT

**Success Criteria:**
- User can create account in <1 minute
- User stays logged in across sessions
- Password reset flow completes successfully

---

#### FR-2: AI Account Connection
**Priority:** MUST HAVE (MVP)

- Users SHALL be able to connect their Claude (Anthropic) API account
- Users SHALL be able to connect their Codex (OpenAI) API account
- Users SHALL enter API keys manually (copy/paste from provider dashboard)
- System SHALL encrypt and securely store API keys (AES-256)
- System SHALL test connection validity on save
- Users SHALL see visual feedback: "Claude connected ✓" / "Codex connected ✓"
- Users SHALL be able to disconnect and reconnect services
- Users SHALL see clear error messages if API key is invalid, expired, or unreachable

**Success Criteria:**
- User can connect both accounts in <3 minutes with clear guidance
- Keys are never exposed in logs or client-side code
- Connection status is always accurate

---

#### FR-3: Project Management
**Priority:** MUST HAVE (MVP)

- Users SHALL be able to create new projects with name and optional description
- Users SHALL see all their projects in a dashboard grid
- Users SHALL see project status at a glance: 🟢 Live | 🟡 In Progress | 🔴 Needs Attention | ⚪ Paused
- Users SHALL see current phase for each project
- Users SHALL see last activity timestamp
- Users SHALL be able to click a project card to open it
- Users SHALL be able to delete projects
- System SHALL create project directory structure on creation

**Success Criteria:**
- Project created in <30 seconds
- Dashboard can manage 10+ projects without confusion
- Project state persists across sessions

---

#### FR-4: Discovery Phase (Guided Chat)
**Priority:** MUST HAVE (MVP)

- Users SHALL engage in guided conversation with Claude to understand their project
- System SHALL present Claude's questions one at a time
- Users SHALL respond via chat interface
- System SHALL show "Claude is typing..." indicator
- System SHALL show progress indicator (e.g., "3 of 5 questions")
- Users SHALL be able to mark discovery as complete after minimum questions answered
- System SHALL generate DISCOVERY.md automatically from conversation
- Users SHALL be able to review/edit DISCOVERY.md before proceeding

**Success Criteria:**
- Clear understanding of project in 10-15 minutes
- User never confused about what to do next
- DISCOVERY.md accurately captures project vision

---

#### FR-5: Requirements Phase
**Priority:** MUST HAVE (MVP)

- Users SHALL see list of features extracted from Discovery
- Users SHALL be able to add new features
- Users SHALL be able to remove features
- Users SHALL be able to reprioritize features
- Users SHALL be able to mark features as "MVP" or "Later"
- System SHALL generate REQUIREMENTS.md from feature list
- Users SHALL approve requirements before proceeding to Build

**Success Criteria:**
- User confident in what will be built
- No "that's not what I wanted" syndrome after build

---

#### FR-6: Build Phase (Orchestrated AI Build)
**Priority:** MUST HAVE (MVP)

- System SHALL orchestrate Claude (planning) and Codex (coding) to build the project
- Users SHALL see real-time progress: "Claude is planning..." / "Codex is coding..."
- Users SHALL see overall progress bar with percentage
- Users SHALL see step timeline: ✓ completed, ⟳ current, ○ upcoming
- Users SHALL be able to pause build
- Users SHALL be able to resume paused build
- Users SHALL be able to expand "View details" for verbose logs
- System SHALL handle errors gracefully with clear explanations
- System SHALL use user's API keys for all AI calls (Ship doesn't pay)

**Success Criteria:**
- User watches app get built and understands progress
- Build errors are explained clearly: "Rough seas. Here's what happened: [error]. Let's fix it."
- User never feels lost or blocked

---

#### FR-7: Review Phase
**Priority:** MUST HAVE (MVP)

- Users SHALL see preview of built app (iframe or new tab)
- Users SHALL see checklist of features from requirements
- Users SHALL see automated test results
- Users SHALL be able to mark items as verified
- Users SHALL be able to approve build
- Users SHALL be able to request changes if not satisfied

**Success Criteria:**
- User confident app works as expected before deployment
- Quality gate prevents broken deploys

---

#### FR-8: Deployment (Ship It!)
**Priority:** MUST HAVE (MVP)

- Users SHALL be able to deploy with one click
- System SHALL integrate with deployment platform (Vercel/Netlify)
- System SHALL return live URL after deployment
- Users SHALL see success screen: "You did it. [App Name] is live."
- Users SHALL be able to share deployed app URL
- Users SHALL be able to start another project

**Success Criteria:**
- User's app is live on the internet
- Deployment completes in <5 minutes
- Celebration moment feels rewarding

---

#### FR-9: Dashboard
**Priority:** MUST HAVE (MVP)

- Users SHALL see all projects as cards in grid layout
- Users SHALL see status indicator for each project
- Users SHALL see current phase badge
- Users SHALL see last activity timestamp
- Users SHALL be able to filter projects by status
- Users SHALL be able to sort projects (newest, oldest, name)
- Users SHALL see "No projects yet" empty state with CTA
- Users SHALL be able to click "New Project" button

**Success Criteria:**
- Dashboard loads in <2 seconds
- User can find any project quickly
- Clear path to create first project

---

#### FR-10: Settings (API Connections Management)
**Priority:** MUST HAVE (MVP)

- Users SHALL view current connection status for Claude and Codex
- Users SHALL be able to add/update API keys
- Users SHALL be able to test connections
- Users SHALL be able to remove API keys
- Users SHALL see usage stats if API provider supports it
- Users SHALL be able to change email
- Users SHALL be able to change password
- Users SHALL be able to delete account (danger zone)

**Success Criteria:**
- User can troubleshoot connection issues independently
- Clear security warnings for dangerous actions

---

### Secondary Features (Post-MVP)

#### FR-11: Design Phase
- Visual direction and screen specifications
- Defer to post-MVP; use defaults for now

#### FR-12: Cockpit View
- Real-time tmux-style agent monitoring
- Defer to post-MVP; power users can use CLI

#### FR-13: Team Collaboration
- Multiple users on one project
- Defer to post-MVP; adds significant complexity

#### FR-14: Project Templates
- Start from pre-built project types
- Defer to post-MVP; generic start is fine

---

## 4. Non-Functional Requirements

### Performance
- Page load: < 2 seconds
- Time to interactive: < 3 seconds
- Lighthouse score: > 80
- Build status updates: < 500ms latency
- Initial JS bundle: < 300KB

### Security
- Authentication: Email/password + OAuth (Google, GitHub)
- Authorization: User-level access (own projects only)
- Data sensitivity: API keys (encrypted AES-256), user credentials (bcrypt hashed)
- Passwords: Never stored plain, bcrypt + salt
- Sessions: HTTP-only, Secure, SameSite cookies with JWT
- API keys: Never in logs or client-side code
- Input validation: Prevent injection attacks

### Accessibility
- Target: WCAG 2.1 AA
- Screen reader support: Yes (VoiceOver, NVDA tested)
- Keyboard navigation: Yes (full support required)
- Focus indicators: Visible amber ring
- Color contrast: 4.5:1 for text, 3:1 for UI components

### Browser/Platform Support
- Browsers: Chrome, Firefox, Safari, Edge (last 2 versions)
- NO IE11 support
- Desktop minimum width: 1024px
- Tablet (768px+): Functional, not optimized
- Mobile: Out of scope for MVP (desktop-first)
- Offline support: No (requires internet connection)

### Scalability
- Expected users: 100-1000 for MVP
- Growth rate: Not specified (optimize later)
- Data retention: User/project data indefinite while active, build logs 30 days
- Session expiration: 30 days of inactivity
- Account deletion: Full purge within 7 days

---

## 5. Constraints

### Tech Stack
- Framework: Next.js 14+ with App Router
- Styling: Tailwind CSS
- State: React Query + Zustand
- UI Components: Radix UI
- Animation: Framer Motion
- Real-time: Socket.io
- Database: PostgreSQL (or Supabase)
- Hosting: Vercel (primary), self-hosted option

### Timeline
- Not specified (CEO decision)

### Budget
- Not specified (users pay for their own AI API costs)

### Team Size
- Small team (CEO + agents)

### Dependencies on External Systems
- Anthropic Claude API (user's API key)
- OpenAI Codex API (user's API key)
- Deployment platform: Vercel/Netlify (TBD)
- Database: PostgreSQL or Supabase
- OAuth providers: Google, GitHub

---

## 6. Assumptions
(validated from Discovery)

- Users have (or will get) their own Claude and Codex API accounts
- Users are building web apps primarily (not mobile, desktop, CLI)
- Single-user projects for MVP (no collaboration)
- Users have reliable internet during build process
- Users are on desktop devices (not mobile)
- Users understand that Ship uses their API keys (they pay for AI usage)

---

## 7. Out of Scope
Explicitly NOT building:

- Mobile app — Desktop-first, mobile later
- Real-time collaboration — Single-user MVP
- Design Phase UI builder — Use defaults for MVP
- Custom domain setup — Users configure manually post-deploy
- Template marketplace — Start from scratch only
- Team features — Single-user projects
- White-label / API access
- Mobile app generation — Web apps only
- CI/CD pipeline management — Simple deploy only
- Advanced monitoring/analytics
- Billing/subscription system (deferred)

---

## 8. Success Metrics
How we know it's successful:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Discovery completion rate | 60%+ | Users who start Discovery and complete it |
| Build-to-deploy rate | 40%+ | Users who start Build and reach Deploy |
| Time to first deploy | < 2 hours | Average time from signup to first deployed app |
| Second project rate | 30%+ | Users who start second project within 7 days |
| User sentiment | "In control" not "confused" | Qualitative feedback surveys |
| Understanding | User can explain what app does and how | Post-deploy interview |

---

## 9. Open Questions & Decisions Needed

**Q1: Deployment platform for user apps?**
- Options: Vercel, Netlify, Railway, self-managed
- Decision needed by: Before Build phase implementation
- Impacts: Deployment integration, user experience

**Q2: Pricing model?**
- Options: Free forever (users pay AI costs), freemium, subscription
- Decision needed by: Before launch
- Impacts: Feature gating, onboarding flow

**Q3: Self-hosted vs. cloud only?**
- Options: Cloud SaaS only, Electron app, Docker self-host
- Decision needed by: Before architecture finalization
- Impacts: Backend architecture, user data storage

---

Requirements approved by CEO: [Pending]
