// Public website and the admin pages that share its stylesheet.
// Each route group has its own root layout so page stylesheets never mix
// (moving between groups is a full page load, like the old static site).
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/styles/site.css";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
