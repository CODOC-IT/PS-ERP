import { useEffect, type ReactNode } from "react";
import { Button, cn } from "./primitives";

export function Modal({
  open,
  title,
  children,
  onClose,
  footer,
  wide,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-charcoal/40" aria-label="Close" onClick={onClose} />
      <div className={cn("relative w-full rounded-[8px] border border-line bg-white", wide ? "max-w-2xl" : "max-w-md")}>
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="font-heading text-[16px] font-semibold">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="px-4 py-3 text-[13px]">{children}</div>
        {footer ? <div className="flex justify-end gap-2 border-t border-line px-4 py-3">{footer}</div> : null}
      </div>
    </div>
  );
}

export function Drawer({
  open,
  title,
  children,
  onClose,
  footer,
  width = 420,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  width?: number;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <button type="button" className="absolute inset-0 bg-charcoal/40" aria-label="Close" onClick={onClose} />
      <aside
        className="absolute inset-y-0 end-0 flex w-full max-w-full flex-col border-s border-line bg-white"
        style={{ width }}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="font-heading text-[16px] font-semibold">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="flex-1 overflow-auto px-4 py-3">{children}</div>
        {footer ? <div className="flex justify-end gap-2 border-t border-line px-4 py-3">{footer}</div> : null}
      </aside>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  danger,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  body: ReactNode;
  confirmLabel: string;
  danger?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="text-ink">{body}</div>
    </Modal>
  );
}

export function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: { id: string; text: string; tone?: "success" | "danger" | "info" }[];
  onDismiss: (id: string) => void;
}) {
  if (!toasts.length) return null;
  return (
    <div className="pointer-events-none fixed end-4 bottom-4 z-50 flex w-[360px] max-w-[calc(100%-2rem)] flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto rounded-[8px] border border-line bg-white px-3 py-2 text-[13px] shadow-panel",
            t.tone === "danger" && "border-danger/30",
            t.tone === "success" && "border-success/30",
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <span>{t.text}</span>
            <button type="button" className="text-muted" onClick={() => onDismiss(t.id)}>
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Timeline({ items }: { items: { date: string; text: string }[] }) {
  return (
    <ol className="relative ms-2 border-s border-line">
      {items.map((item, i) => (
        <li key={i} className="mb-3 ms-4">
          <span className="absolute -start-1 mt-1.5 size-2 rounded-full bg-gold" />
          <div className="text-[12px] text-muted">{item.date}</div>
          <div className="text-[13px] text-ink">{item.text}</div>
        </li>
      ))}
    </ol>
  );
}

export function Restricted({ explanation }: { explanation?: string }) {
  return (
    <div className="rounded-[8px] border border-line bg-white px-6 py-16 text-center">
      <div className="font-heading text-[16px] font-semibold">You cannot do this with your current role</div>
      <p className="mx-auto mt-1 max-w-md text-[13px] text-muted">
        {explanation ?? "This action is hidden or disabled because your role does not include the required permission."}
      </p>
    </div>
  );
}
