import type { Tool } from './types'

/**
 * Every tool mentioned in the use-case library. Names checked October 2026.
 * affiliateUrl is intentionally empty. Fill it in only after joining a program;
 * pages show an affiliate disclosure automatically when any link uses one.
 */
export const TOOLS: Record<string, Tool> = {
  'chatgpt-business': { id: 'chatgpt-business', name: 'ChatGPT Business', url: 'https://openai.com/business/', affiliateUrl: '', badge: 'GP' },
  'claude-team': { id: 'claude-team', name: 'Claude (Team plan)', url: 'https://claude.com/pricing', affiliateUrl: '', badge: 'CL' },
  'm365-copilot': { id: 'm365-copilot', name: 'Microsoft 365 Copilot', url: 'https://www.microsoft.com/microsoft-365/copilot', affiliateUrl: '', badge: 'MC' },
  'gemini-workspace': { id: 'gemini-workspace', name: 'Gemini in Google Workspace', url: 'https://workspace.google.com/solutions/ai/', affiliateUrl: '', badge: 'GW' },
  'clio-manage': { id: 'clio-manage', name: 'Clio Manage (Manage AI)', url: 'https://www.clio.com/features/legal-ai-software/', affiliateUrl: '', badge: 'CM' },
  'clio-work': { id: 'clio-work', name: 'Clio Work', url: 'https://www.clio.com/work/', affiliateUrl: '', badge: 'CW' },
  cocounsel: { id: 'cocounsel', name: 'CoCounsel (Thomson Reuters)', url: 'https://legal.thomsonreuters.com/en/products/cocounsel-legal', affiliateUrl: '', badge: 'CC' },
  'lexis-protege': { id: 'lexis-protege', name: 'Lexis+ AI with Protégé', url: 'https://www.lexisnexis.com/en-us/products/lexis-plus-ai.page', affiliateUrl: '', badge: 'LX' },
  spellbook: { id: 'spellbook', name: 'Spellbook', url: 'https://www.spellbook.legal/', affiliateUrl: '', badge: 'SB' },
  taxdome: { id: 'taxdome', name: 'TaxDome', url: 'https://taxdome.com/', affiliateUrl: '', badge: 'TD' },
  karbon: { id: 'karbon', name: 'Karbon', url: 'https://karbonhq.com/', affiliateUrl: '', badge: 'KB' },
  quickbooks: { id: 'quickbooks', name: 'QuickBooks Online (Intuit Assist)', url: 'https://quickbooks.intuit.com/', affiliateUrl: '', badge: 'QB' },
  dext: { id: 'dext', name: 'Dext', url: 'https://dext.com/', affiliateUrl: '', badge: 'DX' },
  jump: { id: 'jump', name: 'Jump', url: 'https://jump.ai/', affiliateUrl: '', badge: 'JP' },
  zocks: { id: 'zocks', name: 'Zocks', url: 'https://www.zocks.io/', affiliateUrl: '', badge: 'ZK' },
  holistiplan: { id: 'holistiplan', name: 'Holistiplan', url: 'https://www.holistiplan.com/', affiliateUrl: '', badge: 'HP' },
  wealthbox: { id: 'wealthbox', name: 'Wealthbox', url: 'https://www.wealthbox.com/', affiliateUrl: '', badge: 'WB' },
  'appfolio-realmx': { id: 'appfolio-realmx', name: 'AppFolio Realm-X', url: 'https://www.appfolio.com/ai', affiliateUrl: '', badge: 'AF' },
  fathom: { id: 'fathom', name: 'Fathom', url: 'https://www.fathom.ai/', affiliateUrl: '', badge: 'FA' },
  otter: { id: 'otter', name: 'Otter.ai', url: 'https://otter.ai/', affiliateUrl: '', badge: 'OT' },
  'zoom-companion': { id: 'zoom-companion', name: 'Zoom AI Companion', url: 'https://www.zoom.com/en/products/ai-assistant/', affiliateUrl: '', badge: 'ZM' },
  canva: { id: 'canva', name: 'Canva (Magic Studio)', url: 'https://www.canva.com/magic/', affiliateUrl: '', badge: 'CV' },
  'hubspot-breeze': { id: 'hubspot-breeze', name: 'HubSpot Breeze', url: 'https://www.hubspot.com/products/artificial-intelligence', affiliateUrl: '', badge: 'HS' },
  'notion-ai': { id: 'notion-ai', name: 'Notion AI', url: 'https://www.notion.com/product/ai', affiliateUrl: '', badge: 'NO' },
  zapier: { id: 'zapier', name: 'Zapier', url: 'https://zapier.com/', affiliateUrl: '', badge: 'ZP' },
  make: { id: 'make', name: 'Make', url: 'https://www.make.com/', affiliateUrl: '', badge: 'MK' },
}

export function getTool(id: string): Tool {
  const tool = TOOLS[id]
  if (!tool) throw new Error(`Unknown tool id: ${id}`)
  return tool
}

export function toolHref(tool: Tool) {
  return tool.affiliateUrl || tool.url
}
