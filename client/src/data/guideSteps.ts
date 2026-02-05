import { GuideStep, GuidePhase } from '@/context/GuideContext';

export const guideSteps: GuideStep[] = [
  // ============================================
  // PHASE 1: MORNING CHECK-IN
  // ============================================
  {
    id: '1.1',
    phase: 'checkin',
    title: "Good Morning! Let's Start Your Day",
    content: `Welcome to FlipIQ Command! I'm your guide, and I'll walk you through your daily workflow step by step.

Every day starts with a quick check-in so I know how to help you.

**YOUR DEAL COUNTS TODAY:**
- High Priority: 10 deals (closest to closing)
- Medium Priority: 2 deals (need nurturing)
- Low Priority: 6 deals (long-term follow-up)
- New Deals: 194 deals (unreviewed)

**HOW MUCH TIME DO YOU HAVE?**

Click one of the options below to get started, or click "Deal Review" in the sidebar to jump right in.`,
    trigger: {
      type: 'manual',
    },
    highlightSelector: '[data-testid="link-deal-review"]',
    action: 'click-deal-review',
  },

  // ============================================
  // PHASE 2: DEAL REVIEW
  // ============================================
  {
    id: '2.1',
    phase: 'dealreview',
    title: 'Deal Review - Understanding Your Dashboard',
    content: `You're now in **DEAL REVIEW**. This is where you manage your active pipeline.

**WHAT YOU'RE LOOKING AT:**
The counter "0 / 215" means:
- 0 = Deals you've reviewed today
- 215 = Total deals in your pipeline

**WHY THIS MATTERS:**
You MUST review active deals before chasing new ones because:
1. These deals are closest to closing
2. Missing a follow-up can kill a deal
3. Your pipeline = your paycheck

**WHAT TO DO NEXT:**
Look at the **PRIORITY TABS** at the top:
High | Medium | Low | New

Click the **"High Priority"** tab to start.
(Always work High Priority FIRST)`,
    trigger: {
      type: 'route-change',
      targetRoute: '/',
    },
    highlightSelector: '[data-priority="high"]',
    action: 'view-dashboard',
  },
  {
    id: '2.2',
    phase: 'dealreview',
    title: 'Deal Review - Priority Categories',
    content: `**PRIORITY WORK ORDER:**

**HIGH PRIORITY (Work FIRST)**
- These deals have the highest chance of closing
- Agent is responsive, negotiations are active
- Missing these = leaving money on the table

**MEDIUM PRIORITY (Work SECOND)**
- Good potential but needs nurturing
- Agent engaged but not urgent
- Consistent follow-up moves these to High

**LOW PRIORITY (Work THIRD)**
- Lower probability deals
- Agent unresponsive or wide price gap
- Don't spend too much time here

**NEW DEALS (Work LAST)**
- Unassigned priority
- You'll categorize these as you review
- Only work these AFTER clearing priorities

**WHY THIS ORDER:**
The closer a deal is to closing, the more valuable your time.
A 5-minute call on a High Priority deal is worth more than 30 minutes on a New Deal.

**WHAT TO DO NEXT:**
Look at your first **DEAL CARD**
I'll explain what each part means.`,
    trigger: {
      type: 'tab-click',
      targetTab: 'high',
    },
    highlightSelector: '.deal-card:first-child',
    action: 'select-priority',
  },
  {
    id: '2.3',
    phase: 'dealreview',
    title: 'Deal Review - Reading a Deal Card',
    content: `**ANATOMY OF A DEAL CARD:**

Each deal card shows you:
- **Priority Badge** - High/Medium/Low/New
- **Property Address** - Where the deal is
- **Basic Details** - Beds, baths, sqft
- **List Price** - Current asking price
- **PTFV** - Your profit potential (lower = better)
- **Propensity Score** - Seller motivation (higher = better)
- **Distress Signals** - Why they might sell (NOD, Tax Default)
- **DOM** - Days on Market (aged = motivated)
- **Agent** - Who to call
- **Offer Status** - Where you are in the process
- **Next Steps** - Your action items

**KEY NUMBERS TO KNOW:**
- **PTFV** (Price-to-Future-Value): Lower = Better deal
  72% means you're buying at 72% of what it's worth fixed up

- **Propensity Score**: Higher = More motivated seller
  85+ is "hot" - multiple distress signals present

**WHAT TO DO NEXT:**
**CLICK** on a deal card to open the full Property IQ view.
I'll show you what to do inside.`,
    trigger: {
      type: 'manual',
    },
    highlightSelector: '.deal-card',
    action: 'click-deal-card',
  },
  {
    id: '2.4',
    phase: 'dealreview',
    title: 'Property IQ - Your Analysis Hub',
    content: `You're now in **PROPERTY IQ (PIQ)** - your complete deal analysis screen.

**THE 5 TABS:**

**PIQ (Property Details)**
What: Property info, photos, history
Why: Verify the basics match reality

**COMPS**
What: Similar sold properties
Why: Validate your ARV (After Repair Value)

**NOTES**
What: Your notes and conversation history
Why: Track all communication

**AGENT**
What: Listing agent profile & history
Why: Understand who you're negotiating with

**iQ ANALYSIS**
What: AI-powered insights and recommendations
Why: Get smart suggestions

**YOUR DAILY WORKFLOW IN PIQ:**
1. Review what's changed since last look
2. Check if you need to take action
3. Update offer status if needed
4. Set next follow-up date
5. Move to next deal

**WHAT TO DO NEXT:**
Look at the **Offer Status** dropdown.
I'll show you how to update your progress.`,
    trigger: {
      type: 'route-change',
      targetRoute: '/piq',
    },
    highlightSelector: '[data-testid="offer-status"]',
    action: 'open-piq',
  },
  {
    id: '2.5',
    phase: 'dealreview',
    title: 'Offer Terms - Tracking Your Progress',
    content: `**OFFER STATUS PROGRESSION:**

Your offer moves through these stages:

**0% - NONE** - No contact yet
**10% - INITIAL CONTACT** - First conversation
**20% - CONTINUE FOLLOW** - Agent engaged, nurturing
**30% - BACK UP** - In backup position
**40% - TERMS SENT** - Offer submitted
**60% - NEGOTIATIONS** - Back and forth active
**70% - CONTRACT SUBMITTED** - Under contract
**80% - OFFER ACCEPTED** - Deal secured
**100% - ACQUIRED** - CLOSED!

**HOW TO UPDATE:**
1. Click the "Offer Status" dropdown
2. Select the stage that matches reality
3. Add notes about what happened
4. Set your next follow-up date

**WHEN TO UPDATE:**
- After EVERY meaningful conversation
- When offer terms change
- When status changes (accepted, rejected, countered)

**WHY THIS MATTERS:**
Accurate status = Accurate priorities
The system uses this to sort your Deal Review

**WHAT TO DO NEXT:**
Update the status if needed, then go back to Deal Review to continue with other deals.`,
    trigger: {
      type: 'click',
      targetSelector: '[data-testid="offer-status"]',
    },
    highlightSelector: '[data-testid="offer-status"]',
    action: 'update-status',
  },
  {
    id: '2.6',
    phase: 'dealreview',
    title: 'Deal Review - Great Progress!',
    content: `**EXCELLENT WORK!**

You've learned how to navigate Deal Review.

**DEAL REVIEW CHECKLIST:**
- High Priority deals reviewed
- Offer statuses updated
- Follow-ups scheduled
- Ready for outreach

**WHAT HAPPENS NEXT:**
Now that you've worked your active pipeline, it's time to **BUILD NEW RELATIONSHIPS** through Daily Outreach.

This is where you:
- Maintain existing agent relationships
- Call priority agents
- Connect with new agents using properties as entry points

**DAILY OUTREACH has 3 sections:**
1. **Campaigns** - Mass outreach to known agents
2. **Priority Calls** - Phone calls to top producers
3. **New Relationships** - Property-based introductions

**WHAT TO DO NEXT:**
Click **"Daily Outreach"** in the left sidebar.
(Third item under TODAY'S PLAN)`,
    trigger: {
      type: 'manual',
    },
    highlightSelector: '[data-testid="link-daily-outreach"]',
    action: 'go-to-outreach',
  },

  // ============================================
  // PHASE 3: DAILY OUTREACH
  // ============================================
  {
    id: '3.1',
    phase: 'outreach',
    title: 'Daily Outreach - Building Relationships',
    content: `Welcome to **DAILY OUTREACH**!

This is where you build the agent relationships that send you deals BEFORE they hit the market.

**YOUR DAILY TARGET: 30 Conversations**
Not 30 calls. Not 30 dials. 30 CONVERSATIONS.
A conversation = actual engagement with an agent.

**THE 3 SECTIONS:**

**CAMPAIGNS (Relationship Maintenance)**
Who: Hot, Warm, Cold agents you already know
How: Text, Email, Voicemail drops
Why: Stay top of mind so they call YOU first

**PRIORITY AGENT CALLS (High-Value Relationships)**
Who: Top-producing, investor-friendly agents
How: PHONE CALLS ONLY (not texts)
Why: These agents can send you multiple deals

**NEW RELATIONSHIPS (Deal-Driven Entry)**
Who: New agents you haven't worked with
How: Property as conversation starter
Why: Expand your network strategically

**WORK ORDER:**
Start with what's fastest (Campaigns), then highest value (Priority Calls), then growth (New Relationships).

**WHAT TO DO NEXT:**
Look at the **Action Plan** at the top to see your daily targets.`,
    trigger: {
      type: 'route-change',
      targetRoute: '/daily-outreach',
    },
    highlightSelector: '[data-testid="outreach-action-plan"]',
    action: 'view-outreach',
  },
  {
    id: '3.2',
    phase: 'outreach',
    title: 'Daily Outreach - Campaigns',
    content: `**CAMPAIGNS = Staying Top of Mind**

You're messaging agents you ALREADY know to stay on their radar.

**WHY THIS WORKS:**
When an agent trips over a deal and doesn't have a strong buyer relationship, you want to be the squeaky wheel they remember.

**STEP 1: SELECT YOUR AUDIENCE**
Choose one or more groups:
- High Priority Agents (closest relationships)
- Medium Priority Agents (building relationships)
- Low Priority Agents (early stage)

**STEP 2: CHOOSE MESSAGE TYPE**
- SMS Text - Quick, personal touch
- Email - Market updates, listings
- Voicemail Drop - Pre-recorded message

**STEP 3: SELECT OR CREATE MESSAGE**
Use a template or customize your own.
Examples: "Market Update Q4", "Just Sold in Area"

**WHAT TO DO NEXT:**
Scroll down to see the **Priority Agent Calls** section.
These are your highest-value conversations.`,
    trigger: {
      type: 'manual',
    },
    highlightSelector: '[data-testid="campaigns-section"]',
    action: 'view-campaigns',
  },
  {
    id: '3.3',
    phase: 'outreach',
    title: 'Daily Outreach - Priority Agent Calls',
    content: `**PRIORITY CALLS = Your Highest Value Activity**

These are investor-friendly, high-volume agents.
Your goal: Build the relationship so they send YOU deals first.

**PHONE CALLS ONLY**
Do NOT text or email Priority Agents.
Relationships at this level require voice communication.

**AGENT CARD BREAKDOWN:**
- Name & Contact Info
- Active In Last 2 Years: X deals
- Average Deals/Year: X
- Investor Source Count: X (deals from investors)
- Last Closing: Date (Recent = Hungry)
- Lenders Used: List (Shows investor experience)

**HOW TO WORK THE CALL:**
1. Click "Call Agent" button
2. Reference a specific property if helpful
3. Focus on RELATIONSHIP, not just this deal
4. Ask: "What are you seeing in the market?"
5. Offer value: "I can close in 14 days with hard money"

**AFTER EACH CALL:**
- Update Agent Status
- Set Reminder for follow-up
- Log notes about conversation

**WHAT TO DO NEXT:**
Continue scrolling to see the **Build New Relationships** section.`,
    trigger: {
      type: 'manual',
    },
    highlightSelector: '[data-testid="priority-agents-section"]',
    action: 'view-priority-calls',
  },
  {
    id: '3.4',
    phase: 'outreach',
    title: 'Daily Outreach - New Relationships',
    content: `**NEW RELATIONSHIPS = Growing Your Network**

The system selects properties with high-propensity sellers and matching agents you haven't worked with yet.

**THE CORE PRINCIPLE:**
Chase the RELATIONSHIP, not just the deal.
Use the property as your entry point, but the goal is to build a connection that sends you future deals.

**CONFIGURATION OPTIONS:**

**Call Framing:**
- Use a property (RECOMMENDED) - Natural conversation starter
- Call without property - Pure relationship focus

**Agent Pool:**
- New agent relationships - Expanding network
- Agents assigned to me - Working existing assignments

**Agent Value Tier:**
- High-Value - Proven investors, highest upside
- Mid-Value - Building experience
- Low-Value (Practice) - Lower risk, build confidence

**TIP FOR NEW ASSOCIATES:**
Start with Low-Value Agents to practice your pitch.
Mistakes are less costly, and you build confidence before tackling High-Value conversations.

**WHAT TO DO NEXT:**
When you're done with outreach, click **"My Stats"** in the sidebar to track your progress.`,
    trigger: {
      type: 'manual',
    },
    highlightSelector: '[data-testid="new-relationships-section"]',
    action: 'view-new-relationships',
  },
  {
    id: '3.5',
    phase: 'outreach',
    title: 'Daily Outreach - Logging Conversations',
    content: `**LOGGING A CONVERSATION**

After each call, it's critical to log the outcome.

**OUTCOME OPTIONS:**
- **Connected** - Had a real conversation
- **Voicemail** - Left a message
- **No Answer** - No response, no voicemail
- **Callback Scheduled** - They'll call back
- **Not Interested** - Clear rejection

**WHAT TO LOG:**
- Outcome type
- Brief notes (what was discussed)
- Next action (follow-up date/task)
- Relationship status change (if any)

**WHY LOGGING MATTERS:**
1. Builds your contact history
2. Triggers smart follow-up reminders
3. Moves agents through priority tiers
4. Tracks your daily conversation count

**YOUR TARGET:**
30 logged conversations per day = Success!

**WHAT TO DO NEXT:**
Click **"My Stats"** in the sidebar to see your performance metrics.`,
    trigger: {
      type: 'manual',
    },
    highlightSelector: '[data-testid="link-my-stats"]',
    action: 'log-conversation',
  },

  // ============================================
  // PHASE 4: MY STATS
  // ============================================
  {
    id: '4.1',
    phase: 'stats',
    title: 'My Stats - Tracking Your Performance',
    content: `**MY STATS = Your Daily Scorecard**

This is where you see if your activities are producing results.

**KEY METRICS:**

**CONVERSATIONS**
Today: X / 30 target
This Week: X / 150 target

**OFFERS SUBMITTED**
Today: X / 3-5 target
This Week: X / 15-25 target

**NEW RELATIONSHIPS**
This Week: X / 5 target
This Month: X / 20 target

**DEALS CLOSED**
This Month: X / 2 target
This Quarter: X / 6 target

**THE MATH:**
30 conversations/day x 5 days = 150/week
150 conversations -> 15-25 offers -> 2-3 accepted -> 2 CLOSED

This is why the daily activities matter!

**WHAT TO DO NEXT:**
Review your numbers, identify any gaps, and adjust tomorrow's focus accordingly.

Click **Continue** to complete the guided tour.`,
    trigger: {
      type: 'route-change',
      targetRoute: '/my-stats',
    },
    highlightSelector: '[data-testid="stats-overview"]',
    action: 'view-stats',
  },

  // ============================================
  // PHASE 5: COMPLETION
  // ============================================
  {
    id: '5.1',
    phase: 'complete',
    title: "Great Work! You've Completed the Guide",
    content: `**CONGRATULATIONS!**

You've completed the FlipIQ Command guided tour.

**HERE'S WHAT YOU LEARNED:**
- Deal Review: Managing your active pipeline
- Priority System: Working deals in the right order
- Property IQ: Analyzing deals and updating status
- Daily Outreach: Building agent relationships
- My Stats: Tracking your performance

**DAILY WORKFLOW SUMMARY:**
1. Morning Check-in with iQ
2. Deal Review (High -> Medium -> Low -> New)
3. Daily Outreach (Campaigns -> Priority Calls -> New Relationships)
4. Check My Stats for progress

**TOGGLE GUIDE:**
You can turn this guide ON or OFF anytime by clicking the guide icon in the sidebar.

- Keep it ON while you're learning
- Turn it OFF once you've got the rhythm

**See you tomorrow!**

The guide will reset each day to walk you through your morning check-in.`,
    trigger: {
      type: 'manual',
    },
    action: 'complete',
  },
];

// Helper function to get phase display name
export function getPhaseDisplayName(phase: GuidePhase): string {
  const names: Record<GuidePhase, string> = {
    checkin: 'Morning Check-in',
    dealreview: 'Deal Review',
    outreach: 'Daily Outreach',
    stats: 'My Stats',
    complete: 'Complete',
  };
  return names[phase];
}

// Helper function to get phase icon
export function getPhaseIcon(phase: GuidePhase): string {
  const icons: Record<GuidePhase, string> = {
    checkin: 'sun',
    dealreview: 'list-todo',
    outreach: 'phone',
    stats: 'bar-chart-2',
    complete: 'check-circle',
  };
  return icons[phase];
}

// Get total steps count
export const totalStepsCount = guideSteps.length;

// Get steps by phase
export function getStepsByPhase(phase: GuidePhase): GuideStep[] {
  return guideSteps.filter(step => step.phase === phase);
}
