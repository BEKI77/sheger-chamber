/** @type {import('next').NextConfig} */
const nextConfig = {
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
