import { Terminal, Award, ExternalLink, Tent, Mountain, Bike, Flame, Plane, Waves } from 'lucide-react';
import InteractiveNetworkMap from '@/components/InteractiveNetworkMap';
import Counter from '@/components/Counter';
import Image from 'next/image';
import Link from 'next/link';

const metrics = [
  { value: 4, suffix: '+', unit: 'years', caption: 'In academic research' },
  { value: 5, suffix: '+', unit: 'projects', caption: 'Shipped from idea to impact' },
  { value: 2, suffix: '', unit: 'continents', caption: 'Experience in North America and Asia' },
  { value: 2, suffix: '', unit: 'publications', caption: 'IEEE conference papers' },
];

const skills = [
  { category: 'Languages', tools: ['Python', 'TypeScript', 'JavaScript', 'PHP', 'SQL'] },
  { category: 'Machine Learning & Data', tools: ['Random Forest', 'SVM', 'KNN', 'Decision Trees', 'Time-Series Forecasting', 'Pandas', 'NumPy'] },
  { category: 'Networking & Simulation', tools: ['NS-3', 'Wireshark', 'Delay Tolerant Networking', 'LEO Satellite Link Modeling', 'Routing Analysis'] },
  { category: 'Geospatial & UAS', tools: ['ArcGIS Pro', 'ArcGIS Online', 'Pix4Dmapper', 'Photogrammetry', 'Open3D', 'UAS Flight Operations'] },
  { category: 'LLMs & Multi-Model Orchestration', tools: ['Large Language Models (LLMs)', 'OmniRoute', 'Multi-model agent workflows', 'Local & hosted inference', 'Retrieval-Augmented Generation'] },
  { category: 'AI & Agentic Systems', tools: ['LangGraph', 'LangChain', 'Ollama', 'Model Context Protocol (MCP)', 'ChromaDB', 'tree-sitter', 'Langfuse'] },
  { category: 'MCP Servers', tools: ['Higgsfield MCP', 'Novamira MCP', 'Autodesk MCP Server', 'surgical-mcp-rag', 'FastMCP', 'langchain-mcp-adapters'] },
  { category: 'Web & Tooling', tools: ['React', 'Next.js', 'Tailwind CSS', 'Recharts', 'Laravel', 'Git', 'SQLite'] },
  { category: 'Security', tools: ['MITRE ATT&CK for ICS', 'ICS/SCADA Security', 'Threat Intelligence', 'Spoofing & Data Integrity Analysis'] },
];

