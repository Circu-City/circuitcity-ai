const pages: Record<string, { title: string; desc: string }> = {
  blog: { title: "Blog", desc: "Insights, tips, and stories about AI in e-commerce and customer experience." },
  careers: { title: "Careers", desc: "Join our team and help shape the future of AI-powered customer support." },
  contact: { title: "Contact Us", desc: "Get in touch — we would love to hear from you." },
  privacy: { title: "Privacy Policy", desc: "How we collect, use, and protect your personal data." },
  terms: { title: "Terms of Service", desc: "The terms and conditions governing the use of CircuCity AI." },
  gdpr: { title: "GDPR Compliance", desc: "Our commitment to data protection and GDPR compliance." },
  security: { title: "Security", desc: "Enterprise-grade security measures protecting your store and customer data." },
};

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const key = slug?.[0] || "";
  const page = pages[key];

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-dark-navy mb-4">{page?.title || "Page"}</h1>
        <p className="text-gray-600 text-lg mb-12">{page?.desc || ""}</p>
        <div className="bg-gray-50 rounded-2xl p-16 border border-gray-200">
          <p className="text-gray-400 text-lg">Full content for this page is coming soon. We are working on creating a comprehensive resource for you.</p>
        </div>
      </div>
    </div>
  );
}
