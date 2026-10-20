import AdminShell from "@/components/admin/AdminShell";
import AdminPartnerships from "@/components/admin/partnerships/AdminPartnerships";

export const metadata = {
    title: "SHAGGAR CHAMBER / ADMIN PARTNERSHIPS MANAGEMENT"
};

export default function AdminPartnershipsPage() {
    return (
        <AdminShell>
            <AdminPartnerships />
        </AdminShell>
    );
}