export default function Home() {
  return (
    <div className="space-y-12 md:space-y-24">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-stretch gap-6 md:gap-12 pt-6 md:pt-20">
        <div className="relative w-full md:w-[22rem] min-h-[280px] md:min-h-[400px] shrink-0 rounded-3xl overflow-hidden shadow-xl border border-slate-200 group flex-1">
          <picture>
            <source type="image/avif" sizes="(min-width: 768px) 352px, 100vw" srcSet="/optimized/profile-704.avif 704w, /optimized/profile-1056.avif 1056w, /optimized/profile-1408.avif 1408w" />
            <source type="image/webp" sizes="(min-width: 768px) 352px, 100vw" srcSet="/optimized/profile-704.webp 704w, /optimized/profile-1056.webp 1056w, /optimized/profile-1408.webp 1408w" />
            <img
              src="/optimized/profile-1056.jpg"
              alt="Md Muntasir Hossain"
              width={1056}
              height={1408}
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
          </picture>
        </div>
        <div className="flex-1 space-y-4 md:space-y-6 flex flex-col justify-center py-2 md:py-4">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Md Muntasir Hossain
          </h1>
          <p className="text-base md:text-lg text-slate-700 leading-relaxed">
            I am a Doctor of Engineering student and Graduate Research Assistant at <span className="text-teal-600 font-medium">Lamar University</span>, Center for Data Analytics and Cybersecurity, where I work on the reliability and resilience of satellite communication systems, from maritime LEO broadband to interplanetary deep space networks.
          </p>
          <p className="text-base md:text-lg text-slate-700 leading-relaxed">
            My research spans satellite-based communication, Delay Tolerant Networking for deep space and cislunar relays, wireless network resilience, machine learning for predictive analytics, and cybersecurity analysis of LEO satellite networks.
          </p>
          <div className="flex flex-wrap gap-2 md:gap-3 pt-1 md:pt-2">
            {['Satellite Communication', 'Machine Learning', 'Cybersecurity', 'Maritime Networks', 'LEO Satellites', 'Deep Space Networks'].map(tag => (
              <span key={tag} className="px-4 py-1.5 bg-teal-50/80 text-teal-700 rounded-full text-sm font-medium border border-teal-100">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="city-section-bleed space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 px-4 pb-4 md:px-0">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Explore the City</h2>
          <div className="bg-white/95 text-slate-600 font-semibold px-4 py-1.5 rounded-full text-sm shadow-sm border border-slate-200 w-fit">
            Choose a destination
          </div>
        </div>
        <InteractiveNetworkMap />
      </section>

      {/* Quantitative Values / Key Metrics */}
      <section className="space-y-6 md:space-y-10">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 text-center">
          Key metrics that define my journey
        </h2>
        <div className="relative">
          {/* Field photo — anchored right on desktop so the cards can overlap its left edge */}
          <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[54%] rounded-3xl overflow-hidden border border-slate-200 shadow-sm group">
            <picture>
              <source type="image/avif" sizes="(min-width: 1024px) 54vw, 100vw" srcSet="/optimized/key-metrics-640.avif 640w, /optimized/key-metrics-1280.avif 1280w, /optimized/key-metrics-1920.avif 1920w" />
              <source type="image/webp" sizes="(min-width: 1024px) 54vw, 100vw" srcSet="/optimized/key-metrics-640.webp 640w, /optimized/key-metrics-1280.webp 1280w, /optimized/key-metrics-1920.webp 1920w" />
              <img
                src="/optimized/key-metrics-1280.jpg"
                alt="Md Muntasir Hossain preparing the UAS for a mapping flight at the LNVA canal site"
                width={1280}
                height={1707}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
            </picture>
          </div>

          {/* Metric cards — float above the photo */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:w-[62%] lg:py-16">
            {metrics.map(({ value, suffix, unit, caption }) => (
              <div
                key={caption}
                className="interactive-card bg-white rounded-3xl border border-slate-100 shadow-[0_10px_35px_-12px_rgba(15,23,42,0.25)] p-6 md:p-8 flex flex-col items-center justify-center text-center gap-2 min-h-[9rem] md:min-h-[10rem]"
              >
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900">
                  <Counter value={value} suffix={suffix} /> {unit}
                </h3>
                <p className="text-sm md:text-base text-slate-500 leading-snug">{caption}</p>
              </div>
            ))}
          </div>

          {/* Field photo — stacked below the cards on smaller screens */}
          <div className="lg:hidden relative mt-4 h-64 sm:h-80 rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
            <picture>
              <source type="image/avif" sizes="100vw" srcSet="/optimized/key-metrics-640.avif 640w, /optimized/key-metrics-1280.avif 1280w, /optimized/key-metrics-1920.avif 1920w" />
              <source type="image/webp" sizes="100vw" srcSet="/optimized/key-metrics-640.webp 640w, /optimized/key-metrics-1280.webp 1280w, /optimized/key-metrics-1920.webp 1920w" />
              <img
                src="/optimized/key-metrics-1280.jpg"
                alt="Md Muntasir Hossain preparing the UAS for a mapping flight at the LNVA canal site"
                width={1280}
                height={1707}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </picture>
          </div>
        </div>
      </section>

      {/* Research Focus Areas */}
      <section className="space-y-4 md:space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-2">Core Research Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Satellite based Communication & Navigation",
            "Intelligent Systems",
            "Wireless Network Resilience & Cybersecurity",
            "Machine Learning & Dynamic Data-Driven Optimization",
            "Autonomous Systems"
          ].map((interest, i) => (
            <div key={i} className="bg-white p-3 md:p-5 rounded-xl border border-slate-200 flex items-start gap-3 md:gap-4 hover:shadow-md transition-shadow">
              <div className="mt-0.5 bg-teal-50 border border-teal-100 text-teal-600 p-2 rounded-lg">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="font-medium text-slate-800 text-lg">{interest}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Skills & Tools */}
      <section className="space-y-4 md:space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-2">Skills &amp; Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {skills.map(({ category, tools }) => (
            <div key={category} className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {tools.map(tool => (
                  <span key={tool} className="px-2.5 py-1 bg-teal-50/80 text-teal-700 text-xs font-semibold rounded border border-teal-100">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent News */}
      <section className="space-y-4 md:space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-2">Recent News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="interactive-card group bg-white p-4 md:p-6 rounded-2xl border border-slate-200 hover:border-teal-300 transition-all flex flex-col gap-3 md:gap-4">
            <div className="flex justify-between items-start">
              <span className="text-sm font-bold text-teal-600 tracking-wider uppercase">May 2026</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">Completed MS and Began Doctoral Research</h3>
            <p className="text-slate-600 line-clamp-2">I was conferred the Master of Science in Computer Science at Lamar University on May 15, 2026, and began the Doctor of Engineering in Electrical &amp; Computer Engineering on May 26, 2026. My doctoral research extends the LEO satellite work toward interplanetary deep space communication and Delay Tolerant Networking.</p>
          </div>

          <a href="https://www.linkedin.com/posts/mdmuntasirhossain98_aws-amazonwebservices-artificialintelligence-activity-7444969525290381313-KE_I" target="_blank" rel="noopener noreferrer" className="interactive-card group bg-white p-4 md:p-6 rounded-2xl border border-slate-200 hover:border-teal-300 transition-all flex flex-col gap-3 md:gap-4">
            <div className="flex justify-between items-start">
              <span className="text-sm font-bold text-teal-600 tracking-wider uppercase">April 2026</span>
              <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-teal-600 transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">🥈 2nd Place — AWS AI Pitch Competition</h3>
            <p className="text-slate-600 line-clamp-2">Awarded $35,000 in AWS credits for SatLink AI, a predictive connectivity intelligence platform for maritime and port operations, at Lamar University&apos;s SBDC competition.</p>
          </a>

          <a href="https://www.linkedin.com/posts/mdmuntasirhossain98_ieee-icaic-starlink-activity-7433392560175226880-bhmp" target="_blank" rel="noopener noreferrer" className="interactive-card group bg-white p-4 md:p-6 rounded-2xl border border-slate-200 hover:border-teal-300 transition-all flex flex-col gap-3 md:gap-4">
            <div className="flex justify-between items-start">
              <span className="text-sm font-bold text-teal-600 tracking-wider uppercase">February 2026</span>
              <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-teal-600 transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">IEEE ICAIC 2026 — Paper Accepted & Presented</h3>
            <p className="text-slate-600 line-clamp-2">Presented &ldquo;A Dual-Task Prediction Model for Starlink Maritime Performance&rdquo; at the 5th IEEE International Conference on AI in Cybersecurity, University of Houston.</p>
          </a>
        </div>
      </section>

      {/* Awards and Grants */}
      <section className="space-y-4 md:space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
          <Award className="w-7 h-7 text-amber-500" />
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Awards &amp; Grants</h2>
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

          {/* AIUB Scholarship */}
          <div className="interactive-card bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 hover:shadow">
            <div className="relative w-28 h-28 shrink-0 rounded-2xl border border-slate-100 p-3 flex items-center justify-center bg-white">
              <div className="relative w-full h-full">
                <picture>
                  <source type="image/avif" sizes="112px" srcSet="/optimized/aiub-logo-224.avif 224w, /optimized/aiub-logo-448.avif 448w" />
                  <source type="image/webp" sizes="112px" srcSet="/optimized/aiub-logo-224.webp 224w, /optimized/aiub-logo-448.webp 448w" />
                  <img
                    src="/optimized/aiub-logo-448.png"
                    alt="AIUB Scholarship Grant"
                    width={448}
                    height={244}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                </picture>
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

      {/* Personal Hobbies */}
      <section className="space-y-4 md:space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
          <Tent className="w-7 h-7 text-emerald-600" />
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Personal Hobbies</h2>
        </div>
        <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
          Beyond the code and the lab, I am an explorer at heart. When I&apos;m not analyzing network topologies or writing NS-3 simulation models, you can usually find me outdoors — I believe that stepping away from the screen is the best way to solve complex problems.
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
