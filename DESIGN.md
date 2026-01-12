# DESIGN — Ship Web Application

> **Instructions:** Fill out EVERY section before writing code. Empty sections = incomplete design = bugs and wasted time.

---

## Product Vision

### 1. What is this application?
**One-sentence description:**
Ship is an AI development companion that guides domain experts through building real software while teaching them how it works — not by hiding complexity, but by making the voyage comprehensible.

### 2. Who are the users?

**Primary user persona:**
- **Name/Role:** Josh — The Domain Expert
- **Background:** Environmental surveyor who deeply understands his field. Has had an idea for a field data collection app for years. No coding experience, but smart and capable.
- **Technical skill level:** Zero — can use apps but has never built one
- **Goals:** Ship his field data collection app AND understand how it works so he can maintain/extend it
- **Frustrations:** Bolt/Lovable build things but he can't change them. Cursor is for coders. YouTube tutorials don't stick. Feels like software is a black box.
- **What they want from this app:** To feel like a captain steering his ship, not a passenger on autopilot. To build something real AND understand how.

**Secondary users:**
- **Maya — The Vibe Coder:** Can prompt AI to generate code, but doesn't understand it. Wants to level up to "real" development. Needs the middle layer between magic and mastery.
- **Sam — The Dev Curious:** (Future) Technical professionals who code isn't their job but want to ship side projects. Have some programming awareness but not fluency.

**Anti-persona:**
- **Derek:** Wants AI to build everything with zero effort. Won't engage with the process. Just wants the output without the voyage. Ship is not for Derek — send him to Bolt.

### 3. What problem does this solve?

**User's current situation (without this app):**
Josh has a brilliant idea for a field data collection app that would transform his work. He deeply understands what it needs to do. But there's a wall between his domain expertise and making it real. He's tried Bolt — it generated something, but when it wasn't quite right, he couldn't fix it. He's tried tutorials — too slow, doesn't stick. He's stuck.

**What makes this frustrating/painful:**
- "AI tools build for me, but I can't modify the result"
- "I don't understand what got built, so I can't maintain it"
- "I feel dependent on magic I don't control"
- "Learning to code 'properly' takes years I don't have"
- "I know WHAT I want, just not HOW to build it"

**How this app solves it:**
Ship guides Josh through the entire voyage — from idea to deployed app — while explaining what's happening at each step. The AI crew (Claude + Codex) does the heavy lifting, but Josh remains captain. He learns by doing: he makes real decisions, sees their consequences, and ends up with both a working app AND understanding of how it works.

**Why existing solutions don't work:**
- **Bolt/Lovable/v0:** "Describe it, we build it" — fast but Josh can't modify results or learn
- **Cursor/Copilot:** Assume you can already code — Josh can't even start
- **Tutorials/bootcamps:** Too slow, too theoretical, Josh needs to ship something NOW
- **Hiring a developer:** Josh can't maintain it after, still dependent

### 4. Core value proposition

**In 1-2 sentences, why would someone use this instead of alternatives?**

Ship teaches you to fish while catching dinner tonight. Other AI tools give you a fish you can't replicate. Coding bootcamps teach you to fish over 6 months with no dinner. Ship does both — you ship real software AND understand how, one voyage at a time.

---

## User Flows

### Primary Flow: New User First Project

**Flow name:** "First Voyage — From Idea to Deployed App"

**Steps:**
1. **Landing Page** — User sees Ship's value prop: "Your agents. Your rules. Ship faster."
   - CTA: "Start your first voyage"
   
2. **Account Creation** — Email/password or OAuth (Google/GitHub)
   - Minimal friction — just email + password
   - No credit card required for first project
   
3. **Connect Your Crew** — This is critical
   - "Before we sail, let's assemble your crew"
   - **Connect Claude account** — OAuth to Anthropic, or enter API key
   - **Connect Codex account** — OAuth to OpenAI, or enter API key
   - Visual: Two "crew member" cards that light up when connected
   - User can skip temporarily but will be blocked before build phase
   
4. **Name Your Project**
   - "What are you building?"
   - Simple text input + optional description
   - Examples shown: "Field Survey App", "Mom's Recipe Site", "Team Standup Bot"
   
5. **Discovery Phase**
   - Ship asks Josh clarifying questions about his idea
   - "Who will use this?" "What's the most important feature?" "What does success look like?"
   - Chat interface with Claude (first mate)
   - Generates DISCOVERY.md
   
6. **Requirements Phase**
   - Review and refine what was discovered
   - Checklist of features with priorities
   - "These are the specs. Anything missing?"
   - Generates REQUIREMENTS.md
   
7. **Design Phase** (optional based on project type)
   - Visual direction selection
   - Component choices
   - Simple screen flows
   - Generates design tokens
   
