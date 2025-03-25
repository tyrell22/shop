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
    {
      question: "How do I use M3U URL with Kodi?",
      answer: `1. Install Kodi on your device and open it.
2. Install the PVR IPTV Simple Client add-on from Add-ons > Download > PVR Clients.
3. Configure the add-on by setting "Location" to Remote Path and pasting your M3U URL.
4. Enable the client and restart Kodi, then go to TV in the main menu to view your channels.`
    },
    {
      question: "How do I use M3U URL with Smart TVs?",
      answer: `1. Install an IPTV app on your Smart TV (e.g., IPTV Smarters Pro, Smart IPTV, or SS IPTV).
2. Open the app and look for an option to add a playlist or M3U URL.
3. Enter your M3U URL provided in your subscription.
4. Save the playlist and refresh the app to load your channels.`
    },
    {
      question: "How do I use M3U URL with  Android/iOS Devices?",
      answer: `1. Download an IPTV app from your device's app store (e.g., IPTV Smarters Pro, XCIPTV, TiviMate for Android or IPTV Smarters Pro, GSE Smart IPTV for iOS).
2. Open the app and add a new playlist using your M3U URL.
3. Wait for the app to load the channels, then select a channel to stream.`
    },
    {
      question: "How do I use M3U URL with MAG Boxes?",
      answer: `MAG boxes typically use a portal URL, but some support M3U playlists:
1. Access your MAG box's settings menu.
2. Go to System Settings > Portals or IPTV Playlist.
3. If M3U is supported, select Add Playlist and enter your M3U URL.
4. Save and restart the MAG box to load the channels.
5. If M3U isn't supported, contact support for a portal URL specific to your subscription.`
    }
  ];

  // General FAQs
  const generalFaqs = [
    {
      question: "What is Crisp TV?",
      answer: "Crisp TV is a premium IPTV service that provides thousands of live TV channels from around the world in high definition quality. Our service includes channels from the US, UK, Canada, Europe, Asia, and more, with content in multiple languages to suit your preferences."
    },
    {
      question: "How much does Crisp TV cost?",
      answer: "Crisp TV offers multiple subscription packages starting from $9.99 per month. We provide Basic, Standard, and Premium packages with different features and device limits. Visit our packages page for detailed pricing information."
    },
    {
      question: "Do you offer a free trial?",
      answer: "Yes, we offer a limited free trial for new customers so you can test our service before committing to a subscription. The trial provides access to a selection of our channels for 24 hours. Contact our support team to request a trial."
    },
    {
      question: "How many devices can I use with my subscription?",
      answer: "The number of devices depends on your subscription package. Our Basic plan supports 1 device, Standard supports 2 devices, and Premium supports up to 4 devices simultaneously."
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer: "Yes, you can cancel your subscription at any time from your account dashboard. There are no cancellation fees or hidden charges. If you need assistance with cancellation, our support team is available 24/7 to help."
    }
  ];

  // Technical FAQs
  const technicalFaqs = [
    {
      question: "What internet speed do I need for Crisp TV?",
      answer: "For SD content, we recommend at least 5 Mbps. For HD content, 10 Mbps or higher is recommended. For 4K content, we recommend 25 Mbps or higher. You can check your internet speed at speedtest.net."
    },
    {
      question: "Why am I experiencing buffering?",
      answer: "Buffering can occur due to several factors: insufficient internet speed, network congestion, or device limitations. Try reducing the stream quality, using a wired connection instead of Wi-Fi, or restarting your device and router."
    },
    {
      question: "Is VPN use recommended with Crisp TV?",
      answer: "While our service works with VPNs, they can sometimes reduce your connection speed, potentially affecting streaming quality. If you choose to use a VPN, select a server close to your location for better performance."
    },
    {
      question: "Can I use Crisp TV when traveling abroad?",
      answer: "Yes, you can access Crisp TV from anywhere in the world as long as you have an internet connection. Some countries may have restrictions on IPTV services, so check local regulations or consider using a VPN if necessary."
    },
    {
      question: "How do I update my payment information?",
      answer: "Log in to your Crisp TV account, go to Account Settings > Payment Methods, and you can add, remove, or update your payment information. For assistance, contact our support team."
    }
  ];

  // Create FAQ schema for SEO
  const allFaqs = [...instructionFaqs, ...generalFaqs, ...technicalFaqs];
  const faqSchema = generateFAQSchema(allFaqs);

  // Support categories with icons
  const supportCategories = [
    { 
      icon: <FileCog className="h-10 w-10 text-yellow-400" />, 
      title: "Technical Support", 
      description: "Get help with setup, streaming issues, or account problems" 
    },
    { 
      icon: <MonitorSmartphone className="h-10 w-10 text-yellow-400" />, 
      title: "Device Compatibility", 
      description: "Learn how to use Crisp TV on your preferred devices" 
    },
    { 
      icon: <FileText className="h-10 w-10 text-yellow-400" />, 
      title: "Billing Questions", 
      description: "Assistance with payments, subscriptions, or refunds" 
    },
    { 
      icon: <MessageSquare className="h-10 w-10 text-yellow-400" />, 
      title: "General Inquiries", 
      description: "Questions about our service, features, or content" 
    },
  ];

  // Support team highlights
  const supportTeamBenefits = [
    { 
      icon: <Clock className="h-6 w-6 text-yellow-400" />, 
      title: "24/7 Availability", 
      description: "Our team is available around the clock to assist you" 
    },
    { 
      icon: <CheckCircle className="h-6 w-6 text-yellow-400" />, 
      title: "Rapid Response", 
      description: "Most tickets are answered within 30 minutes" 
    },
    { 
      icon: <Settings className="h-6 w-6 text-yellow-400" />, 
      title: "Technical Expertise", 
      description: "Specialized support for all major devices and platforms" 
    },
    { 
      icon: <Headphones className="h-6 w-6 text-yellow-400" />, 
      title: "Multilingual Support", 
      description: "Assistance available in English, Spanish, French, and Arabic" 
    },
  ];

  // Contact options
  const contactOptions = [
    { 
      icon: <Mail className="h-8 w-8 text-yellow-400" />, 
      title: "Email Support", 
      details: "support@crisptv.com", 
      description: "For general inquiries and non-urgent issues" 
    },
    { 
      icon: <MessageSquare className="h-8 w-8 text-yellow-400" />, 
      title: "Live Chat", 
      details: "Available 24/7", 
      description: "For immediate assistance with quick questions" 
    },
    { 
      icon: <Phone className="h-8 w-8 text-yellow-400" />, 
      title: "Phone Support", 
      details: "+1 (888) 555-IPTV", 
      description: "For complex issues requiring detailed assistance" 
    },
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
                      <div>
                        <Label htmlFor="email" className="text-yellow-400">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Your email"
                          className="bg-black text-white border-gray-700 focus:border-yellow-400"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject" className="text-yellow-400">Subject</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Subject of your message"
                          className="bg-black text-white border-gray-700 focus:border-yellow-400"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="message" className="text-yellow-400">Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="How can we assist you?"
                          className="bg-black text-white border-gray-700 focus:border-yellow-400"
                          rows={5}
                          required
                        />
                      </div>
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
            <div className="container px-4 md:px-6">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-yellow-400">
                  Setup Instructions
                </h2>
                <p className="max-w-[800px] mx-auto text-gray-300 md:text-xl">
                  Learn how to set up Crisp TV on your favorite devices
                </p>
              </div>

              <div className="grid md:grid-cols-5 gap-8">
                <div className="md:col-span-2 flex items-center justify-center">
                  <div className="relative w-full h-[300px] sm:h-[400px] rounded-xl overflow-hidden border-2 border-yellow-400">
                    <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 flex items-center justify-center">
                      <div className="grid grid-cols-2 grid-rows-2 gap-4 w-3/4 h-3/4">
                        <div className="rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center">
                          <MonitorSmartphone className="w-16 h-16 text-yellow-400" />
                        </div>
                        <div className="rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center">
                          <Settings className="w-16 h-16 text-yellow-400" />
                        </div>
                        <div className="rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center">
                          <FileCog className="w-16 h-16 text-yellow-400" />
                        </div>
                        <div className="rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center">
                          <LifeBuoy className="w-16 h-16 text-yellow-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-3">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="vlc">
                      <AccordionTrigger className="text-yellow-400">Using M3U URL with VLC Media Player</AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        <ol className="list-decimal list-inside space-y-2">
                          <li>Open VLC Media Player on your computer.</li>
                          <li>Go to <strong>Media</strong> > <strong>Open Network Stream</strong> (or press <strong>Ctrl+N</strong>).</li>
                          <li>In the "Network URL" field, paste your M3U URL (e.g., the one provided in your subscription email).</li>
                          <li>Click <strong>Play</strong> to start streaming your IPTV channels.</li>
                          <li>Optional: Save the playlist by going to <strong>Playlist</strong> > <strong>Save Playlist to File</strong> for easy access later.</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="kodi">
                      <AccordionTrigger className="text-yellow-400">Using M3U URL with Kodi</AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        <ol className="list-decimal list-inside space-y-2">
                          <li>Install Kodi on your device and open it.</li>
                          <li>Install the <strong>PVR IPTV Simple Client</strong> add-on:
                            <ul className="list-disc list-inside ml-4">
                              <li>Go to <strong>Add-ons</strong> > <strong>Download</strong> > <strong>PVR Clients</strong>.</li>
                              <li>Select <strong>PVR IPTV Simple Client</strong> and click <strong>Install</strong>.</li>
                            </ul>
                          </li>
                          <li>Configure the add-on:
                            <ul className="list-disc list-inside ml-4">
                              <li>Go to <strong>My Add-ons</strong> > <strong>PVR Clients</strong> > <strong>PVR IPTV Simple Client</strong> > <strong>Configure</strong>.</li>
                              <li>In the "General" tab, set "Location" to <strong>Remote Path (Internet address)</strong>.</li>
                              <li>Paste your M3U URL in the "M3U Playlist URL" field.</li>
                              <li>Click <strong>OK</strong>.</li>
                            </ul>
                          </li>
                          <li>Enable the client: Go to <strong>Settings</strong> > <strong>PVR & Live TV</strong> > enable <strong>Sync channel groups with backend</strong>.</li>
                          <li>Restart Kodi, then go to <strong>TV</strong> in the main menu to view your channels.</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="smart-tv">
                      <AccordionTrigger className="text-yellow-400">Using M3U URL with Smart TVs</AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        <p>Most Smart TVs support IPTV apps that can use M3U URLs. Here's how to set it up:</p>
                        <ol className="list-decimal list-inside space-y-2 mt-2">
                          <li>Install an IPTV app on your Smart TV (e.g., <strong>IPTV Smarters Pro</strong>, <strong>Smart IPTV</strong>, or <strong>SS IPTV</strong>) from your TV's app store.</li>
                          <li>Open the app and look for an option to add a playlist:
                            <ul className="list-disc list-inside ml-4">
                              <li>In <strong>IPTV Smarters Pro</strong>: Select <strong>Add Playlist</strong> > <strong>M3U URL</strong>, then paste your M3U URL.</li>
                              <li>In <strong>Smart IPTV</strong>: Go to the app's website (e.g., siptv.app), enter your TV's MAC address, and upload your M3U URL.</li>
                              <li>In <strong>SS IPTV</strong>: Go to <strong>Settings</strong> > <strong>Add Playlist</strong> > <strong>External Playlist</strong>, and enter your M3U URL.</li>
                            </ul>
                          </li>
                          <li>Save the playlist and refresh the app to load your channels.</li>
                          <li>Navigate to the channel list and start streaming.</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="android-ios">
                      <AccordionTrigger className="text-yellow-400">Using M3U URL with Android/iOS Devices</AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        <ol className="list-decimal list-inside space-y-2">
                          <li>Download an IPTV app from your device's app store:
                            <ul className="list-disc list-inside ml-4">
                              <li>Android: <strong>IPTV Smarters Pro</strong>, <strong>XCIPTV</strong>, or <strong>TiviMate</strong> (Google Play Store).</li>
                              <li>iOS: <strong>IPTV Smarters Pro</strong> or <strong>GSE Smart IPTV</strong> (App Store).</li>
                            </ul>
                          </li>
                          <li>Open the app and add a new playlist:
                            <ul className="list-disc list-inside ml-4">
                              <li>In <strong>IPTV Smarters Pro</strong>: Tap <strong>Add Playlist</strong> > <strong>M3U URL</strong>, paste your M3U URL, and save.</li>
                              <li>In <strong>TiviMate</strong>: Go to <strong>Settings</strong> > <strong>Playlists</strong> > <strong>Add Playlist</strong> > <strong>M3U Playlist</strong>, and enter your URL.</li>
                              <li>In <strong>GSE Smart IPTV</strong>: Go to <strong>Remote Playlists</strong> > <strong>Add M3U URL</strong>, paste your URL, and save.</li>
                            </ul>
                          </li>
                          <li>Wait for the app to load the channels, then select a channel to stream.</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="mag">
                      <AccordionTrigger className="text-yellow-400">Using M3U URL with MAG Boxes</AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        <p>MAG boxes typically use a portal URL, but some support M3U playlists. Here's how to set it up:</p>
                        <ol className="list-decimal list-inside space-y-2 mt-2">
                          <li>Access your MAG box's settings menu (varies by model, e.g., MAG 254, 322).</li>
                          <li>Go to <strong>System Settings</strong> > <strong>Portals</strong> or <strong>IPTV Playlist</strong>.</li>
                          <li>If M3U is supported:
                            <ul className="list-disc list-inside ml-4">
                              <li>Select <strong>Add Playlist</strong> or <strong>External Playlist</strong>.</li>
                              <li>Enter your M3U URL (you may need to use a USB drive to upload the M3U file if direct URL entry isn't supported).</li>
                            </ul>
                          </li>
                          <li>Save and restart the MAG box to load the channels.</li>
                          <li>If M3U isn't supported, contact support for a portal URL specific to your subscription.</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="w-full py-16 md:py-24 bg-black">
            <div className="container px-4 md:px-6">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-yellow-400">
                  Frequently Asked Questions
                </h2>
                <p className="max-w-[800px] mx-auto text-gray-300 md:text-xl">
                  Find answers to common questions about our IPTV service
                </p>
              </div>

              <Tabs defaultValue="general" className="w-full max-w-4xl mx-auto">
                <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                  <TabsTrigger 
                    value="general"
                    className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
                  >
                    General
                  </TabsTrigger>
                  <TabsTrigger 
                    value="technical"
                    className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
                  >
                    Technical
                  </TabsTrigger>
                  <TabsTrigger 
                    value="setup"
                    className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
                  >
                    Setup
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="mt-6">
                  <div className="space-y-4">
                    {generalFaqs.map((faq, index) => (
                      <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                        <h3 className="text-xl font-medium text-yellow-400 mb-2">{faq.question}</h3>
                        <p className="text-gray-300">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="technical" className="mt-6">
                  <div className="space-y-4">
                    {technicalFaqs.map((faq, index) => (
                      <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                        <h3 className="text-xl font-medium text-yellow-400 mb-2">{faq.question}</h3>
                        <p className="text-gray-300">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="setup" className="mt-6">
                  <div className="space-y-4">
                    {instructionFaqs.map((faq, index) => (
                      <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                        <h3 className="text-xl font-medium text-yellow-400 mb-2">{faq.question}</h3>
                        <p className="text-gray-300 whitespace-pre-line">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </section>

          {/* Video Tutorials Section */}
          <section className="w-full py-16 md:py-24 bg-gray-900">
            <div className="container px-4 md:px-6">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-yellow-400">
                  Video Tutorials
                </h2>
                <p className="max-w-[800px] mx-auto text-gray-300 md:text-xl">
                  Visual step-by-step guides for setting up Crisp TV on various devices
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                <Card className="bg-gray-900 border border-gray-800 overflow-hidden">
                  <div className="aspect-video bg-gray-800 flex items-center justify-center">
                    <div className="rounded-full w-16 h-16 bg-yellow-400 flex items-center justify-center">
                      <Play className="h-8 w-8 text-black ml-1" />
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-yellow-400">Smart TV Setup Guide</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300">Complete walkthrough for setting up Crisp TV on Samsung, LG, and other Smart TV models</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border border-gray-800 overflow-hidden">
                  <div className="aspect-video bg-gray-800 flex items-center justify-center">
                    <div className="rounded-full w-16 h-16 bg-yellow-400 flex items-center justify-center">
                      <Play className="h-8 w-8 text-black ml-1" />
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-yellow-400">Android & iOS Setup</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300">How to install and configure Crisp TV on your smartphone or tablet</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border border-gray-800 overflow-hidden">
                  <div className="aspect-video bg-gray-800 flex items-center justify-center">
                    <div className="rounded-full w-16 h-16 bg-yellow-400 flex items-center justify-center">
                      <Play className="h-8 w-8 text-black ml-1" />
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-yellow-400">Troubleshooting Common Issues</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300">Solutions for buffering, connection problems, and other common IPTV issues</p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center mt-8">
                <Link href="/tutorials">
                  <Button className="bg-yellow-400 text-black hover:bg-yellow-300">
                    View All Tutorials
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Comparison of Compatible Devices */}
          <section className="w-full py-16 md:py-24 bg-black">
            <div className="container px-4 md:px-6">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-yellow-400">
                  Compatible Devices
                </h2>
                <p className="max-w-[800px] mx-auto text-gray-300 md:text-xl">
                  Crisp TV works seamlessly with a wide range of devices and platforms
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-900">
                      <th className="p-4 border border-gray-800 text-left text-yellow-400">Device Type</th>
                      <th className="p-4 border border-gray-800 text-center text-yellow-400">Compatibility</th>
                      <th className="p-4 border border-gray-800 text-center text-yellow-400">Recommended App</th>
                      <th className="p-4 border border-gray-800 text-center text-yellow-400">Video Quality</th>
                      <th className="p-4 border border-gray-800 text-center text-yellow-400">Ease of Setup</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-4 border border-gray-800 bg-gray-900">
                        <div className="flex items-center gap-3">
                          <Tv className="h-5 w-5 text-yellow-400" />
                          <span className="font-medium">Smart TVs</span>
                        </div>
                      </td>
                      <td className="p-4 border border-gray-800 bg-gray-900 text-center">Excellent</td>
                      <td className="p-4 border border-gray-800 bg-gray-900 text-center">IPTV Smarters Pro</td>
                      <td className="p-4 border border-gray-800 bg-gray-900 text-center">Up to 4K</td>
                      <td className="p-4 border border-gray-800 bg-gray-900 text-center">★★★★☆</td>
                    </tr>
                    <tr>
                      <td className="p-4 border border-gray-800 bg-gray-900">
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-yellow-400" />
                          <span className="font-medium">Amazon Firestick</ Grec>
                        </div>
                      </td>
                      <td className="p-4 border border-gray-800 bg-gray-900 text-center">Excellent</td>
                      <td className="p-4 border border-gray-800 bg-gray-900 text-center">TiviMate</td>
                      <td className="p-4 border border-gray-800 bg-gray-900 text-center">Up to 4K</td>
                      <td className="p-4 border border-gray-800 bg-gray-900 text-center">★★★★★</td>
                    </tr>
                    <tr>
                      <td className="p-4 border border-gray-800 bg-gray-900">
                        <div className="flex items-center gap-3">
                          <Monitor className="h-5 w-5 text-yellow-400" />
                          <span className="font-medium">Computers/Laptops</span>
                        </div>
                      </td>
                      <td className="p-4 border border-gray-800 bg-gray-900 text-center">Excellent</td>
                      <td className="p-4 border border-gray-800 bg-gray-900 text-center">VLC Player</td>
                      <td className="p-4 border border-gray-800 bg-gray-900 text-center">Up to 4K</td>
                      <td className="p-4 border border-gray-800 bg-gray-900 text-center">★★★☆☆</td>
                    </tr>
                    <tr>
                      <td className="p-4 border border-gray-800 bg-gray-900">
                        <div className="flex items-center gap-3">
                          <MonitorSmartphone className="h-5 w-5 text-yellow-400" />
                          <span className="font-medium">Android/iOS</span>
                        </div>
                      </td>
                      <td className="p-4 border border-gray-800 bg-gray-900 text-center">Excellent</td>
                      <td className="p-4 border border-gray-800 bg-gray-900 text-center">IPTV Smarters Pro</td>
                      <td className="p-4 border border-gray-800 bg-gray-900 text-center">Up to 1080p</td>
                      <td className="p-4 border border-gray-800 bg-gray-900 text-center">★★★★☆</td>
                    </tr>
                    <tr>
                      <td className="p-4 border border-gray-800 bg-gray-900">
                        <div className="flex items-center gap-3">
                          <Settings className="h-5 w-5 text-yellow-400" />
                          <span className="font-medium">MAG Boxes</span>
                        </div>
                      </td>
                      <td className="p-4 border border-gray-800 bg-gray-900 text-center">Very Good</td>
                      <td className="p-4 border border-gray-800 bg-gray-900 text-center">Portal URL</td>
                      <td className="p-4 border border-gray-800 bg-gray-900 text-center">Up to 1080p</td>
                      <td className="p-4 border border-gray-800 bg-gray-900 text-center">★★★☆☆</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
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