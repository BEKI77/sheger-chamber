import AdminShell from "@/components/admin/AdminShell";
import AdminRevenue from "@/components/admin/revenue/AdminRevenue";

export const metadata = {
    title: "Shagar Chamber | Revenue Management"
};

export default function AdminRevenuePage() {
    return (
        <AdminShell>
            <AdminRevenue />
        </AdminShell>
    );
}