8. **Build Phase**
   - "Your crew is building. Here's what's happening..."
   - Real-time log of Claude planning, Codex executing
   - Progress bar with phases
   - User can pause, ask questions, redirect
   
9. **Review Phase**
   - "Let's make sure this is seaworthy"
   - Automated tests run
   - User can click through preview
   - List of items to verify
   
10. **Ship It!**
    - "Ready to ship?"
    - One-click deploy (Vercel/Netlify integration)
    - Success screen: "You did it. [App Name] is live."
    - CTA: "Share it" / "Start another voyage"

**Success criteria:**
- User can complete flow in 30-60 minutes for simple app
- No confusion at any step — always know what's happening and why
- Clear "next" action at every screen
- User feels capable, not lost

**Failure points to avoid:**
- Account connection failing silently → Clear error states with retry
- Getting stuck in discovery → Time limit / "good enough" escape hatch
- Build errors → "Rough seas" mode with clear explanation
- User abandoning mid-flow → Save state, email reminder, easy resume

### Secondary Flow: Connect AI Accounts

**Flow name:** "Assemble Your Crew"

**Steps:**
1. User clicks "Settings" → "AI Connections" or arrives from onboarding
2. Sees two cards: Claude (First Mate) and Codex (Engineer)
3. Each card shows connection status:
   - Not connected (gray, "Connect" button)
   - Connected (green checkmark, account email shown, "Disconnect" button)
   - Error (red, "Reconnect" button with error message)
4. **Connect Claude:**
   - Option A: OAuth flow with Anthropic (if available)
   - Option B: "Enter API Key" → modal with input, link to "Get API key"
   - On success: Card turns green, shows "Claude ready to navigate"
5. **Connect Codex:**
   - Option A: OAuth flow with OpenAI (if available)
   - Option B: "Enter API Key" → modal with input, link to "Get API key"
   - On success: Card turns green, shows "Codex ready to build"
6. Both connected → "Your crew is assembled. Ready to sail."

### Secondary Flow: Resume Existing Project

**Flow name:** "Return to Harbor"

**Steps:**
1. User logs in → Dashboard shows project cards
2. Each card shows: Project name, current phase, last activity, status indicator
3. User clicks card → Project view opens
4. If mid-phase: "Welcome back. You were [doing X]. Ready to continue?"
5. User can resume exactly where they left off

### Secondary Flow: Project Monitoring (Power User)

**Flow name:** "Check on the Fleet"

**Steps:**
1. Dashboard shows all projects as cards
2. Status indicators: 🟢 Live / 🟡 In Progress / 🔴 Needs Attention / ⚪ Paused
3. Click project → see current phase, recent logs, agent activity
4. "Cockpit View" for real-time monitoring of active builds
5. Can issue commands: "Pause", "Resume", "Redirect", "Cancel"

---

## Pages & Screens

### Page Inventory

1. **Landing Page** (public)
   - Purpose: Convert visitors to sign-ups
   - Key message: "Ship real software. Understand how. AI crew, you're the captain."
   - Main CTA: "Start your first voyage"

2. **Sign Up / Login** (public)
   - Purpose: Account creation/access
   - Key message: "Your crew is waiting"
   - Main CTA: Sign up → Onboarding, Login → Dashboard

3. **Onboarding: Connect Accounts** (authenticated)
   - Purpose: Connect Claude and Codex API accounts
   - Key message: "Assemble your crew"
   - Main CTA: "Continue to first project" (enabled when both connected)

4. **Dashboard** (authenticated)
   - Purpose: Overview of all projects, quick actions
   - Key message: "Your harbor — all voyages at a glance"
   - Main CTA: "New project" or click existing project

5. **Project View** (authenticated)
   - Purpose: Single project status, progress, and actions
   - Key message: "[Project name] — [Current phase]"
   - Main CTA: "Continue" or phase-specific action

6. **Discovery Phase** (authenticated)
   - Purpose: Chat-based discovery with Claude
   - Key message: "Let's figure out what you're building"
   - Main CTA: "Looks good, continue to requirements"

7. **Requirements Phase** (authenticated)
   - Purpose: Review and confirm feature list
   - Key message: "Here's what we're building"
   - Main CTA: "Confirmed, start design" or "Confirmed, start build"

8. **Design Phase** (authenticated, optional)
   - Purpose: Visual direction and screen specs
   - Key message: "How should it look and feel?"
   - Main CTA: "Design approved, start build"

9. **Build Phase** (authenticated)
   - Purpose: Monitor real-time build progress
   - Key message: "Your crew is building"
   - Main CTA: "Review build" (when complete)

