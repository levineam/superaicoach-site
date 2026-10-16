import type { IndustryId, UseCase } from '../types'
import lawIntakeCallToMatterSummary from './law-intake-call-to-matter-summary'
import lawDeadlinesFromCourtDocuments from './law-deadlines-from-court-documents'
import lawClientStatusUpdates from './law-client-status-updates'
import lawFirstPassResearchWithCitations from './law-first-pass-research-with-citations'
import lawContractReviewInWord from './law-contract-review-in-word'
import cpaChaseMissingClientDocuments from './cpa-chase-missing-client-documents'
import cpaCategorizeTransactionsMatchReceipts from './cpa-categorize-transactions-match-receipts'
import cpaTaxSeasonClientQuestions from './cpa-tax-season-client-questions'
import cpaPlainEnglishFinancialSummary from './cpa-plain-english-financial-summary'
import riaMeetingNotesToCrm from './ria-meeting-notes-to-crm'
import riaClientReviewPrepBrief from './ria-client-review-prep-brief'
import riaTaxReturnSummary from './ria-tax-return-summary'
import pmAfterHoursLeasingInquiries from './pm-after-hours-leasing-inquiries'
import pmMaintenanceRequestTriage from './pm-maintenance-request-triage'
import pmOwnerReportCommentary from './pm-owner-report-commentary'
import agencyKickoffCallToCreativeBrief from './agency-kickoff-call-to-creative-brief'
import agencyRepurposeContent from './agency-repurpose-content'
import agencyProposalFirstDrafts from './agency-proposal-first-drafts'
import officeMeetingNotesActionItems from './office-meeting-notes-action-items'
import officeSharedInboxTriage from './office-shared-inbox-triage'
import officeConnectAppsNoRetyping from './office-connect-apps-no-retyping'
import officeSearchYourOwnFiles from './office-search-your-own-files'
import officeWriteAiUsePolicy from './office-write-ai-use-policy'
import dentalOfficeAiReceptionist from './dental-office-ai-receptionist'
import medicalAiScribeVisitNotes from './medical-ai-scribe-visit-notes'
import restaurantReplyToGoogleReviews from './restaurant-reply-to-google-reviews'
import contractorAiReceptionistMissedCalls from './contractor-ai-receptionist-missed-calls'
import nonprofitGrantProposalFirstDrafts from './nonprofit-grant-proposal-first-drafts'
import realEstateListingDescriptions from './real-estate-listing-descriptions'

/** All use cases, in display order. Add a new file in this folder and list it here. */
export const USE_CASES: UseCase[] = [
  lawIntakeCallToMatterSummary,
  lawDeadlinesFromCourtDocuments,
  lawClientStatusUpdates,
  lawFirstPassResearchWithCitations,
  lawContractReviewInWord,
  cpaChaseMissingClientDocuments,
  cpaCategorizeTransactionsMatchReceipts,
  cpaTaxSeasonClientQuestions,
  cpaPlainEnglishFinancialSummary,
  riaMeetingNotesToCrm,
  riaClientReviewPrepBrief,
  riaTaxReturnSummary,
  pmAfterHoursLeasingInquiries,
  pmMaintenanceRequestTriage,
  pmOwnerReportCommentary,
  agencyKickoffCallToCreativeBrief,
  agencyRepurposeContent,
  agencyProposalFirstDrafts,
  officeMeetingNotesActionItems,
  officeSharedInboxTriage,
  officeConnectAppsNoRetyping,
  officeSearchYourOwnFiles,
  officeWriteAiUsePolicy,
  realEstateListingDescriptions,
  nonprofitGrantProposalFirstDrafts,
  contractorAiReceptionistMissedCalls,
  restaurantReplyToGoogleReviews,
  medicalAiScribeVisitNotes,
  dentalOfficeAiReceptionist,
]

export function getUseCase(slug: string) {
  return USE_CASES.find((u) => u.slug === slug)
}

export function casesForIndustry(industry: IndustryId) {
  return USE_CASES.filter((u) => u.industry === industry)
}

export const FEATURED_USE_CASES = USE_CASES.filter((u) => u.featured)
