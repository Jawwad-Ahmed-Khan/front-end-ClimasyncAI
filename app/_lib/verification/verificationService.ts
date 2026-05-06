/**
 * ClimaSync.AI — Verification Agent API Service
 *
 * Interfaces with the backend AI Verification endpoints:
 *   POST /verify/text   — text-only analysis
 *   POST /verify/media  — image/video upload
 *   POST /verify/mixed  — image + text together
 */
import axios from "axios";
import { API_BASE_URL } from "../auth/authConstants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type VerificationVerdict =
  | "authentic"
  | "likely_authentic"
  | "uncertain"
  | "likely_manipulated"
  | "manipulated";

export type RecommendedAction =
  | "approve_and_alert"
  | "flag_for_human_review"
  | "reject_as_misinformation"
  | "request_more_info";

export interface VerificationSignal {
  label: string;
  detail: string;
  weight: "strong" | "moderate" | "weak";
  supports_authentic: boolean;
}

export interface VerificationResult {
  verdict: VerificationVerdict;
  confidence: number;
  authenticity_score: number;
  content_type: "image" | "video" | "text" | "mixed";
  disaster_relevance: "high" | "medium" | "low" | "not_disaster_related";
  supporting_signals: VerificationSignal[];
  red_flags: VerificationSignal[];
  summary: string;
  recommended_action: RecommendedAction;
  reasoning: string;
}

// ---------------------------------------------------------------------------
// API calls (no auth required for verification — public interest endpoint)
// ---------------------------------------------------------------------------

const verifyClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000, // 90s — vision calls can be slow
});

/** Verify plain text content */
export async function verifyText(
  text: string,
  context?: string
): Promise<VerificationResult> {
  const response = await verifyClient.post<VerificationResult>("/verify/text", {
    text,
    context: context || null,
  });
  return response.data;
}

/** Verify an image or video file */
export async function verifyMedia(
  file: File,
  caption?: string
): Promise<VerificationResult> {
  const formData = new FormData();
  formData.append("file", file);
  if (caption) formData.append("caption", caption);

  const response = await verifyClient.post<VerificationResult>(
    "/verify/media",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
}

/** Verify image + text together */
export async function verifyMixed(
  text: string,
  file?: File
): Promise<VerificationResult> {
  const formData = new FormData();
  formData.append("text", text);
  if (file) formData.append("file", file);

  const response = await verifyClient.post<VerificationResult>(
    "/verify/mixed",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
}
