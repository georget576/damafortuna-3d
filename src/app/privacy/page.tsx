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
                <p>DamaFortuna 3D collects minimal information to provide our tarot reading services. This includes:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Email addresses for account creation and authentication</li>
                  <li>User preferences for personalized reading experiences</li>
                  <li>Reading history stored in your personal journal</li>
                </ul>
              </Section>

              <Section title="How We Use Your Information">
                <p>We use your information solely to:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Provide and improve our tarot reading services</li>
                  <li>Authenticate your account and secure your data</li>
                  <li>Personalize your reading experience</li>
                  <li>Maintain your reading journal</li>
                </ul>
              </Section>

              <Section title="Data Security">
                <p>
                  We implement industry-standard security measures to protect your personal information. Your data is encrypted and stored securely.
                </p>
              </Section>

              <Section title="Third-Party Services">
                <p>
                  We use Google for authentication purposes. Your Google profile information is only used for account creation and sign-in purposes.
                </p>
              </Section>

              <Section title="Your Rights">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Delete your account and data</li>
                  <li>Export your data</li>
                </ul>
              </Section>

              <Section title="Changes to This Policy">
                <p>
                  We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date.
                </p>
              </Section>

              <Section title="Contact Us">
                <p>
                  If you have any questions about this privacy policy, please contact us.
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