const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repositoryName = "modeling-portfolio";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: isGitHubPages ? `/${repositoryName}` : "" },
  ...(isGitHubPages
    ? { basePath: `/${repositoryName}`, assetPrefix: `/${repositoryName}/` }
    : {}),
};

export default nextConfig;
