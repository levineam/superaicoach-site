#!/usr/bin/env node
/**
 * SuperAI Wealth Manager Tools MCP Server
 * Portfolio analysis, client situation modeling, and market intelligence
 * for wealth managers and financial advisors.
 */
'use strict';

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');

// ─── Tool definitions ──────────────────────────────────────────────────────

const TOOLS = [
  {
    name: 'analyze_portfolio_allocation',
    description: 'Analyze a client portfolio: asset class breakdown, concentration risks, rebalancing opportunities, and alignment with risk tolerance.',
    inputSchema: {
      type: 'object',
      properties: {
        portfolio_description: {
          type: 'string',
          description: 'Description of the portfolio holdings (e.g. "60% equities, 30% bonds, 10% alternatives — heavy tech concentration in equities")',
        },
        risk_tolerance: {
          type: 'string',
          enum: ['conservative', 'moderate', 'aggressive', 'very-aggressive'],
          description: 'Client risk tolerance level',
        },
        time_horizon_years: {
          type: 'number',
          description: 'Investment time horizon in years',
        },
        client_age: {
          type: 'number',
          description: 'Client age (optional, affects lifecycle recommendations)',
        },
      },
      required: ['portfolio_description', 'risk_tolerance'],
    },
  },
  {
    name: 'model_client_situation',
    description: 'Build a structured client situation model: goals, timeline, risk capacity, tax situation, and recommended strategy framework.',
    inputSchema: {
      type: 'object',
      properties: {
        client_description: {
          type: 'string',
          description: 'Brief description of client situation (age, career, family, approximate wealth level, goals)',
        },
        primary_goals: {
          type: 'array',
          items: { type: 'string' },
          description: 'Primary financial goals (e.g. ["retirement at 60", "college funding", "estate transfer"])',
        },
        key_concerns: {
          type: 'array',
          items: { type: 'string' },
          description: 'Key concerns or constraints (e.g. ["high tax bracket", "concentrated stock position", "business sale upcoming"])',
        },
      },
      required: ['client_description'],
    },
  },
  {
    name: 'market_intelligence_brief',
    description: 'Generate a market intelligence brief for client conversations: macro conditions, sector performance, key themes, and talking points.',
    inputSchema: {
      type: 'object',
      properties: {
        focus_area: {
          type: 'string',
          description: 'Optional focus area (e.g. "fixed income", "international equities", "alternatives", "broad market")',
          default: 'broad market',
        },
        client_portfolio_focus: {
          type: 'string',
          description: 'Optional: describe the client portfolio context to make the brief more relevant',
        },
      },
      required: [],
    },
  },
  {
    name: 'estate_planning_checklist',
    description: 'Generate a personalized estate planning checklist based on client situation.',
    inputSchema: {
      type: 'object',
      properties: {
        client_situation: {
          type: 'string',
          description: 'Client situation description (marital status, dependents, asset types, estimated estate size)',
        },
        completed_items: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional: list of already-completed estate planning steps',
        },
      },
      required: ['client_situation'],
    },
  },
];

// ─── Prompt builders ───────────────────────────────────────────────────────

function buildPortfolioAnalysisPrompt(portfolioDescription, riskTolerance, timeHorizonYears, clientAge) {
  const horizonStr = timeHorizonYears ? `\nTime horizon: ${timeHorizonYears} years` : '';
  const ageStr = clientAge ? `\nClient age: ${clientAge}` : '';
  return `You are a senior wealth manager conducting a portfolio review. Analyze the following client portfolio:

**Portfolio:** ${portfolioDescription}
**Risk tolerance:** ${riskTolerance}${horizonStr}${ageStr}

Provide a structured portfolio analysis covering:
1. **Current Allocation Assessment** — How does the current allocation align with stated risk tolerance and time horizon?
2. **Concentration Risks** — Identify any problematic concentrations (sector, geography, single security, asset class)
3. **Diversification Gaps** — Asset classes or geographies underrepresented given the risk profile
4. **Rebalancing Recommendations** — Specific moves to improve risk-adjusted return profile
5. **Liquidity Considerations** — Ensure adequate liquidity for likely needs
6. **Tax Efficiency Opportunities** — Loss harvesting, asset location optimization, or structure improvements
7. **Next Review Triggers** — Conditions that should prompt a portfolio review

Format as a professional investment committee memo. Be specific and actionable.`;
}

