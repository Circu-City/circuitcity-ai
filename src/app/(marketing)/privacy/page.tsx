export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-dark-navy mb-4">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: June 2025</p>
        <div className="prose max-w-none space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-dark-navy mb-3">1. Information We Collect</h2>
            <p>When you use CircuCity AI, we collect information you provide directly, such as your name, email address, company name, and payment information. We also automatically collect certain data including IP addresses, browser type, and usage patterns through cookies and similar technologies.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-dark-navy mb-3">2. How We Use Your Data</h2>
            <p>We use your information to provide, maintain, and improve our services; process transactions; send you technical notices and support messages; and communicate with you about products, services, and events. We do not sell your personal data to third parties.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-dark-navy mb-3">3. Data Storage & Security</h2>
            <p>Your data is stored on secure servers located within the European Union. We implement industry-standard encryption, access controls, and security measures to protect your information. We retain your data only as long as necessary to provide our services or as required by law.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-dark-navy mb-3">4. Your Rights</h2>
            <p>Under GDPR and applicable data protection laws, you have the right to access, correct, delete, or export your personal data. You may also object to or restrict certain processing. To exercise these rights, contact us at privacy@circucity.se.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-dark-navy mb-3">5. Contact</h2>
            <p>For questions about this Privacy Policy, contact our Data Protection Officer at privacy@circucity.se or at CircuCity AI, Stockholm, Sweden.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