10. **Review Phase** (authenticated)
    - Purpose: Test and verify before deployment
    - Key message: "Making sure it's seaworthy"
    - Main CTA: "Ship it!" or "Needs changes"

11. **Shipped / Success** (authenticated)
    - Purpose: Celebrate completion, provide next steps
    - Key message: "You did it. [App] is live."
    - Main CTA: "See it live" / "Start another voyage"

12. **Settings** (authenticated)
    - Purpose: Manage account, connections, preferences
    - Key message: "Your Ship settings"
    - Main CTA: Context-dependent

13. **Cockpit View** (authenticated)
    - Purpose: Real-time agent monitoring (power users)
    - Key message: "What your crew is doing right now"
    - Main CTA: "Pause" / "Resume" / "Redirect"

### Page Priority

**Must have for MVP:**
- [x] Landing page
- [x] Sign up / Login
- [x] Onboarding: Connect Accounts
- [x] Dashboard
- [x] Project View
- [x] Discovery Phase
- [x] Requirements Phase
- [x] Build Phase
- [x] Review Phase
- [x] Shipped / Success
- [x] Basic Settings (account + API connections)

**Nice to have (can add later):**
- [ ] Design Phase (skip for MVP, use defaults)
- [ ] Cockpit View (CLI users can use terminal)
- [ ] Advanced Settings
- [ ] Team/collaboration features
- [ ] Billing/subscription management

---

## Information Architecture

### Navigation Structure

**Unauthenticated users see:**
```
Landing Page
  ├─ Features (anchor section)
  ├─ How It Works (anchor section)
  ├─ Pricing (anchor or separate page)
  ├─ Login
  └─ Sign Up
```

**Authenticated users see:**
```
Dashboard (home)
  ├─ Projects list
  ├─ New Project button
  └─ Account menu (top right)
      ├─ Settings
      ├─ AI Connections
      └─ Log out

Project View (when project selected)
  ├─ Breadcrumb: Dashboard > [Project Name]
  ├─ Phase tabs: Discovery | Requirements | Design | Build | Review | Ship
  ├─ Sidebar (collapsed by default):
  │   ├─ Files browser
  │   ├─ Activity log
  │   └─ Agent status
  └─ Main content area (phase-specific)

Settings
  ├─ Account (email, password)
  ├─ AI Connections (Claude, Codex)
  ├─ Preferences (theme, notifications)
  └─ Danger Zone (delete account)
```

### Content Hierarchy

**What's most important for users to see first?**
1. **Current project status** — Where am I? What's next?
2. **Next action** — What do I do now?
3. **Agent status** — Is my crew working? Any problems?
4. **Project history** — What happened before?

---

## Feature Requirements

### Must Have (MVP)

**Feature 1:** User Authentication
- **What it does:** Sign up, log in, log out, password reset
- **Why it's essential:** Need accounts to persist projects and API connections
- **How it works:** Email/password auth with optional OAuth (Google, GitHub)
- **Success looks like:** User can create account in <1 minute, stay logged in across sessions

**Feature 2:** AI Account Connection
- **What it does:** Connect Claude (Anthropic) and Codex (OpenAI) accounts
- **Why it's essential:** Ship can't function without AI crew members
- **How it works:** 
  - User enters API key (copy/paste from Anthropic/OpenAI dashboard)
  - Keys are encrypted and stored securely
  - Connection tested on save
  - Visual feedback: "Claude connected ✓" / "Codex connected ✓"
- **Success looks like:** User can connect both accounts in <3 minutes with clear guidance

**Feature 3:** Project Creation
- **What it does:** Start a new project with a name and description
- **Why it's essential:** Core action — everything starts here
- **How it works:**
  - Click "New Project" → Modal with name field (required) + description (optional)
  - Creates project directory structure
  - Opens to Discovery phase
- **Success looks like:** Project created in <30 seconds, user immediately in Discovery

**Feature 4:** Discovery Phase (Chat)
- **What it does:** Guided conversation with Claude to understand the project
- **Why it's essential:** Differentiator — this is where "teaching" happens
- **How it works:**
  - Chat interface with Claude asking questions
  - User responds, Claude synthesizes
  - Generates DISCOVERY.md automatically
  - User can review/edit before proceeding
- **Success looks like:** Clear understanding of project in 10-15 minutes

**Feature 5:** Requirements Phase
- **What it does:** Review and confirm what will be built
- **Why it's essential:** Prevents "that's not what I wanted" syndrome
- **How it works:**
  - List of features extracted from Discovery
  - User can add, remove, reprioritize
  - Mark as "MVP" or "Later"
  - Generates REQUIREMENTS.md
- **Success looks like:** User confident in what will be built

