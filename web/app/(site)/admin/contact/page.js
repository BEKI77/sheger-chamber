import AdminShell from "@/components/admin/AdminShell";
import AdminContact from "@/components/admin/contact/AdminContact";

export const metadata = {
    title: "Shagar Chamber / Contact Messages"
};

export default function AdminContactPage() {
    return (
        <AdminShell>
            <AdminContact />
        </AdminShell>
    );
}
