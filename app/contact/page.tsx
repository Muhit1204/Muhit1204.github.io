import { Github, Linkedin, Briefcase, User } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 md:space-y-16 pb-8 md:pb-16 pt-4 md:pt-8 text-center">
      {/* Header */}
      <section className="space-y-8 border-b border-slate-200/60 pb-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#2d4a3e]">
          Get in Touch
        </h1>
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">I would love to connect!</h2>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            If you have questions, ideas for collaboration, or want to chat, here&apos;s how to find me.
          </p>
        </div>
      </section>

      {/* Email Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight text-[#2d4a3e]">Email</h2>
        <div className="inline-grid grid-cols-1 sm:grid-cols-[auto_auto] items-center justify-items-center sm:justify-items-start gap-x-4 gap-y-3">
          <span className="inline-flex w-full items-center justify-center gap-2 bg-[#fbdca4] text-[#2d4a3e] font-bold px-5 py-2.5 rounded-2xl shadow-sm">
            <Briefcase className="w-5 h-5" strokeWidth={2.5} />
            Work
          </span>
          <span className="text-lg text-slate-700 font-medium break-words">mhossain54@lamar.edu</span>
          <span className="inline-flex w-full items-center justify-center gap-2 bg-[#fbdca4] text-[#2d4a3e] font-bold px-5 py-2.5 rounded-2xl shadow-sm">
            <User className="w-5 h-5" strokeWidth={2.5} />
            Personal
          </span>
          <span className="text-lg text-slate-700 font-medium break-words">muntasir.hossain007@gmail.com</span>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight text-[#2d4a3e]">Connect with me on Social Media!</h2>
        <div className="flex justify-center gap-6 pt-2">
          <a
            href="https://github.com/Muhit1204"
            target="_blank"
            rel="noopener noreferrer"
            className="w-20 h-20 bg-[#fbdca4] rounded-[2rem] flex items-center justify-center text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-sm"
          >
            <Github className="w-10 h-10" strokeWidth={3} />
          </a>
          <a
            href="https://linkedin.com/in/mdmuntasirhossain98"
            target="_blank"
            rel="noopener noreferrer"
            className="w-20 h-20 bg-[#fbdca4] rounded-[2rem] flex items-center justify-center text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-sm"
          >
            <Linkedin className="w-10 h-10" strokeWidth={2.5} />
          </a>
        </div>
      </section>

      {/* Book a Chat Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold tracking-tight text-[#2d4a3e]">Book a time to chat!</h2>
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span className="text-xl">🗓️</span>
            <a
              href="https://calendar.app.google/7bicmniscwJYaoA36"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold text-blue-500 hover:text-blue-600 transition-colors"
            >
              Schedule time with me
            </a>
            <span className="text-lg text-slate-800">at your convenience using my Google Calendar.</span>
          </div>

          <p className="text-lg text-[#2d4a3e] font-medium pt-4">Looking forward to connecting!</p>
        </div>
      </section>
    </div>
  );
}
