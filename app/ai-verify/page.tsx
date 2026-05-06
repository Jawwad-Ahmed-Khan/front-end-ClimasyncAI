"use client";

import { useState, useRef, useCallback } from "react";
import {
  verifyText,
  verifyMedia,
  verifyMixed,
  type VerificationResult,
  type VerificationVerdict,
} from "@/app/_lib/verification/verificationService";
import styles from "./verify.module.css";

// ─── helpers ────────────────────────────────────────────────────────────────

const VERDICT_META: Record<
  VerificationVerdict,
  { label: string; color: string; icon: string }
> = {
  authentic:           { label: "Authentic",           color: "#22c55e", icon: "✅" },
  likely_authentic:    { label: "Likely Authentic",    color: "#84cc16", icon: "🟢" },
  uncertain:           { label: "Uncertain",           color: "#f59e0b", icon: "⚠️" },
  likely_manipulated:  { label: "Likely Manipulated",  color: "#f97316", icon: "🟠" },
  manipulated:         { label: "Manipulated / Fake",  color: "#ef4444", icon: "❌" },
};

const ACTION_META: Record<string, { label: string; color: string }> = {
  approve_and_alert:       { label: "Approve & Alert",          color: "#22c55e" },
  flag_for_human_review:   { label: "Flag for Human Review",    color: "#f59e0b" },
  reject_as_misinformation:{ label: "Reject as Misinformation", color: "#ef4444" },
  request_more_info:       { label: "Request More Info",        color: "#60a5fa" },
};

// ─── component ──────────────────────────────────────────────────────────────

type Tab = "text" | "media" | "mixed";

