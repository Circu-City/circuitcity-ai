import Link from "next/link";
import { ArrowLeft, Heart, MapPin, Clock, Globe, Users, Star } from "lucide-react";

const roles = [
  { title: "Community Moderator", location: "Remote", commitment: "5-10 hours/week", description: "Help moderate our community forums and Discord server. Assist users with questions, maintain a positive environment, and gather feedback for the product team.", skills: ["Strong communication skills", "Interest in AI and e-commerce", "Patient and empathetic"] },
  { title: "Open Source Contributor", location: "Remote", commitment: "Flexible", description: "Contribute to our open-source chatbot widget and SDK libraries. Review pull requests, fix bugs, improve documentation, and help build the community around CircuCity AI.", skills: ["Experience with open source", "JavaScript/TypeScript skills", "Self-motivated"] },
  { title: "Translation Volunteer", location: "Remote", commitment: "2-5 hours/week", description: "Help translate our platform, documentation, and marketing materials into your native language. We support 50+ languages and need help maintaining quality across all of them.", skills: ["Native fluency in target language", "English proficiency", "Attention to detail"] },
  { title: "Beta Tester", location: "Remote", commitment: "2-3 hours/week", description: "Test new features before they launch. Provide detailed feedback on UX, bugs, and feature requests. Help shape the future of CircuCity AI.", skills: ["Experience with SaaS products", "Detail-oriented", "Comfortable providing written feedback"] },
];

export default function VolunteerPage() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/careers" className="inline-flex items-center gap-2 text-gray-500 hover:text-dark-navy mb-4"><ArrowLeft className="w-4 h-4" /> Back to Careers</Link>
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-dark-navy mb-4">Volunteer & Unpaid Roles</h1>
          <p className="text-gray-600 text-lg">Make an impact while building your skills. Volunteer roles are flexible, remote-friendly, and a great way to get involved with CircuCity AI. While unpaid, we provide mentorship, references, and certificates of contribution.</p>
        </div>
        <div className="space-y-6">
          {roles.map((role, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1"><Heart className="w-5 h-5 text-lemon-green" /><h2 className="text-xl font-bold text-dark-navy">{role.title}</h2></div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {role.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {role.commitment}</span>
                  </div>
                </div>
                <a href={`mailto:careers@circucity.se?subject=${encodeURIComponent(role.title + ' - Volunteer')}`} className="px-5 py-2 bg-lemon-gradient text-dark-navy font-bold rounded-lg text-sm hover:opacity-90 whitespace-nowrap">Apply</a>
              </div>
              <p className="text-gray-600 mb-4">{role.description}</p>
              <div>
                <p className="text-sm font-semibold text-dark-navy mb-2">We're looking for</p>
                <ul className="space-y-1">
                  {role.skills.map((skill, j) => (
                    <li key={j} className="text-sm text-gray-500 flex items-center gap-2"><Star className="w-3 h-3 text-lemon-green" />{skill}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 p-6 bg-lemon-green/5 rounded-2xl text-center">
          <p className="text-dark-navy font-medium mb-2">Have an idea for a volunteer role we haven't listed?</p>
          <p className="text-gray-600 text-sm">Reach out to <a href="mailto:careers@circucity.se" className="text-lemon-green hover:underline">careers@circucity.se</a> and tell us how you'd like to contribute!</p>
        </div>
      </div>
    </div>
  );
}
