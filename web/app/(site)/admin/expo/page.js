import AdminShell from "@/components/admin/AdminShell";
import AdminExpo from "@/components/admin/expo/AdminExpo";

export const metadata = {
    title: "Shagar Chamber | Expo Management"
};

export default function AdminExpoPage() {
    return (
        <AdminShell>
            <AdminExpo />
        </AdminShell>
    );
}
