import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-[#f9f8f6]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900" style={{ fontFamily: 'var(--font-heading), Playfair Display, Georgia, serif' }}>
          Md Muntasir Hossain
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/about" className="hover:text-slate-900 transition-colors">About</Link>
            <Link href="/experience" className="hover:text-slate-900 transition-colors">Experience</Link>
            <Link href="/publications" className="hover:text-slate-900 transition-colors">Publications</Link>
            <Link href="/projects" className="hover:text-slate-900 transition-colors">Projects</Link>
            <Link href="/contact" className="hover:text-slate-900 transition-colors">Contact</Link>
          </nav>
          <div className="hidden md:block w-px h-5 bg-slate-300 mx-2" />
          <div className="flex items-center gap-4">
            <a href="https://github.com/Muhit1204" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-900 transition-colors">
              <Github className="w-4 h-4" />
              <span className="sr-only">GitHub</span>
            </a>
            <a href="https://linkedin.com/in/mdmuntasirhossain98" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-900 transition-colors">
              <Linkedin className="w-4 h-4" />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a href="mailto:muntasir.hossain007@gmail.com" className="text-slate-500 hover:text-slate-900 transition-colors">
              <Mail className="w-4 h-4" />
              <span className="sr-only">Email</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
