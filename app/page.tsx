import { Terminal, BookOpen, Briefcase, Globe, Award, ExternalLink } from 'lucide-react';
import InteractiveNetworkMap from '@/components/InteractiveNetworkMap';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-stretch gap-12 pt-12 md:pt-20">
        <div className="relative w-full md:w-[22rem] min-h-[400px] shrink-0 rounded-3xl overflow-hidden shadow-xl border border-slate-200 group flex-1">
          <Image
            src="/profile-image.jpeg"
            alt="Md Muntasir Hossain"
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
            quality={100}
            priority
          />
        </div>
        <div className="flex-1 space-y-6 flex flex-col justify-center py-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Md Muntasir Hossain
          </h1>
          <p className="text-lg text-slate-700 leading-relaxed">
            I am a Graduate Research Assistant at <span className="text-teal-600 font-medium">Lamar University</span>, Center for Data Analytics and Cybersecurity, where I work on improving the reliability and resilience of Maritime Satellite Communications and intelligent networking systems.
          </p>
          <p className="text-lg text-slate-700 leading-relaxed">
            My research focuses on satellite-based communication, wireless network resilience, machine learning for predictive analytics, and cybersecurity analysis of LEO satellite networks. I'm particularly interested in data-driven optimization for maritime broadband connectivity.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            {['Satellite Communication', 'Machine Learning', 'Cybersecurity', 'Maritime Networks', 'LEO Satellites'].map(tag => (
              <span key={tag} className="px-4 py-1.5 bg-teal-50/80 text-teal-700 rounded-full text-sm font-medium border border-teal-100">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Explore the City</h2>
          <div className="bg-white/95 text-slate-600 font-semibold px-4 py-1.5 rounded-full text-sm shadow-sm border border-slate-200 w-fit">
            Click on the buildings to explore
          </div>
        </div>
        <InteractiveNetworkMap />
      </section>

      {/* Quantitative Values / Key Metrics */}
      <section className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 group">
        <Image
          src="/key-metric-bg.jpeg"
          alt="Key Metrics Background"
          fill
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px]" />

        <div className="relative z-10 py-20 px-8">
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-3xl font-bold tracking-tight text-white text-center">
              Key metrics that define my journey
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-4 bg-white/10 text-white rounded-2xl backdrop-blur-md border border-white/20">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-5xl font-bold text-white">4+</h3>
                <p className="text-sm font-medium text-slate-300 uppercase tracking-wider">Years in Academic Research</p>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-4 bg-white/10 text-white rounded-2xl backdrop-blur-md border border-white/20">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h3 className="text-5xl font-bold text-white">5+</h3>
                <p className="text-sm font-medium text-slate-300 uppercase tracking-wider">Major Projects</p>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-4 bg-white/10 text-white rounded-2xl backdrop-blur-md border border-white/20">
                  <Globe className="w-8 h-8" />
                </div>
                <h3 className="text-5xl font-bold text-white">2</h3>
                <p className="text-sm font-medium text-slate-300 uppercase tracking-wider">Continents of Experience</p>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-4 bg-white/10 text-white rounded-2xl backdrop-blur-md border border-white/20">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-5xl font-bold text-white">2</h3>
                <p className="text-sm font-medium text-slate-300 uppercase tracking-wider">IEEE Publications</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Focus Areas */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-2">Core Research Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Satellite based Communication & Navigation",
            "Intelligent Systems",
            "Wireless Network Resilience & Cybersecurity",
            "Machine Learning & Dynamic Data-Driven Optimization",
            "Autonomous Systems"
          ].map((interest, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="mt-0.5 bg-teal-50 border border-teal-100 text-teal-600 p-2 rounded-lg">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="font-medium text-slate-800 text-lg">{interest}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recent News */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-2">Recent News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Example News Items */}
          <a href="https://linkedin.com/in/mdmuntasirhossain98" target="_blank" rel="noopener noreferrer" className="interactive-card group bg-white p-6 rounded-2xl border border-slate-200 hover:border-teal-300 transition-all flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <span className="text-sm font-bold text-teal-600 tracking-wider uppercase">March 2026</span>
              <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-teal-600 transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">Published new research on Maritime LEO Connectivity</h3>
            <p className="text-slate-600 line-clamp-2">Our latest paper exploring the resilience of satellite networks in maritime environments has been accepted. Read more about our findings on dynamic data-driven optimization.</p>
          </a>

          <a href="https://linkedin.com/in/mdmuntasirhossain98" target="_blank" rel="noopener noreferrer" className="interactive-card group bg-white p-6 rounded-2xl border border-slate-200 hover:border-teal-300 transition-all flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <span className="text-sm font-bold text-teal-600 tracking-wider uppercase">January 2026</span>
              <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-teal-600 transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">Joined Center for Data Analytics and Cybersecurity</h3>
            <p className="text-slate-600 line-clamp-2">Excited to start my new role as a Graduate Research Assistant at Lamar University, focusing on intelligent networking systems and cybersecurity.</p>
          </a>
        </div>
      </section>
    </div>
  );
}
