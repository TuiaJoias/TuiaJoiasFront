import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminSessionProvider } from "@/components/admin/AdminSessionProvider";
import { FeedbackProvider } from "@/components/admin/FeedbackProvider";

export default function AdminPage() {
  return (
    <AdminSessionProvider>
      <FeedbackProvider>
        <AdminDashboard />
      </FeedbackProvider>
    </AdminSessionProvider>
  );
}
