import { Bot } from "lucide-react";

export function Footer() {
  const linkGroups = [
    { title: "Product", links: ["Features", "Pricing", "API", "Documentation"] },
    { title: "Company", links: ["About Us", "Blog", "Careers", "Contact"] },
    { title: "Legal", links: ["Privacy", "Terms", "GDPR", "Security"] },
  ];

  return (
    <footer className="bg-dark-navy text-gray-400 py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-lemon-gradient rounded-xl flex items-center justify-center">
              <Bot className="text-dark-navy w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-white">CircuCity<span className="text-lemon-green"> AI</span></span>
          </div>
          <p className="text-sm leading-relaxed">AI-powered customer support for modern e-commerce stores.</p>
        </div>
        {linkGroups.map((group) => (
          <div key={group.title}>
            <h4 className="text-white font-semibold mb-4">{group.title}</h4>
            <ul className="space-y-2 text-sm">
              {group.links.map((link) => {
                const slug = link.toLowerCase().replace(/\s+/g, "-");
                const href = `/${slug === "api" ? "api-docs" : slug}`;
                return <li key={link}><a href={href} className="hover:text-white transition-colors">{link}</a></li>;
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} CircuCity AI. All rights reserved.
      </div>
    </footer>
  );
}
