import { can } from "@/data/roles";
import type { Permission } from "@/lib/types";
import { useApp } from "@/store/AppState";

export function useCan() {
  const { role } = useApp();
  return (permission: Permission) => can(role, permission);
}

export function scopedProjects() {
  const { role } = useApp();
  if (role === "coordinator") return ["jub", "dmm"];
  return null as string[] | null;
}
