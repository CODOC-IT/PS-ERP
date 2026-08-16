import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Checkbox, Field, Input } from "@/components/ui/primitives";
import { t } from "@/lib/i18n";
import { useApp } from "@/store/AppState";

export function LoginPage() {
  const nav = useNavigate();
  const { locale, setLocale, setRole } = useApp();
  const [id, setId] = useState("fahad.alqahtani@powersolid-intl.com");
  const [pw, setPw] = useState("••••••••");

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col bg-white px-8 py-8 lg:px-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/brand/power-solid-logo.png" alt="Power Solid" className="h-12 w-12 object-contain" />
            <div>
              <div className="font-heading text-[18px] font-semibold">Power Solid ERP</div>
              <div className="text-[12px] text-muted">{t(locale, "product")}</div>
            </div>
          </div>
          <button type="button" className="text-[13px] font-medium" onClick={() => setLocale(locale === "en" ? "ar" : "en")}>
            {locale === "en" ? "العربية" : "English"}
          </button>
        </div>
        <div className="mx-auto my-auto w-full max-w-sm py-12">
          <h1 className="font-heading text-[28px] font-semibold">{t(locale, "signIn")}</h1>
          <p className="mt-1 text-[13px] text-muted">Office, site and payroll staff use the same sign-in.</p>
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (id.toLowerCase().includes("ahmed") || id.toUpperCase().includes("PS-1042")) setRole("employee");
              else setRole("owner");
              nav(id.toLowerCase().includes("ahmed") ? "/portal" : "/home");
            }}
          >
            <Field label={t(locale, "email")} required>
              <Input value={id} onChange={(e) => setId(e.target.value)} autoComplete="username" />
            </Field>
            <Field label={t(locale, "password")} required>
              <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" />
            </Field>
            <div className="flex items-center justify-between">
              <Checkbox label={t(locale, "remember")} defaultChecked />
              <Link className="text-[13px] text-muted underline" to="/forgot-password">
                {t(locale, "forgot")}
              </Link>
            </div>
            <Button variant="primary" className="w-full" type="submit">
              {t(locale, "signIn")}
            </Button>
          </form>
          <p className="mt-6 text-[12px] text-muted">Demo data. Not live Power Solid figures. Try employee ID PS-1042 for the worker portal.</p>
          <p className="mt-3 text-[12px]">
            <Link className="underline" to="/home">
              Skip to office app
            </Link>
            {" · "}
            <Link className="underline" to="/prototype">
              Product map
            </Link>
          </p>
        </div>
        <div className="text-[12px] text-muted">Jubail Industrial City · Asia/Riyadh</div>
      </div>
      <div className="relative hidden min-h-[320px] lg:block">
        <img src="/brand/hero-industrial.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-charcoal/55" />
        <div className="absolute bottom-10 start-10 end-10 text-white">
          <div className="font-heading text-[22px] font-semibold">Certified manpower. Site ready.</div>
          <p className="mt-2 max-w-md text-[14px] text-white/80">
            Oil & gas, petrochemical and construction crews for shutdowns and long-term operations across Saudi Arabia.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ForgotPage() {
  const nav = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-6">
      <div className="w-full max-w-md rounded-[8px] border border-line bg-white p-6">
        <img src="/brand/power-solid-logo.png" alt="" className="h-10 w-10 object-contain" />
        <h1 className="mt-4 font-heading text-[22px] font-semibold">Reset password</h1>
        <p className="mt-1 text-[13px] text-muted">Enter your email or employee ID. Noura in Admin will confirm staff resets.</p>
        <div className="mt-4">
          <Field label="Email or employee ID">
            <Input defaultValue="fahad.alqahtani@powersolid-intl.com" />
          </Field>
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="primary" onClick={() => nav("/login")}>
            Send reset link
          </Button>
          <Button onClick={() => nav("/login")}>Back to sign in</Button>
        </div>
      </div>
    </div>
  );
}
