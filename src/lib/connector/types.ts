/**
 * SAC Connector — Protocol Types
 *
 * The SAC Connector is the attached-runtime contract between the control plane
 * (superaicoach-site) and Jarvis. It provides a narrow, stable set of operations
 * that let Jarvis read and act on real workspace state without routing through
 * an external gateway.
 *
 * Lane 2 (Attached Connector) only — no hosted runtime, no OpenClaw dependency.
 */

// ---------------------------------------------------------------------------
// Operation types
// ---------------------------------------------------------------------------

export type ConnectorOperation =
  | 'chat'
  | 'read_project_state'
  | 'read_note'
  | 'create_task'
  | 'update_task'
  | 'append_note'
  | 'propose_plan'

// ---------------------------------------------------------------------------
// Message format (OpenAI-compatible)
// ---------------------------------------------------------------------------

export interface ConnectorMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// ---------------------------------------------------------------------------
// Request shapes per operation
// ---------------------------------------------------------------------------

export interface ConnectorChatRequest {
  op: 'chat'
  messages: ConnectorMessage[]
  /** Optional: the caller already has board context and passes it in */
  workspaceContext?: WorkspaceContext
}

export interface ConnectorReadProjectStateRequest {
  op: 'read_project_state'
  /** Filter to a specific project name */
  project?: string
}

export interface ConnectorReadNoteRequest {
  op: 'read_note'
  noteId: string
}

export interface ConnectorCreateTaskRequest {
  op: 'create_task'
  project: string
  status: string
  description: string
  priority: TaskPriority
  column?: TaskColumn
}

export interface ConnectorUpdateTaskRequest {
  op: 'update_task'
  taskId: string
  patch: Partial<{
    status: string
    description: string
    priority: TaskPriority
    column: TaskColumn
  }>
}

export interface ConnectorAppendNoteRequest {
  op: 'append_note'
  noteId: string
  content: string
}

export interface ConnectorProposePlanRequest {
  op: 'propose_plan'
  goal: string
  workspaceContext?: WorkspaceContext
}

export type ConnectorRequest =
  | ConnectorChatRequest
  | ConnectorReadProjectStateRequest
  | ConnectorReadNoteRequest
  | ConnectorCreateTaskRequest
  | ConnectorUpdateTaskRequest
  | ConnectorAppendNoteRequest
  | ConnectorProposePlanRequest

// ---------------------------------------------------------------------------
// Response shapes
// ---------------------------------------------------------------------------

export interface ConnectorResponseBase {
  ok: boolean
  op: ConnectorOperation
}

export interface ConnectorChatResponse extends ConnectorResponseBase {
  ok: true
  op: 'chat'
  /** Streaming: not returned here — handled via SSE route */
  message?: string
  usage?: ConnectorUsage
}

export interface ConnectorProjectStateResponse extends ConnectorResponseBase {
  ok: true
  op: 'read_project_state'
  state: WorkspaceContext
}

export interface ConnectorErrorResponse extends ConnectorResponseBase {
  ok: false
  error: string
}

export type ConnectorResponse =
  | ConnectorChatResponse
  | ConnectorProjectStateResponse
  | ConnectorErrorResponse

// ---------------------------------------------------------------------------
// Workspace context — the structured state injected into Jarvis prompts
// ---------------------------------------------------------------------------

export type TaskPriority = 'High' | 'Medium' | 'Low'
export type TaskColumn = 'active' | 'in-review' | 'needs-you' | 'done'

export interface WorkspaceTask {
  id: string
  project: string
  status: string
  description: string
  priority: TaskPriority
  column: TaskColumn
}

export interface WorkspaceContext {
  tenantSlug: string
  fetchedAt: string
  projects: string[]
  tasks: WorkspaceTask[]
  counts: {
    total: number
    needsYou: number
    active: number
    done: number
  }
}

// ---------------------------------------------------------------------------
// Token usage (for cost visibility)
// ---------------------------------------------------------------------------

export interface ConnectorUsage {
  inputTokens: number
  outputTokens: number
  /** Estimated cost in USD cents */
  estimatedCostCents?: number
}
