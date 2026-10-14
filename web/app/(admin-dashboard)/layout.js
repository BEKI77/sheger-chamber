// Admin dashboard: has its own stylesheet instead of site.css.
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/styles/admin-dashboard.css";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
