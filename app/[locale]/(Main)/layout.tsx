import DashboardLayout from "@/components/Layouts/DashboardLayout";
import type { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