**Feature 6:** Build Phase (Monitored)
- **What it does:** Orchestrate Claude + Codex to build the project
- **Why it's essential:** This is the actual building
- **How it works:**
  - Calls backend orchestration layer
  - Shows real-time progress: "Claude is planning..." / "Codex is coding..."
  - User can see what's happening without overwhelm
  - Handles errors gracefully with explanations
- **Success looks like:** User watches their app get built, understands progress

**Feature 7:** Review Phase
- **What it does:** Test and verify the built project
- **Why it's essential:** Quality gate before deployment
- **How it works:**
  - Preview of built app (iframe or new tab)
  - Checklist from requirements
  - Automated test results
  - "Approve" or "Request Changes"
- **Success looks like:** User confident app works as expected

**Feature 8:** Deployment (Ship It)
- **What it does:** Deploy app to production
- **Why it's essential:** The goal — shipping real software
- **How it works:**
  - Integration with Vercel/Netlify/similar
  - One-click deploy
  - Returns live URL
  - Celebration moment
- **Success looks like:** User's app is live on the internet

**Feature 9:** Dashboard
- **What it does:** Show all projects with status
- **Why it's essential:** Hub for managing multiple projects
- **How it works:**
  - Card grid of projects
  - Status indicators
  - Click to open project
  - Sort/filter options
- **Success looks like:** User can manage 10+ projects without confusion

**Feature 10:** Settings (API Connections)
- **What it does:** Manage Claude and Codex connections
- **Why it's essential:** Users need to update/change API keys
- **How it works:**
  - View current connection status
  - Add/remove/update API keys
  - Test connection
  - View usage (if API supports)
- **Success looks like:** User can troubleshoot connection issues

### Nice to Have (Post-MVP)

**Feature:** Design Phase
- **What it does:** Visual direction and screen specifications
- **Why it's lower priority:** Can use defaults for MVP; manual design is time-consuming

**Feature:** Cockpit View
- **What it does:** Real-time tmux-style agent monitoring
- **Why it's lower priority:** Power users can use CLI; web-based is complex

**Feature:** Team Collaboration
- **What it does:** Multiple users on one project
- **Why it's lower priority:** MVP is single-user; teams add complexity

**Feature:** Project Templates
- **What it does:** Start from pre-built project types
- **Why it's lower priority:** Generic start is fine for MVP

---

## User Interface Specifications

### Design Principles

**Our app should feel:**
- [x] Professional and polished
- [x] Technical and precise
- [x] Minimal and clean
- [ ] Friendly and approachable (secondary)
- [ ] Playful and fun (sparingly, via nautical touches)
- [ ] Rich and feature-full (later)

**Design priorities (rank 1-5):**
- Speed/Performance: **2** (fast is essential)
- Visual polish: **3** (quality matters)
- Ease of use: **1** (primary goal)
- Feature completeness: **4** (MVP first)
- Mobile experience: **5** (desktop-first)

### Visual Style

**Color palette emotional goal:**
Dark and sophisticated. "Quiet Harbor" — the confidence of a seasoned captain who doesn't need to prove anything. Warm amber accents prevent coldness.

**Typography feel:**
Modern warmth meets technical precision. Serif for headlines (craft, wisdom), sans-serif for UI (clarity), mono for code (authenticity).

**Overall aesthetic:**
Premium. Confident. Forward-moving.

### Design Tokens

**Colors:**
- **Primary brand color (Beacon Amber):** 
  - Hex: #f59e0b
  - When to use: CTAs, active states, focus rings, links, key moments
  - When NOT to use: Large areas, error states, backgrounds

- **Background color:**
  - Hex: #0f172a (Deep Navy)
  - Dark theme native

- **Text colors:**
  - Primary text: #f8fafc (Warm White)
  - Secondary text: #94a3b8 (Slate 400)
  - Disabled text: #475569 (Slate 600)

- **Surface colors:**
  - Card background: #1e293b (Slate 800)
  - Elevated surface: #334155 (Slate 700)
  - Border: #334155 (Slate 700)

- **Semantic colors:**
  - Success: #22c55e (Green 500) — "Smooth sailing"
  - Error: #ef4444 (Red 500) — "Rough seas"
  - Warning: #eab308 (Yellow 500)
  - Info: #60a5fa (Blue 400)

**Typography:**
- **Display/Heading font:** Fraunces
  - Where used: Hero headlines, celebration moments, brand moments
  - Weights needed: 400, 600, 700

- **Body/UI font:** Inter
  - Where used: All UI text, body copy, buttons, labels
  - Weights needed: 400, 500, 600

- **Monospace font:** JetBrains Mono
  - Where used: Code blocks, logs, technical output

**Spacing scale:**
- Base unit: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96

