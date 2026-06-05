import Link from "next/link";

const pages: Record<string, { title: string; desc: string }> = {};

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const key = slug?.[0] || "";
  const page = pages[key];

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-dark-navy mb-4">{page?.title || "Page Not Found"}</h1>
        <p className="text-gray-600 text-lg mb-8">{page?.desc || "The page you are looking for does not exist."}</p>
        <Link href="/" className="inline-block bg-dark-navy text-white px-6 py-3 rounded-xl font-medium hover:bg-dark-navy/90 transition-colors">Return Home</Link>
      </div>
    </div>
  );
}
