export default function GdprPage() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-dark-navy mb-4">GDPR Compliance</h1>
        <p className="text-gray-500 mb-8">Our commitment to data protection and privacy.</p>
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-dark-navy mb-3">Our Commitment</h2>
            <p>CircuCity AI is fully committed to compliance with the EU General Data Protection Regulation (GDPR). We have implemented comprehensive data protection measures across our platform.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-dark-navy mb-3">Key Measures</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Data Processing Agreement (DPA) available for all customers</li>
              <li>All data stored on EU-based servers (Skellefteå, Sweden)</li>
              <li>End-to-end encryption for data in transit and at rest</li>
              <li>Right to access, rectify, and delete personal data</li>
              <li>Data Protection Officer: dpo@circucity.se</li>
              <li>Regular security audits and penetration testing</li>
              <li>Data breach notification within 72 hours</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
