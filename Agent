# UX Research Agent
## Capstone Project Plan

---

## The Problem

UX researchers manually gather insights from scattered sources:
- Interviews
- Podcasts  
- Reddit discussions
- Articles

Then manually synthesize into findings.

**Result:** Fragmented output
- Raw observations in one place
- Themes elsewhere
- Personas in spreadsheet
- Hypotheses as notes

Manual copy-pasting at each step.
Research insights never reach design team.

---

## The Idea

**UX Research Agent** automates three things:

### 1. Gathers insights automatically
- Fetches real interviews, podcasts, Reddit, articles
- Via fetch MCP (no hallucination)
- Every finding traceable to real URL

### 2. Structures findings systematically
- Applies 3-Lens framework:
  - Assumption Extraction
  - Failure Mapping
  - Behaviour Change
- Organizes into:
  - Themes (ranked)
  - Personas (grounded)
  - Problem statements
  - Testable hypotheses

### 3. Produces hand-off-ready research
- Complete markdown report
- 7 structured JSON exports
- Ready for designers/PMs to prototype
- No re-work needed

---

## MVP (Building First)

**Research Gathering Phase:**
- Connect to web sources (fetch MCP)
- Extract raw observations (with quotes & URLs)

**Analysis Phase:**
- Cluster observations into themes
- Rank by frequency × severity
- Extract behavioral patterns

**Synthesis Phase:**
- Apply 3-Lens framework (for each theme)
  - Assumptions (user, context, system)
  - Failures (false positives + negatives)
  - Behavior gaps (current → desired)
- Build behavioral personas (2–4)
- Curate research quotes

**Definition Phase:**
- Write problem statements
  - Tied to user needs
  - Include business impact
- Articulate user goals & decision points
  - Where users need clarity
  - Measurable benefits

**Hypothesis Phase:**
- Generate testable hypotheses
- Specific design recommendations
- Wireframe directions
- Measurement criteria

**Validation Phase:**
- Validate against 10-point rubric
  - Traceability (real sources only)
  - Diverse sources (interviews + Reddit + podcasts + articles)
  - Behavioral patterns identified
  - Personas grounded in data
  - Problem statements specific
  - User goals clear
  - 3-Lens complete
  - Hypothesis rigor
  - Actionability

- If FAIL → Revise (max 2 cycles)
- If PASS → Output

**Output:**
- research_findings_report.md (8 sections)
- raw_observations.json
- themes_ranked.json
- behavioral_personas.json
- problem_statements.json
- user_goals_decisions.json
- curated_quotes.json
- hypotheses_with_recommendations.json

---

## Stretch Goals

- Learn from design feedback
  - Track which hypotheses are prototyped
  - Improve future research prompts

- Priority scoring for research
  - Flag high-impact themes
  - Flag edge cases

- Dashboard
  - Research velocity
  - Themes extracted per session
  - Hypotheses generated
  - Accuracy of predictions

- Multi-session synthesis
  - Combine findings across 3+ research runs
  - Extract meta-patterns

- Figma export
  - Auto-create research boards
  - Populate with findings, personas, wireframe directions

---

## How AI is Used & Why

### Classification
Unstructured research formats (interviews, podcasts, Reddit, articles).
Same platform, different formats.
LLM reads context → extracts patterns.

### Extraction
Pull atomic observations from messy data.
One idea per observation.
Tied to real quotes & sources.

### Clustering & Ranking
Group by similarity.
Rank by frequency × severity.
Transparent, math-based ranking.

### 3-Lens Analysis
Apply framework consistently.
Extract assumptions, map failures, map behavior gaps.
Ensures analytical depth.

### Persona Synthesis
Build from observations (not stereotypes).
Ground each persona in actual patterns.
Prevent invented archetypes.

### Hypothesis Generation
Connect evidence → design interventions.
Specific, testable hypotheses.
Measurable metrics included.

### Quality Validation
Grade own research against rubric.
Catch fabrications & weak conclusions.
Revise automatically (max 2 cycles).

