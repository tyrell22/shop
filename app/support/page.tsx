"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { 
  Headphones, 
  LifeBuoy, 
  MessageSquare, 
  FileText, 
  MonitorSmartphone, 
  FileCog, 
  Settings, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle,
  Play,
  Tv,
  Zap,
  Globe,
  Monitor
} from "lucide-react";
import { SEOMetadata } from "@/components/seo-metadata";
import { generateFAQSchema } from "@/lib/structured-data";

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Message Sent",
          description: "We've received your support request and will get back to you soon!",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error(data.error || "Failed to send message");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Setup instruction FAQs
  const instructionFaqs = [
    {
      question: "How do I use M3U URL with VLC Media Player?",
      answer: `1. Open VLC Media Player on your computer.
2. Go to Media > Open Network Stream (or press Ctrl+N).
3. In the "Network URL" field, paste your M3U URL (e.g., the one provided in your subscription email).
4. Click Play to start streaming your IPTV channels.
5. Optional: Save the playlist by going to Playlist > Save Playlist to File for easy access later.`
    },
    // ... (rest of instructionFaqs remain unchanged)
  ];

  // General FAQs
  const generalFaqs = [
    {
      question: "What is Crisp TV?",
      answer: "Crisp TV is a premium IPTV service that provides thousands of live TV channels from around the world in high definition quality. Our service includes channels from the US, UK, Canada, Europe, Asia, and more, with content in multiple languages to suit your preferences."
    },
    // ... (rest of generalFaqs remain unchanged)
  ];

  // Technical FAQs
  const technicalFaqs = [
    {
      question: "What internet speed do I need for Crisp TV?",
      answer: "For SD content, we recommend at least 5 Mbps. For HD content, 10 Mbps or higher is recommended. For 4K content, we recommend 25 Mbps or higher. You can check your internet speed at speedtest.net."
    },
    // ... (rest of technicalFaqs remain unchanged)
  ];

  // Create FAQ schema for SEO
  const allFaqs = [...instructionFaqs, ...generalFaqs, ...technicalFaqs];
  const faqSchema = generateFAQSchema(allFaqs);

  // Support categories with icons
  const supportCategories = [
    // ... (supportCategories remain unchanged)
  ];

  // Support team highlights
  const supportTeamBenefits = [
    // ... (supportTeamBenefits remain unchanged)
  ];

  // Contact options
  const contactOptions = [
    // ... (contactOptions remain unchanged)
  ];

  return (
    <>
      <SEOMetadata 
        title="Crisp TV Support | 24/7 IPTV Help & Technical Assistance"
        description="Get expert help with your Crisp TV IPTV subscription. Learn how to set up M3U URLs on various devices and access our 24/7 customer support team."
        canonical="/support"
        keywords={["iptv support", "m3u setup", "iptv help", "vlc iptv setup", "kodi iptv", "smart tv iptv", "iptv customer support", "streaming help"]}
        structuredData={faqSchema}
      />

      <div className="flex min-h-screen flex-col bg-black text-white">
        <SiteHeader />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-gray-900 to-black">
            <div className="container px-4 md:px-6">
              <div className="text-center space-y-4 mb-12">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-yellow-400">
                  Customer Support
                </h1>
                <p className="max-w-[800px] mx-auto text-gray-300 text-xl md:text-2xl">
                  We're here to help you get the most out of your Crisp TV experience
                </p>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mt-12">
                {supportCategories.map((category, index) => (
                  <Card key={index} className="bg-gray-900 border-2 border-yellow-400 shadow-lg hover:shadow-yellow-400/20 transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="mb-4 flex justify-center">{category.icon}</div>
                      <CardTitle className="text-xl font-semibold text-yellow-400 text-center">{category.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-center">{category.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Form and Options Section */}
          <section className="w-full py-16 md:py-24 bg-black">
            <div className="container px-4 md:px-6">
              <div className="grid gap-12 lg:grid-cols-2">
                {/* Contact Form */}
                <div>
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-yellow-400 mb-4">
                      Contact Us
                    </h2>
                    <p className="text-gray-300 md:text-lg">
                      Have a question or need assistance? Fill out the form below and our support team will get back to you as soon as possible.
                    </p>
                  </div>
                  <div className="bg-gray-900 p-6 rounded-lg border-2 border-yellow-400">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-yellow-400">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          className="bg-black text-white border-gray-700 focus:border-yellow-400"
                          required
                        />
                      </div>
                      {/* ... (rest of form fields remain unchanged) */}
                      <Button
                        type="submit"
                        className="w-full bg-yellow-400 text-black hover:bg-yellow-300 py-6 text-lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </div>
                </div>

                {/* Contact Options and Support Team */}
                <div className="space-y-12">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-yellow-400 mb-6">
                      Other Ways to Reach Us
                    </h2>
                    <div className="space-y-6">
                      {contactOptions.map((option, index) => (
                        <div key={index} className="flex items-start gap-4 bg-gray-900 p-4 rounded-lg border border-gray-800">
                          <div className="flex-shrink-0">{option.icon}</div>
                          <div>
                            <h3 className="text-xl font-semibold text-yellow-400">{option.title}</h3>
                            <p className="text-white font-medium">{option.details}</p>
                            <p className="text-gray-400">{option.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-yellow-400 mb-6">
                      Our Support Team
                    </h2>
                    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                      <p className="text-gray-300 mb-6">
                        Our dedicated support team is committed to providing you with the best possible assistance to enhance your Crisp TV experience.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        {supportTeamBenefits.map((benefit, index) => (
                          <div key={index} className="flex gap-3">
                            <div className="flex-shrink-0 mt-1">{benefit.icon}</div>
                            <div>
                              <h3 className="font-medium text-white">{benefit.title}</h3>
                              <p className="text-sm text-gray-400">{benefit.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Setup Instructions Section */}
          <section className="w-full py-16 md:py-24 bg-gray-900">
            {/* ... (Setup Instructions Section content remains unchanged) */}
          </section>

          {/* FAQ Section */}
          <section className="w-full py-16 md:py-24 bg-black">
            {/* ... (FAQ Section content remains unchanged) */}
          </section>

          {/* Video Tutorials Section */}
          <section className="w-full py-16 md:py-24 bg-gray-900">
            {/* ... (Video Tutorials Section content remains unchanged) */}
          </section>

          {/* Comparison of Compatible Devices */}
          <section className="w-full py-16 md:py-24 bg-black">
            {/* ... (Comparison Section content remains unchanged) */}
          </section>

          {/* Live Support CTA */}
          <section className="w-full py-16 md:py-24 bg-gradient-to-t from-gray-900 to-black">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center mb-4">
                  <Headphones className="h-8 w-8 text-black" />
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-yellow-400">
                  Still Need Assistance?
                </h2>
                <p className="max-w-[800px] text-gray-300 md:text-xl">
                  Our support team is available 24/7 to help you with any questions or issues.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Button className="bg-yellow-400 text-black hover:bg-yellow-300 px-8 py-6 text-lg">
                    Start Live Chat
                  </Button>
                  <Link href="/contact">
                    <Button variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-6 text-lg">
                      Call Support
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