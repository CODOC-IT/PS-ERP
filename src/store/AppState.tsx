import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Locale, RoleId } from "@/lib/types";
import { NOTIFICATIONS } from "@/data/finance";
import { userForRole } from "@/data/roles";
import type { StaffUser } from "@/lib/types";

interface Toast {
  id: string;
  text: string;
  tone?: "success" | "danger" | "info";
}

interface AppState {
  role: RoleId;
  locale: Locale;
  collapsed: boolean;
  hijri: boolean;
  toasts: Toast[];
  searchOpen: boolean;
  createOpen: boolean;
  notifyOpen: boolean;
  userMenuOpen: boolean;
  recentlyViewed: { label: string; to: string }[];
  notifications: typeof NOTIFICATIONS;
  user: StaffUser;
  setRole: (r: RoleId) => void;
  setLocale: (l: Locale) => void;
  toggleCollapsed: () => void;
  setHijri: (v: boolean) => void;
  toast: (text: string, tone?: Toast["tone"]) => void;
  dismissToast: (id: string) => void;
  setSearchOpen: (v: boolean) => void;
  setCreateOpen: (v: boolean) => void;
  setNotifyOpen: (v: boolean) => void;
  setUserMenuOpen: (v: boolean) => void;
  markRead: (id: string) => void;
  remember: (label: string, to: string) => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<RoleId>("owner");
  const [locale, setLocaleState] = useState<Locale>("en");
  const [collapsed, setCollapsed] = useState(false);
  const [hijri, setHijri] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<{ label: string; to: string }[]>([
    { label: "Ahmed Al-Harbi", to: "/employees/PS-1042" },
    { label: "Jubail Turnaround 2026", to: "/projects/jub" },
    { label: "INV-2026-0087", to: "/invoices/INV-2026-0087" },
  ]);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const setRole = useCallback((r: RoleId) => {
    setRoleState(r);
    setUserMenuOpen(false);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    document.documentElement.lang = l === "ar" ? "ar" : "en";
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  }, []);

  const toast = useCallback((text: string, tone?: Toast["tone"]) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, text, tone }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const value = useMemo<AppState>(
    () => ({
      role,
      locale,
      collapsed,
      hijri,
      toasts,
      searchOpen,
      createOpen,
      notifyOpen,
      userMenuOpen,
      recentlyViewed,
      notifications,
      user: userForRole(role),
      setRole,
      setLocale,
      toggleCollapsed: () => setCollapsed((v) => !v),
      setHijri,
      toast,
      dismissToast: (id) => setToasts((t) => t.filter((x) => x.id !== id)),
      setSearchOpen,
      setCreateOpen,
      setNotifyOpen,
      setUserMenuOpen,
      markRead: (id) => setNotifications((n) => n.map((x) => (x.id === id ? { ...x, read: true } : x))),
      remember: (label, to) =>
        setRecentlyViewed((r) => {
          if (r[0]?.to === to) return r;
          return [{ label, to }, ...r.filter((x) => x.to !== to)].slice(0, 8);
        }),
    }),
    [
      role,
      locale,
      collapsed,
      hijri,
      toasts,
      searchOpen,
      createOpen,
      notifyOpen,
      userMenuOpen,
      recentlyViewed,
      notifications,
      setRole,
      setLocale,
      toast,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp outside provider");
  return ctx;
}
