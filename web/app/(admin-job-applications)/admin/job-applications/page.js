import AdminShell from "@/components/admin/AdminShell";
import AdminJobApplications from "@/components/admin/job-applications/AdminJobApplications";

export const metadata = {
    title: "Shagar Chamber | Job Applications"
};

export default function AdminJobApplicationsPage() {
    return (
        <AdminShell>
            <AdminJobApplications />
        </AdminShell>
    );
}
