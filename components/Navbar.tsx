'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Github, Linkedin, Mail, Menu, X, Download } from 'lucide-react';

const navLinks = [
  { href: '/education', label: 'Education' },
  { href: '/experience', label: 'Experience' },
  { href: '/publications', label: 'Publications' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-[#f9f8f6]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-5 min-w-0">
          <a
            href="/resume.pdf"
            download
            className="inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-medium px-3 md:px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors shadow-sm shrink-0"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download Resume</span>
            <span className="sr-only sm:hidden">Download Resume</span>
          </a>
          <Link href="/" className="flex items-center gap-2 font-bold text-lg md:text-xl tracking-tight text-slate-900 truncate">
            Md Muntasir Hossain
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-slate-900 transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="w-px h-5 bg-slate-300 mx-2" />
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

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-[#f9f8f6]/95 backdrop-blur-md">
          <nav className="flex flex-col px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="py-3 px-3 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="/resume.pdf"
              download
              onClick={() => setIsOpen(false)}
              className="mt-2 inline-flex items-center gap-2 bg-slate-900 text-white py-3 px-3 text-base font-medium rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download Resume
            </a>
          </nav>
          <div className="border-t border-slate-200 px-6 py-4 flex items-center gap-6">
            <a href="https://github.com/Muhit1204" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-900 transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com/in/mdmuntasirhossain98" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-900 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="mailto:muntasir.hossain007@gmail.com" className="text-slate-500 hover:text-slate-900 transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
