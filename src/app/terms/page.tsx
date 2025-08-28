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
                  By accessing and using DamaFortuna 3D, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </Section>

              <Section title="Use License">
                <p>
                  Permission is granted to temporarily download one copy of DamaFortuna 3D for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose</li>
                  <li>Attempt to decompile or reverse engineer any software contained on DamaFortuna 3D</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                  <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                </ul>
              </Section>

              <Section title="Disclaimer">
                <p>
                  The materials on DamaFortuna 3D are provided on an 'as is' basis. DamaFortuna 3D makes no warranties, expressed or implied...
                </p>
              </Section>

              <Section title="Limitations">
                <p>
                  In no event shall DamaFortuna 3D or its suppliers be liable for any damages...
                </p>
              </Section>

              <Section title="Accuracy of Materials">
                <p>
                  The materials appearing on DamaFortuna 3D could include technical, typographical, or photographic errors...
                </p>
              </Section>

              <Section title="Links">
                <p>
                  DamaFortuna 3D has not reviewed all of the sites linked to its site...
                </p>
              </Section>

              <Section title="Modifications">
                <p>
                  DamaFortuna 3D may revise these terms of service for its site at any time without notice...
                </p>
              </Section>

              <Section title="Governing Law">
                <p>
                  These terms and conditions are governed by and construed in accordance with the laws of Malaysia...
                </p>
              </Section>

              <Section title="Our Tarot Reading Services">
                <p>
                  DamaFortuna 3D provides entertainment purposes only...
                </p>
              </Section>

              <Section title="User Accounts">
                <p>
                  When you create an account, you agree to provide accurate, current, and complete information...
                </p>
              </Section>

              <Section title="Prohibited Activities">
                <p>You may not use our service for any unlawful or prohibited activities, including but not limited to:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Attempting to gain unauthorized access to our systems</li>
                  <li>Interfering with or disrupting the service or servers or networks</li>
                  <li>Using the service for spam or unsolicited commercial communications</li>
                  <li>Uploading or transmitting viruses or other malicious code</li>
                </ul>
              </Section>

              <Section title="Changes to Terms">
                <p>
                  We reserve the right to modify these terms at any time...
                </p>
              </Section>

              <Section title="Contact Us">
                <p>
                  If you have any questions about these Terms of Service, please contact us.
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

