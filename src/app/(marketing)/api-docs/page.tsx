export default function ApiDocsPage() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-dark-navy mb-4">API Documentation</h1>
        <p className="text-gray-600 text-lg mb-12">Integrate CircuCity AI with any platform using our REST API.</p>
        <div className="bg-dark-navy rounded-2xl p-8 text-white mb-8">
          <p className="text-lemon-green font-mono text-sm mb-4">POST /api/v1/chat</p>
          <pre className="text-gray-300 text-sm overflow-x-auto">{`{
  "message": "Do you have this in blue?",
  "session_id": "abc123",
  "store_id": "store_xyz"
}`}</pre>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {["Authentication", "Chat Endpoint", "Product Catalog", "Webhooks", "Analytics", "Rate Limits"].map((item) => (
            <div key={item} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-lemon-green transition-colors">
              <h3 className="font-bold text-dark-navy mb-2">{item}</h3>
              <p className="text-gray-500 text-sm">Detailed documentation and examples for the {item.toLowerCase()} API.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
