import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function TermsPrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-yellow-400">
                Terms &amp; Privacy
              </h1>
              <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl">
                Please review our terms of service and privacy policy
              </p>
            </div>
            
            <Tabs defaultValue="terms" className="w-full max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger 
                  value="terms"
                  className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
                >
                  Terms of Service
                </TabsTrigger>
                <TabsTrigger 
                  value="privacy"
                  className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
                >
                  Privacy Policy
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="terms" className="mt-6">
                <div className="bg-gray-900 p-6 md:p-8 rounded-lg border border-gray-800 space-y-6">
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-yellow-400">Terms of Service</h2>
                    <p className="text-gray-300">Last updated: March 10, 2025</p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium text-yellow-400">1. Acceptance of Terms</h3>
                    <p className="text-gray-300">
                      By accessing or using Crisp TV's services, you agree to be bound by these Terms of Service. If you do not 
                      agree to these terms, please do not use our services.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium text-yellow-400">2. Service Description</h3>
                    <p className="text-gray-300">
                      Crisp TV provides streaming services through internet protocol television (IPTV). Our service 
                      offers access to various television channels and content based on the subscription package 
                      purchased by the user.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium text-yellow-400">3. Subscription and Payment</h3>
                    <p className="text-gray-300">
                      Users must purchase a subscription to access Crisp TV services. Subscription fees are non-refundable 
                      and are charged according to the plan selected. Prices are subject to change with notice provided 
                      to users. All payments are processed securely through our payment providers.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium text-yellow-400">4. User Responsibilities</h3>
                    <p className="text-gray-300">
                      Users are responsible for maintaining the confidentiality of their account information. Users must 
                      not share their account credentials with others. Each subscription is limited to the number of devices 
                      specified in the purchased package. Users must not use the service for illegal purposes or in violation 
                      of any applicable laws.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium text-yellow-400">5. Service Availability and Quality</h3>
                    <p className="text-gray-300">
                      While we strive to provide uninterrupted service, we do not guarantee that our services will be 
                      error-free, uninterrupted, or that defects will be corrected. Service quality may vary based on 
                      device, internet connection, and other factors beyond our control.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium text-yellow-400">6. Content Availability</h3>
                    <p className="text-gray-300">
                      Channel and content availability is subject to change without notice due to licensing agreements, 
                      technical issues, or other reasons. Crisp TV does not guarantee the availability of specific channels 
                      or content.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium text-yellow-400">7. Intellectual Property</h3>
                    <p className="text-gray-300">
                      All content provided through Crisp TV is protected by copyright and other intellectual property laws. 
                      Users may not reproduce, distribute, modify, display, or create derivative works of the content without 
                      authorization.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium text-yellow-400">8. Termination of Service</h3>
                    <p className="text-gray-300">
                      Crisp TV reserves the right to suspend or terminate service to any user who violates these Terms of 
                      Service or uses the service improperly. Upon termination, users will lose access to all content and 
                      services.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium text-yellow-400">9. Limitation of Liability</h3>
                    <p className="text-gray-300">
                      To the maximum extent permitted by law, Crisp TV shall not be liable for any indirect, incidental, 
                      special, consequential, or punitive damages resulting from the use or inability to use our services.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium text-yellow-400">10. Changes to Terms</h3>
                    <p className="text-gray-300">
                      Crisp TV reserves the right to modify these Terms of Service at any time. Users will be notified 
                      of significant changes. Continued use of our services after such modifications constitutes acceptance 
                      of the updated terms.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="privacy" className="mt-6">
                <div className="bg-gray-900 p-6 md:p-8 rounded-lg border border-gray-800 space-y-6">
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-yellow-400">Privacy Policy</h2>
                    <p className="text-gray-300">Last updated: March 10, 2025</p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium text-yellow-400">1. Information We Collect</h3>
                    <p className="text-gray-300">
                      We collect information you provide when creating an account, subscribing to our service, or contacting 
                      customer support. This may include your name, email address, billing information, and device information.
                    </p>
                    <p className="text-gray-300">
                      We also automatically collect certain information when you use our service, including your IP address, 
                      device type, operating system, browser type, viewing habits, and usage data.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium text-yellow-400">2. How We Use Your Information</h3>
                    <p className="text-gray-300">
                      We use the information we collect to:
                    </p>
                    <ul className="list-disc pl-6 text-gray-300 space-y-1">
                      <li>Provide, maintain, and improve our services</li>
                      <li>Process transactions and send related information</li>
                      <li>Send administrative messages and provide customer support</li>
                      <li>Personalize your experience and provide content recommendations</li>
                      <li>Monitor and analyze usage patterns and trends</li>
                      <li>Detect, investigate, and prevent fraudulent transactions and unauthorized activities</li>
                      <li>Comply with legal obligations</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium text-yellow-400">3. Information Sharing and Disclosure</h3>
                    <p className="text-gray-300">
                      We do not sell or rent your personal information to third parties. We may share your information with:
                    </p>
                    <ul className="list-disc pl-6 text-gray-300 space-y-1">
                      <li>Service providers who perform services on our behalf</li>
                      <li>Payment processors to complete transactions</li>
                      <li>Law enforcement or other parties when required by law or to protect our rights</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium text-yellow-400">4. Data Security</h3>
                    <p className="text-gray-300">
                      We implement appropriate technical and organizational measures to protect the security of your personal 
                      information. However, no method of transmission over the Internet or electronic storage is 100% secure, 
                      and we cannot guarantee absolute security.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium text-yellow-400">5. Cookies and Similar Technologies</h3>
                    <p className="text-gray-300">
                      We use cookies and similar technologies to collect information and improve our services. You can 
                      configure your browser to reject cookies, but this may limit your ability to use certain features 
                      of our service.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium text-yellow-400">6. Your Rights and Choices</h3>
                    <p className="text-gray-300">
                      Depending on your location, you may have certain rights regarding your personal information, such as the 
                      right to access, correct, delete, or restrict processing of your data. To exercise these rights, please 
                      contact us using the information provided below.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium text-yellow-400">7. Data Retention</h3>
                    <p className="text-gray-300">
                      We retain your personal information for as long as necessary to provide our services and fulfill the 
                      purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium text-yellow-400">8. International Data Transfers</h3>
                    <p className="text-gray-300">
                      Your information may be transferred to and processed in countries other than the country in which you 
                      reside. These countries may have different data protection laws than your country.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium text-yellow-400">9. Children's Privacy</h3>
                    <p className="text-gray-300">
                      Our services are not directed to children under the age of 13, and we do not knowingly collect personal 
                      information from children under 13. If we learn that we have collected personal information from a child 
                      under 13, we will take steps to delete that information.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium text-yellow-400">10. Changes to this Privacy Policy</h3>
                    <p className="text-gray-300">
                      We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
                      new Privacy Policy on this page and updating the "Last updated" date.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium text-yellow-400">11. Contact Us</h3>
                    <p className="text-gray-300">
                      If you have any questions about this Privacy Policy or our data practices, please contact us at 
                      privacy@crispiptv.com.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}