import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-[80vh] pr-4">
            <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
              <Section title="Information We Collect">
                <p>DamaFortuna 3D collects minimal information to provide our tarot reading services. We believe in transparency and only gather what is absolutely necessary to deliver a high-quality, personalized experience. This includes:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Email addresses:</strong> Required for account creation, authentication, and secure communication. We use this information to verify your identity and send important account-related notifications.</li>
                  <li><strong>User preferences:</strong> Collected to tailor your tarot reading experience to your individual needs. This includes your preferred reading styles, themes, and customization options that help us provide more relevant and meaningful insights.</li>
                  <li><strong>Reading history:</strong> Automatically stored in your personal journal to help you track your spiritual journey over time. This allows you to review past readings, observe patterns, and see how your interpretations evolve.</li>
                </ul>
              </Section>

              <Section title="How We Use Your Information">
                <p>We use your information solely to enhance your spiritual journey with DamaFortuna 3D. Your trust is our priority, and we are committed to using your data responsibly and exclusively for the following purposes:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Provide and improve our tarot reading services:</strong> We analyze usage patterns to enhance the accuracy and relevance of our readings, continuously refining our algorithms and interpretation methods to deliver deeper insights.</li>
                  <li><strong>Authenticate your account and secure your data:</strong> We implement robust security measures to protect your account from unauthorized access, ensuring that your personal information and reading history remain confidential and secure.</li>
                  <li><strong>Personalize your reading experience:</strong> By understanding your preferences and past interactions, we can customize readings that resonate more deeply with your current life circumstances and spiritual needs.</li>
                  <li><strong>Maintain your reading journal:</strong> We preserve your reading history to help you track your personal growth, reflect on past insights, and build a comprehensive record of your spiritual journey.</li>
                </ul>
              </Section>

              <Section title="Data Security">
                <p>
                  We take your privacy and security extremely seriously. DamaFortuna 3D implements comprehensive, industry-standard security measures to protect your personal information at every stage of your interaction with our platform. Your data is encrypted both in transit and at rest using advanced encryption protocols, ensuring that even if unauthorized access were attempted, your information would remain unreadable and protected. We employ regular security audits, vulnerability assessments, and follow best practices for data storage and handling. Our infrastructure is designed with multiple layers of protection, including firewalls, intrusion detection systems, and secure authentication mechanisms. We also maintain strict access controls, ensuring that only authorized personnel with legitimate business purposes can access your data, and all access is carefully monitored and logged.
                </p>
              </Section>

              <Section title="Third-Party Services">
                <p>
                  To provide you with a seamless and secure authentication experience, DamaFortuna 3D integrates with Google's authentication services. When you choose to sign in with Google, we only request access to your basic profile information such as your name and email address—nothing more. This information is used exclusively for account creation and verification purposes, allowing you to bypass traditional password-based authentication while maintaining security. We do not access, store, or use any other Google profile data, including your contacts, calendar information, Google Drive files, or any other personal Google services. Your Google credentials are never stored on our servers; instead, we rely on Google's secure OAuth protocol to handle the authentication process. You retain full control over what information is shared, and you can revoke access to DamaFortuna 3D from your Google account settings at any time.
                </p>
              </Section>

              <Section title="Your Rights">
                <p>As a user of DamaFortuna 3D, you have comprehensive rights regarding your personal data and account information. We are committed to empowering you with full control over your digital footprint and spiritual journey data. You have the right to:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Access your personal data:</strong> Request a complete copy of all the information we hold about you, including your account details, preferences, and complete reading history. This allows you to understand exactly what data we collect and how it's stored.</li>
                  <li><strong>Correct inaccurate data:</strong> Update or modify any information that is outdated, incomplete, or inaccurate. If you notice any errors in your profile or reading data, you can request corrections to ensure your information remains current and correct.</li>
                  <li><strong>Delete your account and data:</strong> Exercise your "right to be forgotten" by requesting the complete deletion of your account and all associated data. This includes removing your reading history, preferences, and personal information from our systems, subject only to legal retention requirements.</li>
                  <li><strong>Export your data:</strong> Download your information in a portable, machine-readable format. This allows you to transfer your data to other services or simply maintain your own backup of your spiritual journey records for your personal records.</li>
                </ul>
              </Section>

              <Section title="Changes to This Policy">
                <p>
                  DamaFortuna 3D is committed to maintaining transparency and keeping you informed about how we handle your personal information. As our services evolve and as legal and regulatory requirements change, we may need to update this privacy policy to reflect new practices, additional features, or enhanced security measures. When we make changes, we will post the updated policy on this page with a clear revision date indicating when the changes took effect. For significant modifications that might materially impact how we collect, use, or protect your data, we will make reasonable efforts to notify you through prominent in-app notifications, email communications, or other appropriate methods. We encourage you to review this privacy policy periodically to stay informed about our privacy practices. Your continued use of DamaFortuna 3D after any policy changes constitutes your acceptance of the updated terms.
                </p>
              </Section>

              <Section title="Contact Us">
                <p>
                  We value your privacy and are committed to addressing any concerns or questions you may have about our privacy practices. If you have any questions, comments, or requests regarding this privacy policy, or if you wish to exercise your data protection rights, please don't hesitate to reach out to our dedicated privacy team. You can contact us through our secure in-app messaging system, which is accessible from your account settings, or by emailing us directly at privacy@damafortuna3d.com. We strive to respond to all inquiries within 48 business hours and will make every effort to resolve your concerns in a timely and satisfactory manner. For more complex requests, such as data deletion or account modifications, we may need additional time to process your request, but we will keep you informed throughout the process. Your feedback helps us improve our services and better protect your privacy.
                </p>
              </Section>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 text-foreground">{title}</h2>
      <Separator className="mb-4" />
      {children}
    </div>
  )
}