import { NavLink, useLocation } from "react-router-dom";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { visibleNav } from "@/lib/nav";
import { t } from "@/lib/i18n";
import { useApp } from "@/store/AppState";
import { NavIcon } from "@/components/ui/icons";
import { cn } from "@/components/ui/primitives";

export function Sidebar() {
  const { role, locale, collapsed, toggleCollapsed } = useApp();
  const groups = visibleNav(role);
  const loc = useLocation();

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col bg-nav text-white transition-[width] duration-200",
        collapsed ? "w-[72px]" : "w-[252px]",
      )}
    >
      <div className={cn("flex items-center gap-2 border-b border-white/10 px-3 py-3", collapsed && "justify-center")}>
        <NavLink to="/home" className="flex items-center gap-2 min-w-0">
          <img src="/brand/power-solid-logo.png" alt="Power Solid" className="h-9 w-9 object-contain" />
          {!collapsed ? (
            <div className="min-w-0">
              <div className="font-heading text-[13px] font-semibold leading-tight">Power Solid ERP</div>
              <div className="text-[11px] text-gold">{t(locale, "product")}</div>
            </div>
          ) : null}
        </NavLink>
      </div>
      <nav className="erp-scroll flex-1 overflow-y-auto py-2">
        {groups.map((g) => (
          <div key={g.id} className="mb-2">
            {g.label && !collapsed ? (
              <div className="px-4 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                {locale === "ar" ? g.labelAr : g.label}
              </div>
            ) : null}
            {g.items.map((item) => {
              const active = item.to === "/home" ? loc.pathname === "/home" : loc.pathname === item.to || loc.pathname.startsWith(item.to + "/");
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={item.label}
                  className={cn(
                    "mx-2 flex items-center gap-2 rounded-[6px] px-2 py-1.5 text-[13px]",
                    active ? "bg-white/10 text-gold" : "text-white/80 hover:bg-white/5 hover:text-white",
                    collapsed && "justify-center px-0",
                  )}
                >
                  <NavIcon name={item.icon} className={active ? "text-gold" : "text-white/70"} />
                  {!collapsed ? <span>{locale === "ar" ? item.labelAr : item.label}</span> : null}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="border-t border-white/10 p-2">
        <button
          type="button"
          onClick={toggleCollapsed}
          className="flex w-full items-center justify-center gap-2 rounded-[6px] px-2 py-1.5 text-[12px] text-white/60 hover:bg-white/5 hover:text-white"
        >
          {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          {!collapsed ? <span>Collapse</span> : null}
        </button>
        {!collapsed ? (
          <div className="mt-1 px-2 text-[11px] text-white/35">{t(locale, "demoData")} · Asia/Riyadh</div>
        ) : null}
      </div>
    </aside>
  );
}
