const riyadhFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Riyadh",
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const riyadhTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Riyadh",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function money(n: number) {
  const abs = Math.abs(n);
  const formatted = abs.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return n < 0 ? `−SAR ${formatted}` : `SAR ${formatted}`;
}

export function moneyPlain(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatDate(iso: string) {
  if (!iso) return "—";
  const d = iso.length <= 10 ? new Date(`${iso}T12:00:00+03:00`) : new Date(iso);
  return riyadhFmt.format(d).replace(/ /g, " ");
}

export function formatDateTime(iso: string) {
  return riyadhTime.format(new Date(iso));
}

export function hijri(iso: string) {
  const d = iso.length <= 10 ? new Date(`${iso}T12:00:00+03:00`) : new Date(iso);
  return new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Riyadh",
  }).format(d);
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export function daysUntil(iso: string) {
  const end = new Date(`${iso}T12:00:00+03:00`).getTime();
  const now = new Date("2026-08-16T12:00:00+03:00").getTime();
  return Math.round((end - now) / 86400000);
}

export function fullName(e: { firstName: string; lastName: string; preferredName?: string }) {
  return `${e.firstName} ${e.lastName}`;
}
