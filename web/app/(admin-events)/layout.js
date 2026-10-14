// Admin events page: has its own stylesheet instead of site.css.
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/styles/admin-events.css";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
