#!/usr/bin/env node
/**
 * SuperAI Consultant Research MCP Server
 * Provides research and client prep tools for management consultants.
 */
'use strict';

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');

const BRAVE_API_KEY = process.env.BRAVE_API_KEY || '';

// ─── Tool definitions ──────────────────────────────────────────────────────

const TOOLS = [
  {
    name: 'research_company',
    description: 'Research a company: recent news, financial overview, key leadership, strategic priorities, and competitive positioning.',
    inputSchema: {
      type: 'object',
      properties: {
        company_name: {
          type: 'string',
          description: 'Company name to research (e.g. "McKinsey & Company", "Accenture")',
        },
        focus_areas: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional: specific areas to focus on (e.g. ["recent earnings", "leadership changes", "strategic initiatives"])',
        },
      },
      required: ['company_name'],
    },
  },
  {
    name: 'prepare_client_brief',
    description: 'Generate a structured pre-meeting client brief: agenda preparation, talking points, risk areas, and opportunity angles.',
    inputSchema: {
      type: 'object',
      properties: {
        client_name: {
          type: 'string',
          description: 'Client or prospect name',
        },
        meeting_type: {
          type: 'string',
          enum: ['discovery', 'proposal', 'status-update', 'executive-review', 'closing'],
          description: 'Type of meeting',
        },
        context: {
          type: 'string',
          description: 'Additional context about the engagement or client situation',
        },
      },
      required: ['client_name', 'meeting_type'],
    },
  },
  {
    name: 'analyze_industry_trends',
    description: 'Summarize recent trends in an industry sector for client positioning and strategic advice.',
    inputSchema: {
      type: 'object',
      properties: {
        industry: {
          type: 'string',
          description: 'Industry or sector to analyze (e.g. "healthcare IT", "financial services", "manufacturing")',
        },
        time_horizon: {
          type: 'string',
          enum: ['current', '6-months', '1-year', '3-year'],
          description: 'Time horizon for the analysis',
          default: '1-year',
        },
      },
      required: ['industry'],
    },
  },
  {
    name: 'competitive_snapshot',
    description: 'Build a quick competitive snapshot: key players, market share estimates, recent moves, and differentiation factors.',
    inputSchema: {
      type: 'object',
      properties: {
        company_or_market: {
          type: 'string',
          description: 'Company name or market segment to analyze',
        },
        include_players: {
          type: 'number',
          description: 'Number of top competitors to include (default: 5)',
          default: 5,
        },
      },
      required: ['company_or_market'],
    },
  },
];

// ─── Research prompt templates ─────────────────────────────────────────────

function buildCompanyResearchPrompt(companyName, focusAreas) {
  const focusStr = focusAreas && focusAreas.length
    ? `\n\nFocus particularly on: ${focusAreas.join(', ')}`
    : '';
  return `You are a senior management consultant conducting pre-engagement research. Research the following company and provide a structured briefing document:

**Company:** ${companyName}${focusStr}

Provide a structured research brief with:
1. **Company Overview** — Business model, revenue scale, market position
2. **Recent News & Developments** — Last 6-12 months key events, announcements, leadership changes
3. **Financial Health Snapshot** — Revenue trends, profitability indicators, recent performance signals
4. **Strategic Priorities** — Current stated objectives, initiatives, transformation programs
5. **Competitive Position** — Key competitors, differentiation, market share signals
6. **Potential Opportunities** — Areas where consulting services could add value
7. **Risk Areas** — Challenges, headwinds, or sensitivities to be aware of

Format as a professional consultant brief. Be specific and actionable.`;
}

function buildClientBriefPrompt(clientName, meetingType, context) {
  const meetingDescriptions = {
    discovery: 'first discovery conversation to understand needs and build rapport',
    proposal: 'proposal presentation to pitch engagement approach and pricing',
    'status-update': 'project status update to review progress and align on next steps',
    'executive-review': 'executive review with senior stakeholders for strategic alignment',
    closing: 'closing conversation to confirm decisions and finalize agreement',
  };

  const meetingDesc = meetingDescriptions[meetingType] || meetingType;
  const contextStr = context ? `\n\nAdditional context: ${context}` : '';

  return `You are a senior management consultant preparing for a client meeting. Create a pre-meeting brief for:

**Client:** ${clientName}
**Meeting Type:** ${meetingDesc}${contextStr}

Prepare a structured brief including:
1. **Meeting Objectives** — What success looks like for this meeting
2. **Agenda Recommendation** — Suggested flow and timing
3. **Key Talking Points** — 3-5 high-impact points to communicate
4. **Questions to Ask** — Discovery or alignment questions appropriate for this meeting type
5. **Anticipated Objections** — Common concerns and how to address them
6. **Risk Areas** — Topics to navigate carefully
7. **Next Steps to Propose** — Clear asks or commitments to drive forward

Be specific and actionable. Format as a one-page pre-meeting prep document.`;
}

