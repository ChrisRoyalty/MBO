import { Helmet } from "react-helmet";
import React from "react";

const SEO = () => {
  const schemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MBO",
    url: "https://mindpowerbusinessonline.com",
    logo: "https://mindpowerbusinessonline.com/src/assets/mindpower-logo.svg",
    description:
      "Business optimization platform to help businesses create online presence and connect with customers",
    sameAs: [
      "https://www.facebook.com/mindpowerbusinessschool",
      //   "https://twitter.com/yourhandle",
      //   "https://linkedin.com/company/yourcompany",
    ],
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>
        MBO - Elevate Your Business | Connect, Showcase & Grow Online
      </title>
      <meta
        name="description"
        content="Create a powerful online presence for your business. Share your story, showcase products, and help customers find you with MBO's business optimization platform."
      />
      <meta
        name="keywords"
        content="business optimization, online presence, showcase products, business growth, connect with customers"
      />
      <meta name="author" content="MBO" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content="https://www.facebook.com/mindpowerbusinessschool"
      />
      <meta
        property="og:title"
        content="MBO - Elevate Your Business | Connect, Showcase & Grow Online"
      />
      <meta
        property="og:description"
        content="Create a powerful online presence for your business. Share your story, showcase products, and help customers find you."
      />
      <meta
        property="og:image"
        content="https://mindpowerbusinessonline.com/src/assets/mindpower-logo.svg"
      />

      <meta
        property="twitter:title"
        content="MBO - Elevate Your Business | Connect, Showcase & Grow Online"
      />
      <meta
        property="twitter:description"
        content="Create a powerful online presence for your business. Share your story, showcase products, and help customers find you."
      />
      <meta
        property="twitter:image"
        content="https://mindpowerbusinessonline.com/src/assets/mindpower-logo.svg"
      />

      {/* Canonical URL */}
      <link rel="canonical" href="https://mindpowerbusinessonline.com" />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schemaOrgJSONLD)}
      </script>
    </Helmet>
  );
};

export default SEO;
