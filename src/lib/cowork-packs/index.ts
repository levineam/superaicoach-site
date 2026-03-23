export interface SkillCard {
  icon: string
  title: string
  description: string
}

export interface Workflow {
  name: string
  description: string
}

export interface CoworkPack {
  profession: string
  label: string
  tagline: string
  skillCards: SkillCard[]
  customInstructions: string
  folderStructure: string[]
  workflows: Workflow[]
  connectors: string[]
}

import { financialAdvisorPack } from './financial-advisor'
import { attorneyPack } from './attorney'
import { executivePack } from './executive'

export const COWORK_PACKS: CoworkPack[] = [
  financialAdvisorPack,
  attorneyPack,
  executivePack,
]

export function getPackByProfession(profession: string): CoworkPack | undefined {
  return COWORK_PACKS.find((p) => p.profession === profession)
}

export function buildPackEmailHtml(pack: CoworkPack): string {
  const folderList = pack.folderStructure.map((f) => `<li>${f}</li>`).join('\n')
  const workflowList = pack.workflows
    .map(
      (w) =>
        `<li><strong>${w.name}</strong><br/><span style="color:#64748b">${w.description}</span></li>`,
    )
    .join('\n')
  const connectorList = pack.connectors.map((c) => `<li>${c}</li>`).join('\n')

  return `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; color: #1e293b;">
  <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 4px;">Your ${pack.label} Cowork Starter Pack</h1>
  <p style="color: #64748b; font-size: 15px; margin-bottom: 32px;">Everything you need to set up Claude Cowork for your practice.</p>

  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />

  <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">📋 Custom Instructions</h2>
  <p style="font-size: 13px; color: #64748b; margin-bottom: 8px;">Copy and paste this into your Cowork project's custom instructions:</p>
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; margin-bottom: 32px;">${pack.customInstructions}</div>

  <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">📁 Recommended Folder Structure</h2>
  <p style="font-size: 13px; color: #64748b; margin-bottom: 8px;">Create these folders in your Cowork project:</p>
  <ul style="font-size: 14px; line-height: 2; padding-left: 20px; margin-bottom: 32px;">
    ${folderList}
  </ul>

  <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">⚡ Workflows</h2>
  <p style="font-size: 13px; color: #64748b; margin-bottom: 8px;">Try these recurring workflows to get the most out of your setup:</p>
  <ol style="font-size: 14px; line-height: 1.8; padding-left: 20px; margin-bottom: 32px;">
    ${workflowList}
  </ol>

  <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">🔌 Connector Setup</h2>
  <p style="font-size: 13px; color: #64748b; margin-bottom: 8px;">Connect these services in your Cowork project settings:</p>
  <ul style="font-size: 14px; line-height: 2; padding-left: 20px; margin-bottom: 8px;">
    ${connectorList}
  </ul>
  <p style="font-size: 13px; color: #64748b; margin-bottom: 32px;">In Cowork, go to Project Settings → Connectors → Add each service and follow the authorization prompts.</p>

  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />

  <p style="font-size: 14px; color: #64748b;">
    Need help setting up? Reply to this email or visit <a href="https://superaicoach.com" style="color: #3b82f6;">superaicoach.com</a>.
  </p>
</div>
`.trim()
}

export function buildInternalNotificationHtml(
  email: string,
  pack: CoworkPack,
  source: string,
): string {
  return `
<div style="font-family: -apple-system, sans-serif; max-width: 480px; padding: 24px;">
  <h2 style="font-size: 18px; color: #0f172a;">New Cowork Pack Request</h2>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Profession:</strong> ${pack.label}</p>
  <p><strong>Source:</strong> ${source}</p>
  <p><strong>Time:</strong> ${new Date().toISOString()}</p>
</div>
`.trim()
}