**Component sizing:**
- Small: 32px (compact buttons, inputs)
- Medium: 40px (default buttons, inputs)
- Large: 48px (prominent buttons)

---

## Component Behavior Specifications

### Login Form

**Purpose:** Authenticate existing users

**Location:** /login page

**UI Elements:**
- Email input field
- Password input field
- "Log in" button (primary)
- "Forgot password?" link
- "Don't have an account? Sign up" link
- Error message area

**Visual States:**
- **Default:** Empty fields, button enabled
- **Hover:** Button brightens slightly
- **Focus:** Amber ring on focused field
- **Active/Pressed:** Button darkens
- **Loading:** Button shows spinner, fields disabled
- **Success:** Redirect to dashboard
- **Error:** Red border on invalid field, error message shown
- **Disabled:** Gray button when fields empty

**User Interactions:**

**Action: User clicks "Log in" button**
- Immediately: Button shows loading spinner, fields disabled
- After loading: Validate credentials on server
- If success: Redirect to /dashboard
- If failure: Show error message, re-enable form
- User ends up: Dashboard (success) or same page with error (failure)

**Action: User types in email field**
- Validation: Basic email format check on blur
- When shown: After user leaves field
- Can continue: Yes
- Focus: Stays in field during typing

**Action: User submits form**
- Validation: Both fields required, email format valid
- Success: Redirect to dashboard
- Error: Show specific error ("Invalid email or password")
- Form data: Cleared on success, preserved on error

**Edge Cases & Error Handling:**

**What if user:**
- Enters invalid email format?
  - Show "Please enter a valid email" below field on blur
- Enters wrong password?
  - Show "Invalid email or password" (generic for security)
- Loses internet connection?
  - Show "Can't connect. Check your internet and try again."
- Clicks submit twice?
  - Button disabled during loading, ignore second click
- Navigates away mid-login?
  - Login cancelled, no side effects

**Error Messages:**
- Empty email: "Email is required"
- Invalid email: "Please enter a valid email address"
- Empty password: "Password is required"
- Wrong credentials: "Invalid email or password"
- Server error: "Something went wrong. Please try again."
- Network error: "Can't connect. Check your internet and try again."

**Accessibility:**
- Keyboard navigation: Tab through fields, Enter to submit
- Screen reader: Labels announce field purpose, errors announced
- Focus indicators: Amber ring visible

---

### API Connection Card (Claude/Codex)

**Purpose:** Connect and manage AI service accounts

**Location:** Settings > AI Connections, Onboarding flow

**UI Elements:**
- Card container
- Service icon (Claude or Codex logo)
- Service name ("Claude" / "Codex")
- Role description ("First Mate - Navigation & Planning" / "Engineer - Building & Execution")
- Status indicator (dot: green/gray/red)
- Status text ("Connected" / "Not connected" / "Error")
- Action button ("Connect" / "Disconnect" / "Reconnect")
- Connected email/identifier (when connected)

**Visual States:**
- **Default (Not Connected):** Gray border, gray status dot, "Connect" button
- **Connected:** Green border glow, green dot, shows account info, "Disconnect" button
- **Error:** Red border, red dot, error message, "Reconnect" button
- **Loading:** Pulsing animation, "Connecting..." text
- **Hover:** Slight elevation on card

**User Interactions:**

**Action: User clicks "Connect" button**
- Immediately: Opens modal with API key input
- Modal contains: Input field, "Get API key" link, "Connect" button
- After entering key: Validates with service
- If success: Card updates to Connected state
- If failure: Shows error in modal
- User ends up: Connected state or retry

**Action: User clicks "Disconnect" button**
- Immediately: Confirmation modal "Are you sure? You'll need to reconnect to use [Service]"
- If confirmed: Key deleted, card returns to Not Connected
- If cancelled: No change

**Error Messages:**
- Invalid key: "This API key doesn't appear to be valid. Please check and try again."
- Expired key: "This API key has expired. Please generate a new one."
- Rate limited: "Too many attempts. Please wait a few minutes."
- Network error: "Couldn't reach [Service]. Check your internet connection."

**Accessibility:**
- Keyboard: Tab to buttons, Enter to activate
- Screen reader: "Claude connection status: Connected" / "Connect Claude button"

---

### Project Card (Dashboard)

**Purpose:** Show project status at a glance, click to open

**Location:** Dashboard grid

**UI Elements:**
- Card container
- Project name (truncated if long)
- Project description (optional, 1 line max)
- Status indicator with label
- Current phase badge
- Last activity timestamp
- Click target (entire card)

