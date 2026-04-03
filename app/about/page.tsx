import { MapPin, Tent, Bike, Mountain, Flame, Plane, Waves, Rocket, GraduationCap, Award, Code, Terminal, Shield, Map, FileText } from 'lucide-react';
import Image from 'next/image';

export default function About() {
  return (
    <div className="space-y-10 md:space-y-20 max-w-5xl mx-auto pb-6 md:pb-12">
      {/* Header */}
      <section className="space-y-4 md:space-y-6 pt-4 md:pt-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-6 max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">About Me</h1>
            <p className="text-lg md:text-xl text-slate-600 font-light leading-relaxed">
              Beyond the code and the lab, I am an explorer at heart—whether that means navigating the complexities of satellite networks or finding the best hiking trails.
            </p>
          </div>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-sm hover:shadow-md shrink-0 w-fit"
          >
            <FileText className="w-5 h-5" />
            Open Resume
          </a>
        </div>
      </section>


      {/* Education */}
      <section id="education" className="space-y-4 md:space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <GraduationCap className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Education</h2>
        </div>
        <div className="space-y-6 md:space-y-12 relative">
          {/* Glowing Timeline Line */}
          <div className="hidden md:block absolute left-[20%] top-2 bottom-2 w-px bg-gradient-to-b from-blue-200 via-indigo-200 to-transparent" />

          {/* Master's Degree */}
          <div className="relative pl-8 md:pl-0">
            <div className="md:grid md:grid-cols-5 md:gap-8 items-start">
              <div className="hidden md:block col-span-1 pt-1 text-right pr-8">
                <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">2023 – Present</p>
              </div>
              <div className="col-span-4 relative group">
                {/* Timeline dot */}
                <div className="absolute -left-8 md:-left-[2.4rem] top-1.5 w-3 h-3 bg-blue-500 rounded-full ring-4 ring-white group-hover:scale-150 group-hover:bg-indigo-500 transition-all duration-300 z-10" />

                <div className="interactive-card bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-300">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">Masters of Science (MS) in Computer Science</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-slate-500 mb-6 font-medium">
                    <span className="flex items-center gap-2 text-slate-700">
                      <GraduationCap className="w-4 h-4" />
                      Lamar University
                    </span>
                    <span className="hidden sm:inline text-slate-300">•</span>
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Beaumont, TX
                    </span>
                  </div>
                  <p className="md:hidden text-sm font-bold text-blue-600 mb-4 uppercase tracking-wider">2023 – Present</p>

                  <div className="space-y-2 mb-4 md:mb-8">
                    <span className="font-semibold text-slate-900 text-sm uppercase tracking-wider">Relevant Coursework</span>
                    <p className="text-slate-600 leading-relaxed">
                      Software Engineering, Analysis of Algorithms, Computer Networks, Big Data, Machine Learning, Advance Operating Systems.
                    </p>
                  </div>

                  {/* THESIS NESTED CARD */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-400" />
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-bold text-blue-700 tracking-widest uppercase">Master&apos;s Thesis</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-4 leading-snug">
                      PREDICTIVE PERFORMANCE MODELING AND SECURITY ANALYSIS OF STARLINK LEO SATELLITE NETWORKS IN MARITIME ENVIRONMENTS
                    </h4>
                    <ul className="space-y-2 text-slate-600 mb-6 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>This thesis explores the resilience of satellite networks in maritime environments, focusing on dynamic data-driven optimization to improve the reliability of LEO satellite communications under unpredictable weather and mobility conditions.</span>
                      </li>
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      {["LEO Satellites", "Maritime Communication", "Network Resilience", "Machine Learning"].map(kw => (
                        <span key={kw} className="px-2.5 py-1 bg-white text-slate-600 text-xs font-semibold rounded border border-slate-200">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Bachelor's Degree */}
          <div className="relative pl-8 md:pl-0">
            <div className="md:grid md:grid-cols-5 md:gap-8 items-start">
              <div className="hidden md:block col-span-1 pt-1 text-right pr-8">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">2017 – 2021</p>
              </div>
              <div className="col-span-4 relative group">
                {/* Timeline dot */}
                <div className="absolute -left-8 md:-left-[2.4rem] top-1.5 w-3 h-3 bg-slate-400 rounded-full ring-4 ring-white group-hover:scale-150 group-hover:bg-blue-400 transition-all duration-300 z-10" />

                <div className="interactive-card bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-slate-300">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">Bachelors of Science (B.Sc.) in Computer Science and Engineering</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-slate-500 mb-6 font-medium">
                    <span className="flex items-center gap-2 text-slate-700">
                      <GraduationCap className="w-4 h-4" />
                      American International University-Bangladesh
                    </span>
                    <span className="hidden sm:inline text-slate-300">•</span>
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Dhaka
                    </span>
                  </div>
                  <p className="md:hidden text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">2017 – 2021</p>

                  <div className="space-y-2 mb-4 md:mb-8">
                    <span className="font-semibold text-slate-900 text-sm uppercase tracking-wider">Relevant Coursework</span>
                    <p className="text-slate-600 leading-relaxed">
                      Data Structures, Algorithms, Cloud Computing, Data Mining, Cybersecurity, Data communication.
                    </p>
                  </div>

                  {/* THESIS NESTED CARD */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-400" />
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <span className="text-xs font-bold text-slate-600 tracking-widest uppercase">Bachelor&apos;s Thesis</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-4 leading-snug">
                      Rigorous Study of Computer Geometry and Turin Test on Graph Layout Algorithms
                    </h4>
                    <ul className="space-y-2 text-slate-600 mb-6 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-slate-400 mt-1">•</span>
                        <span>An in-depth analysis of vulnerabilities within cloud-integrated Internet of Things (IoT) networks, proposing a novel framework for detecting and mitigating distributed denial-of-service (DDoS) attacks using machine learning techniques.</span>
                      </li>
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      {["IoT", "Cloud Computing", "Cybersecurity", "DDoS", "Machine Learning"].map(kw => (
                        <span key={kw} className="px-2.5 py-1 bg-white text-slate-600 text-xs font-semibold rounded border border-slate-200">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Awards and Grants */}
      <section className="space-y-4 md:space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <Award className="w-8 h-8 text-amber-500" />
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Awards & Grants</h2>
        </div>
        <div className="flex flex-col gap-4 md:gap-6">
          {/* AWS Pitch Competition */}
          <div className="interactive-card bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 hover:shadow">
            <div className="relative w-28 h-28 shrink-0 rounded-2xl border border-orange-100 p-3 flex items-center justify-center bg-white">
              <div className="relative w-full h-full">
                <Image
                  src="/aws-logo.png"
                  alt="Amazon Web Services"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 w-full">
                <h3 className="text-xl font-bold text-slate-900">2nd Place — AWS AI Pitch Competition</h3>
                <span className="text-sm font-bold text-amber-600 tracking-wider uppercase md:ml-auto">April 2026</span>
              </div>
              <p className="text-slate-700 font-medium">Small Business Development Center at Lamar University × Amazon Web Services</p>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Awarded $35,000 in AWS credits for SatLink AI — a predictive connectivity intelligence platform for maritime and port operations. Recognized for bridging academic research with entrepreneurial commercialization for Gulf Coast port operators.
              </p>
            </div>
          </div>

          {/* US DOE Grant */}
          <div className="interactive-card bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 hover:shadow">
            <div className="relative w-28 h-28 shrink-0 rounded-2xl border border-slate-100 p-3 flex items-center justify-center bg-white">
              <div className="relative w-full h-full">
                <Image
                  src="/us-doe-logo.png"
                  alt="U.S. Department of Energy"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 w-full">
                <h3 className="text-xl font-bold text-slate-900">Research Grant</h3>
                <span className="text-sm font-bold text-amber-600 tracking-wider uppercase md:ml-auto">PRESENT</span>
              </div>
              <p className="text-slate-700 font-medium">U.S. Department of Energy (DOE)</p>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Federally funded project focusing on improving the reliability and resilience of Maritime Satellite Communications and intelligent networking systems.
              </p>
            </div>
          </div>

          {/* Lamar University Grant */}
          <div className="interactive-card bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 hover:shadow">
            <div className="relative w-28 h-28 shrink-0 rounded-2xl border border-slate-100 p-3 flex items-center justify-center bg-white">
              <div className="relative w-full h-full">
                <Image
                  src="/cpm-logo.png"
                  alt="Lamar University"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 w-full">
                <h3 className="text-xl font-bold text-slate-900">Research Grant</h3>
                <span className="text-sm font-bold text-amber-600 tracking-wider uppercase md:ml-auto">PRESENT</span>
              </div>
              <p className="text-slate-700 font-medium">Lamar University Center for Advances in Port Management</p>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Collaborative research grant aimed at performance evaluation and adaptive optimization of satellite-based and Delay Tolerant Networks for port activities.
              </p>
            </div>
          </div>

          {/* AIUB Scholarship */}
          <div className="interactive-card bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 hover:shadow">
            <div className="relative w-28 h-28 shrink-0 rounded-2xl border border-slate-100 p-3 flex items-center justify-center bg-white">
              <div className="relative w-full h-full">
                <Image
                  src="/aiub-logo.png"
                  alt="AIUB Scholarship Grant"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 w-full">
                <h3 className="text-xl font-bold text-slate-900">Dr. Anwarul Abedin Scholarship Grant</h3>
                <span className="text-sm font-bold text-amber-600 tracking-wider uppercase md:ml-auto">2017 – 2021</span>
              </div>
              <p className="text-slate-700 font-medium">American International University-Bangladesh</p>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Awarded for outstanding academic performance and consistent excellence during undergraduate studies in Computer Science and Engineering.
              </p>
            </div>
          </div>

          {/* Dean's List Award */}
          <div className="interactive-card bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 hover:shadow">
            <div className="relative w-28 h-28 shrink-0 rounded-2xl border border-rose-100 bg-rose-50 p-3 flex items-center justify-center text-rose-500">
              <Award className="w-12 h-12" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 w-full">
                <h3 className="text-xl font-bold text-slate-900">Dean&apos;s List Award</h3>
                <span className="text-sm font-bold text-amber-600 tracking-wider uppercase md:ml-auto">2019</span>
              </div>
              <p className="text-slate-700 font-medium">American International University-Bangladesh</p>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Recognized for outstanding academic performance and ranking among the top students in the Department of Computer Science. Awarded for consistent academic excellence and exemplary GPA achievement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications & Courses */}
      <section className="space-y-4 md:space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <Code className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Certifications & Courses</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Intermediate Python */}
          <div className="interactive-card group bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-purple-300 flex flex-col gap-3 md:gap-4">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-slate-100 mb-2">
              <Image
                src="/cert-python-intermediate.jpg"
                alt="Intermediate Python Certificate"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-700 transition-colors">Intermediate Python</h3>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-wider">DataCamp</span>
            </div>
          </div>

          {/* Intro to Python */}
          <div className="interactive-card group bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-purple-300 flex flex-col gap-3 md:gap-4">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-slate-100 mb-2">
              <Image
                src="/cert-python-intro.jpg"
                alt="Introduction to Python Certificate"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-700 transition-colors">Introduction to Python</h3>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-wider">DataCamp</span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 md:space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <Tent className="w-8 h-8 text-emerald-600" />
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Personal Hobbies</h2>
        </div>
        <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
          When I'm not analyzing network topologies or writing NS-3 simulation models, you can usually find me outdoors. I believe that stepping away from the screen is the best way to solve complex problems.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          <div className="interactive-card bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center gap-3 md:gap-4 hover:border-emerald-300">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Tent className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Camping</h3>
          </div>

          <div className="interactive-card bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center gap-3 md:gap-4 hover:border-amber-300">
            <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
              <Mountain className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Hiking</h3>
          </div>

          <div className="interactive-card bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center gap-3 md:gap-4 hover:border-blue-300">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
              <Bike className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Cycling</h3>
          </div>

          <div className="interactive-card bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center gap-3 md:gap-4 hover:border-orange-300">
            <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl">
              <Flame className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">BBQ</h3>
          </div>

          <div className="interactive-card bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center gap-3 md:gap-4 hover:border-indigo-300">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Plane className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Traveling</h3>
          </div>

          <div className="interactive-card bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center gap-3 md:gap-4 hover:border-cyan-300">
            <div className="p-4 bg-cyan-50 text-cyan-600 rounded-2xl">
              <Waves className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Swimming</h3>
          </div>
        </div>
      </section>
    </div>
  );
}
