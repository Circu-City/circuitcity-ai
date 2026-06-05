export default function SecurityPage() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-dark-navy mb-4">Security</h1>
        <p className="text-gray-500 mb-8">Enterprise-grade security protecting your store and customer data.</p>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: "Encryption", desc: "All data is encrypted in transit using TLS 1.3 and at rest using AES-256. Your conversations and customer data are always protected." },
            { title: "Infrastructure", desc: "Hosted on secure, SOC 2 compliant cloud infrastructure within the EU. Regular backups with point-in-time recovery." },
            { title: "Authentication", desc: "Multi-factor authentication (MFA) for all admin accounts. SSO support via SAML and OAuth 2.0 for enterprise customers." },
            { title: "API Security", desc: "All API endpoints require Bearer token authentication. Rate limiting, IP whitelisting, and request validation prevent abuse." },
            { title: "Monitoring", desc: "24/7 automated monitoring for suspicious activity. Real-time alerts and incident response within 15 minutes." },
            { title: "Compliance", desc: "GDPR compliant with regular third-party audits. SOC 2 Type II certification in progress. Annual penetration testing." },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-dark-navy mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <p className="text-gray-500">Report a security issue: <a href="mailto:security@circucity.se" className="text-lemon-green hover:underline">security@circucity.se</a></p>
        </div>
      </div>
    </div>
  );
}