**Visual States:**
- **Default:** Standard card styling
- **Hover:** Slight elevation, border brightens
- **Active Status:** Based on project state:
  - 🟢 "Live" — Green dot, project deployed
  - 🟡 "In Progress" — Amber dot, actively building
  - ⚪ "Paused" — Gray dot, user paused
  - 🔴 "Needs Attention" — Red dot, error or blocker
- **Empty state (no projects):** "No projects yet" with CTA

**User Interactions:**

**Action: User clicks card**
- Immediately: Navigate to /project/[id]
- What user sees: Project view for that project

**Action: User hovers card**
- Card elevates slightly
- Border becomes more visible

---

### Discovery Chat Interface

**Purpose:** Guided conversation to understand what user is building

**Location:** Discovery phase of project

**UI Elements:**
- Chat message list (scrollable)
- Agent messages (left-aligned, with Claude avatar)
- User messages (right-aligned)
- Text input area
- Send button
- "Claude is typing..." indicator
- Progress indicator (e.g., "3 of 5 questions")
- "Done with discovery" button (appears after minimum questions)

**Visual States:**
- **Default:** Input enabled, waiting for user
- **Claude typing:** "Claude is typing..." animation
- **User typing:** Normal input behavior
- **Loading:** After send, before response
- **Complete:** "Done" button appears prominently

**User Interactions:**

**Action: User types message and clicks send**
- Immediately: User message appears in chat, input clears
- Then: "Claude is typing..." appears
- After 1-5 seconds: Claude response appears
- Next: Input re-focuses for next message

**Action: User clicks "Done with discovery"**
- Immediately: Confirmation if minimum questions not answered
- If confirmed or minimum met: Generate DISCOVERY.md, show summary, CTA to Requirements

**Error Messages:**
- Network error: "Couldn't send message. Please try again."
- Claude error: "Claude is having trouble. Give it a moment and try again."

---

### Build Progress View

**Purpose:** Show real-time build status without overwhelming user

**Location:** Build phase of project

**UI Elements:**
- Overall progress bar with percentage
- Current step label ("Claude is planning the architecture...")
- Step timeline (collapsed by default):
  - ✓ Completed steps (green check)
  - ⟳ Current step (amber, animated)
  - ○ Upcoming steps (gray)
- "View details" toggle for verbose logs
- Agent status indicators (Claude: planning | Codex: building)
- "Pause" / "Resume" buttons
- Error state with "What happened?" explanation

**Visual States:**
- **Building:** Progress bar animating, current step shown
- **Paused:** Progress bar static, "Paused" badge, "Resume" button
- **Error:** Red state, error message, "Try again" / "Get help" buttons
- **Complete:** Green checkmark, "Review your build" CTA

**User Interactions:**

**Action: User clicks "Pause"**
- Immediately: Agents stop, state saved
- What user sees: "Build paused. Your crew will pick up where they left off."
- Resume: Continues from last checkpoint

**Action: User clicks "View details"**
- Expands log panel showing verbose output
- Can collapse again

**Error Messages:**
- Build error: "Rough seas: [specific error]. Here's what happened and what you can do."
- Network lost: "Lost connection to your crew. Reconnecting..."

---

## Data & State Management

### What data does the app store?

**User data:**
- Email: Stored in database, validated on signup
- Password: Hashed with bcrypt, salted, never stored plain
- Profile info: Name (optional), created_at, last_login

**API Credentials (sensitive):**
- Claude API key: Encrypted at rest (AES-256), associated with user
- Codex API key: Encrypted at rest (AES-256), associated with user
- Storage: Database with encryption, never in logs or client

**Application data:**
- Projects: name, description, current_phase, created_at, updated_at, status
- Project files: DISCOVERY.md, REQUIREMENTS.md, etc. (stored in file system or object storage)
- Build logs: Stored per project, can be large
- Chat history: Stored per project/phase

**Session data:**
- How long: 30 days (remember me) or session (no remember me)
- What triggers logout: Manual logout, password change, 30 days inactivity
- Multi-device: Allowed, each device has own session

### State that needs to persist:
- [x] User authentication
- [x] API key connections
- [x] Project data and progress
- [x] Current phase in each project
- [x] Chat history

### State that's temporary:
- [x] Form inputs (until submit)
- [x] UI state (modals open, accordions expanded)
- [x] Real-time build logs (persisted after completion)

---

## Authentication & Security

### Authentication method:
- [x] Email/Password (primary)
- [x] OAuth: Google, GitHub (secondary)

### Session management:
- Token type: HTTP-only cookie with JWT
- Storage location: HTTP-only, Secure, SameSite cookie
- Expiration: 30 days
- Refresh strategy: Silent refresh before expiration

### Password requirements:
- Minimum length: 8 characters
- Required characters: None required, but strength indicator shown
- Validation timing: On blur and submit

