import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ADVANCES, DOCUMENTS, TIMESHEET_ROWS, TS_DAYS } from "@/data";
import { formatDate, money } from "@/lib/format";
import { t } from "@/lib/i18n";
import { statusIcon, toneFor } from "@/lib/status";
import { useApp } from "@/store/AppState";
import { Alert, Button, Field, Input, Panel, Select, StatusBadge, Textarea } from "@/components/ui/primitives";

const dayName = (iso: string) => {
  const d = new Date(`${iso}T12:00:00+03:00`);
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" });
};

export function PortalHome() {
  const { locale } = useApp();
  return (
    <div>
      <h1 className="font-heading text-[24px] font-semibold">{t(locale, "goodEvening")}</h1>
      <p className="text-[13px] text-muted">16 Aug 2026 · Jubail Turnaround 2026</p>
      <section className="mt-4">
        <h2 className="font-heading text-[18px] font-semibold">{t(locale, "attention")}</h2>
        <Panel className="mt-2 p-4">
          <div className="text-[13px] text-muted">Timesheet: 09–15 Aug 2026</div>
          <div className="text-[14px]">Please confirm by 18 Aug</div>
          <Link to="/portal/timesheets/ts-jub-0815">
            <Button variant="gold" className="mt-3 w-full">
              {t(locale, "reviewTimesheet")}
            </Button>
          </Link>
        </Panel>
        <Alert tone="warning" title="Your Iqama expires on 28 Aug 2026">
          <Link to="/portal/documents" className="underline">
            Upload renewed document
          </Link>
        </Alert>
      </section>
      <nav className="mt-6 grid gap-2">
        {[
          [t(locale, "myTimesheets"), "/portal/timesheets"],
          [t(locale, "myAdvances"), "/portal/advances"],
          [t(locale, "myDocuments"), "/portal/documents"],
          [t(locale, "myProfile"), "/portal/profile"],
          [t(locale, "myPayslips"), "/portal/payslips"],
        ].map(([l, to]) => (
          <Link key={to} to={to} className="rounded-[8px] border border-line bg-white px-4 py-3 text-[14px] font-medium">
            {l}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function PortalTimesheets() {
  return (
    <div>
      <h1 className="font-heading text-[22px] font-semibold">My Timesheets</h1>
      <Link to="/portal/timesheets/ts-jub-0815" className="mt-3 block rounded-[8px] border border-line bg-white p-4">
        <div className="font-medium">09–15 Aug 2026</div>
        <div className="text-[13px] text-muted">Jubail Turnaround 2026 · Awaiting your confirmation</div>
      </Link>
      <div className="mt-2 rounded-[8px] border border-line bg-white p-4 text-[13px] text-muted">02–08 Aug 2026 · Confirmed</div>
    </div>
  );
}

export function PortalTimesheetDetail() {
  const row = TIMESHEET_ROWS[0];
  const nav = useNavigate();
  const { toast, locale } = useApp();
  return (
    <div>
      <h1 className="font-heading text-[22px] font-semibold">Timesheet</h1>
      <div className="text-[14px]">09–15 Aug 2026</div>
      <div className="text-[13px] text-muted">Jubail Turnaround 2026</div>
      <ul className="mt-4 divide-y divide-line rounded-[8px] border border-line bg-white">
        {TS_DAYS.map((d) => {
          const v = row.days[d];
          const label = v === "A" ? "Absent" : v === "OFF" ? "Scheduled off" : `${v} regular hours${d === "2026-08-09" ? "" : ""}`;
          return (
            <li key={d} className="px-4 py-3">
              <div className="text-[13px] text-muted">{dayName(d)}</div>
              <div className={v === "A" ? "font-medium text-danger" : "font-medium"}>{v === "8" && d === "2026-08-09" ? "8 regular hours" : v === "8" ? "8 regular hours" : label}</div>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[13px]">
        <div>
          Regular
          <div className="font-heading text-[18px] font-semibold">40 h</div>
        </div>
        <div>
          OT
          <div className="font-heading text-[18px] font-semibold">0 h</div>
        </div>
        <div>
          Absent
          <div className="font-heading text-[18px] font-semibold">1 day</div>
        </div>
      </div>
      <Button
        variant="primary"
        className="mt-4 w-full"
        onClick={() => {
          toast("Timesheet confirmed.");
          nav("/portal");
        }}
      >
        {t(locale, "confirm")}
      </Button>
      <Link to="/portal/timesheets/ts-jub-0815/contest">
        <Button className="mt-2 w-full" variant="danger-outline">
          {t(locale, "somethingWrong")}
        </Button>
      </Link>
    </div>
  );
}

export function PortalContest() {
  const nav = useNavigate();
  const { toast } = useApp();
  const [done, setDone] = useState(false);
  if (done) {
    return (
      <div>
        <h1 className="font-heading text-[22px] font-semibold">Submitted</h1>
        <p className="mt-2 text-[14px]">Your coordinator will review this. Payroll will not use the disputed entry until it is resolved.</p>
        <Button className="mt-4 w-full" onClick={() => nav("/portal")}>
          Back home
        </Button>
      </div>
    );
  }
  return (
    <div>
      <h1 className="font-heading text-[22px] font-semibold">What is incorrect?</h1>
      <Field label="Date">
        <Select defaultValue="2026-08-11">
          <option value="2026-08-11">11 Aug 2026</option>
          {TS_DAYS.map((d) => (
            <option key={d} value={d}>
              {formatDate(d)}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Issue">
        <Select defaultValue="absent">
          <option value="absent">I worked but marked absent</option>
          <option>Hours are incorrect</option>
          <option>Overtime is missing</option>
          <option>Wrong project</option>
          <option>Other</option>
        </Select>
      </Field>
      <Field label="Message">
        <Textarea defaultValue="I worked the full shift on 11 Aug." />
      </Field>
      <div className="mt-2 rounded-[8px] border border-dashed border-line px-3 py-6 text-center text-[13px] text-muted">Optional photo or document</div>
      <p className="mt-2 text-[12px] text-muted">You cannot edit the client timesheet yourself.</p>
      <Button
        variant="primary"
        className="mt-4 w-full"
        onClick={() => {
          toast("Issue submitted.");
          setDone(true);
        }}
      >
        Submit issue
      </Button>
    </div>
  );
}

export function PortalAdvances() {
  const a = ADVANCES.find((x) => x.id === "ADV-2026-0091")!;
  return (
    <div>
      <h1 className="font-heading text-[22px] font-semibold">My Salary Advances</h1>
      <Link to="/portal/advances/new">
        <Button variant="gold" className="mt-3 w-full">
          Request advance
        </Button>
      </Link>
        <Link className="block rounded-[8px] border border-line bg-white p-4" to="/advances/ADV-2026-0091">
        <div className="font-medium">{a.id}</div>
        <div className="text-[13px]">
          {money(a.requested)} · <StatusBadge tone={toneFor(a.status)}>{statusIcon(a.status)} {a.status}</StatusBadge>
        </div>
      </Link>
    </div>
  );
}

export function PortalAdvanceNew() {
  const nav = useNavigate();
  const { toast } = useApp();
  return (
    <div>
      <h1 className="font-heading text-[22px] font-semibold">Request salary advance</h1>
      <p className="text-[13px] text-muted">Current outstanding advance: SAR 0.00</p>
      <Field label="Requested amount">
        <Input defaultValue="2000" />
      </Field>
      <Field label="Reason (optional)">
        <Textarea />
      </Field>
      <Field label="Preferred recovery">
        <Select>
          <option>Next salary</option>
          <option>Installments</option>
        </Select>
      </Field>
      <Button
        variant="primary"
        className="mt-4 w-full"
        onClick={() => {
          toast("Request sent to management.");
          nav("/portal/advances");
        }}
      >
        Submit
      </Button>
    </div>
  );
}

export function PortalDocuments() {
  const docs = DOCUMENTS.filter((d) => d.employeeId === "PS-1042");
  return (
    <div>
      <h1 className="font-heading text-[22px] font-semibold">My Documents</h1>
      <ul className="mt-3 space-y-2">
        {docs.map((d) => (
          <li key={d.id} className="rounded-[8px] border border-line bg-white p-4">
            <div className="font-medium">{d.type}</div>
            <div className="text-[13px] text-muted">{d.expiryDate ? `Expiry ${formatDate(d.expiryDate)}` : "No expiry"}</div>
            <StatusBadge tone={toneFor(d.verification)}>
              {statusIcon(d.verification)} {d.verification}
            </StatusBadge>
          </li>
        ))}
      </ul>
      <Link to="/documents/upload?employee=PS-1042">
        <Button className="mt-4 w-full">Upload renewed document</Button>
      </Link>
    </div>
  );
}

export function PortalProfile() {
  return (
    <div>
      <h1 className="font-heading text-[22px] font-semibold">My Profile</h1>
      <Panel className="mt-3 space-y-1 p-4 text-[14px]">
        <div>PS-1042</div>
        <div>Ahmed Al-Harbi</div>
        <div>Rigger I</div>
        <div>+966 55 441 2088</div>
        <div>Jubail Turnaround 2026</div>
      </Panel>
    </div>
  );
}

export function PortalPayslips() {
  return (
    <div>
      <h1 className="font-heading text-[22px] font-semibold">My Payslips</h1>
      <p className="mt-2 text-[13px] text-muted">July 2026 is available. August is not finalized.</p>
      <div className="mt-3 rounded-[8px] border border-line bg-white p-4">July 2026 · Net SAR 4,820.00</div>
    </div>
  );
}