export default function VerifyPage() {
  const [tab, setTab] = useState<Tab>("text");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // text tab
  const [textInput, setTextInput] = useState("");
  const [contextInput, setContextInput] = useState("");

  // media / mixed tab
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleSubmit = async () => {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      let res: VerificationResult;
      if (tab === "text") {
        if (!textInput.trim()) throw new Error("Please enter some text to verify.");
        res = await verifyText(textInput, contextInput || undefined);
      } else if (tab === "media") {
        if (!file) throw new Error("Please upload an image to verify.");
        res = await verifyMedia(file, caption || undefined);
      } else {
        if (!textInput.trim()) throw new Error("Please enter text to verify.");
        res = await verifyMixed(textInput, file || undefined);
      }
      setResult(res);
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Verification failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setFile(null);
    setPreview(null);
    setTextInput("");
    setCaption("");
    setContextInput("");
  };

  const verdict = result ? VERDICT_META[result.verdict] : null;
  const action = result ? ACTION_META[result.recommended_action] : null;
  const scoreColor =
    result
      ? result.authenticity_score >= 7
        ? "#22c55e"
        : result.authenticity_score >= 4
        ? "#f59e0b"
        : "#ef4444"
      : "#60a5fa";

  return (
    <main className={styles.page}>
      {/* ── hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>🤖 AI-Powered</div>
        <h1 className={styles.heroTitle}>
          Disaster Content<br />
          <span className={styles.heroGradient}>Verification Agent</span>
        </h1>
        <p className={styles.heroSub}>
          Submit images, videos, or text reports for instant AI authenticity analysis.
          Powered by GPT-4o Vision — built to fight disaster misinformation.
        </p>
      </section>

      <div className={styles.container}>
        {/* ── tabs ── */}
        <div className={styles.tabs}>
          {(["text", "media", "mixed"] as Tab[]).map((t) => (
            <button
              key={t}
              className={`${styles.tab} ${tab === t ? styles.tabActive : ""}`}
              onClick={() => { setTab(t); reset(); }}
            >
              {t === "text" && "📝 Text Report"}
              {t === "media" && "🖼️ Image / Video"}
              {t === "mixed" && "🔀 Image + Text"}
            </button>
          ))}
        </div>

        {!result ? (
          <div className={styles.card}>
            {/* text input — shown for text & mixed */}
            {(tab === "text" || tab === "mixed") && (
              <div className={styles.field}>
                <label className={styles.label}>
                  {tab === "mixed" ? "Accompanying Text / Caption" : "Text Content to Verify"}
                </label>
                <textarea
                  className={styles.textarea}
                  rows={6}
                  placeholder={
                    tab === "text"
                      ? "Paste a social media post, eyewitness report, news snippet…"
                      : "Enter the caption or claim accompanying this media…"
                  }
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
              </div>
            )}

            {/* context — text tab only */}
            {tab === "text" && (
              <div className={styles.field}>
                <label className={styles.label}>Context (optional)</label>
                <input
                  className={styles.input}
                  placeholder="e.g. Flood in Sindh, August 2024"
                  value={contextInput}
                  onChange={(e) => setContextInput(e.target.value)}
                />
              </div>
            )}

            {/* file drop zone — media & mixed */}
            {(tab === "media" || tab === "mixed") && (
              <div className={styles.field}>
                <label className={styles.label}>
                  {tab === "mixed" ? "Image (optional)" : "Image File"}
                </label>
                <div
                  className={styles.dropzone}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onDrop}
                  onClick={() => fileRef.current?.click()}
                >
                  {preview ? (
                    <img src={preview} alt="preview" className={styles.preview} />
                  ) : (
                    <>
                      <span className={styles.dropIcon}>📂</span>
                      <p className={styles.dropText}>
                        Drag & drop or <u>click to browse</u>
                      </p>
                      <p className={styles.dropHint}>JPEG · PNG · WEBP · GIF — max 20MB</p>
                    </>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFile(f);
                    }}
                  />
                </div>
                {file && (
                  <p className={styles.fileName}>
                    📎 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    <button className={styles.clearFile} onClick={() => { setFile(null); setPreview(null); }}>✕</button>
                  </p>
                )}

                {/* caption for media-only */}
                {tab === "media" && (
                  <div className={styles.field} style={{ marginTop: "1rem" }}>
                    <label className={styles.label}>Caption / Claim (optional)</label>
                    <input
                      className={styles.input}
                      placeholder="What does this image claim to show?"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}

            {error && <div className={styles.errorBanner}>⚠️ {error}</div>}

            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <span className={styles.spinner}>
                  <span className={styles.spinnerDot} /> Analyzing with GPT-4o…
                </span>
              ) : (
                "🔍 Run Verification"
              )}
            </button>

            {loading && (
              <p className={styles.loadingNote}>
                Vision analysis can take 15–30 seconds. Please wait…
              </p>
            )}
          </div>
        ) : (
          /* ── results ── */
          <div className={styles.results}>
            {/* verdict header */}
            <div
              className={styles.verdictCard}
              style={{ borderColor: verdict!.color, boxShadow: `0 0 40px ${verdict!.color}22` }}
            >
              <div className={styles.verdictIcon}>{verdict!.icon}</div>
              <div>
                <p className={styles.verdictLabel}>Verdict</p>
                <h2 className={styles.verdictText} style={{ color: verdict!.color }}>
                  {verdict!.label}
                </h2>
                <p className={styles.verdictSummary}>{result.summary}</p>
              </div>
            </div>

            {/* score strip */}
            <div className={styles.scoreStrip}>
              <ScoreMeter value={result.authenticity_score} color={scoreColor} label="Authenticity Score" max={10} />
              <ScoreMeter value={result.confidence * 10} color="#60a5fa" label="AI Confidence" max={10} />
              <div className={styles.pill} style={{ backgroundColor: action!.color + "22", borderColor: action!.color, color: action!.color }}>
                <span>⚡ {action!.label}</span>
              </div>
              <div className={styles.pill} style={{ backgroundColor: "#a78bfa22", borderColor: "#a78bfa", color: "#a78bfa" }}>
                <span>🌊 {result.disaster_relevance.replace("_", " ")} relevance</span>
              </div>
            </div>

            {/* signals */}
            <div className={styles.signalGrid}>
              {result.supporting_signals.length > 0 && (
                <SignalList title="✅ Supporting Signals" signals={result.supporting_signals} accent="#22c55e" />
              )}
              {result.red_flags.length > 0 && (
                <SignalList title="🚩 Red Flags" signals={result.red_flags} accent="#ef4444" />
              )}
            </div>

            {/* reasoning */}
            <details className={styles.reasoning}>
              <summary>🧠 Full AI Reasoning</summary>
              <p>{result.reasoning}</p>
            </details>

            <button className={styles.resetBtn} onClick={reset}>
              ← Run Another Verification
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

// ─── sub-components ──────────────────────────────────────────────────────────

function ScoreMeter({ value, color, label, max }: { value: number; color: string; label: string; max: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className={styles.meter}>
      <div className={styles.meterLabel}>{label}</div>
      <div className={styles.meterBar}>
        <div className={styles.meterFill} style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <div className={styles.meterValue} style={{ color }}>{value.toFixed(1)} / {max}</div>
    </div>
  );
}

function SignalList({ title, signals, accent }: { title: string; signals: any[]; accent: string }) {
  return (
    <div className={styles.signalBox} style={{ borderColor: accent + "44" }}>
      <h3 className={styles.signalTitle} style={{ color: accent }}>{title}</h3>
      {signals.map((s, i) => (
        <div key={i} className={styles.signal}>
          <span className={styles.signalWeight} style={{
            backgroundColor: s.weight === "strong" ? accent + "33" : s.weight === "moderate" ? accent + "22" : accent + "11",
            color: accent,
          }}>
            {s.weight}
          </span>
          <div>
            <p className={styles.signalLabel}>{s.label}</p>
            <p className={styles.signalDetail}>{s.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
