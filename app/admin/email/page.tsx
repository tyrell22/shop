"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { SiteHeader } from "@/components/site-header"

export default function AdminEmailPage() {
  const [subject, setSubject] = useState("")
  const [recipient, setRecipient] = useState("")
  const [htmlContent, setHtmlContent] = useState("")
  const [textContent, setTextContent] = useState("")
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!subject || !recipient || (!htmlContent && !textContent)) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)

    try {
      const response = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: recipient,
          subject,
          html: htmlContent,
          text: textContent || htmlContent.replace(/<[^>]*>/g, ""),
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Email Sent",
          description: "Your email has been sent successfully",
        })

        // Reset form
        setSubject("")
        setRecipient("")
        setHtmlContent("")
        setTextContent("")
      } else {
        toast({
          title: "Failed to Send Email",
          description: data.message || "There was an error sending your email",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending email:", error)
      toast({
        title: "Error",
        description: "There was an error sending your email",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/admin" className="mr-4">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-yellow-400">Email Manager</h1>
            </div>
          </div>

          <Card className="border-2 border-yellow-400 bg-gray-900">
            <CardHeader>
              <CardTitle className="text-yellow-400">Send Custom Email</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendEmail} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-gray-200">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="border-gray-700 bg-gray-800 text-white"
                      placeholder="Email subject"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient" className="text-gray-200">
                      Recipient Email
                    </Label>
                    <Input
                      id="recipient"
                      type="email"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="border-gray-700 bg-gray-800 text-white"
                      placeholder="recipient@example.com"
                      required
                    />
                  </div>
                </div>

                <Tabs defaultValue="html" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                    <TabsTrigger
                      value="html"
                      className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
                    >
                      HTML Content
                    </TabsTrigger>
                    <TabsTrigger
                      value="text"
                      className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
                    >
                      Plain Text
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="html" className="mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="html-content" className="text-gray-200">
                        HTML Content
                      </Label>
                      <Textarea
                        id="html-content"
                        value={htmlContent}
                        onChange={(e) => setHtmlContent(e.target.value)}
                        className="min-h-[300px] border-gray-700 bg-gray-800 text-white font-mono"
                        placeholder="<h1>Hello</h1><p>Your email content here...</p>"
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="text" className="mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="text-content" className="text-gray-200">
                        Plain Text Content
                      </Label>
                      <Textarea
                        id="text-content"
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        className="min-h-[300px] border-gray-700 bg-gray-800 text-white font-mono"
                        placeholder="Hello,

Your email content here..."
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end">
                  <Button type="submit" className="bg-yellow-400 text-black hover:bg-yellow-300" disabled={isSending}>
                    {isSending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