### Protected routes:
- `/dashboard` — User's project list
- `/project/*` — All project pages
- `/settings` — User settings
- `/onboarding/*` — Onboarding flow

### Redirect behavior:
- After login → `/dashboard` (or `/onboarding/connect` if first login)
- After logout → `/`
- If accessing protected route while logged out → `/login?redirect=[original]`
- After signup → `/onboarding/connect`

---

## API & Backend Integration

### Do we have a backend?
- [x] Yes, we're building it

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Ship Web App                             │
│                     (Next.js Frontend)                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Ship API Server                           │
│                        (Node.js/Bun)                            │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Auth Service │  │ Project Svc  │  │ Orchestration Engine │  │
│  │              │  │              │  │                      │  │
│  │ - Login      │  │ - CRUD       │  │ - Claude API calls   │  │
│  │ - Signup     │  │ - Phases     │  │ - Codex API calls    │  │
│  │ - Sessions   │  │ - Files      │  │ - State machine      │  │
│  └──────────────┘  └──────────────┘  │ - Queue management   │  │
│                                       └──────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
           ▼                 ▼                 ▼
    ┌────────────┐    ┌────────────┐    ┌────────────┐
    │  Database  │    │   Claude   │    │   Codex    │
    │ (Postgres) │    │    API     │    │    API     │
    │            │    │ (Anthropic)│    │  (OpenAI)  │
    │ - Users    │    │            │    │            │
    │ - Projects │    │ Uses user's│    │ Uses user's│
    │ - Sessions │    │  API key   │    │  API key   │
    └────────────┘    └────────────┘    └────────────┘
