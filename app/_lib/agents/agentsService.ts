/**
 * ClimaSync.AI — AI Agents API Service
 *
 * Calls the backend AI agent pipeline endpoints:
 *   POST /agents/analyze/{event_id}  — full 4-agent pipeline
 *   POST /agents/extract/{event_id}  — Agent 1 only (debug)
 *   POST /agents/risk/{event_id}     — Agents 1+2 (debug)
 */
import { apiClient } from "../apiClient";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RiskReport {
  risk_level: "low" | "medium" | "high" | "critical";
  severity_score: number;
  affected_population_estimate: number;
  estimated_damage_pkr: number | null;
  key_risk_factors: string[];
  recommended_response_window_hours: number;
  confidence: number;
  reasoning: string;
}

export interface AgentPipelineResult {
  event_id: string;
  risk_report: RiskReport;
  tasks_created: number;
  tasks_allocated: number;
  unallocated_task_ids: string[];
  allocation_summary: string;
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

/** Run the full 4-agent disaster management pipeline */
export async function runAgentPipeline(eventId: string): Promise<AgentPipelineResult> {
  const response = await apiClient.post<AgentPipelineResult>(
    `/agents/analyze/${eventId}`
  );
  return response.data;
}

/** Run only Agent 1 — Data Extraction (debug) */
export async function extractDisasterContext(eventId: string): Promise<unknown> {
  const response = await apiClient.post(`/agents/extract/${eventId}`);
  return response.data;
}

/** Run Agents 1+2 — Data Extraction + Risk Analysis (debug) */
export async function analyzeRisk(eventId: string): Promise<RiskReport> {
  const response = await apiClient.post<RiskReport>(`/agents/risk/${eventId}`);
  return response.data;
}
