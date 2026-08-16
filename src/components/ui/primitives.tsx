import { Link } from "react-router-dom";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import type { StatusTone } from "@/lib/types";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function Button({
  variant = "secondary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "gold" | "secondary" | "ghost" | "danger" | "danger-outline";
  size?: "sm" | "md";
}) {
  const base =
    "inline-flex items-center justify-center gap-1.5 font-medium transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";
  const sizes = size === "sm" ? "h-8 px-2.5 text-[13px] rounded-[6px]" : "h-9 px-3 text-[13px] rounded-[6px]";
  const variants = {
    primary: "bg-charcoal text-white hover:bg-nav",
    gold: "bg-gold text-charcoal hover:bg-gold-deep",
    secondary: "bg-white text-ink border border-line hover:bg-surface-2",
    ghost: "bg-transparent text-ink hover:bg-surface-2",
    danger: "bg-danger text-white hover:bg-[#8f1c14]",
    "danger-outline": "bg-white text-danger border border-danger/30 hover:bg-danger-bg",
  };
  return <button className={cn(base, sizes, variants[variant], className)} {...props} />;
}

export function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1 flex items-center gap-1 text-[12px] font-medium text-ink">
        {label}
        {required ? <span className="text-danger">*</span> : null}
      </span>
      {children}
      {error ? <span className="mt-1 block text-[12px] text-danger">{error}</span> : null}
      {hint && !error ? <span className="mt-1 block text-[12px] text-muted">{hint}</span> : null}
    </label>
  );
}

const inputCls =
  "w-full h-9 rounded-[6px] border border-line bg-white px-2.5 text-[13px] text-ink placeholder:text-muted/80";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputCls, props.className)} {...props} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(inputCls, "h-auto min-h-[88px] py-2", props.className)} {...props} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(inputCls, props.className)} {...props} />;
}

export function Checkbox({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className="inline-flex items-center gap-2 text-[13px] text-ink">
      <input type="checkbox" className="size-4 accent-charcoal" {...props} />
      {label}
    </label>
  );
}

export function StatusBadge({
  children,
  tone = "neutral",
  icon,
}: {
  children: ReactNode;
  tone?: StatusTone;
  icon?: ReactNode;
}) {
  const map: Record<StatusTone, string> = {
    neutral: "bg-surface-2 text-ink",
    success: "bg-success-bg text-success",
    warning: "bg-warning-bg text-warning",
    danger: "bg-danger-bg text-danger",
    info: "bg-info-bg text-info",
    gold: "bg-[#f4ead6] text-charcoal",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-medium", map[tone])}>
      {icon}
      {children}
    </span>
  );
}

export function Alert({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warning" | "danger" | "success";
  title?: string;
  children?: ReactNode;
}) {
  const map = {
    info: "bg-info-bg text-info border-info/20",
    warning: "bg-warning-bg text-warning border-warning/20",
    danger: "bg-danger-bg text-danger border-danger/20",
    success: "bg-success-bg text-success border-success/20",
  };
  return (
    <div className={cn("rounded-[8px] border px-3 py-2.5 text-[13px]", map[tone])}>
      {title ? <div className="font-medium text-ink">{title}</div> : null}
      {children ? <div className={cn(title && "mt-1", "text-ink")}>{children}</div> : null}
    </div>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-[8px] border border-line bg-surface", className)}>{children}</div>;
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <h2 className="font-heading text-[20px] font-semibold text-ink">{children}</h2>
      {action}
    </div>
  );
}

export function Kpi({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "danger" | "warning" | "gold";
}) {
  return (
    <div className="min-w-0">
      <div className="text-[12px] text-muted">{label}</div>
      <div
        className={cn(
          "mt-0.5 font-heading text-[22px] font-semibold tabular-nums",
          tone === "danger" && "text-danger",
          tone === "warning" && "text-warning",
          tone === "gold" && "text-gold-deep",
          !tone && "text-ink",
        )}
      >
        {value}
      </div>
      {hint ? <div className="text-[12px] text-muted">{hint}</div> : null}
    </div>
  );
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-nav text-[12px] font-semibold text-gold"
      style={{ width: size, height: size }}
    >
      {initials}
    </span>
  );
}

export function Tabs({
  tabs,
  value,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-line">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={cn(
            "relative -mb-px shrink-0 px-3 py-2 text-[13px] font-medium",
            value === t.id ? "text-ink" : "text-muted hover:text-ink",
          )}
        >
          {t.label}
          {value === t.id ? <span className="absolute inset-x-2 bottom-0 h-0.5 bg-gold" /> : null}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="font-heading text-[16px] font-semibold text-ink">{title}</div>
      {body ? <p className="mx-auto mt-1 max-w-md text-[13px] text-muted">{body}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function SkeletonRows({ rows = 8, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="p-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="mb-2 flex gap-2">
          {Array.from({ length: cols }).map((__, j) => (
            <div key={j} className="h-4 flex-1 rounded-[4px] bg-surface-2" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function Money({ value, className }: { value: number; className?: string }) {
  const abs = Math.abs(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return <span className={cn("tabular-nums", className)}>{value < 0 ? `−SAR ${abs}` : `SAR ${abs}`}</span>;
}

export function PageHeader({
  breadcrumb,
  title,
  description,
  actions,
}: {
  breadcrumb?: ReactNode;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        {breadcrumb ? <div className="mb-1 text-[12px] text-muted">{breadcrumb}</div> : null}
        <h1 className="font-heading text-[28px] font-semibold leading-tight text-ink">{title}</h1>
        {description ? <div className="mt-1 text-[13px] text-muted">{description}</div> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Crumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="flex flex-wrap items-center gap-1">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1">
          {i > 0 ? <span className="text-line">/</span> : null}
          {item.to ? (
            <Link to={item.to} className="hover:text-ink">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
