// components/seo-metadata.tsx
"use client"

import Head from 'next/head'
import Script from 'next/script'

interface SEOMetadataProps {
  title?: string
  description?: string
  canonical?: string
  keywords?: string[]
  ogImage?: string
  ogType?: string
  structuredData?: Record<string, any>
}

export function SEOMetadata({
  title = "Crisp TV - Premium IPTV Service",
  description = "Crisp TV offers premium IPTV services with thousands of channels worldwide, HD quality streaming, and reliable service at affordable prices.",
  canonical,
  keywords = [],
  ogImage = "/images/crisptvlogo.png",
  ogType = "website",
  structuredData,
}: SEOMetadataProps) {
  // Build the full canonical URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://crispiptv.com"
  const fullCanonical = canonical ? `${baseUrl}${canonical}` : baseUrl

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={fullCanonical} />
        
        {/* Keywords */}
        {keywords.length > 0 && (
          <meta name="keywords" content={keywords.join(', ')} />
        )}
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={fullCanonical} />
        <meta property="og:image" content={`${baseUrl}${ogImage}`} />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${baseUrl}${ogImage}`} />
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      {/* Structured Data JSON-LD */}
      {structuredData && (
        <Script 
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </>
  )
}