export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://memo-log-lime.vercel.app/sitemap.xml",
  };
}