### Why AI Specifically
Research content is unstructured & highly variable.

Same insight phrased 10 different ways.

LLMs excel at:
- Context understanding across formats
- Pattern extraction from messy data
- Reasoning about assumptions & behavior
- Natural-language hypothesis generation
- Linking evidence to design direction

Keyword filtering won't work.
Manual analysis takes weeks.

---

## Core Workflow

```
GATHER
(fetch MCP: interviews, podcasts, Reddit, articles)
        ↓
EXTRACT OBSERVATIONS
(LLM: atomic ideas + quotes + sources + sentiment)
        ↓
CLUSTER INTO THEMES
(LLM: group by similarity, rank by frequency × severity)
        ↓
EXTRACT BEHAVIORAL PATTERNS
(LLM: recurring user actions + triggers + outcomes)
        ↓
BUILD PERSONAS
(LLM: 2–4 archetypes grounded in research data)
        ↓
APPLY 3-LENS FRAMEWORK
(LLM: assumptions → failures → behavior gaps)
        ↓
CURATE RESEARCH QUOTES
(LLM: organize by sentiment + impact)
        ↓
WRITE PROBLEM STATEMENTS
(LLM: tied to user needs + business impact)
        ↓
ARTICULATE USER GOALS & DECISION POINTS
(LLM: where users need clarity + benefits)
        ↓
SYNTHESIZE HYPOTHESES
(LLM: design recommendations + wireframe directions)
        ↓
VALIDATE (10-POINT RUBRIC)
(LLM: grade own research)
        ↓
REVISE IF NEEDED
(max 2 cycles)
        ↓
FINALIZE & OUTPUT
(markdown report + 7 JSON exports)
```

---

## Output & Hand-Off

**research_findings_report.md**

Sections A–H:
- A. Research Brief
- B. Top Themes (ranked)
- C. Behavioral Insights (patterns + quotes + personas)
- D. 3-Lens Analysis
- E. Problem Statements & User Goals
- F. Hypotheses & Design Recommendations
- G. Research Plan
- H. Expectations & Gotchas

**JSON Exports**

For design tools / Figma:

1. raw_observations.json
   - 20–40 observations
   - Quotes + sources + sentiment

2. themes_ranked.json
   - Themes with frequency, severity
   - Behavioral patterns
   - Evidence

3. behavioral_personas.json
   - 2–4 personas
   - Goals, patterns, pain points
   - Research evidence

4. problem_statements.json
   - Problems
   - User needs
   - Business impact

5. user_goals_decisions.json
   - User goals
   - Decision points
   - Measurable benefits

6. curated_quotes.json
   - Best quotes by theme
   - Organized by sentiment

7. hypotheses_with_recommendations.json
   - Testable hypotheses
   - Design directions
   - Wireframe guidance
   - Measurement criteria

**Designer reads report → Selects 2–3 top hypotheses → Starts prototyping immediately**

No re-research needed.
No re-interpretation needed.

---

## Why This Matters

**Speed**
- From: 2–3 weeks manual research
- To: 1–2 hours agent-driven gathering + analysis

**Traceability**
- Every insight tied to real URL
- No guesses or fabrications

**Actionability**
- Structured output (personas, hypotheses)
- Not scattered observations
- Designers start building immediately

**Rigor**
- 3-Lens framework ensures depth
- Quality validation catches weak conclusions

**Reusability**
- Same workflow for any UX research topic
- Competitor analysis, feature research, retention studies, etc.

---

## Key Principles

### No Hallucination
Every observation sourced to real URL.
No invented data.

### Evidence-First
Personas grounded in data.
Problem statements tie to user needs.
Hypotheses linked to evidence.

### Structured Output
Ready for design tools.
Personas guide user testing.
Hypotheses guide prototyping.
Wireframe directions guide interaction design.

### Validation Gate
Quality checked before output.
If fails rubric → auto-revise (max 2 cycles).
If passes → output.

### Reusable Framework
3-Lens methodology applies to all UX patterns.
Future projects use same agent & framework.

