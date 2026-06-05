import Link from "next/link";

const pages: Record<string, { title: string; description: string }> = {
  features: { title: "Features", description: "Explore the powerful AI capabilities CircuCity AI brings to your e-commerce store." },
  pricing: { title: "Pricing", description: "Simple, transparent pricing that scales with your business. Start free, upgrade as you grow." },
  documentation: { title: "Documentation", description: "Comprehensive guides and API references to integrate CircuCity AI into your store." },
  "api-docs": { title: "API Documentation", description: "REST API reference for developers. Integrate CircuCity AI with any platform." },
  "about-us": { title: "About Us", description: "Our mission is to make AI-powered customer support accessible to every online store." },
  blog: { title: "Blog", description: "Insights, tips, and stories about AI in e-commerce and customer experience." },
  careers: { title: "Careers", description: "Join our team and help shape the future of AI-powered customer support." },
  contact: { title: "Contact", description: "Get in touch with our team. We would love to hear from you." },
  "contact-sales": { title: "Contact Sales", description: "Talk to our sales team about custom enterprise solutions." },
  privacy: { title: "Privacy Policy", description: "How we collect, use, and protect your data." },
  terms: { title: "Terms of Service", description: "The terms and conditions for using CircuCity AI services." },
  gdpr: { title: "GDPR Compliance", description: "Our commitment to GDPR compliance and data protection." },
  security: { title: "Security", description: "Enterprise-grade security measures that protect your store and customer data." },
  api: { title: "API", description: "Powerful REST APIs to programmatically manage your AI agent and conversations." },
};

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const key = slug[0] || "";
  const page = pages[key];

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-32">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-dark-navy mb-4">Page Not Found</h1>
          <Link href="/" className="text-lemon-green hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold text-dark-navy mb-4">{page.title}</h1>
        <p className="text-gray-600 text-lg mb-8">{page.description}</p>
        <div className="bg-gray-50 rounded-2xl p-12 border border-gray-200">
          <p className="text-gray-400">Full content coming soon. This page is under active development.</p>
          <Link href="/" className="mt-6 inline-block bg-dark-navy text-white px-6 py-3 rounded-xl font-medium hover:bg-dark-navy/90 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
