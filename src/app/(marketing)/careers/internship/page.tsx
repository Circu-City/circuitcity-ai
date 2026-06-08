import Link from "next/link";
import { ArrowLeft, GraduationCap, Clock, MapPin, Calendar, Users, Star } from "lucide-react";

const internships = [
  { title: "Software Engineering Intern", location: "Skellefteå, Sweden", duration: "3-6 months", description: "Work alongside our engineering team building AI-powered chatbot features. You'll contribute to real production code and learn about LLMs, vector databases, and full-stack development with Next.js and TypeScript.", requirements: ["Currently pursuing a CS degree or equivalent", "Experience with JavaScript/TypeScript", "Interest in AI/ML technologies"] },
  { title: "AI Research Intern", location: "Remote (Europe)", duration: "3-6 months", description: "Research and experiment with cutting-edge AI models for conversational commerce. Help improve our RAG pipeline and develop new features for personalized shopping assistance.", requirements: ["Background in ML/NLP or related field", "Experience with Python and ML frameworks", "Strong analytical skills"] },
  { title: "Design Intern", location: "Skellefteå, Sweden / Remote", duration: "3 months", description: "Help design intuitive interfaces for our chatbot platform. Work on user research, wireframes, prototypes, and visual design for both the dashboard and embedded widgets.", requirements: ["Portfolio demonstrating UI/UX work", "Familiarity with Figma or similar tools", "Understanding of design systems"] },
];

export default function InternshipPage() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/careers" className="inline-flex items-center gap-2 text-gray-500 hover:text-dark-navy mb-4"><ArrowLeft className="w-4 h-4" /> Back to Careers</Link>
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-dark-navy mb-4">Internship Opportunities</h1>
          <p className="text-gray-600 text-lg">Kickstart your career with hands-on experience at CircuCity AI. All internships include mentorship, real project work, and a monthly stipend.</p>
        </div>
        <div className="space-y-6">
          {internships.map((intern, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1"><GraduationCap className="w-5 h-5 text-lemon-green" /><h2 className="text-xl font-bold text-dark-navy">{intern.title}</h2></div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {intern.location}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {intern.duration}</span>
                  </div>
                </div>
                <a href={`mailto:careers@circucity.se?subject=${encodeURIComponent(intern.title + ' Internship')}`} className="px-5 py-2 bg-lemon-gradient text-dark-navy font-bold rounded-lg text-sm hover:opacity-90 whitespace-nowrap">Apply Now</a>
              </div>
              <p className="text-gray-600 mb-4">{intern.description}</p>
              <div>
                <p className="text-sm font-semibold text-dark-navy mb-2">Requirements</p>
                <ul className="space-y-1">
                  {intern.requirements.map((req, j) => (
                    <li key={j} className="text-sm text-gray-500 flex items-center gap-2"><Star className="w-3 h-3 text-lemon-green" />{req}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
