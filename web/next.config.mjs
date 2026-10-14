// The Express API runs separately. The browser only ever talks to this
// Next.js site, which forwards /api/* to the API, so login cookies are
// first-party and no CORS setup is needed.
const BACKEND_URL = (process.env.BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            { source: "/api/:path*", destination: `${BACKEND_URL}/api/:path*` }
        ];
    },
    // Old static-site addresses keep working
    async redirects() {
        return [
            { source: "/index.html", destination: "/", permanent: true },
            { source: "/admin-dashboard.html", destination: "/admin", permanent: true },
            { source: "/admin-login.html", destination: "/admin/login", permanent: true },
            { source: "/admin-:page([a-z-]+).html", destination: "/admin/:page", permanent: true },
            { source: "/job-application.html", destination: "/job-application", permanent: true },
            { source: "/news-details.html", destination: "/news-details", permanent: true }
        ];
    }
};

export default nextConfig;
