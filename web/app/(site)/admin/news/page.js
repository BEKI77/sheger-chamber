import AdminShell from "@/components/admin/AdminShell";
import AdminNews from "@/components/admin/news/AdminNews";

export const metadata = {
    title: "Shagar Chamber — News Management"
};

export default function AdminNewsPage() {
    return (
        <AdminShell>
            <AdminNews />
        </AdminShell>
    );
}
