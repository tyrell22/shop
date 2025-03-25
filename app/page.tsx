"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Tv, 
  Zap, 
  Globe, 
  Headphones, 
  Monitor, 
  Play, 
  Shield, 
  Check,
  Users,
  Award
} from "lucide-react";
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

  // Content for key features section
  const keyFeatures = [
    {
      icon: <Tv className="h-12 w-12 text-yellow-400" />,
      title: "Thousands of Channels",
      description: "Stream live TV channels from around the world in HD, FHD, and 4K quality."
    },
    {
      icon: <Zap className="h-12 w-12 text-yellow-400" />,
      title: "Lightning-Fast Streaming",
      description: "Enjoy buffer-free streaming with our high-performance server infrastructure."
    },
    {
      icon: <Globe className="h-12 w-12 text-yellow-400" />,
      title: "Global Content",
      description: "Access international channels from over 50 countries in 15+ languages."
    },
    {
      icon: <Shield className="h-12 w-12 text-yellow-400" />,
      title: "Reliable Service",
      description: "99.9% uptime guarantee with continuous service monitoring and updates."
    }
  ];

  // Content for how it works section
  const howItWorks = [
    {
      step: "1",
      title: "Choose Your Package",
      description: "Select from our range of affordable packages designed to meet your viewing needs."
    },
    {
      step: "2",
      title: "Complete Payment",
      description: "Secure payment processing with multiple payment options for your convenience."
    },
    {
      step: "3",
      title: "Receive Access",
      description: "Get instant access to your subscription with detailed setup instructions."
    },
    {
      step: "4",
      title: "Start Streaming",
      description: "Enjoy thousands of channels across all your favorite devices with ease."
    }
  ];

  // Content for testimonials
  const testimonials = [
    {
      quote: "Crisp TV has transformed how my family watches television. The channel selection is amazing and the quality is superb!",
      author: "Michael R.",
      location: "United States"
    },
    {
      quote: "As someone who travels frequently, having access to my home country's channels is invaluable. Crisp TV delivers flawlessly.",
      author: "Sarah J.",
      location: "Canada"
    },
    {
      quote: "The value for money is exceptional. Thousands of channels for a fraction of what I was paying for cable TV.",
      author: "David T.",
      location: "United Kingdom"
    }
  ];

  return (
    <>
      <SEOMetadata 
        title="Crisp TV - Best Premium IPTV Service | Live TV Channels Worldwide"
        description="Crisp TV offers premium IPTV service with thousands of live TV channels worldwide. High-definition streaming, affordable packages, and free trial available."
        keywords={["iptv service", "premium iptv", "cheap IPTV", "streaming service", "hd channels", "sports channels", "best IPTV"]}
        structuredData={combinedStructuredData}
      />

      <div className="flex flex-col min-h-screen bg-black text-white">
        <SiteHeader />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-gray-900 to-black">
            <div className="container px-4 md:px-6">
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                <div className="flex flex-col justify-center space-y-6">
                  <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-yellow-400">
                      Premium IPTV Experience
                    </h1>
                    <p className="max-w-[600px] text-gray-300 md:text-xl leading-relaxed">
                      Unlock a world of entertainment with thousands of channels, movies, and shows at your fingertips. Start streaming today with our reliable and affordable IPTV service.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Link href="/packages">
                      <Button className="bg-yellow-400 text-black hover:bg-yellow-300 px-6 py-6 text-lg">
                        View Packages
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button
                        variant="outline"
                        className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-6 py-6 text-lg"
                      >
                        Create Account
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-xl overflow-hidden border-2 border-yellow-400">
                    <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 flex items-center justify-center">
                      <div className="grid grid-cols-2 grid-rows-2 gap-4 w-3/4 h-3/4">
                        <div className="rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center">
                          <Tv className="w-16 h-16 text-yellow-400" />
                        </div>
                        <div className="rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center">
                          <Globe className="w-16 h-16 text-yellow-400" />
                        </div>
                        <div className="rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center">
                          <Play className="w-16 h-16 text-yellow-400" />
                        </div>
                        <div className="rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center">
                          <Monitor className="w-16 h-16 text-yellow-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Key Features Section */}
          <section className="w-full py-16 md:py-24 bg-black">
            <div className="container px-4 md:px-6">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-yellow-400">
                  Why Choose Crisp TV?
                </h2>
                <p className="max-w-[800px] mx-auto text-gray-300 md:text-xl">
                  Experience premium television like never before with our cutting-edge IPTV technology
                </p>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {keyFeatures.map((feature, index) => (
                  <Card key={index} className="flex flex-col h-full p-6 bg-gray-900 border-2 border-yellow-400 shadow-lg hover:shadow-yellow-400/20 transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="mb-4">{feature.icon}</div>
                      <CardTitle className="text-xl font-semibold text-yellow-400">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-gray-300">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Packages Section */}
          <section className="w-full py-16 md:py-24 bg-gray-900">
            <div className="container px-4 md:px-6">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-yellow-400">
                  Our Premium Packages
                </h2>
                <p className="max-w-[800px] mx-auto text-gray-300 md:text-xl">
                  Choose the perfect plan for your entertainment needs
                </p>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {featuredProducts.length > 0 ? (
                  featuredProducts.map((product) => (
                    <div key={product.id} className="flex flex-col p-6 bg-black rounded-lg border-2 border-yellow-400">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-yellow-400">{product.name}</h3>
                        <p className="mt-2 text-gray-300">{product.description}</p>
                        <div className="mt-4 text-3xl font-bold text-white">
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
                      <div className="flex-1 mb-6">
                        <h4 className="font-medium text-white mb-3">What's included:</h4>
                        <ul className="space-y-2">
                          {Array.isArray(product.features) && product.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-gray-300">
                              <Check className="w-5 h-5 mr-2 text-yellow-400 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button 
                        className="w-full bg-yellow-400 text-black hover:bg-yellow-300"
                        onClick={() => handleSubscribeNow(product.id)}
                      >
                        Subscribe Now
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <Tv className="h-16 w-16 mx-auto text-yellow-400 mb-4" />
                    <p className="text-gray-300 text-lg">Loading packages...</p>
                    <Link href="/packages" className="mt-4 inline-block">
                      <Button className="bg-yellow-400 text-black hover:bg-yellow-300">
                        View All Packages
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
              {featuredProducts.length > 0 && (
                <div className="flex justify-center mt-12">
                  <Link href="/packages">
                    <Button className="bg-yellow-400 text-black hover:bg-yellow-300 px-8 py-6 text-lg">
                      View All Packages
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* How It Works Section */}
          <section className="w-full py-16 md:py-24 bg-black">
            <div className="container px-4 md:px-6">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-yellow-400">
                  How Crisp TV Works
                </h2>
                <p className="max-w-[800px] mx-auto text-gray-300 md:text-xl">
                  Get started with our premium IPTV service in just four simple steps
                </p>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {howItWorks.map((step, index) => (
                  <div key={index} className="relative flex flex-col items-center text-center p-6 bg-gray-900 rounded-lg border border-gray-800">
                    <div className="w-12 h-12 rounded-full bg-yellow-400 text-black flex items-center justify-center text-xl font-bold mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-bold text-yellow-400 mb-2">{step.title}</h3>
                    <p className="text-gray-300">{step.description}</p>
                    {index < howItWorks.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-0.5 bg-yellow-400"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Testimonials Section */}
          <section className="w-full py-16 md:py-24 bg-gray-900">
            <div className="container px-4 md:px-6">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-yellow-400">
                  What Our Customers Say
                </h2>
                <p className="max-w-[800px] mx-auto text-gray-300 md:text-xl">
                  Join thousands of satisfied customers enjoying our premium IPTV service
                </p>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="bg-black border-2 border-yellow-400">
                    <CardContent className="p-6">
                      <div className="mb-4 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-lg">★</span>
                        ))}
                      </div>
                      <p className="italic text-gray-300 mb-6">"{testimonial.quote}"</p>
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-yellow-400 mr-3">
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{testimonial.author}</p>
                          <p className="text-sm text-gray-400">{testimonial.location}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Features Highlights Section */}
          <section className="w-full py-16 md:py-24 bg-black">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col lg:flex-row gap-12 items-center">
                <div className="lg:w-1/2">
                  <div className="space-y-4">
                    <div className="inline-block rounded-lg bg-yellow-400 px-3 py-1 text-sm text-black font-semibold">
                      Premium Experience
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-yellow-400">
                      Everything You Need for Ultimate Entertainment
                    </h2>
                    <p className="text-gray-300 md:text-lg">
                      Crisp TV delivers a comprehensive entertainment solution with features designed to enhance your viewing experience.
                    </p>
                  </div>
                  <ul className="mt-8 space-y-4">
                    <li className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-400/10 flex items-center justify-center">
                        <Check className="h-4 w-4 text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Multi-Device Support</h3>
                        <p className="text-gray-400">Stream on Smart TVs, phones, tablets, computers, and more</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-400/10 flex items-center justify-center">
                        <Check className="h-4 w-4 text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Video-on-Demand</h3>
                        <p className="text-gray-400">Access a vast library of movies and TV shows on demand</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-400/10 flex items-center justify-center">
                        <Check className="h-4 w-4 text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">24/7 Support</h3>
                        <p className="text-gray-400">Dedicated customer support team ready to assist you</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-400/10 flex items-center justify-center">
                        <Check className="h-4 w-4 text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Regular Updates</h3>
                        <p className="text-gray-400">New channels and features added regularly</p>
                      </div>
                    </li>
                  </ul>
                  <div className="mt-8">
                    <Link href="/features">
                      <Button className="bg-yellow-400 text-black hover:bg-yellow-300">
                        Explore All Features
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                      <Monitor className="h-10 w-10 text-yellow-400 mb-4" />
                      <h3 className="text-lg font-medium text-yellow-400 mb-2">Smart TVs</h3>
                      <p className="text-gray-300">Compatible with Samsung, LG, Sony, and more</p>
                    </div>
                    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                      <Globe className="h-10 w-10 text-yellow-400 mb-4" />
                      <h3 className="text-lg font-medium text-yellow-400 mb-2">International</h3>
                      <p className="text-gray-300">Content from 50+ countries in 15+ languages</p>
                    </div>
                    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                      <Award className="h-10 w-10 text-yellow-400 mb-4" />
                      <h3 className="text-lg font-medium text-yellow-400 mb-2">Premium Quality</h3>
                      <p className="text-gray-300">HD, FHD, and 4K streaming options</p>
                    </div>
                    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                      <Headphones className="h-10 w-10 text-yellow-400 mb-4" />
                      <h3 className="text-lg font-medium text-yellow-400 mb-2">24/7 Support</h3>
                      <p className="text-gray-300">Expert assistance whenever you need it</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="w-full py-16 md:py-24 bg-gradient-to-t from-gray-900 to-black">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center text-center space-y-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-yellow-400">
                  Ready to Experience Crisp TV?
                </h2>
                <p className="max-w-[800px] text-gray-300 md:text-xl">
                  Join thousands of satisfied customers enjoying premium IPTV service at affordable prices.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Link href="/packages">
                    <Button className="bg-yellow-400 text-black hover:bg-yellow-300 px-8 py-6 text-lg">
                      Get Started Today
                    </Button>
                  </Link>
                  <Link href="/support">
                    <Button variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-6 text-lg">
                      Contact Support
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}