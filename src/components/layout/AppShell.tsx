import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { CLIENTS, EMPLOYEES, INVOICES, TIMESHEETS } from "@/data";
import { t } from "@/lib/i18n";
import { useApp } from "@/store/AppState";
import { Input } from "@/components/ui/primitives";
import { ToastStack } from "@/components/ui/overlays";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell() {
  const { role, searchOpen, setSearchOpen, createOpen, setCreateOpen, notifyOpen, setNotifyOpen, notifications, markRead, toasts, dismissToast, locale, recentlyViewed } =
    useApp();
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    if (role === "employee" && !loc.pathname.startsWith("/portal")) nav("/portal", { replace: true });
  }, [role, loc.pathname, nav]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="erp-scroll min-h-0 flex-1 overflow-auto p-5">
          <Outlet />
        </main>
      </div>
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      {searchOpen ? (
        <div className="fixed inset-0 z-50">
          <button type="button" className="absolute inset-0 bg-charcoal/40" onClick={() => setSearchOpen(false)} />
          <div className="relative mx-auto mt-20 w-[640px] max-w-[calc(100%-2rem)] rounded-[8px] border border-line bg-white">
            <div className="border-b border-line p-3">
              <Input autoFocus placeholder={t(locale, "searchPh")} defaultValue="Ahmed" />
            </div>
            <div className="max-h-[70vh] overflow-auto p-3 text-[13px]">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">Recently viewed</p>
              {recentlyViewed.map((r) => (
                <Link key={r.to} to={r.to} onClick={() => setSearchOpen(false)} className="block rounded-[6px] px-2 py-1.5 hover:bg-surface-2">
                  {r.label}
                </Link>
              ))}
              <p className="mb-1 mt-3 text-[11px] font-semibold uppercase tracking-wide text-muted">Employees</p>
              {EMPLOYEES.filter((e) => `${e.firstName} ${e.lastName}`.toLowerCase().includes("ahmed")).map((e) => (
                <Link key={e.id} to={`/employees/${e.id}`} onClick={() => setSearchOpen(false)} className="block rounded-[6px] px-2 py-1.5 hover:bg-surface-2">
                  {e.firstName} {e.lastName}
                  <span className="ms-2 text-muted">
                    {e.id} · {e.trade}
                  </span>
                </Link>
              ))}
              <p className="mb-1 mt-3 text-[11px] font-semibold uppercase tracking-wide text-muted">Projects</p>
              <Link to="/projects/jub" onClick={() => setSearchOpen(false)} className="block rounded-[6px] px-2 py-1.5 hover:bg-surface-2">
                Ahmed has assignment on Jubail Turnaround 2026
              </Link>
              <p className="mb-1 mt-3 text-[11px] font-semibold uppercase tracking-wide text-muted">Timesheets</p>
              {TIMESHEETS.slice(0, 1).map((ts) => (
                <Link key={ts.id} to={`/timesheets/${ts.id}`} onClick={() => setSearchOpen(false)} className="block rounded-[6px] px-2 py-1.5 hover:bg-surface-2">
                  09–15 Aug 2026 · Jubail Turnaround
                </Link>
              ))}
              <p className="mb-1 mt-3 text-[11px] font-semibold uppercase tracking-wide text-muted">Advances</p>
              <Link to="/advances/ADV-2026-0091" onClick={() => setSearchOpen(false)} className="block rounded-[6px] px-2 py-1.5 hover:bg-surface-2">
                ADV-2026-0091 · Ahmed Al-Harbi
              </Link>
              <p className="mb-1 mt-3 text-[11px] font-semibold uppercase tracking-wide text-muted">Clients</p>
              {CLIENTS.slice(0, 2).map((c) => (
                <Link key={c.id} to={`/clients/${c.id}`} onClick={() => setSearchOpen(false)} className="block rounded-[6px] px-2 py-1.5 hover:bg-surface-2">
                  {c.displayName}
                </Link>
              ))}
              <p className="mb-1 mt-3 text-[11px] font-semibold uppercase tracking-wide text-muted">Invoices</p>
              {INVOICES.slice(0, 2).map((inv) => (
                <Link key={inv.id} to={`/invoices/${inv.id}`} onClick={() => setSearchOpen(false)} className="block rounded-[6px] px-2 py-1.5 hover:bg-surface-2">
                  {inv.id}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {createOpen ? (
        <div className="fixed inset-0 z-50">
          <button type="button" className="absolute inset-0 bg-charcoal/40" onClick={() => setCreateOpen(false)} />
          <div className="relative mx-auto mt-24 w-[360px] max-w-[calc(100%-2rem)] rounded-[8px] border border-line bg-white p-2">
            <div className="px-2 py-2 text-[13px] font-medium">Create</div>
            {[
              ["Client", "/clients/new"],
              ["Project", "/projects/new"],
              ["Employee", "/employees/new"],
              ["Manpower requirement", "/manpower/new"],
              ["Timesheet intake", "/timesheets/upload"],
              ["Salary advance (on behalf)", "/advances/new"],
              ["Invoice", "/invoices/new"],
            ].map(([label, to]) => (
              <button
                key={to}
                type="button"
                className="w-full rounded-[6px] px-2 py-2 text-start text-[13px] hover:bg-surface-2"
                onClick={() => {
                  setCreateOpen(false);
                  nav(to);
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {notifyOpen ? (
        <div className="fixed inset-0 z-50">
          <button type="button" className="absolute inset-0" onClick={() => setNotifyOpen(false)} />
          <div className="absolute end-4 top-12 w-[400px] max-w-[calc(100%-2rem)] rounded-[8px] border border-line bg-white shadow-panel">
            <div className="flex items-center justify-between border-b border-line px-3 py-2">
              <div className="text-[13px] font-semibold">{t(locale, "notifications")}</div>
              <Link to="/notifications" className="text-[12px] text-muted" onClick={() => setNotifyOpen(false)}>
                Open all
              </Link>
            </div>
            <div className="max-h-[70vh] overflow-auto">
              {notifications.map((n) => (
                <Link
                  key={n.id}
                  to={n.href}
                  onClick={() => {
                    markRead(n.id);
                    setNotifyOpen(false);
                  }}
                  className="block border-b border-line px-3 py-2.5 hover:bg-canvas"
                >
                  <div className="flex items-start gap-2">
                    {!n.read ? <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" /> : <span className="mt-1.5 size-1.5" />}
                    <div>
                      <div className="text-[13px] font-medium text-ink">{locale === "ar" ? n.titleAr : n.title}</div>
                      <div className="text-[12px] text-muted">{n.body}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function PortalShell() {
  const { locale, setLocale, user, setRole, toasts, dismissToast } = useApp();
  const nav = useNavigate();
  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-canvas">
      <header className="flex items-center justify-between border-b border-line bg-nav px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <img src="/brand/power-solid-logo.png" alt="" className="h-8 w-8 object-contain" />
          <div>
            <div className="text-[13px] font-semibold">Power Solid</div>
            <div className="text-[11px] text-gold">Employee</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="text-[12px]" onClick={() => setLocale(locale === "en" ? "ar" : "en")}>
            {locale === "en" ? "العربية" : "EN"}
          </button>
          <button
            type="button"
            className="text-[12px] text-white/70"
            onClick={() => {
              setRole("owner");
              nav("/home");
            }}
          >
            Staff
          </button>
        </div>
      </header>
      <main className="p-4 pb-24">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 start-1/2 w-full max-w-[430px] -translate-x-1/2 border-t border-line bg-white">
        <div className="grid grid-cols-4 text-center text-[11px]">
          <Link className="py-2" to="/portal">
            Home
          </Link>
          <Link className="py-2" to="/portal/timesheets">
            Timesheets
          </Link>
          <Link className="py-2" to="/portal/documents">
            Documents
          </Link>
          <Link className="py-2" to="/portal/profile">
            Profile
          </Link>
        </div>
      </nav>
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      <div className="hidden">{user.name}</div>
    </div>
  );
}