```

### Key Backend Abstractions

**1. Orchestration Engine**
- Manages the Claude + Codex workflow
- Maintains state machine for build phases
- Queues and executes AI tasks
- Handles retries and error recovery
- Uses USER's API keys (we don't pay for AI calls)

**2. Credential Vault**
- Securely stores encrypted API keys
- Retrieves and decrypts on-demand for AI calls
- Never logs or exposes keys
- Supports key rotation

**3. Real-time Communication**
- WebSocket connection for build progress
- Server-Sent Events as fallback
- Broadcasts: phase changes, log updates, completions, errors

### API endpoints needed:

**Auth:**
- `POST /api/auth/signup` — Create account
- `POST /api/auth/login` — Log in
- `POST /api/auth/logout` — Log out
- `POST /api/auth/forgot-password` — Request reset
- `POST /api/auth/reset-password` — Complete reset
- `GET /api/auth/me` — Get current user

**Connections:**
- `GET /api/connections` — List connected services
- `POST /api/connections/claude` — Save Claude API key
- `POST /api/connections/codex` — Save Codex API key
- `DELETE /api/connections/:service` — Remove connection
- `POST /api/connections/:service/test` — Test connection

**Projects:**
- `GET /api/projects` — List user's projects
- `POST /api/projects` — Create project
- `GET /api/projects/:id` — Get project details
- `PATCH /api/projects/:id` — Update project
- `DELETE /api/projects/:id` — Delete project

**Phases:**
- `POST /api/projects/:id/discovery/message` — Send discovery message
- `POST /api/projects/:id/discovery/complete` — Complete discovery
- `GET /api/projects/:id/requirements` — Get requirements
- `PATCH /api/projects/:id/requirements` — Update requirements
- `POST /api/projects/:id/build/start` — Start build
- `POST /api/projects/:id/build/pause` — Pause build
- `POST /api/projects/:id/build/resume` — Resume build
- `POST /api/projects/:id/deploy` — Deploy to production

**Real-time:**
- `WS /api/projects/:id/stream` — WebSocket for build updates

### Third-party integrations:
- [x] Anthropic Claude API — AI planning/navigation
- [x] OpenAI Codex API — AI code generation
- [ ] Vercel/Netlify — Deployment (v1)
- [ ] Supabase — Database option
- [ ] Stripe — Payments (post-MVP)

---

## Performance & Technical Constraints

### Performance targets:
- Page load: < 2 seconds
- Time to interactive: < 3 seconds
- Lighthouse score: > 80
- Build status updates: < 500ms latency

### Browser support:
- [x] Chrome (last 2 versions)
- [x] Firefox (last 2 versions)
- [x] Safari (last 2 versions)
- [x] Edge (last 2 versions)
- [ ] Mobile Safari (not MVP)
- [ ] Chrome Android (not MVP)
- [ ] IE11 — No

### Device support:
- Desktop: 1024px minimum width
- Tablet: 768px+ (functional, not optimized)
- Mobile: Out of scope for MVP

### Accessibility requirements:
- WCAG level: AA
- Keyboard navigation: Required for all interactive elements
- Screen reader: VoiceOver, NVDA tested
- Color contrast: 4.5:1 for text, 3:1 for UI components

### Technology constraints:
- Framework: Next.js 14+ with App Router
- Styling: Tailwind CSS
- State: React Query + Zustand
- Allowed dependencies: Radix UI, Framer Motion, Socket.io
- Bundle size limit: < 300KB initial JS
- Hosting platform: Vercel (primary), self-hosted option

---

## Content Strategy

### Tone of voice:
- [x] Friendly and conversational
- [x] Technical and precise (when needed)
- [ ] Professional and formal (too stiff)
- [ ] Playful and casual (sparingly)

**Example sentence in our voice:**
"Rough seas here — let's look at what's going on. This error means [explanation]. Here's what you can do."

### Copy for key moments:

**Landing page headline:**
"Your agents. Your rules. Ship faster."

**Landing page subheadline:**
"Ship guides you from idea to deployed app — while teaching you how it works. AI does the building. You stay captain."

**Primary CTA text:**
"Start your first voyage"

**Empty states:**
- No projects yet: "Your harbor is empty. Every great voyage starts with an idea. What will you build?"
- No search results: "No projects match that search."
- Error occurred: "Something went wrong. Let's figure out what happened."

**Success messages:**
- Logged in: "Welcome back, Captain."
- Project created: "Your voyage begins. Let's discover what you're building."
- Build complete: "Your crew finished building. Time to review."
- Deployed: "You did it. [App Name] is live."

**Error messages:**
- Network error: "Lost connection. Check your internet and we'll try again."
- Validation error: "Hmm, that doesn't look right. [Specific issue]."
- Build error: "Rough seas. Here's what happened: [error]. Let's fix it."
- Permission denied: "You don't have access to that. Need to log in?"

---

## Open Questions & Decisions Needed

**Questions that need answers before building:**

1. **Deployment platform for user apps?**
   - Options: Vercel, Netlify, Railway, self-managed
   - Decision needed by: Before Build phase implementation
   - Impacts: Deployment integration, user experience

2. **Pricing model?**
   - Options: Free forever (users pay AI costs), freemium, subscription
   - Decision needed by: Before launch
   - Impacts: Feature gating, onboarding flow

3. **Self-hosted vs. cloud only?**
   - Options: Cloud SaaS only, Electron app, Docker self-host
   - Decision needed by: Before architecture finalization
   - Impacts: Backend architecture, user data storage

**Assumptions we're making:**
- Users have (or will get) their own Claude and Codex API accounts
- Users are building web apps primarily (not mobile, desktop, CLI)
- Single-user projects for MVP (no collaboration)
- Users have reliable internet during build process

---

## Out of Scope (For Now)

**Features we explicitly are NOT building:**

- **Mobile app** — Desktop-first, mobile later
- **Real-time collaboration** — Single-user MVP
- **Design Phase UI builder** — Use defaults, manual design later
- **Custom domain setup** — Users can configure manually post-deploy
- **Template marketplace** — Start from scratch for now
- **Team features** — Single-user projects only
- **White-label / API** — Direct use only
- **Mobile app generation** — Web apps only for MVP
- **CI/CD pipeline management** — Simple deploy only

**This prevents scope creep and keeps focus on MVP.**

---

## Success Metrics

### How do we know this is working?

**Qualitative measures:**
- User can complete first project from idea to deployed app without getting stuck
- User can articulate what their app does and roughly how it works
- User feedback indicates they felt "in control" not "confused"
- Users return to build second project

**Quantitative measures:**
- 60%+ of users who start Discovery complete it
- 40%+ of users who start Build reach Deploy
- Average time to first deploy: < 2 hours
- 30%+ of users start second project within 7 days

---

## Design Review Checklist

Before marking design as "complete" and ready for implementation:

- [x] Product vision is clear (can explain in 1 sentence)
- [x] Primary user persona defined with real pain points
- [x] All user flows documented step-by-step
- [x] Every page/screen listed with purpose
- [x] All MVP features defined with success criteria
- [x] Core interactive components have behavior spec
- [x] Key UI states documented (loading, error, success, empty)
- [x] Error messages written for every scenario
- [ ] Mobile behavior defined for all components (out of scope)
- [x] Authentication flow completely specified
- [x] API endpoints documented
- [x] Performance targets set
- [x] Browser/device support defined
- [x] No open questions remaining (or explicitly deferred)
- [x] Out-of-scope items listed to prevent scope creep
- [x] Success metrics defined

**READY FOR IMPLEMENTATION.**

---

## Change Log

- 2026-01-11: Initial comprehensive design document created
- [Date]: [What changed]