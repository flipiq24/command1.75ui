# FlipIQ - Complete Application Documentation

## Executive Summary

FlipIQ is a real estate investment deal management platform designed specifically for **Acquisition Associates (AAs)** at real estate investment companies. The application helps AAs manage property deals, track agent relationships, organize daily outreach activities, and maximize deal acquisition efficiency through AI-powered assistance.

---

## Core User Role: Acquisition Associate (AA)

The primary user is an **Acquisition Associate** whose daily job involves:
- Reviewing property deals assigned to them
- Calling real estate agents to build relationships and acquire deals
- Tracking offer statuses and following up on negotiations
- Meeting daily goals for offers, calls, and conversations

---

## Application Structure

### Tech Stack
- **Frontend**: React + TypeScript, Tailwind CSS, Radix UI components, Wouter routing
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL via Drizzle ORM (Neon serverless)
- **AI**: OpenAI API integration for intelligent assistance
- **State Management**: TanStack Query for server state, React Context for UI state

---

## Main Pages & Features

### 1. iQ Overlay (AI Assistant) - Home Screen Experience

The iQ overlay is the **default home screen** that opens when the user first visits the app each session. It provides:

#### AA1 Check-In Flow (Fully Scripted - No AI)
A structured daily check-in that runs through these questions:
1. **Availability**: "Are you able to work a full day today?"
2. **Help Requests**: "Is there anything you'll need help with today?" (notifies AM if yes)
3. **Blockers**: "Is there anything that might prevent you from getting those calls done today?" (notifies AM if yes)

#### Daily Briefing
After check-in, shows the **Action Plan** with:
- **Critical Calls**: Urgent agent callbacks
- **Reminders**: Scheduled follow-ups
- **Hot/Warm/Cold/New Properties**: Pipeline breakdown
- **Offers showing "None"**: Properties needing initial offers
- **Goals**: Offers out, Agent calls, Conversations targets

#### Navigation Options
After briefing, user can choose:
- **Go to Deal Review**: Navigate to the Deal Review page (hot deals first)
- **Daily Outreach**: Navigate to agent calling page

#### Session States
iQ provides contextual greetings based on:
- **New Day / First Visit**: Full check-in flow
- **Returning After Lunch**: Welcome back with morning progress summary
- **Continuing Session**: Quick check-in ("Is everything going smoothly?")

#### AI-Powered Responses
- Check-in remains **fully scripted** for speed and consistency
- Free-form questions during briefing or deal review use **OpenAI** for intelligent responses

---

### 2. Deal Review Page (Home: `/`)

The main deal management dashboard showing all properties assigned to the AA.

#### Action Plan Component
Visual progress tracker with interactive circles showing:
- **Hot Deals**: High-priority properties (red/orange indicators)
- **Warm Deals**: Medium-priority properties
- **Cold Deals**: Lower-priority properties  
- **New Deals**: Fresh leads needing initial contact

#### Deal Table
Each deal displays:
- **Address & Property Specs**: SFR/MFR, beds, baths, sqft, year built, lot size, pool
- **Price**: Listed or estimated price
- **Propensity Score**: Calculated from indicators (higher = more likely to sell)
- **Source**: MLS or Off Market
- **Status**: None → Initial Contact → Offer Terms Sent → In Negotiations → Offer Accepted → Acquired
- **Status %**: Progress indicator (0% - 100%)
- **Last Opened / Last Called**: Activity tracking dates

#### Propensity Indicators (Motivation Signals)
Properties are scored based on distress/motivation indicators:

**RED (Highest Priority - 6-8 points each)**:
- Notice of Trustee Sale (NTS) - 8 pts
- Notice of Default (NOD) - 6 pts

**ORANGE (High Priority - 4-5 points each)**:
- Divorce - 5 pts
- Probate - 5 pts
- Tax Delinquency - 4 pts
- Bankruptcy/Judgment - 4 pts
- Affidavit of Death - 4 pts

**YELLOW (Medium Priority - 2-3 points each)**:
- Vacant Property - 3 pts
- Involuntary Liens - 3 pts
- High Mortgage/Debt - 3 pts
- Non-Owner Occupied - 2 pts
- Expired Listing - 2 pts

