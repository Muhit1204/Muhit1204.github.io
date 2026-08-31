import { MapPin, GraduationCap, Code, FileText } from 'lucide-react';
import Image from 'next/image';

export default function Education() {
  return (
    <div className="space-y-10 md:space-y-20 max-w-5xl mx-auto pb-6 md:pb-12">
      {/* Header */}
      <section className="space-y-4 md:space-y-6 pt-4 md:pt-8">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-body">Education</h1>
          <p className="text-lg md:text-xl text-muted font-light leading-relaxed">
            My academic path from computer science fundamentals to doctoral research on satellite and deep space communication, along with the professional certifications that support it.
          </p>
        </div>
      </section>


      {/* Education */}
      <section id="education" className="space-y-4 md:space-y-8">
        <div className="flex items-center gap-3 border-b border-line pb-4">
          <GraduationCap className="w-8 h-8 text-accent" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-body">Education</h2>
        </div>
        <div className="space-y-6 md:space-y-12 relative">
          {/* Glowing Timeline Line */}
          <div className="hidden md:block absolute left-[20%] top-2 bottom-2 w-px bg-gradient-to-b from-accent-dim to-transparent" />

          {/* Doctoral Degree */}
          <div className="relative pl-6 sm:pl-8 md:pl-0">
            <div className="md:grid md:grid-cols-5 md:gap-8 items-start">
              <div className="hidden md:block col-span-1 pt-1 text-right pr-8">
                <p className="text-sm font-bold text-accent uppercase tracking-wider">2026 – Present</p>
              </div>
              <div className="col-span-4 relative group">
                {/* Timeline dot */}
                <div className="absolute -left-6 sm:-left-8 md:-left-[2.4rem] top-1.5 w-3 h-3 bg-surface-2 rounded-full ring-4 ring-bg group-hover:scale-150 group-hover:bg-surface-2 transition-all duration-300 z-10" />

                <div className="interactive-card bg-surface p-4 sm:p-6 md:p-8 rounded-none border border-line shadow-sm hover:border-accent-dim">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-body mb-2 group-hover:text-accent transition-colors [overflow-wrap:anywhere]">Doctor of Engineering (D.E.) in Electrical &amp; Computer Engineering</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-muted mb-6 font-medium">
                    <span className="flex items-center gap-2 text-body">
                      <GraduationCap className="w-4 h-4" />
                      Lamar University, Phillip M. Drayer Department of Electrical and Computer Engineering
                    </span>
                    <span className="hidden sm:inline text-line">•</span>
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Beaumont, TX
                    </span>
                  </div>
                  <p className="md:hidden text-sm font-bold text-accent mb-4 uppercase tracking-wider">2026 – Present (Expected 2029)</p>

                  <div className="space-y-2 mb-4 md:mb-8">
                    <p className="text-muted leading-relaxed">
                      Doctoral research on interplanetary deep space communication and Delay Tolerant Networking, building on prior LEO satellite performance work. The research investigates multi-hop relay architectures, including cislunar links, and the application of machine learning to resilient routing under long and variable propagation delays.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {["Deep Space Communication", "Delay Tolerant Networking", "LEO Satellites", "Network Resilience", "Machine Learning"].map(kw => (
                      <span key={kw} className="px-2.5 py-1 bg-surface text-muted text-xs font-semibold rounded border border-line">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Master's Degree */}
          <div className="relative pl-6 sm:pl-8 md:pl-0">
            <div className="md:grid md:grid-cols-5 md:gap-8 items-start">
              <div className="hidden md:block col-span-1 pt-1 text-right pr-8">
                <p className="text-sm font-bold text-accent uppercase tracking-wider">2023 – 2026</p>
              </div>
              <div className="col-span-4 relative group">
                {/* Timeline dot */}
                <div className="absolute -left-6 sm:-left-8 md:-left-[2.4rem] top-1.5 w-3 h-3 bg-surface-2 rounded-full ring-4 ring-bg group-hover:scale-150 group-hover:bg-surface-2 transition-all duration-300 z-10" />

                <div className="interactive-card bg-surface p-4 sm:p-6 md:p-8 rounded-none border border-line shadow-sm hover:border-accent-dim">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-body mb-2 group-hover:text-accent transition-colors [overflow-wrap:anywhere]">Masters of Science (MS) in Computer Science</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-muted mb-6 font-medium">
                    <span className="flex items-center gap-2 text-body">
                      <GraduationCap className="w-4 h-4" />
                      Lamar University
                    </span>
                    <span className="hidden sm:inline text-line">•</span>
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Beaumont, TX
                    </span>
                    <span className="hidden sm:inline text-line">•</span>
                    <span className="flex items-center gap-2 text-accent font-semibold">
                      Conferred May 2026
                    </span>
                  </div>
                  <p className="md:hidden text-sm font-bold text-accent mb-4 uppercase tracking-wider">2023 – 2026 (Conferred May 2026)</p>

                  <div className="space-y-2 mb-4 md:mb-8">
                    <span className="font-semibold text-body text-sm uppercase tracking-wider">Relevant Coursework</span>
                    <p className="text-muted leading-relaxed">
                      Software Engineering, Analysis of Algorithms, Computer Networks, Big Data, Machine Learning, Advance Operating Systems.
                    </p>
                  </div>

                  {/* THESIS NESTED CARD */}
                  <div className="bg-surface-2 border border-line rounded-none p-4 md:p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-surface-2" />
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-accent" />
                      <span className="text-xs font-bold text-accent tracking-widest uppercase">Master&apos;s Thesis</span>
                    </div>
                    <h4 className="text-lg font-bold text-body mb-4 leading-snug">
                      PREDICTIVE PERFORMANCE MODELING AND SECURITY ANALYSIS OF STARLINK LEO SATELLITE NETWORKS IN MARITIME ENVIRONMENTS
                    </h4>
                    <ul className="space-y-2 text-muted mb-6 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>This thesis explores the resilience of satellite networks in maritime environments, focusing on dynamic data-driven optimization to improve the reliability of LEO satellite communications under unpredictable weather and mobility conditions.</span>
                      </li>
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      {["LEO Satellites", "Maritime Communication", "Network Resilience", "Machine Learning"].map(kw => (
                        <span key={kw} className="px-2.5 py-1 bg-surface text-muted text-xs font-semibold rounded border border-line">
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
          <div className="relative pl-6 sm:pl-8 md:pl-0">
            <div className="md:grid md:grid-cols-5 md:gap-8 items-start">
              <div className="hidden md:block col-span-1 pt-1 text-right pr-8">
                <p className="text-sm font-bold text-muted uppercase tracking-wider">2017 – 2021</p>
              </div>
              <div className="col-span-4 relative group">
                {/* Timeline dot */}
                <div className="absolute -left-6 sm:-left-8 md:-left-[2.4rem] top-1.5 w-3 h-3 bg-accent rounded-full ring-4 ring-bg group-hover:scale-150 transition-all duration-300 z-10" />

                <div className="interactive-card bg-surface p-4 sm:p-6 md:p-8 rounded-none border border-line shadow-sm hover:border-accent-dim">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-body mb-2 group-hover:text-accent transition-colors [overflow-wrap:anywhere]">Bachelors of Science (B.Sc.) in Computer Science and Engineering</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-muted mb-6 font-medium">
                    <span className="flex items-center gap-2 text-body">
                      <GraduationCap className="w-4 h-4" />
                      American International University-Bangladesh
                    </span>
                    <span className="hidden sm:inline text-line">•</span>
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Dhaka
                    </span>
                  </div>
                  <p className="md:hidden text-sm font-bold text-muted mb-4 uppercase tracking-wider">2017 – 2021</p>

                  <div className="space-y-2 mb-4 md:mb-8">
                    <span className="font-semibold text-body text-sm uppercase tracking-wider">Relevant Coursework</span>
                    <p className="text-muted leading-relaxed">
                      Data Structures, Algorithms, Cloud Computing, Data Mining, Cybersecurity, Data communication.
                    </p>
                  </div>

                  {/* THESIS NESTED CARD */}
                  <div className="bg-surface-2 border border-line rounded-none p-4 md:p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-accent-dim" />
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-muted" />
                      <span className="text-xs font-bold text-muted tracking-widest uppercase">Bachelor&apos;s Thesis</span>
                    </div>
                    <h4 className="text-lg font-bold text-body mb-4 leading-snug">
                      Rigorous Study of Computer Geometry and Turin Test on Graph Layout Algorithms
                    </h4>
                    <ul className="space-y-2 text-muted mb-6 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-muted mt-1">•</span>
                        <span>An in-depth analysis of vulnerabilities within cloud-integrated Internet of Things (IoT) networks, proposing a novel framework for detecting and mitigating distributed denial-of-service (DDoS) attacks using machine learning techniques.</span>
                      </li>
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      {["IoT", "Cloud Computing", "Cybersecurity", "DDoS", "Machine Learning"].map(kw => (
                        <span key={kw} className="px-2.5 py-1 bg-surface text-muted text-xs font-semibold rounded border border-line">
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

      {/* Certifications & Courses */}
      <section id="certifications" className="space-y-4 md:space-y-8">
        <div className="flex items-center gap-3 border-b border-line pb-4">
          <Code className="w-8 h-8 text-accent" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-body">Certifications & Courses</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* ICS Cybersecurity 201 */}
          <div className="interactive-card group bg-surface p-4 md:p-6 rounded-none border border-line shadow-sm hover:border-accent-dim flex flex-col gap-3 md:gap-4">
            <div className="relative w-full aspect-[4/3] rounded-none overflow-hidden border border-line mb-2">
              <Image
                src="/cert-ics-201.jpg"
                alt="Intermediate Cybersecurity for Industrial Control Systems, Lecture Part 1 (201) Certificate"
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex justify-between items-start gap-2">
              <h3 className="text-base sm:text-xl font-bold text-body group-hover:text-accent transition-colors [overflow-wrap:anywhere]">Intermediate Cybersecurity for ICS (201)</h3>
              <span className="text-xs font-bold text-muted bg-surface-2 px-2 py-1 rounded-none uppercase tracking-wider shrink-0">CISA</span>
            </div>
          </div>

          {/* ICS Cybersecurity 202 */}
          <div className="interactive-card group bg-surface p-4 md:p-6 rounded-none border border-line shadow-sm hover:border-accent-dim flex flex-col gap-3 md:gap-4">
            <div className="relative w-full aspect-[4/3] rounded-none overflow-hidden border border-line mb-2">
              <Image
                src="/cert-ics-202.jpg"
                alt="Intermediate Cybersecurity for Industrial Control Systems, Part 2 (202) Certificate"
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex justify-between items-start gap-2">
              <h3 className="text-base sm:text-xl font-bold text-body group-hover:text-accent transition-colors [overflow-wrap:anywhere]">Intermediate Cybersecurity for ICS (202)</h3>
              <span className="text-xs font-bold text-muted bg-surface-2 px-2 py-1 rounded-none uppercase tracking-wider shrink-0">CISA</span>
            </div>
          </div>

          {/* CyberStrike Nemesis */}
          <div className="interactive-card group bg-surface p-4 md:p-6 rounded-none border border-line shadow-sm hover:border-accent-dim flex flex-col gap-3 md:gap-4">
            <div className="relative w-full aspect-[4/3] rounded-none overflow-hidden border border-line mb-2">
              <Image
                src="/cert-cyberstrike.jpg"
                alt="CyberStrike Nemesis Certificate"
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex justify-between items-start gap-2">
              <h3 className="text-base sm:text-xl font-bold text-body group-hover:text-accent transition-colors [overflow-wrap:anywhere]">CyberStrike Nemesis</h3>
              <span className="text-xs font-bold text-muted bg-surface-2 px-2 py-1 rounded-none uppercase tracking-wider shrink-0">DOE</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