---

## MCP Servers Required

| Server | Purpose |
|--------|---------|
| fetch | Retrieve web content |
| filesystem | Read research topic, write findings report |

---

## Tech Stack

- **Email API:** Gmail API (OAuth)
- **LLM:** Claude API (Anthropic)
- **Classification:** LLM + rule-based heuristics
- **Storage:** Local JSON or SQLite
- **Interface:** Gmail labels + dashboard
- **Orchestration:** Python agent loop (async)

---

## Constraints

**Technical:**
- Fetch API rate limits (250 req/min)
- Email body parsing (HTML/images)
- Large attachments (>50 MB)

**User:**
- No automatic sending
- Every draft must be approved
- Privacy: no retention after session

**Academic:**
- Deadline parsing (not always explicit)
- Attachment handling (text-only)

**Edge Cases:**
- Professor sends personal email
- Student sends coursework from personal account
- Forwarded threads (mixed classifications)
- University marketing (academic domain but promotional)

---

## Success Criteria

### 10-Point Validation Rubric

✓ **Traceability**
Every observation from real URL.

✓ **Diverse Sources**
Interviews + Reddit + podcasts + articles.

✓ **Theme Evidence**
3+ observations per theme.
Ranking math shown.

✓ **Behavioral Patterns**
Recurring user actions identified.
2+ observations per pattern.

✓ **Personas Grounded**
Built from data (not stereotypes).
Clear pain points + patterns.

✓ **Problem Statements**
Specific, not vague.
Tied to user needs + business impact.

✓ **User Goals Clear**
Grounded in research.
Measurable benefits.

✓ **3-Lens Complete**
Assumptions + failures + behavior gaps.
All backed by evidence.

✓ **Hypothesis Rigor**
Tied to evidence.
Interventions specific/testable.
Measurements concrete.
Wireframe directions given.

✓ **Actionability**
Personas guide user testing.
Problem statements guide design.
Hypotheses guide prototyping.

---

## Implementation Phases

**Phase 1: Core Infrastructure**
- Gmail API connection (OAuth)
- Database for metadata
- Configuration file
- Simple dashboard

**Phase 2: Email Classification**
- Classification rules
- LLM prompt
- 95%+ accuracy test
- Feedback loop
- Labels in Gmail

**Phase 3: Digest Generation**
- Collect non-academic emails
- Group by type
- Generate summaries
- Send as email/dashboard
- Unsubscribe links

**Phase 4: Routine Detection**
- LLM prompt for routine emails
- 80%+ detection accuracy
- Confidence scoring

**Phase 5: Reply Drafting**
- LLM prompt for drafts
- 70%+ approval rate test
- Tone-matching logic
- Approval interface
- Send logic

**Phase 6: Testing**
- Full workflow test
- Real email data
- Classification accuracy
- Draft quality
- Time savings

**Phase 7: Feedback Loop** (Stretch)
- Misclassification feedback
- Draft edit logging
- Sender learning

**Phase 8: Analytics** (Stretch)
- Metrics tracking
- Weekly dashboard
- Time savings estimate

---

## Next Steps

1. **Read this brief to Prof. Kemkar**
   - Get feedback on scope
   - Confirm 3-Lens framework approach

2. **Set up research gathering**
   - Configure fetch MCP
   - Test on sample research topics

3. **Build LLM prompts**
   - Classification prompt
   - Observation extraction
   - Theme clustering
   - 3-Lens analysis
   - Persona synthesis
   - Hypothesis generation

4. **Test on real data**
   - Run on 3–5 real research topics
   - Measure accuracy
   - Validate output quality

5. **Iterate & refine**
   - Based on test results
   - Improve prompts
   - Add feedback loop

6. **Document & submit**
   - README with setup instructions
   - Example outputs
   - Lessons learned

---

**Ready to start building. Begin with Phase 1 (GitHub API setup), then Phase 2–6 sequentially. Phases 7–8 are stretch goals for iteration 2.**
