import { ArrowLeft, Clock, MapPin, Briefcase } from "lucide-react";
import Link from "next/link";

const jobs = [
  { title: "Senior Full-Stack Developer", type: "Full-time", location: "Skellefteå, Sweden / Remote", dept: "Engineering" },
  { title: "AI/ML Engineer", type: "Full-time", location: "Skellefteå, Sweden / Remote", dept: "Engineering" },
  { title: "UX/UI Designer", type: "Full-time", location: "Remote (Europe)", dept: "Design" },
  { title: "Customer Success Manager", type: "Full-time", location: "Skellefteå, Sweden", dept: "Customer" },
  { title: "Content Marketing Specialist", type: "Contract", location: "Remote (Europe)", dept: "Marketing" },
];

export default function CareersPage() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-dark-navy mb-4">Join Our Team</h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">Help us build the future of AI-powered e-commerce. We are based in Skellefteå, Sweden, with a distributed team across Europe.</p>
          <div className="flex justify-center gap-4 mt-6">
            <Link href="/careers/internship" className="px-6 py-2.5 border border-gray-200 rounded-xl text-dark-navy font-medium hover:bg-gray-50">Internships</Link>
            <Link href="/careers/volunteer" className="px-6 py-2.5 border border-gray-200 rounded-xl text-dark-navy font-medium hover:bg-gray-50">Volunteer Roles</Link>
          </div>
        </div>
        <div className="space-y-4">
          {jobs.map((job, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center justify-between hover:border-lemon-green transition-colors">
              <div>
                <h3 className="font-bold text-dark-navy text-lg">{job.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                  <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {job.type}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {job.dept}</span>
                </div>
              </div>
              <a href={`mailto:careers@circucity.se?subject=${encodeURIComponent(job.title)}`} className="px-4 py-2 bg-lemon-gradient text-dark-navy font-bold rounded-lg text-sm hover:opacity-90">Apply</a>
            </div>
          ))}
        </div>
        <div className="mt-12 p-6 bg-gray-50 rounded-2xl text-center">
          <p className="text-gray-600 mb-2">Don't see a role that fits?</p>
          <p className="text-dark-navy font-medium">Send your resume to <a href="mailto:careers@circucity.se" className="text-lemon-green hover:underline">careers@circucity.se</a></p>
        </div>
      </div>
    </div>
  );
}
