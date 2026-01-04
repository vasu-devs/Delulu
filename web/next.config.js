/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['react-plotly.js', 'plotly.js-dist-min'],
};

module.exports = nextConfig;
