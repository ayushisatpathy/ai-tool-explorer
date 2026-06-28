import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-indigo-700">
          <span>🤖</span>
          <span>AI Tool Explorer</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-indigo-600 transition-colors">
            Tools
          </Link>
          <Link href="/admin" className="hover:text-indigo-600 transition-colors">
            Admin
          </Link>
        </div>
      </nav>
    </header>
  );
}
