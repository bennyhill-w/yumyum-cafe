import { Helmet } from "react-helmet-async";

const BASE_URL = "https://yumyum-cafe.com.ng";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;

export default function SEO({
  title,
  description,
  image,
  url,
  type = "website",
  structuredData,
}) {
  const fullTitle = title
    ? `${title} | Yum-Yum Cafe`
    : "Yum-Yum Cafe — Delicious Food in Lagos";

  const fullDescription =
    description ||
    "Quick service restaurant offering fresh Continental & African dishes, bakery, ice cream and conference hall across 4 Lagos locations. Order online today.";

  const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL;
  const fullImage = image || DEFAULT_IMAGE;

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Yum-Yum Cafe" />
      <meta property="og:locale" content="en_NG" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />

      {/* Structured data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
