import { MapPin, Clock, Briefcase, ArrowRight } from "lucide-react";

const jobs = [
  { title: "Senior AI Engineer", dept: "Engineering", location: "Remote — Europe", type: "Full-time", desc: "Build and optimize our core AI chatbot engine. Work with LLMs, RAG pipelines, and real-time inference." },
  { title: "Full-Stack Developer", dept: "Engineering", location: "Remote — Worldwide", type: "Full-time", desc: "Develop our dashboard, widget, and API integrations using Next.js, TypeScript, and PostgreSQL." },
  { title: "Product Designer", dept: "Design", location: "Stockholm, Sweden", type: "Full-time", desc: "Design intuitive AI-powered interfaces that delight e-commerce merchants and their customers." },
  { title: "Customer Success Manager", dept: "Sales", location: "Remote — Americas", type: "Full-time", desc: "Help our customers succeed with AI. Onboard new stores, provide training, and drive adoption." },
  { title: "Content Marketer", dept: "Marketing", location: "Remote — Europe", type: "Contract", desc: "Create compelling content about AI in e-commerce — blog posts, case studies, and social media." },
];

export default function CareersPage() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-dark-navy mb-4">Join Our Team</h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">Help us build the future of AI-powered customer support. We are looking for passionate people to join our growing team.</p>
        </div>
        <div className="space-y-4">
          {jobs.map((job, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-xl font-bold text-dark-navy">{job.title}</h3>
                  <p className="text-gray-500 text-sm">{job.dept}</p>
                </div>
                <span className="bg-lemon-green/10 text-lemon-green px-3 py-1 rounded-full text-xs font-medium">{job.type}</span>
              </div>
              <p className="text-gray-600 mb-4">{job.desc}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.type}</span>
              </div>
              <button className="mt-4 inline-flex items-center gap-1 text-lemon-green font-medium text-sm">Apply Now <ArrowRight className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
        <div className="text-center mt-12 p-8 bg-dark-navy rounded-3xl">
          <p className="text-white text-lg mb-2">Don't see the right role?</p>
          <p className="text-gray-400 mb-4">We are always looking for talented people. Send us your resume.</p>
          <a href="mailto:careers@circucity.se" className="inline-block bg-lemon-gradient text-dark-navy font-bold px-6 py-3 rounded-xl hover:scale-105 transition-transform shadow-lemon">careers@circucity.se</a>
        </div>
      </div>
    </div>
  );
}
