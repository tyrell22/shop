"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useToast } from "@/components/ui/use-toast";
import { Headphones } from "lucide-react";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

  // FAQs for both display and structured data
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
      question: "How do I use M3U URL with Android/iOS Devices?",
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

  // Create FAQ structured data
  const faqSchema = generateFAQSchema(instructionFaqs);

  // Additional FAQs for structured data only (to improve SEO)
  const additionalFaqsForSeo = [
    {
      question: "What is Crisp TV?",
      answer: "Crisp TV is a premium IPTV service that provides thousands of live TV channels from around the world in high definition quality."
    },
    {
      question: "How much does Crisp TV cost?",
      answer: "Crisp TV offers multiple subscription packages starting from $9.99 per month. Visit our packages page for detailed pricing information."
    },
    {
      question: "Do you offer a free trial?",
      answer: "Yes, we offer a limited free trial for new customers. Contact our support team to request a trial."
    },
    {
      question: "How many devices can I use with my subscription?",
      answer: "The number of devices depends on your subscription package. Our basic package supports 1 device, while premium packages support up to 4 devices simultaneously."
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer: "Yes, you can cancel your subscription at any time from your account dashboard."
    }
  ];

  // Create comprehensive FAQ schema for SEO
  const completeFaqSchema = generateFAQSchema([...instructionFaqs, ...additionalFaqsForSeo]);

  return (
    <>
      <SEOMetadata 
        title="Crisp TV Support | IPTV Setup Help & Customer Assistance"
        description="Get help with your Crisp TV IPTV subscription. Learn how to set up M3U URLs on various devices including VLC, Kodi, Smart TVs, Android/iOS, and MAG boxes."
        canonical="/support"
        keywords={["iptv support", "m3u setup", "iptv help", "vlc iptv setup", "kodi iptv", "smart tv iptv", "iptv customer support"]}
        structuredData={completeFaqSchema}
      />

      <div className="flex min-h-screen flex-col bg-black text-white">
        <SiteHeader />
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="text-center space-y-4 mb-12">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-yellow-400">
                  Support
                </h1>
                <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl">
                  Need help? Contact our 24/7 support team by filling out the form below.
                </p>
              </div>

              {/* Instructions Section - Moved Above Form */}
              <div className="max-w-2xl mx-auto mb-12">
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">Setup Instructions</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="vlc">
                    <AccordionTrigger className="text-yellow-400">Using M3U URL with VLC Media Player</AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <ol className="list-decimal list-inside space-y-2">
                        <li>Open VLC Media Player on your computer.</li>
                        <li>Go to <strong>Media</strong> &gt; <strong>Open Network Stream</strong> (or press <strong>Ctrl+N</strong>).</li>
                        <li>In the "Network URL" field, paste your M3U URL (e.g., the one provided in your subscription email).</li>
                        <li>Click <strong>Play</strong> to start streaming your IPTV channels.</li>
                        <li>Optional: Save the playlist by going to <strong>Playlist</strong> &gt; <strong>Save Playlist to File</strong> for easy access later.</li>
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
                            <li>Go to <strong>Add-ons</strong> &gt; <strong>Download</strong> &gt; <strong>PVR Clients</strong>.</li>
                            <li>Select <strong>PVR IPTV Simple Client</strong> and click <strong>Install</strong>.</li>
                          </ul>
                        </li>
                        <li>Configure the add-on:
                          <ul className="list-disc list-inside ml-4">
                            <li>Go to <strong>My Add-ons</strong> &gt; <strong>PVR Clients</strong> &gt; <strong>PVR IPTV Simple Client</strong> &gt; <strong>Configure</strong>.</li>
                            <li>In the "General" tab, set "Location" to <strong>Remote Path (Internet address)</strong>.</li>
                            <li>Paste your M3U URL in the "M3U Playlist URL" field.</li>
                            <li>Click <strong>OK</strong>.</li>
                          </ul>
                        </li>
                        <li>Enable the client: Go to <strong>Settings</strong> &gt; <strong>PVR & Live TV</strong> &gt; enable <strong>Sync channel groups with backend</strong>.</li>
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
                            <li>In <strong>IPTV Smarters Pro</strong>: Select <strong>Add Playlist</strong> &gt; <strong>M3U URL</strong>, then paste your M3U URL.</li>
                            <li>In <strong>Smart IPTV</strong>: Go to the app's website (e.g., siptv.app), enter your TV's MAC address, and upload your M3U URL.</li>
                            <li>In <strong>SS IPTV</strong>: Go to <strong>Settings</strong> &gt; <strong>Add Playlist</strong> &gt; <strong>External Playlist</strong>, and enter your M3U URL.</li>
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
                            <li>In <strong>IPTV Smarters Pro</strong>: Tap <strong>Add Playlist</strong> &gt; <strong>M3U URL</strong>, paste your M3U URL, and save.</li>
                            <li>In <strong>TiviMate</strong>: Go to <strong>Settings</strong> &gt; <strong>Playlists</strong> &gt; <strong>Add Playlist</strong> &gt; <strong>M3U Playlist</strong>, and enter your URL.</li>
                            <li>In <strong>GSE Smart IPTV</strong>: Go to <strong>Remote Playlists</strong> &gt; <strong>Add M3U URL</strong>, paste your URL, and save.</li>
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
                        <li>Go to <strong>System Settings</strong> &gt; <strong>Portals</strong> or <strong>IPTV Playlist</strong>.</li>
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

              {/* Support Form */}
              <div className="max-w-lg mx-auto bg-gray-900 p-6 rounded-lg border-2 border-yellow-400">
                <div className="flex justify-center mb-6">
                  <Headphones className="h-12 w-12 text-yellow-400" />
                </div>
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
                    className="w-full bg-yellow-400 text-black hover:bg-yellow-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}