function buildClientSituationPrompt(clientDescription, primaryGoals, keyConcerns) {
  const goalsStr = primaryGoals && primaryGoals.length
    ? `\n**Primary goals:** ${primaryGoals.join(', ')}`
    : '';
  const concernsStr = keyConcerns && keyConcerns.length
    ? `\n**Key concerns:** ${keyConcerns.join(', ')}`
    : '';

  return `You are a CFP-credentialed wealth advisor building a client situation model. Analyze this client:

**Client description:** ${clientDescription}${goalsStr}${concernsStr}

Build a comprehensive situation model including:
1. **Client Profile Summary** — Age, stage, risk capacity assessment, family situation
2. **Financial Goals Framework** — Prioritized goals with time horizons and funding estimates
3. **Risk Profile** — Risk tolerance vs. risk capacity analysis, behavioral tendencies to be aware of
4. **Key Planning Opportunities** — Top 3-5 highest-impact planning strategies
5. **Tax Planning Considerations** — Major tax optimization opportunities given their situation
6. **Insurance & Protection Gaps** — Coverage areas to review (life, disability, LTC, umbrella)
7. **Next Steps** — Prioritized action items for the next planning meeting
8. **Open Questions** — What you need to know before making final recommendations

Format as a client planning brief. Be specific about the strategies most relevant to this situation.`;
}

function buildMarketIntelligencePrompt(focusArea, clientPortfolioFocus) {
  const focus = focusArea || 'broad market';
  const portfolioContext = clientPortfolioFocus
    ? `\n\nClient portfolio context: ${clientPortfolioFocus}`
    : '';

  return `You are a senior portfolio strategist preparing a market intelligence brief for wealth manager client conversations.

**Focus area:** ${focus}${portfolioContext}

Provide a market intelligence brief covering:
1. **Macro Environment** — Current conditions: growth, inflation, rates, central bank posture
2. **Market Conditions** — Recent performance across key asset classes, sentiment indicators
3. **Sector & Theme Highlights** — 2-3 sectors or themes with notable developments
4. **Key Risks to Monitor** — Top 3 tail risks or developing concerns
5. **Opportunities** — Areas where current conditions create tactical opportunity
6. **Client Conversation Talking Points** — 3-4 soundbites that translate market conditions into client-friendly language
7. **What to Watch** — Key data releases, events, or thresholds in the coming weeks

Format as a one-page CIO briefing note. Use plain language for client-facing points while keeping professional rigor for advisor-level analysis.`;
}

function buildEstatePlanningPrompt(clientSituation, completedItems) {
  const completedStr = completedItems && completedItems.length
    ? `\n\nAlready completed: ${completedItems.join(', ')}`
    : '';

  return `You are a wealth advisor conducting an estate planning review. Generate a personalized checklist for:

**Client situation:** ${clientSituation}${completedStr}

Create a comprehensive, prioritized estate planning checklist with:

**Foundational Documents** (mark which likely apply based on their situation)
- Will status and recency
- Revocable living trust (if appropriate given estate size and goals)
- Durable power of attorney (financial)
- Healthcare proxy / medical power of attorney
- Living will / advance directive
- HIPAA authorizations

**Beneficiary Designations**
- Retirement accounts (IRA, 401k) — primary + contingent
- Life insurance policies
- Payable-on-death bank accounts
- Transfer-on-death investment accounts

**Asset Titling & Transfer**
- Joint tenancy vs. tenants in common considerations
- Property titles align with estate plan
- Business interests properly documented

**Tax Planning**
- Annual gift exclusion utilization (confirm the current IRS annual exclusion amount for the applicable tax year)
- 529 superfunding if applicable
- Charitable giving strategies (DAF, CRT, direct gifts)
- Trust structures for estate tax mitigation if applicable

**Protection & Insurance**
- Life insurance adequacy review
- Irrevocable life insurance trust (ILIT) if appropriate

**Business & Complex Assets** (if applicable)
- Business succession plan
- Buy-sell agreement
- Qualified opportunity zones, restricted stock

For each item, indicate: Priority (High/Medium/Low), likely applicable based on their situation, and a one-sentence explanation of why it matters.`;
}

// ─── Server ────────────────────────────────────────────────────────────────

const server = new Server(
  { name: 'superai-wealth-manager-tools', version: '1.0.0' },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: rawArgs } = request.params;
  const args = rawArgs ?? {};

  switch (name) {
    case 'analyze_portfolio_allocation':
      return {
        content: [{
          type: 'text',
          text: buildPortfolioAnalysisPrompt(
            args.portfolio_description,
            args.risk_tolerance,
            args.time_horizon_years,
            args.client_age,
          ),
        }],
        isError: false,
      };

    case 'model_client_situation':
      return {
        content: [{
          type: 'text',
          text: buildClientSituationPrompt(
            args.client_description,
            args.primary_goals,
            args.key_concerns,
          ),
        }],
        isError: false,
      };

    case 'market_intelligence_brief':
      return {
        content: [{
          type: 'text',
          text: buildMarketIntelligencePrompt(args.focus_area, args.client_portfolio_focus),
        }],
        isError: false,
      };

    case 'estate_planning_checklist':
      return {
        content: [{
          type: 'text',
          text: buildEstatePlanningPrompt(args.client_situation, args.completed_items),
        }],
        isError: false,
      };

    default:
      return {
        content: [{ type: 'text', text: `Unknown tool: ${name}` }],
        isError: true,
      };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