**GREEN (Lower Priority - 1 point each)**:
- Long Term Owner (20+ Yrs) - 1 pt
- Corporate/Trust Owned - 1 pt
- Owns Multiple Properties - 1 pt

#### Status Dropdown
AAs can update deal status with options:
- None (0%)
- Initial Contact Started (10%)
- Continue to Follow (20%)
- Offer Terms Sent (30%)
- Back Up (30%)
- Contract Submitted (50%)
- In Negotiations (60%)
- Offer Accepted (80%)
- Acquired (100%)
- Pass, Cancelled FEC, Sold Others/Closed (0%)

---

### 3. Daily Outreach Page (`/daily-outreach`)

Agent relationship management and calling workflow.

#### Outreach Action Plan Component
Visual progress tracker showing:
- **Connections Made**: Progress toward daily call goal (e.g., 3/30)
- **Priority Agents**: Top relationship agents to contact (e.g., 2/5)
- **Top of Mind**: Check-in calls with key agents (e.g., 0/3)
- **New Relationships**: Building new agent connections (e.g., 1/5)

#### Agent Lists
Segmented by relationship status:

**Priority Agents**: Highest-value relationships, must contact daily
**Hot Agents**: Strong relationships, frequent contact
**Warm Agents**: Established relationships, regular contact
**Cold Agents**: New or dormant relationships, needs nurturing
**Unknown**: New agents not yet categorized

#### Agent Information
Each agent card shows:
- Agent Name & Office
- Phone & Email
- Relationship Status (Priority/Hot/Warm/Cold)
- Basket (Clients/High Value/Low Value)
- Follow-Up Status & Date
- Investor Source Count
- Active in Last 2 Years (Yes/No)
- Pending/Backup/Sold deal counts

#### Outreach Actions
- **Call Button**: Click-to-call functionality
- **Text Button**: Send SMS
- **Email Button**: Send email
- **Log Outcome**: Record call results

---

### 4. Property Intelligence (PIQ) Page (`/piq/:id`)

Deep-dive property analysis page with AI-powered insights.

#### Tabs
- **PIQ**: Main property intelligence view
- **Notes**: User notes and annotations
- **Agent**: Agent information and relationship history
- **Comps**: Comparable properties analysis
- **iQ**: AI-generated property story and analysis

#### Comps Views
- **Map View**: Visual map of comparable properties
- **Matrix View**: Side-by-side comparison grid
- **List View**: Detailed list of comps

#### AI Features
- **Property Story**: AI-generated narrative about the property and seller motivation
- **iQ Analysis**: AI-powered insights on deal potential
- **Comps iQ Report**: AI analysis of comparable properties

---

## Sidebar Navigation

### Today's Plan
- **iQ**: Opens iQ overlay (AI assistant)
- **Deal Review**: Main deal dashboard (`/`)
- **Daily Outreach**: Agent calling page (`/daily-outreach`)

### Pipeline
- **My Deals**: All active properties (chronological view)

### Find Deals
- **MLS Hot Deals**: Latest MLS deals by propensity, keywords, ARV %
- **MLS Search**: Standard MLS filter search
- **Agent Search**: Find investor-friendly agents
- **Campaigns**: Agent marketing campaigns

### Tools
- **My Stats**: Text, call, email, and offer tracking
- **DispoPro**: Deal wholesaling/marketing tool
- **Pro Dashboard**: Advanced analytics

---

## Database Schema

### Deals Table
```typescript
{
  id: number,
  address: string,
  specs: string,           // "SFR / 3 Br / 2 Ba / 1 Gar / 1990 / 1,169 ft²..."
  price: string,           // "$390,000"
  propensity: string[],    // ["Notice of Default (NOD)", "Tax Delinquency"]
  source: string,          // "MLS" or "Off Market"
  mlsStatus: string | null,
  type: 'hot' | 'warm' | 'cold' | 'new',
  status: string,          // "Offer Terms Sent"
  statusPercent: string,   // "30%"
  lastOpen: string,        // "11/26/25"
  lastCalled: string       // "11/21/25"
}
```

