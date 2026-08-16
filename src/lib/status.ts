import type { StatusTone } from "@/lib/types";

export function toneFor(status: string): StatusTone {
  const s = status.toLowerCase();
  if (["expired", "overdue", "blocked", "failed", "rejected", "voided", "cancelled", "danger", "locked"].some((k) => s.includes(k)))
    return "danger";
  if (["expiring", "awaiting", "pending", "partial", "disputed", "warning", "incomplete", "mobilizing", "under review", "requested", "validation"].some((k) => s.includes(k)))
    return "warning";
  if (["approved", "active", "paid", "valid", "cleared", "ready", "filled", "finalized", "confirmed", "reconciled"].some((k) => s.includes(k)))
    return "success";
  if (["draft", "new", "not sent", "closed", "archived", "inactive"].some((k) => s.includes(k))) return "neutral";
  if (["info", "issued"].some((k) => s.includes(k))) return "info";
  return "neutral";
}

export function statusIcon(status: string) {
  const t = toneFor(status);
  if (t === "success") return "✓";
  if (t === "warning") return "!";
  if (t === "danger") return "×";
  return "•";
}
