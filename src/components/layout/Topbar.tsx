import { useNavigate } from "react-router-dom";
import { Bell, HelpCircle, Plus, Search } from "lucide-react";
import { t } from "@/lib/i18n";
import { ROLES } from "@/data/roles";
import { useApp } from "@/store/AppState";
import { Avatar, Button, cn } from "@/components/ui/primitives";
import type { RoleId } from "@/lib/types";

export function Topbar() {
  const nav = useNavigate();
  const {
    locale,
    setLocale,
    user,
    role,
    setRole,
    setSearchOpen,
    setCreateOpen,
    setNotifyOpen,
    notifyOpen,
    userMenuOpen,
    setUserMenuOpen,
    notifications,
  } = useApp();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-line bg-white px-4">
      <button
        type="button"
        className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-[6px] border border-line bg-canvas px-3 text-start text-[13px] text-muted"
        onClick={() => setSearchOpen(true)}
      >
        <Search size={16} />
        <span className="truncate">{t(locale, "searchPh")}</span>
        <span className="ms-auto hidden text-[11px] text-muted sm:inline">Ctrl K</span>
      </button>
      <span className="hidden rounded-[4px] border border-line px-1.5 py-0.5 text-[11px] text-muted lg:inline">{t(locale, "demoData")}</span>
      <Button variant="gold" size="sm" onClick={() => setCreateOpen(true)}>
        <Plus size={14} />
        {t(locale, "quickCreate")}
      </Button>
      <div className="relative">
        <button
          type="button"
          className="relative flex size-9 items-center justify-center rounded-[6px] hover:bg-surface-2"
          aria-label={t(locale, "notifications")}
          onClick={() => setNotifyOpen(!notifyOpen)}
        >
          <Bell size={16} />
          {unread ? (
            <span className="absolute top-1.5 end-1.5 min-w-4 rounded-full bg-danger px-1 text-[10px] font-semibold text-white">
              {unread}
            </span>
          ) : null}
        </button>
      </div>
      <button
        type="button"
        className="flex size-9 items-center justify-center rounded-[6px] hover:bg-surface-2"
        aria-label={t(locale, "help")}
        onClick={() => nav("/help")}
      >
        <HelpCircle size={16} />
      </button>
      <button
        type="button"
        className="h-9 rounded-[6px] px-2 text-[13px] font-medium hover:bg-surface-2"
        onClick={() => setLocale(locale === "en" ? "ar" : "en")}
      >
        {locale === "en" ? "العربية" : "EN"}
      </button>
      <div className="relative">
        <button
          type="button"
          className="flex items-center gap-2 rounded-[6px] py-1 ps-1 pe-2 hover:bg-surface-2"
          onClick={() => setUserMenuOpen(!userMenuOpen)}
        >
          <Avatar name={user.name} size={28} />
          <span className="hidden text-start leading-tight sm:block">
            <span className="block text-[13px] font-medium">{locale === "ar" ? user.nameAr : user.name}</span>
            <span className="block text-[11px] text-muted">{user.title}</span>
          </span>
        </button>
        {userMenuOpen ? (
          <div className="absolute end-0 top-11 z-40 w-80 rounded-[8px] border border-line bg-white p-2 shadow-panel">
            <div className="px-2 py-2">
              <div className="text-[13px] font-medium">{locale === "ar" ? user.nameAr : user.name}</div>
              <div className="text-[12px] text-muted">{user.email}</div>
            </div>
            <button
              type="button"
              className="w-full rounded-[6px] px-2 py-1.5 text-start text-[13px] hover:bg-surface-2"
              onClick={() => {
                setUserMenuOpen(false);
                nav("/settings");
              }}
            >
              Settings
            </button>
            <button
              type="button"
              className="w-full rounded-[6px] px-2 py-1.5 text-start text-[13px] hover:bg-surface-2"
              onClick={() => nav("/login")}
            >
              Sign out
            </button>
            <div className="mt-2 border-t border-line pt-2">
              <div className="px-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                {t(locale, "prototypePreview")}
              </div>
              <p className="px-2 pb-1 text-[11px] text-muted">{t(locale, "prototypeNote")}</p>
              <div className="max-h-64 overflow-auto">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className={cn(
                      "flex w-full items-center justify-between rounded-[6px] px-2 py-1.5 text-start text-[13px] hover:bg-surface-2",
                      role === r.id && "bg-[#f7f1e6]",
                    )}
                    onClick={() => {
                      setRole(r.id as RoleId);
                      if (r.id === "employee") nav("/portal");
                      else if (window.location.pathname.startsWith("/portal")) nav("/home");
                    }}
                  >
                    <span>{locale === "ar" ? r.labelAr : r.label}</span>
                    {role === r.id ? <span className="text-[11px] text-gold-deep">Current</span> : null}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
