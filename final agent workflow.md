# UX Research Agent - Complete Workflow Definition

## Overview
This agent performs web-based UX research gathering and applies the 3-Lens analytical framework to produce structured, actionable research insights without manual copy-pasting between steps.

---

## STEP 1: DEFINE RESEARCH TOPIC & SCOPE
**Purpose:** Establish what product/UX pattern you're researching

**Agent Actions:**
- Accept the research topic as input (e.g., "task management app UX", "onboarding flows", "notification management")
- Define the scope: which user segments, which platforms, which pain points to focus on
- Output a clear research brief that guides all subsequent gathering

**Success Criteria:**
- Research topic is clearly defined
- Scope boundaries are explicit (in/out of scope)
- Research angle is tied to a specific UX problem or user need

---

## STEP 2: GATHER INSIGHTS FROM WEB SOURCES (via MCP Fetch)
**Purpose:** Collect raw insights from multiple web sources without hallucinating

**Agent Actions:**
Use the fetch MCP server to retrieve actual content from:
- **Interview transcripts/articles** — search and fetch published interview summaries (e.g., Product Hunt discussions, Medium articles, User interviews)
- **Podcasts** — fetch podcast transcripts or show notes from UX/product design podcasts (e.g., User Interviews podcast, design-focused shows)
- **Reddit complaints & discussions** — fetch threads from r/design, r/UX_Design, r/webdev discussing pain points in the target UX area
- **Case studies & research reports** — fetch published UX research on similar products/patterns
- **Tweet threads & LinkedIn posts** — fetch public discussions by UX professionals about the pattern you're researching

For each source:
- Record the source URL, type (interview/podcast/Reddit/article), and full retrieved text
- Timestamp when it was fetched
- Note the original author/platform

**MCP Configuration:**
- Use `fetch` MCP server (stdio via `uvx mcp-server-fetch`)
- `allowed_tools`: `mcp__fetch__fetch`, `mcp__fetch__get_url_content`
- Agent can fetch up to 8–10 sources per research topic

**Success Criteria:**
- At least 6–8 relevant sources fetched and stored in memory
- No hallucinated or invented sources — every finding is traceable to a retrieved URL
- Sources cover diverse perspectives (interviews, Reddit, podcasts, articles)

---

## STEP 3: EXTRACT RAW OBSERVATIONS
**Purpose:** Pull out atomic, evidence-backed observations from raw web content

**Agent Actions:**
For each fetched source, extract:
- **Direct quotes** — exact user complaints, pain points, wishes from the source
- **Implied observations** — things users don't say directly but their behavior/language reveals
- **Context** — who said it, when, in what scenario (onboarding? mid-task? switching apps?)
- **Sentiment** — is this a praise, complaint, workaround, or feature request?

Format for each observation:
```
OBSERVATION: [specific, one-sentence observation]
SOURCE: [URL + author/platform]
QUOTE: "[exact quote from source]"
CONTEXT: [when/where/why this observation matters]
SENTIMENT: [praise / complaint / workaround / feature request]
```

Repeat for every distinct observation across all fetched sources.

**Success Criteria:**
- Each observation is tied to a real quote from fetched content
- No synthesized or made-up observations
- Observations are atomic (one idea per observation, not compound)
- Coverage: 20–40 raw observations across all sources

---

## STEP 4: CLUSTER INTO THEMES
**Purpose:** Group related observations into named, evidence-backed themes

**Agent Actions:**
- Read all extracted observations
- Group by similarity (e.g., all onboarding friction → "Onboarding Friction"; all task state confusion → "Task State Visibility")
- For each theme, count:
  - **Frequency** — how many observations mention this issue?
  - **Severity** — do users call it "annoying" (low) or "makes me switch apps" (high)?
  - **Sources** — which source types mentioned it (interviews, Reddit, podcasts)?
- Rank themes by: (frequency × severity)

Format for each theme:
```
THEME: [name, e.g., "Onboarding Friction"]
FREQUENCY: [count of observations in this theme]
SEVERITY: [1–5 scale: 1=minor, 5=critical blocker]
RANK: [overall priority = frequency × severity]
EVIDENCE: [2–3 representative quotes showing this theme]
SOURCES: [which source types contributed: interviews, Reddit, podcasts, etc.]
```

