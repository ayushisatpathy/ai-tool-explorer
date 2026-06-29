export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { PricingBadge } from "@/components/PricingBadge";
import { formatDate } from "@/lib/utils";

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let tool;
  try {
    tool = await api.tools.get(slug);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline mb-6"
      >
        ← Back to all tools
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        {/* Header */}
        <div className="flex items-start gap-5 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
            {tool.logo_url ? (
              <Image
                src={tool.logo_url}
                alt={tool.name}
                width={64}
                height={64}
                className="object-contain"
                unoptimized
              />
            ) : (
              <span className="text-3xl font-bold text-indigo-400">
                {tool.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">{tool.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <PricingBadge pricing={tool.pricing_model} />
              {tool.categories.map((c) => (
                <span
                  key={c}
                  className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed mb-6">
          {tool.description || "No description available."}
        </p>

        {/* Visit button */}
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          Visit Tool →
        </a>

        {/* Meta */}
        <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm text-gray-500">
          <div>
            <span className="block font-medium text-gray-700">Added</span>
            {formatDate(tool.created_at)}
          </div>
          <div>
            <span className="block font-medium text-gray-700">Last seen</span>
            {formatDate(tool.last_seen_at)}
          </div>
        </div>
      </div>
    </div>
  );
}
