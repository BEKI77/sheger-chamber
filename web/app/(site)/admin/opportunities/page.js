import AdminShell from "@/components/admin/AdminShell";
import AdminOpportunities from "@/components/admin/opportunities/AdminOpportunities";

export const metadata = {
    title: "Shagar Chamber - Opportunities Management"
};

export default function AdminOpportunitiesPage() {
    return (
        <AdminShell>
            <AdminOpportunities />
        </AdminShell>
    );
}
