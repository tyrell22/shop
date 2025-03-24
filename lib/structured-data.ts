// lib/structured-data.ts

// Generate Schema.org Organization data
export function generateOrganizationSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Crisp TV",
      "url": process.env.NEXT_PUBLIC_APP_URL || "https://crispiptv.com",
      "logo": `${process.env.NEXT_PUBLIC_APP_URL || "https://crispiptv.com"}/images/crisptvlogo.png`,
      "description": "Premium IPTV service with thousands of channels worldwide, HD quality streaming, and affordable subscription plans.",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "support@crispiptv.com"
      },
      "sameAs": [
        "https://facebook.com/crisptv",
        "https://twitter.com/crisptv",
        "https://instagram.com/crisptv"
      ]
    };
  }
  
  // Generate Schema.org WebSite data
  export function generateWebSiteSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Crisp TV",
      "url": process.env.NEXT_PUBLIC_APP_URL || "https://crispiptv.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${process.env.NEXT_PUBLIC_APP_URL || "https://crispiptv.com"}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };
  }
  
  // Generate Schema.org Product data for IPTV packages
  export function generateProductSchema(product: any) {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description,
      "sku": `iptv-package-${product.id}`,
      "brand": {
        "@type": "Brand",
        "name": "Crisp TV"
      },
      "offers": {
        "@type": "Offer",
        "url": `${process.env.NEXT_PUBLIC_APP_URL || "https://crispiptv.com"}/packages#${product.id}`,
        "priceCurrency": "USD",
        "price": product.price.toFixed(2),
        "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        "availability": "https://schema.org/InStock"
      },
      "image": `${process.env.NEXT_PUBLIC_APP_URL || "https://crispiptv.com"}/images/products/package-${product.id}.jpg`
    };
  }
  
  // Generate Schema.org FAQPage data
  export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }
  
  // Generate Schema.org BreadcrumbList data
  export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": `${process.env.NEXT_PUBLIC_APP_URL || "https://crispiptv.com"}${item.url}`
      }))
    };
  }
  
  // Generate Schema.org LocalBusiness data (for contact/about pages)
  export function generateLocalBusinessSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Crisp TV",
      "image": `${process.env.NEXT_PUBLIC_APP_URL || "https://crispiptv.com"}/images/crisptvlogo.png`,
      "email": "support@crispiptv.com",
      "url": process.env.NEXT_PUBLIC_APP_URL || "https://crispiptv.com",
      "priceRange": "$",
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      }
    };
  }