function buildIndustryTrendsPrompt(industry, timeHorizon) {
  const horizonDesc = {
    current: 'current state and emerging signals',
    '6-months': 'the last 6 months',
    '1-year': 'the past year',
    '3-year': 'the past 3 years and near-term outlook',
  };

  return `You are a senior industry analyst. Provide a comprehensive trend analysis for:

**Industry:** ${industry}
**Time Horizon:** ${horizonDesc[timeHorizon] || timeHorizon}

Structure your analysis as:
1. **Macro Trends** — 3-5 major forces shaping the industry
2. **Technology Shifts** — Digital, AI, and technology disruptions underway
3. **Regulatory & Compliance Changes** — Key regulatory developments affecting strategy
4. **Market Dynamics** — Consolidation, new entrants, pricing pressures
5. **Customer Behavior Changes** — How buyer needs and expectations are evolving
6. **Strategic Implications** — What this means for incumbents vs. challengers
7. **Consulting Opportunity Areas** — Where organizations need external help most

Format for a client-facing executive briefing. Use concrete examples and data points where possible.`;
}

function buildCompetitiveSnapshotPrompt(companyOrMarket, includeCount) {
  const count = includeCount || 5;
  return `You are a strategy consultant conducting competitive intelligence research. Build a competitive snapshot for:

**Subject:** ${companyOrMarket}
**Depth:** Top ${count} competitors

Provide:
1. **Market Overview** — Size, growth rate, key segments
2. **Competitive Landscape Table** — For each top ${count} player: company name, market position, key differentiators, recent moves, estimated market share
3. **Competitive Dynamics** — How competition plays out (price, innovation, relationships, geography)
4. **Disruption Threats** — New entrants, adjacent players, or technology shifts threatening incumbents
5. **White Space** — Gaps or underserved segments in the market
6. **Strategic Implications** — What this means for the subject company's positioning

Format as a consulting deliverable. Be specific about named competitors and concrete differentiation factors.`;
}

// ─── Search helper (optional Brave API) ───────────────────────────────────

async function braveSearch(query) {
  if (!BRAVE_API_KEY) return null;
  try {
    const resp = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`, {
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': BRAVE_API_KEY,
      },
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    return (data.web?.results || [])
      .slice(0, 5)
      .map((r) => `- ${r.title}: ${r.description || ''} (${r.url})`)
      .join('\n');
  } catch {
    return null;
  }
}

// ─── Tool handlers ─────────────────────────────────────────────────────────

async function handleResearchCompany(args) {
  const { company_name, focus_areas } = args;

  let searchContext = '';
  if (BRAVE_API_KEY) {
    const results = await braveSearch(`${company_name} company news strategy 2025 2026`);
    if (results) {
      searchContext = `\n\n**Recent web search results for context:**\n${results}`;
    }
  }

  const prompt = buildCompanyResearchPrompt(company_name, focus_areas) + searchContext;
  return {
    content: [{ type: 'text', text: prompt }],
    isError: false,
  };
}

async function handlePrepareClientBrief(args) {
  const { client_name, meeting_type, context } = args;
  const prompt = buildClientBriefPrompt(client_name, meeting_type, context);
  return {
    content: [{ type: 'text', text: prompt }],
    isError: false,
  };
}

async function handleAnalyzeIndustryTrends(args) {
  const { industry, time_horizon = '1-year' } = args;

  let searchContext = '';
  if (BRAVE_API_KEY) {
    const results = await braveSearch(`${industry} industry trends 2025 2026`);
    if (results) {
      searchContext = `\n\n**Recent web search results for context:**\n${results}`;
    }
  }

  const prompt = buildIndustryTrendsPrompt(industry, time_horizon) + searchContext;
  return {
    content: [{ type: 'text', text: prompt }],
    isError: false,
  };
}

async function handleCompetitiveSnapshot(args) {
  const { company_or_market, include_players = 5 } = args;

  let searchContext = '';
  if (BRAVE_API_KEY) {
    const results = await braveSearch(`${company_or_market} competitors market share 2025`);
    if (results) {
      searchContext = `\n\n**Recent web search results for context:**\n${results}`;
    }
  }

  const prompt = buildCompetitiveSnapshotPrompt(company_or_market, include_players) + searchContext;
  return {
    content: [{ type: 'text', text: prompt }],
    isError: false,
  };
}

// ─── Server setup ──────────────────────────────────────────────────────────

const server = new Server(
  { name: 'superai-consultant-research', version: '1.0.0' },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  switch (name) {
    case 'research_company': return handleResearchCompany(args);
    case 'prepare_client_brief': return handlePrepareClientBrief(args);
    case 'analyze_industry_trends': return handleAnalyzeIndustryTrends(args);
    case 'competitive_snapshot': return handleCompetitiveSnapshot(args);
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
