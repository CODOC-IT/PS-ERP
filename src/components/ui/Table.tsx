import { useMemo, useState, type ReactNode } from "react";
import { EmptyState } from "./primitives";
import { cn } from "./primitives";

export interface Column<T> {
  key: string;
  header: string;
  width?: string;
  sort?: boolean;
  render?: (row: T) => ReactNode;
  value?: (row: T) => string | number;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  rows,
  onRowClick,
  selectable,
  emptyTitle = "No records",
  emptyBody,
  compact,
}: {
  columns: Column<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  emptyTitle?: string;
  emptyBody?: string;
  compact?: boolean;
}) {
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);
  const [selected, setSelected] = useState<Array<string | number>>([]);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = col?.value ? col.value(a) : String((a as Record<string, unknown>)[sort.key] ?? "");
      const bv = col?.value ? col.value(b) : String((b as Record<string, unknown>)[sort.key] ?? "");
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [rows, sort, columns]);

  if (!rows.length) {
    return (
      <div className="erp-table-wrap">
        <EmptyState title={emptyTitle} body={emptyBody} />
      </div>
    );
  }

  return (
    <div className="erp-table-wrap erp-scroll">
      <table className="erp-table">
        <thead>
          <tr>
            {selectable ? (
              <th style={{ width: 36 }}>
                <input
                  type="checkbox"
                  className="accent-charcoal"
                  checked={selected.length === rows.length}
                  onChange={(e) => setSelected(e.target.checked ? rows.map((r) => r.id) : [])}
                />
              </th>
            ) : null}
            {columns.map((c) => (
              <th key={c.key} style={c.width ? { width: c.width } : undefined}>
                {c.sort ? (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1"
                    onClick={() =>
                      setSort((s) =>
                        s?.key === c.key ? { key: c.key, dir: s.dir === "asc" ? "desc" : "asc" } : { key: c.key, dir: "asc" },
                      )
                    }
                  >
                    {c.header}
                    <span className="text-muted">{sort?.key === c.key ? (sort.dir === "asc" ? "↑" : "↓") : ""}</span>
                  </button>
                ) : (
                  c.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr
              key={row.id}
              data-selected={selected.includes(row.id)}
              onClick={() => onRowClick?.(row)}
              className={cn(onRowClick && "cursor-pointer", compact && "text-[12px]")}
            >
              {selectable ? (
                <td onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="accent-charcoal"
                    checked={selected.includes(row.id)}
                    onChange={(e) =>
                      setSelected((s) => (e.target.checked ? [...s, row.id] : s.filter((x) => x !== row.id)))
                    }
                  />
                </td>
              ) : null}
              {columns.map((c) => (
                <td key={c.key}>
                  {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="mb-3 flex flex-wrap items-center gap-2">{children}</div>;
}

export function FilterChip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-8 rounded-full border px-3 text-[12px] font-medium",
        active ? "border-charcoal bg-charcoal text-white" : "border-line bg-white text-ink hover:bg-surface-2",
      )}
    >
      {children}
    </button>
  );
}
