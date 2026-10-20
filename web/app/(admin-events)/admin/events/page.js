import AdminShell from "@/components/admin/AdminShell";
import AdminEvents from "@/components/admin/events/AdminEvents";

export const metadata = {
    title: "Shagar Chamber | Events Management"
};

export default function AdminEventsPage() {
    return (
        <AdminShell>
            <AdminEvents />
        </AdminShell>
    );
}
