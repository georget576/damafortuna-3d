import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Directory | DamaFortuna 3D Tarot Reader",
  description: "Join our community of tarot enthusiasts. Share readings, journal entries, and connect with others.",
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}