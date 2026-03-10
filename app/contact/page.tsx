import { Calendar, Github, Linkedin, Mail, Briefcase } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-16 pt-8">
      {/* Header */}
      <section className="space-y-8 border-b border-slate-200/60 pb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#2d4a3e] font-mono">
          Get in Touch
        </h1>
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">I would love to connect!</h2>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            If you have questions, ideas for collaboration, or want to chat, here's how to find me. I typically respond within 2 business days.
          </p>
        </div>
      </section>

      {/* Email Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight text-[#2d4a3e] font-mono">Email</h2>
        <ul className="space-y-4 text-lg">
          <li className="flex items-center gap-3">
            <span className="text-xl">📧</span>
            <a href="mailto:m.hossain1@lamar.edu" className="text-[#d88965] hover:text-[#c47754] underline underline-offset-4 decoration-2 decoration-[#d88965]/40 hover:decoration-[#d88965] transition-all">
              Email me at work
            </a>
          </li>
          <li className="flex items-center gap-3">
            <span className="text-xl">🙋🏽‍♂️</span>
            <a href="mailto:muntasir.hossain007@gmail.com" className="text-[#d88965] hover:text-[#c47754] underline underline-offset-4 decoration-2 decoration-[#d88965]/40 hover:decoration-[#d88965] transition-all">
              Email me personally
            </a>
          </li>
        </ul>
      </section>

      {/* Social Media Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight text-[#2d4a3e] font-mono">Connect with me on Social Media!</h2>
        <div className="flex gap-6 pt-2">
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
        <h2 className="text-3xl font-bold tracking-tight text-[#2d4a3e] font-mono">Book a time to chat!</h2>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
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

          <div className="space-y-4">
            <p className="text-lg text-[#2d4a3e] font-medium">Here's what to know:</p>
            <ul className="space-y-3 text-lg text-[#2d4a3e] list-disc list-inside ml-2 marker:text-[#2d4a3e]">
              <li className="leading-relaxed">Choose a time that fits your schedule (no need to wait for back-and-forth emails)</li>
              <li className="leading-relaxed">Great for brainstorming sessions, or just a friendly catch-up</li>
              <li className="leading-relaxed">If you have any specific topic in mind, or you feel I should prepare something in advance, let me know through the Booking Form!</li>
              <li className="leading-relaxed">If you don't see an open slot, just reach out by email and we'll find another time!</li>
            </ul>
          </div>
          
          <p className="text-lg text-[#2d4a3e] font-medium pt-4">Looking forward to connecting!</p>
        </div>
      </section>
    </div>
  );
}
