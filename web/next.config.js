/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['react-plotly.js', 'plotly.js-dist-min'],
    async rewrites() {
        return [
            {
                source: "/api/v1/:path*",
                destination: "http://127.0.0.1:8000/api/v1/:path*",
            },
        ];
    },
};

module.exports = nextConfig;