### Agents Table
```typescript
{
  id: number,
  agentName: string,
  officeName: string,
  phone: string,
  email: string,
  assignedUser: string,
  relationshipStatus: 'Priority' | 'Hot' | 'Warm' | 'Cold' | 'Unknown',
  basket: 'Clients' | 'High Value' | 'Low Value',
  requiredAction: number,
  followUpStatus: string,
  followUpDate: string,
  investorSourceCount: number | null,
  activeInLastTwoYears: boolean,
  pending: number,
  backup: number,
  sold: number
}
```

---

## API Endpoints

### Deals
- `GET /api/deals` - Fetch all deals
- `GET /api/deals/:id` - Fetch single deal
- `POST /api/deals` - Create new deal
- `PATCH /api/deals/:id` - Update deal
- `DELETE /api/deals/:id` - Delete deal
- `POST /api/deals/bulk-update` - Bulk update multiple deals

### Agents
- `GET /api/agents` - Fetch all agents
- `GET /api/agents/:id` - Fetch single agent
- `POST /api/agents` - Create new agent
- `PATCH /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent

### AI
- `POST /api/ai/chat` - General AI chat response
- `POST /api/ai/analyze-property` - AI property analysis
- `POST /api/ai/property-story` - Generate property narrative
- `POST /api/ai/agent-iq-report` - Generate agent relationship report

---

## Key Workflows

### Daily Workflow for Acquisition Associate

1. **Morning Start**: Open app → iQ overlay appears automatically
2. **Check-In**: Answer availability, help needs, and blocker questions
3. **Review Briefing**: See action plan stats and goals
4. **Choose Focus**: 
   - Deal Review (property-focused work)
   - Daily Outreach (agent relationship calls)
5. **Work Through Day**: Update statuses, log calls, make offers
6. **Return Sessions**: Quick check-in if returning after break

### Deal Progression Flow
```
New → Initial Contact → Offer Terms Sent → In Negotiations → Offer Accepted → Acquired
```

### Agent Relationship Flow
```
Unknown → Cold → Warm → Hot → Priority
```

---

## UI/UX Patterns

### Colors
- **Primary Orange**: #FF6600 (FlipIQ brand color)
- **Hot/Priority**: Red/Orange tones
- **Warm**: Amber/Yellow tones
- **Cold**: Blue tones
- **New**: Gray tones

### Design System
- Uses shadcn/ui (New York variant) components
- Tailwind CSS v4 for styling
- Radix UI primitives for accessibility
- Framer Motion for animations

### Layout
- **Sidebar**: Collapsible navigation (64px collapsed, 256px expanded)
- **Main Content**: Full-width dashboard area
- **iQ Overlay**: Slides in from right, covers main content

---

## Session Management

### Session Storage
- `flipiq_session_started`: Tracks if iQ should auto-open
- `flipiq_last_session`: Timestamp of last session
- `flipiq_morning_checkin`: Date of morning check-in completion

### Behavior
- iQ opens automatically only once per browser session
- Sidebar navigation closes iQ overlay
- Session state determines greeting context

---

## Important Notes for Development

1. **Check-in is scripted**: Never use AI for check-in questions - speed and consistency matter
2. **AI for free-form only**: OpenAI integration is for questions during briefing/review phases
3. **Propensity scoring**: Higher score = more motivated seller = higher priority
4. **Status progression**: Track deals through the acquisition funnel
5. **Agent relationships**: Long-term relationship building is key to deal flow
6. **Daily goals**: AAs have targets for offers, calls, and conversations

---

## File Structure

```
client/
├── src/
│   ├── components/
│   │   ├── Layout.tsx          # Main layout with sidebar + iQ overlay
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   ├── IQOverlay.tsx       # AI assistant overlay
│   │   ├── ActionPlan.tsx      # Deal review progress tracker
│   │   └── OutreachActionPlan.tsx  # Daily outreach progress tracker
│   ├── pages/
│   │   ├── home.tsx            # Deal Review page
│   │   ├── DailyOutreach.tsx   # Agent outreach page
│   │   └── PIQ.tsx             # Property intelligence page
│   └── lib/
│       └── queryClient.ts      # API client utilities

server/
├── routes.ts                   # API endpoints
├── storage.ts                  # Database operations
├── openai.ts                   # AI integration
└── db.ts                       # Database connection

shared/
└── schema.ts                   # Database schema & types
```

---

This documentation should provide complete context for understanding and working with the FlipIQ application.