**Success Criteria:**
- Themes are mutually exclusive (no overlap)
- Each theme has 3+ supporting observations
- Ranking is transparent and math-based
- Top 3–5 themes are actionable and UX-specific

---

## STEP 5: APPLY THE 3-LENS FRAMEWORK

### LENS 1: ASSUMPTION EXTRACTION
**Purpose:** Uncover the hidden assumptions baked into the current UX

For each top theme, identify:
- **User Assumptions** — What do users believe about themselves, the product, or the task? (e.g., "I think my task list auto-saves," "I assume drag-and-drop is intuitive")
- **Context Assumptions** — What do users assume about when/where/how they'll use this? (e.g., "I can use this on mobile," "This is for teams")
- **System Assumptions** — What do users assume the product *can* or *cannot* do? (e.g., "The app can't integrate with Slack," "Notifications are mandatory")

Format:
```
THEME: [theme name]

ASSUMPTION 1 (User): [what users wrongly believe about themselves or their needs]
ASSUMPTION 2 (Context): [what users assume about the environment]
ASSUMPTION 3 (System): [what users assume about product capabilities]

EVIDENCE:
- "[quote from observation showing this assumption]"
- "[quote from another source confirming this]"
```

**Success Criteria:**
- Each assumption is grounded in gathered data, not your imagination
- Assumptions explain *why* the theme exists (not just *what* users complain about)
- 2–3 assumptions per top theme

---

### LENS 2: PRIMARY FAILURE MAPPING
**Purpose:** Map out where and why users fail in the current UX

For each theme, create a failure map:

**False Positives** (User tries to do something the UX prevents):
- Action the user *wants* to do: [e.g., "quickly see if a task is in progress"]
- What the UX currently forces: [e.g., "open the task, look at a tiny status label"]
- Why it fails: [e.g., "status isn't visible from list view; high cognitive load"]

