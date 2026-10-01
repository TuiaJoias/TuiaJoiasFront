import type { Metadata } from "next";
import { QueryProvider } from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Painel do portfólio",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <QueryProvider>
      <div className="min-h-screen bg-sand text-base leading-[1.55]">{children}</div>
    </QueryProvider>
  );
}
