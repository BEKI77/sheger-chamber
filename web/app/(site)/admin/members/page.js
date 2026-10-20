import AdminShell from "@/components/admin/AdminShell";
import AdminMembers from "@/components/admin/members/AdminMembers";

export const metadata = {
    title: "Shagar Chamber | Admin Membership Management"
};

export default function AdminMembersPage() {
    return (
        <AdminShell>
            <AdminMembers />
        </AdminShell>
    );
}
