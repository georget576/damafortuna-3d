import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-[80vh] pr-4">
            <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
              <Section title="Acceptance of Terms">
                <p>
                  By accessing, browsing, or otherwise utilizing the DamaFortuna 3D platform, you hereby acknowledge and affirm your acceptance of, and agreement to be legally bound by, the terms and conditions set forth in this Terms of Service agreement. If you do not agree to these terms, you are expressly prohibited from using the platform.
                </p>
              </Section>

              <Section title="Use License">
                <p>
                  Subject to your compliance with these Terms of Service, DamaFortuna 3D grants you a limited, revocable, non-exclusive, and non-transferable license to download and temporarily access one copy of the platform solely for personal, non-commercial, and transitory viewing purposes. This license does not constitute a transfer of title, and under this license, you shall not:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Alter, modify, or duplicate any materials contained within the platform</li>
                  <li>Utilize the materials for any commercial or revenue-generating purpose</li>
                  <li>Attempt to decompile, disassemble, or reverse engineer any software components</li>
                  <li>Remove, obscure, or alter any copyright, trademark, or proprietary notices</li>
                  <li>Distribute, sublicense, or mirror the materials on any other server or medium</li>
                </ul>
              </Section>

              <Section title="Disclaimer">
                <p>
                  All materials, content, and services provided via DamaFortuna 3D are offered on an "as is" and "as available" basis. DamaFortuna 3D makes no representations or warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
                </p>
              </Section>

              <Section title="Limitations">
                <p>
                  Under no circumstances shall DamaFortuna 3D or its affiliates, licensors, or suppliers be held liable for any indirect, incidental, consequential, or punitive damages arising out of the use or inability to use the platform, even if DamaFortuna 3D has been advised of the possibility of such damages.
                </p>
              </Section>

              <Section title="Accuracy of Materials">
                <p>
                  While reasonable efforts are made to ensure the accuracy and reliability of the content presented on DamaFortuna 3D, the platform may contain typographical, technical, or photographic errors. DamaFortuna 3D does not warrant that any of the materials are accurate, complete, or current.
                </p>
              </Section>

              <Section title="Links">
                <p>
                  DamaFortuna 3D may contain hyperlinks to external websites that are not maintained or controlled by us. We do not endorse, review, or assume responsibility for the content, policies, or practices of any third-party sites linked from our platform.
                </p>
              </Section>

              <Section title="Modifications">
                <p>
                  DamaFortuna 3D reserves the right, at its sole discretion, to amend, revise, or otherwise modify these Terms of Service at any time without prior notice. Continued use of the platform following any such changes shall constitute your acceptance of the revised terms.
                </p>
              </Section>

              <Section title="Governing Law">
                <p>
                  These Terms of Service shall be governed by, and construed in accordance with, the laws of Malaysia. Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the courts located within Malaysia.
                </p>
              </Section>

              <Section title="Our Tarot Reading Services">
                <p>
                  The tarot reading services provided by DamaFortuna 3D are intended solely for entertainment purposes. No guarantees or assurances are made regarding the accuracy, reliability, or outcomes of any readings, and they should not be construed as professional advice.
                </p>
              </Section>

              <Section title="User Accounts">
                <p>
                  By registering for an account on DamaFortuna 3D, you agree to furnish accurate, current, and complete information. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                </p>
              </Section>

              <Section title="Prohibited Activities">
                <p>
                  You shall not engage in any activity that is unlawful, prohibited by these Terms, or otherwise harmful to the integrity of the platform, including but not limited to:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Attempting to gain unauthorized access to any systems or networks</li>
                  <li>Disrupting or interfering with the functionality of the platform or its servers</li>
                  <li>Engaging in spamming, phishing, or other unsolicited communications</li>
                  <li>Uploading or disseminating malicious software, viruses, or harmful code</li>
                </ul>
              </Section>

              <Section title="Changes to Terms">
                <p>
                  DamaFortuna 3D reserves the right to update or modify these Terms of Service at any time. It is your responsibility to review these terms periodically for any changes. Continued use of the platform following the posting of changes constitutes acceptance thereof.
                </p>
              </Section>

              <Section title="Contact Us">
                <p>
                  Should you have any questions, concerns, or inquiries regarding these Terms of Service, you are encouraged to contact us through the appropriate channels provided on the platform.
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