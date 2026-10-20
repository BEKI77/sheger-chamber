import AdminShell from "@/components/admin/AdminShell";
import AdminProfile from "@/components/admin/profile/AdminProfile";

export const metadata = {
    title: "Shagar Chamber / My Profile"
};

export default function AdminProfilePage() {
    return (
        <AdminShell>
            <AdminProfile />
        </AdminShell>
    );
}
