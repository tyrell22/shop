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
          description: "We’ve received your support request and will get back to you soon!",
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

  return (
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

            {/* Instructions Section */}
            <div className="max-w-2xl mx-auto mt-12">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">Instructions</h2>
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
                    <p>Most Smart TVs support IPTV apps that can use M3U URLs. Here’s how to set it up:</p>
                    <ol className="list-decimal list-inside space-y-2 mt-2">
                      <li>Install an IPTV app on your Smart TV (e.g., <strong>IPTV Smarters Pro</strong>, <strong>Smart IPTV</strong>, or <strong>SS IPTV</strong>) from your TV’s app store.</li>
                      <li>Open the app and look for an option to add a playlist:
                        <ul className="list-disc list-inside ml-4">
                          <li>In <strong>IPTV Smarters Pro</strong>: Select <strong>Add Playlist</strong> > <strong>M3U URL</strong>, then paste your M3U URL.</li>
                          <li>In <strong>Smart IPTV</strong>: Go to the app’s website (e.g., siptv.app), enter your TV’s MAC address, and upload your M3U URL.</li>
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
                      <li>Download an IPTV app from your device’s app store:
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
                    <p>MAG boxes typically use a portal URL, but some support M3U playlists. Here’s how to set it up:</p>
                    <ol className="list-decimal list-inside space-y-2 mt-2">
                      <li>Access your MAG box’s settings menu (varies by model, e.g., MAG 254, 322).</li>
                      <li>Go to <strong>System Settings</strong> > <strong>Portals</strong> or <strong>IPTV Playlist</strong>.</li>
                      <li>If M3U is supported:
                        <ul className="list-disc list-inside ml-4">
                          <li>Select <strong>Add Playlist</strong> or <strong>External Playlist</strong>.</li>
                          <li>Enter your M3U URL (you may need to use a USB drive to upload the M3U file if direct URL entry isn’t supported).</li>
                        </ul>
                      </li>
                      <li>Save and restart the MAG box to load the channels.</li>
                      <li>If M3U isn’t supported, contact support for a portal URL specific to your subscription.</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
