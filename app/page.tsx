"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tv } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { SEOMetadata } from "@/components/seo-metadata";
import { generateWebSiteSchema, generateOrganizationSchema } from "@/lib/structured-data";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { addItem } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Fetch products for client-side rendering
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
          setFeaturedProducts(data.products.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    
    fetchProducts();
  }, []);

  const handleSubscribeNow = (productId) => {
    // Find the product
    const product = products.find(p => p.id === productId);
    if (!product) {
      toast({
        title: "Error",
        description: "Product not found.",
        variant: "destructive",
      });
      return;
    }
    
    // Add to cart
    addItem(product);
    
    toast({
      title: "Added to Cart",
      description: "Product has been added to your cart. Proceed to checkout to complete your order.",
    });
    
    // Redirect to cart page
    router.push('/cart');
  };

  // Combine structured data
  const combinedStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      generateWebSiteSchema(),
      generateOrganizationSchema()
    ]
  };

  return (
    <>
      <SEOMetadata 
        title="Crisp TV - Best Premium IPTV Service | Live TV Channels Worldwide"
        description="Crisp TV offers premium IPTV service with thousands of live TV channels worldwide. High-definition streaming, affordable packages, and free trial available."
        keywords={["iptv service", "premium iptv", "live tv channels", "streaming service", "hd channels", "sports channels", "international tv"]}
        structuredData={combinedStructuredData}
      />

      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 bg-black text-white">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-yellow-400">
                      Crisp TV Premium Service
                    </h1>
                    <p className="max-w-[600px] text-gray-300 md:text-xl">
                      Thousands of channels, movies, and shows at your fingertips. Start streaming today with our reliable
                      IPTV service.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Link href="/packages">
                      <Button className="bg-yellow-400 text-black hover:bg-yellow-300">View Packages</Button>
                    </Link>
                    <Link href="/register">
                      <Button
                        variant="outline"
                        className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                      >
                        Create Account
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-xl overflow-hidden border-2 border-yellow-400">
                    <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 flex items-center justify-center">
                      <Tv className="w-24 h-24 text-yellow-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-yellow-400">
                    Our Premium Packages
                  </h2>
                  <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Choose the perfect plan for your entertainment needs
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-3">
                {featuredProducts.length > 0 ? (
                  featuredProducts.map((product) => (
                    <div key={product.id} className="flex flex-col p-6 bg-black rounded-lg border-2 border-yellow-400">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-yellow-400">{product.name}</h3>
                        <div className="mt-2 text-3xl font-bold text-white">
                          ${typeof product.price === "number" ? product.price.toFixed(2) : "0.00"}
                          <span className="text-sm font-normal text-gray-400">
                            {product.duration_days === 30
                              ? "/month"
                              : product.duration_days === 365
                                ? "/year"
                                : `/${product.duration_days} days`}
                          </span>
                        </div>
                      </div>
                      <ul className="flex-1 mb-6 space-y-2">
                        {Array.isArray(product.features) && product.features.length > 0 ? (
                          product.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-gray-300">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-5 h-5 mr-2 text-yellow-400"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {feature}
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-300">No features listed</li>
                        )}
                      </ul>
                      <Button 
                        className="bg-yellow-400 text-black hover:bg-yellow-300 w-full"
                        onClick={() => handleSubscribeNow(product.id)}
                      >
                        Subscribe Now
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-300 col-span-full text-center">No products available. Please check back later.</p>
                )}
              </div>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}