**False Negatives** (User doesn't do something the UX should enable):
- Action the UX *tries* to support: [e.g., "bulk delete completed tasks"]
- What users *actually* do instead: [e.g., "manually delete one by one, or ignore them"]
- Why it fails: [e.g., "feature is buried in a menu; users don't know it exists"]

Format:
```
THEME: [theme name]

FALSE POSITIVES (Forced/Prevented):
- Want: [desired action]
- Get: [current UX behavior]
- Why: [reason it fails]

FALSE NEGATIVES (Hidden/Unused):
- UX Tries: [intended feature]
- Users Do: [actual workaround]
- Why: [reason for non-adoption]

IMPACT: [how this failure affects the user experience and retention]
```

**Success Criteria:**
- Each failure is tied to gathered evidence
- Failures are specific to user workflows, not vague
- Impact explains business/user cost of the failure
- 1–2 failure maps per top theme

---

### LENS 3: BEHAVIOUR CHANGE MAPPING
**Purpose:** Define the gap between current behavior and desired behavior, with constraints

For each theme, map:

**Current Behavior:**
- How do users *currently* interact with the product or workaround? [e.g., "User manually checks notification settings 5 times before understanding the override rules"]
- What's the mental model they're using? [e.g., "I think this checkbox means notifications are ON, not that it's a whitelist filter"]
- How often does this happen? [e.g., "on every first use"]

**Desired Behavior:**
- How *should* users interact? [e.g., "User can see in one view: 'On for X projects, Off for Y, Exceptions for Z'"]
- What's the ideal mental model? [e.g., "Notifications are sorted into clear, visual tiers"]
- How would success be measured? [e.g., "First-time users set notifications correctly 90% of the time"]

**Constraints:**
- What real constraints exist? [e.g., "Mobile screen space is limited," "We can't change backend notifications system," "Onboarding flow must load in < 2 sec"]
- Which constraints are hard? [e.g., "Must use iOS native notification framework"]
- Which can be challenged? [e.g., "Could we cut onboarding steps?"]

Format:
```
THEME: [theme name]

CURRENT BEHAVIOR:
- How users act: [current workflow]
- Mental model: [what they're thinking]
- Frequency: [when/how often]

DESIRED BEHAVIOR:
- How users should act: [ideal workflow]
- Ideal mental model: [what they should think]
- Success metric: [how to measure it]

CONSTRAINTS:
- Hard constraints: [cannot change]
- Soft constraints: [could change with effort]
- Opportunities: [where we have flexibility]
```

**Success Criteria:**
- Current behavior is grounded in gathered evidence
- Desired behavior is specific, not vague ("simpler" → "3 steps instead of 7")
- Constraints are realistic and tied to product/platform realities
- Gap is measurable: X → Y with specific metrics
- 1–2 behaviour maps per top theme

---

## STEP 6A: EXTRACT BEHAVIORAL PATTERNS
**Purpose:** Identify recurring patterns in how users interact with products and workarounds

**Agent Actions:**
For each theme, extract:
- **Behavioral Pattern**: What's the repeated, observable action users take? (e.g., "Users open the same task multiple times to check status")
- **Frequency**: How often does this behavior occur? (e.g., "3–5 times per session")
- **Trigger**: What causes this pattern? (e.g., "Lack of visible status indicator")
- **Outcome**: What does the user achieve or fail to achieve? (e.g., "User gets answer but wastes time")
- **Workaround**: What do users do instead if blocked? (e.g., "Use a separate note-taking app to track task state")

Format:
```
BEHAVIORAL PATTERN: [pattern name, e.g., "Status Checking Loop"]
FREQUENCY: [how often this happens]
TRIGGER: [what causes it]
OUTCOME: [what results from this pattern]
WORKAROUND: [what users do to work around it]
EVIDENCE:
- "[quote showing this pattern]"
- "[another quote confirming it]"
```

**Success Criteria:**
- Patterns are observable, not inferred
- Each pattern ties to 2+ observations across sources
- Patterns explain recurring user frustrations
- 2–3 patterns per top theme

---

## STEP 6B: CURATE RESEARCH QUOTES
**Purpose:** Collect the most powerful, representative quotes for presentations and stakeholder alignment

**Agent Actions:**
For each top theme, extract and organize quotes by type:

**Direct Complaints** (users explicitly naming the problem):
```
"[exact quote from source]"
— [user type, platform/source], [URL]
```

**Workaround Quotes** (users describing their solution):
```
"[exact quote showing what user does instead]"
— [user type, platform/source], [URL]
```

**Opportunity Quotes** (users hinting at what they wish existed):
```
"[exact quote showing unmet need]"
— [user type, platform/source], [URL]
```

**Surprising/Insightful Quotes** (revealing hidden assumptions):
```
"[exact quote that challenges expected behavior]"
— [user type, platform/source], [URL]
```

Create a curated quote list with 3–5 of the most powerful quotes per theme, ranked by clarity and impact.

**Success Criteria:**
- Each quote is real (from fetched source)
- Quotes cover different emotional angles (complaint, workaround, wish, surprise)
- Quotes are specific enough to be memorable
- Quotes can be used directly in presentations to stakeholders

---

## STEP 6C: BUILD BEHAVIORAL PERSONAS
**Purpose:** Synthesize research data into distinct user archetypes based on actual patterns, not stereotypes

**Agent Actions:**
For each distinct user segment emerging from the research, create a behavioral persona:

```
PERSONA: [Name + title, e.g., "Priya, Overloaded Project Manager"]

CONTEXT & GOALS:
- Primary Goal: [what they're trying to achieve]
- Secondary Goals: [2–3 related goals]
- Frustration Level: [low / moderate / high]
- Current Tool: [what they use now; gap they're experiencing]

BEHAVIORAL PATTERN:
- How they work: [observable routine/workflow]
- Pain point from research: [specific theme this persona hits]
- Workaround they use: [how they work around the problem]
- Frequency of issue: [how often they encounter it]

ASSUMPTIONS THEY HOLD:
- About the product: [assumption 1]
- About themselves: [assumption 2]
- About the platform/context: [assumption 3]

KEY QUOTE:
"[most representative quote from research]"
— [source/platform]

DECISION DRIVERS:
- What would make them switch? [what unblocks them]
- What would keep them from switching? [barriers]
- How do they measure success? [metric they care about]

RESEARCH EVIDENCE:
- [# observations backing this persona]
- Sources: [interview types that support this persona]
```

Build 2–4 personas per research topic, each tied to distinct observations from your research data.

**Success Criteria:**
- Each persona is grounded in 3+ observations (not invented)
- Personas show different user segments, not just demographic variation
- Each persona has a clear problem/pain point from your research
- Personas are specific enough to guide design decisions
- Personas show different behavioral patterns (how they work, what they're doing now)

---

## STEP 6D: DEFINE PROBLEM STATEMENTS
**Purpose:** Articulate the core problems discovered in research, tied to user needs and business impact

**Agent Actions:**
For each top theme, create a problem statement:

```
PROBLEM STATEMENT: [Problem as observed]

USER NEED:
- Who: [user segment/persona name]
- What: [what they're trying to do]
- Why: [underlying motivation or goal]

CURRENT SITUATION:
- How it fails: [specific UX failure from failure map]
- Frequency: [how often this problem occurs]
- Impact on user: [what the user loses: time, trust, abandonment, etc.]
- Business impact: [how this affects retention/adoption/revenue]

EVIDENCE:
- [# observations showing this problem]
- Key themes: [which themes contribute to this problem]
- Representative quote: "[most powerful quote]"

CONSTRAINTS TO RESPECT:
- Technical: [what can't be changed at platform level]
- Business: [budget, timeline, other priorities]
- User: [what we can't ask users to learn/do differently]
```

Format should tie each problem to the 3-Lens analysis (assumptions, failures, behavior gaps).

**Success Criteria:**
- Problem statement is specific, not vague ("users are confused" → "users can't tell task state without opening it")
- Problem ties to a real user need, not just a feature request
- Business impact is quantified or explained
- Constraints are realistic and acknowledged
- Each statement points toward a solvable design problem

---

## STEP 6E: ARTICULATE USER GOALS & DECISION POINTS
**Purpose:** Map out what users are trying to accomplish and where they need to make decisions in the UX

**Agent Actions:**
For each behavioral pattern or persona, identify:

**Primary Goals:**
```
GOAL: [high-level goal user is trying to achieve]
Context: [when/why they're doing this]
Success metric: [how they know they've succeeded]
Current barrier: [what prevents them from succeeding now]
Current friction: [steps they have to take / workarounds needed]
Evidence: [observations supporting this goal]
```

**Decision Points** (where users need clarity or options):
```
DECISION POINT: [moment when user must choose or understand something]
Current state: [what the UX currently shows/requires]
User confusion: [what users are getting wrong / what they need to know]
Impact of poor decision: [what happens if they choose wrong]
Ideal outcome: [what should happen if decision is easy/clear]
Benefit if solved: [what user gains with clear decision-making]
Evidence: "[quotes showing user struggling at this point]"
```

**Example:**

```
GOAL: Quickly see if a task is being worked on or blocked

SUCCESS METRIC: User can tell task state from list view in < 1 second

CURRENT BARRIER: Task state is hidden; user must open task card to see it

CURRENT FRICTION:
1. Scan list of tasks
2. See task that looks "pending" 
3. Click to open task detail
4. Read small status label
5. Close task
6. Repeat for next task → 30 sec wasted per session

---

DECISION POINT: "Is this task ready for me to work on right now?"

CURRENT STATE: User sees task title only. No status badge. No visual hint.

USER CONFUSION: "Does 'in progress' mean someone is working on it now, or just... started? Should I wait? Can I start too?"

IMPACT OF POOR DECISION: User either wastes time waiting, or creates duplicate work by starting on task someone else is already doing.

IDEAL OUTCOME: User sees color-coded badge (grey=not-started, orange=in-progress, red=blocked) and instantly knows whether to start or wait.

BENEFIT IF SOLVED:
- Time saved per session: 30 seconds
- Reduction in duplicate work: 40%
- User confidence in task management: increases trust in app
```

**Success Criteria:**
- Goals and decision points are tied to observations
- Each decision point shows current confusion vs. ideal clarity
- Benefits are measurable or specific (not "users will be happier")
- Decision points align with where users are failing (from failure map)

---

## STEP 6F: SYNTHESIZE HYPOTHESES & RECOMMENDATIONS
**Purpose:** Turn 3-Lens insights into testable hypotheses with clear benefits and design direction

For each top theme, write a hypothesis paired with design recommendations:

```
HYPOTHESIS: [One sentence describing a potential solution or pattern shift]

CURRENT STATE:
[Summary of observations + assumptions + failure maps pointing to the problem]

ROOT CAUSE (from 3-Lens):
- Assumption broken: [which assumption is false or broken]
- Failure mode: [false positive or false negative]
- Behavioral gap: [current vs. desired behavior]

INTERVENTION (Design Recommendation):
[Specific, actionable change to UX/product/positioning]
- What changes: [exact UX change]
- Where it appears: [location in flow/interface]
- Why it works: [ties back to root cause]

EXPECTED BEHAVIORAL SHIFT:
1. [First outcome: how user behavior changes]
2. [Second outcome: what new behavior emerges]
3. [Third outcome: indirect benefit]

USER BENEFITS:
- Time saved: [e.g., "30 seconds per session"]
- Confidence gained: [e.g., "clear understanding of task state"]
- Friction reduced: [e.g., "no need for 3-step workaround"]

BUSINESS BENEFITS:
- Retention impact: [e.g., "users stay longer when ___ is visible"]
- Adoption impact: [e.g., "first-time users adopt feature when ___"]
- Support cost: [e.g., "fewer confused users = fewer support tickets"]

MEASUREMENT CRITERIA:
- Metric 1: [e.g., "Time-to-decision decreases by 40%"]
- Metric 2: [e.g., "Feature adoption increases from 10% to 60%"]
- Metric 3: [e.g., "Support tickets about task state drop by 50%"]

WIREFRAME/FLOW DIRECTION:
[Brief description of how the interface should change, or link to example flows/wireframes showing the before/after]

EVIDENCE:
- Research quotes supporting this: "[quote 1]", "[quote 2]"
- Personas who benefit: [Persona 1, Persona 2]
- Theme impact: [which top theme(s) this solves]
```

**Example:**

```
HYPOTHESIS: Making task state visible in list view with color-coded badges will reduce context-switching and task state confusion.

CURRENT STATE:
Users can't tell if a task is not-started, in-progress, or blocked without opening it (observation + false positive failure). This forces repeated opening of the same task and users eventually give up on using the app (false negative in retention).

ROOT CAUSE:
- Assumption broken: Users assume task state is "obvious" or "visible" (false)
- Failure mode: False positive — users want to see state but can't
- Behavioral gap: Currently check state by opening task → Desired: see state in list view

INTERVENTION:
Add a status badge to the left of each task in list view:
- Not-started: grey dot
- In-progress: orange dot  
- Blocked: red dot
- Add hover state with tooltip: "In progress · Started by [name]" or "Blocked · Waiting for [blocker]"

EXPECTED BEHAVIORAL SHIFT:
1. Users no longer open tasks just to check state
2. Users change task state more frequently (moving from "ignore blocked" to "mark blocked")
3. New users discover task state system visually, without onboarding

USER BENEFITS:
- Time saved: 30 seconds per session (3–5 fewer task opens)
- Clarity gained: instant understanding of task readiness
- Reduced mental load: visual scanning instead of click-read-close loop

BUSINESS BENEFITS:
- Retention: users feel in control of workflow
- Adoption: task state feature goes from unknown to discovered
- Support: fewer "Why can't I see task state?" questions

MEASUREMENT:
- Time-to-state-change decreases by 40%
- Task open rate decreases by 50% (for status-checking)
- First-time users mark a task blocked within first session (currently never)
- Support tickets about task state drop by 60%

WIREFRAME DIRECTION:
[Task List View]
Before: Just task title, due date, assignee
After: [Grey Dot] Task Title | Due Date | Assignee

On hover: Status badge shows with tooltip
On click badge: Quick state-change menu (3-click max)

Flow: User glances at list → sees dot color → instantly knows task status → clicks badge to change if needed

EVIDENCE:
- "I can't tell if my task is being worked on or forgotten" (Reddit, r/productivity)
- "I have to open every task to see if it's blocked" (Interview, Priya)
- "Notifications broke my focus" → Related: users don't know state, keep checking (Podcast)

Personas who benefit: Priya (overloaded PM), Alex (deadline-focused maker)
Themes solved: Task State Confusion (#1 ranked), Decision Clarity
```

**Success Criteria:**
- Hypothesis is tied to gathered evidence
- Intervention is specific and testable (not vague)
- Benefits are concrete and measurable
- Wireframe direction gives designer a clear starting point
- User and business benefits are both clear
- Decision points and user goals are addressed
- 2–4 hypotheses per research topic

---

## STEP 7: STRUCTURE RESEARCH FINDINGS REPORT
**Purpose:** Package all insights into a structured, hand-off-ready format

Output a research findings report with sections:

### A. RESEARCH BRIEF
- Topic: [what you researched]
- Scope: [in/out of scope]
- Sources: [# of interviews, Reddit threads, podcasts, articles fetched]
- Methodology: [3-Lens framework + behavioral analysis]

### B. TOP THEMES (RANKED)
[List top 3–5 themes by impact, with frequency/severity metrics and behavioral patterns]

### C. BEHAVIORAL INSIGHTS
- **Behavioral Patterns**: [recurring user actions and workarounds extracted from research]
- **Curated Research Quotes**: [most powerful quotes organized by theme — complaints, workarounds, opportunities, insights]
- **Behavioral Personas**: [2–4 user archetypes with goals, patterns, pain points, and research evidence]

### D. 3-LENS ANALYSIS (for each top theme)
- Assumption Extraction (3 assumptions with evidence)
- Primary Failure Mapping (false positives + false negatives + impact)
- Behaviour Change Mapping (current → desired + constraints)

### E. PROBLEM STATEMENTS & USER GOALS
- **Problem Statements**: [articulated problems tied to user needs and business impact]
- **User Goals & Decision Points**: [what users are trying to achieve, where they need clarity, benefits of solving each decision point]

### F. HYPOTHESES & DESIGN RECOMMENDATIONS
[2–4 testable hypotheses with design interventions]
- Each hypothesis includes:
  - Root cause from 3-Lens analysis
  - Specific design intervention
  - Expected behavioral shifts
  - User & business benefits
  - Measurement criteria
  - Wireframe/flow direction

### G. RESEARCH PLAN (NEXT STEPS)
- What to validate: [which hypotheses are highest priority]
- Who to interview: [which user segment to test with]
- Generative research: [ideas to prototype and test]
- Evaluative research: [metrics to track if changes work]

### H. EXPECTATIONS & GOTCHAS
- What good looks like: [research that leads to action]
- What to avoid: [false solutions, feature creep]
- Constraints to respect: [platform/business limits]
- How to use this research: [specific guidance for designer/PM]

**Success Criteria:**
- Report is traceable: every claim links back to gathered data
- Report is actionable: each section points to specific design decisions or next steps
- Report is structured: designer can hand it to PM/eng and they know exactly what to build
- Personas, problem statements, and hypotheses guide prototype and testing phases
- No invented insights or hallucinated sources

---

## STEP 8: VALIDATION GATE (QUALITY CHECK)
**Purpose:** Ensure research quality before finalizing

The agent grades its own research findings against a 10-point rubric:

```
✓ TRACEABILITY: Every observation is sourced to a real fetched URL. No made-up quotes or invented data.

✓ DIVERSE SOURCES: Research includes interviews, Reddit, podcasts, articles (not just one type). At least 6–8 sources.

✓ THEME EVIDENCE: Each top theme has 3+ observations backing it. Frequency and severity ranking math is transparent and shown.

✓ BEHAVIORAL PATTERNS: Recurring user behaviors are identified (not assumptions). Each pattern ties to 2+ observations showing the same action loop.

✓ PERSONAS GROUNDED: Personas are built from actual observations, not stereotypes. Each persona has a clear pain point from research and specific behavioral patterns.

✓ PROBLEM STATEMENTS SPECIFIC: Problems are concrete, not vague. Each tied to user need + business impact. Constraints acknowledged.

✓ USER GOALS CLEAR: Goals and decision points are grounded in research. Benefits of solving each are measurable or specific.

✓ 3-LENS COMPLETENESS: Assumptions, failure maps, and behaviour changes are all present for top themes. Each backed by evidence.

✓ HYPOTHESIS RIGOR: Hypotheses are tied to evidence, interventions are specific/testable, measurements are concrete. Wireframe direction is given.

✓ ACTIONABILITY: Personas and problem statements guide next prototyping steps. Designer can read this and start building without guessing.
```

If all 10 checks pass → VERDICT: PASS → proceed to FINALIZE.
If any check fails → VERDICT: FAIL → loop back to REVISE (max 2 revisions).

**Revision Strategy (if FAIL):**
- Add missing observations (re-fetch sources if needed)
- Deepen behavioral pattern extraction (show recurring action loops)
- Build more specific personas with clear pain points
- Rewrite problem statements to be concrete and measurable
- Reframe user goals to tie to research evidence
- Deepen 3-Lens analysis (add missing assumptions, failure maps)
- Rewrite hypotheses to be more specific/measurable with clear benefits
- Re-grade until PASS

---

## STEP 9: FINALIZE & OUTPUT
**Purpose:** Write the approved research findings to disk/Figma

**Agent Actions:**
- Once validation passes, write the full research report and supporting artifacts to disk
- Format: Markdown (main report) + JSON (structured data) for export/integration
- Include:
  - All fetched source URLs (with timestamps)
  - All observations (with quotes and sources)
  - Behavioral patterns with evidence
  - Curated research quotes organized by theme
  - Behavioral personas with goals, pain points, evidence
  - Problem statements tied to user needs
  - User goals and decision points
  - All 3-Lens breakdowns (assumptions, failure maps, behaviour changes)
  - All hypotheses with design recommendations and wireframe directions
  - Research plan and next steps

**File Structure:**
```
output/
├── research_findings_report.md                    [main report: sections A–H]
├── raw_observations.json                          [all 20–40 observations: structured data]
├── themes_ranked.json                             [clustered themes with frequency/severity + patterns]
├── behavioral_personas.json                       [personas with goals, patterns, pain points, evidence]
├── problem_statements.json                        [problems tied to needs + business impact]
├── user_goals_decisions.json                      [user goals + decision points + benefits]
├── curated_quotes.json                            [best quotes organized by theme/type]
└── hypotheses_with_recommendations.json           [hypotheses with design direction + measurements]
```

**Report Sections (to include in markdown):**
- A. Research Brief
- B. Top Themes (Ranked)
- C. Behavioral Insights (patterns + quotes + personas)
- D. 3-Lens Analysis
- E. Problem Statements & User Goals
- F. Hypotheses & Design Recommendations (with wireframe directions)
- G. Research Plan (Next Steps)
- H. Expectations & Gotchas + How to Use This Research

**Success Criteria:**
- Main report is complete, readable, and ready for stakeholder/team hand-off
- All data is structured (JSON) and export-ready for Figma, design tools, or prototyping platforms
- Personas guide user testing and prototyping
- Problem statements point to solvable design problems
- Hypotheses guide next iteration/A/B testing
- Wireframe directions give designer a clear starting point
- Report is ready for designer/PM to start building/testing immediately

---

## MCP SERVERS REQUIRED

| Server | Purpose | Launch Command |
|--------|---------|-----------------|
| `fetch` | Retrieve web content (interviews, Reddit, podcasts, articles) | `uvx mcp-server-fetch` |
| `filesystem` | Read research topic input, write findings report | `npx -y @modelcontextprotocol/server-filesystem <project-path>` |

---

## AGENT WORKFLOW LOOP (PSEUDOCODE)

```
START:
  1. Accept research topic (CLI input or file)
  2. Define scope and research brief
  
GATHER PHASE:
  3. Fetch interviews, podcasts, Reddit threads, articles (via fetch MCP)
  4. Extract raw observations from each source (20–40 total)
  
ANALYZE PHASE:
  5. Cluster observations into themes
  6. Rank themes by frequency × severity
  7. Extract behavioral patterns (recurring user actions)
  
SYNTHESIZE PHASE:
  8. Apply 3-Lens Framework (for each top theme):
     - Lens 1: Extract assumptions (user, context, system)
     - Lens 2: Map failures (false positives + false negatives)
     - Lens 3: Map behaviour change (current → desired + constraints)
  9. Curate research quotes (organized by theme/sentiment)
  10. Build behavioral personas (2–4) with goals, patterns, pain points
  11. Write problem statements (tied to user needs + business impact)
  12. Articulate user goals & decision points (with benefits)
  13. Generate testable hypotheses with design recommendations
  14. Define research plan for next steps
  
CHECK PHASE:
  15. Validate research against 10-point quality rubric:
      - Traceability, diverse sources, theme evidence
      - Behavioral patterns, grounded personas
      - Specific problem statements, clear user goals
      - 3-Lens completeness, hypothesis rigor, actionability
  16. If FAIL → REVISE (max 2 loops)
  17. If PASS → proceed to FINALIZE
  
FINALIZE PHASE:
  18. Write research findings report to output/research_findings_report.md (sections A–H)
  19. Output structured data (JSON):
      - raw_observations.json
      - themes_ranked.json (with patterns)
      - behavioral_personas.json
      - problem_statements.json
      - user_goals_decisions.json
      - curated_quotes.json
      - hypotheses_with_recommendations.json
  
END:
  Done. Research findings + personas + hypotheses + wireframe directions ready for designer/PM to start building/testing.
```

---

## SAMPLE WORKFLOW EXAMPLE

**Research Topic:** "Why do users abandon task management apps after onboarding?"

1. **DEFINE SCOPE**: Focus on onboarding friction, task state visibility, notification overload
2. **GATHER**: Fetch 8 sources (ProductHunt reviews, Reddit r/productivity, User Interviews podcast ep. 45, Medium articles on task app UX, Twitter threads)
3. **EXTRACT**: Pull 30 observations (e.g., "I can't tell if my task is being worked on or forgotten," "Notifications broke my focus")
4. **CLUSTER**: Group into 5 themes (Onboarding Friction, Task State Confusion, Notification Overload, Empty State Discoverability, Sync/Offline Reliability)
5. **EXTRACT BEHAVIORAL PATTERNS**: 
   - Pattern 1: "Status Checking Loop" — Users open same task 3–5 times per session to check state
   - Pattern 2: "Silent Abandonment" — Users stop marking tasks as complete/blocked after first week
6. **APPLY 3-LENS**:
   - **Assumptions**: Users think "auto-save is standard," "Notifications are app's job," "I can use this offline," "Status is obvious"
   - **Failures**: Users can't change task state without opening it (false positive). Users don't know tasks can be blocked (false negative).
   - **Behaviour**: Currently → manually track state in note-taking app. Desired → see state in list view with 1-click change.
7. **CURATE QUOTES**: Organize 6–8 powerful quotes:
   - "I can't tell if my task is being worked on or forgotten" (direct complaint)
   - "I use Notion to track state because the app doesn't show it" (workaround)
   - "I wish I could see at a glance which tasks need my attention" (opportunity)
8. **BUILD PERSONAS**:
   - Priya (Overloaded PM): Goal = manage team workload quickly; pain = task state invisible
   - Alex (Deadline Maker): Goal = focus without context-switching; pain = repeated status checks break flow
9. **WRITE PROBLEM STATEMENTS**:
   - Problem: Users can't quickly see task state, forcing repeated task opens → friction → abandonment
   - User need: Quick visual status without clicking
   - Business impact: 40% early abandonment rate
10. **ARTICULATE USER GOALS & DECISIONS**:
    - Goal 1: "See if task is ready for me to work on" → Decision point: "Is this task blocked/in progress/not started?" → Benefit: Saves 30 sec/session
    - Goal 2: "Change task state without full task edit" → Decision point: "How do I mark as blocked?" → Benefit: Reduces support tickets by 60%
11. **HYPOTHESES WITH DESIGN RECOMMENDATIONS**:
    - "Adding state badges in list view → users change state 60% more → retention improves"
    - Intervention: Add grey/orange/red dots to task list; on-hover quick state menu
    - Wireframe direction: [Task List Before] Title only → [Task List After] [Dot] Title | Date | Assignee
12. **CHECK**: Validate all 10 rubric points (includes behavioral patterns, personas, problem statements, goals, decisions) → PASS
13. **FINALIZE**: Write full report + export JSON files:
    - research_findings_report.md (sections A–H)
    - behavioral_personas.json (Priya, Alex with goals + pain points)
    - problem_statements.json (tied to user needs + business impact)
    - curated_quotes.json (organized by type)
    - hypotheses_with_recommendations.json (with wireframe directions)

**Output ready for:** Designer to create prototypes, PM to set priorities, researcher to plan next testing round

---

## KEY PRINCIPLES

- **No Hallucination**: Every observation is traced to a real, fetched source.
- **Evidence-First**: Assumptions, failures, and hypotheses are grounded in gathered data.
- **Structured Output**: Findings are packaged in a format designers/PMs can use immediately.
- **Reusable Framework**: The 3-Lens methodology applies to any product/UX pattern.
- **Validation Gate**: Quality is checked before output, with a bounded revision loop.

---

**This workflow is ready to be packaged into a custom Claude Skill (`ux-research` Skill) and driven by an agent.py script using the Claude Agent SDK.**
