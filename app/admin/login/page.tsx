import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Entrar" };

export default async function AdminLoginPage(props: PageProps<"/admin/login">) {
  const { sessao } = await props.searchParams;
  return <LoginForm sessionExpired={sessao === "expirada"} />;
}
