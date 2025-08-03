import type { Metadata } from "next";
import MarketingConsultantBot from "@/components/MarketingConsultantBot";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "Marketing Consultant AI - Untuk Mu Karya Mu",
  description: "Get expert digital marketing advice for your small business. Our AI consultant helps with social media, SEO, content marketing, and more.",
  keywords: "digital marketing, social media strategy, SEO, content marketing, small business marketing, AI consultant",
};

export default function MarketingConsultantPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <MarketingConsultantBot />
    </div>
  );
} 