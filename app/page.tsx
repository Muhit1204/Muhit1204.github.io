import {
  Award,
  Bike,
  Briefcase,
  Calendar,
  Cpu,
  Database,
  ExternalLink,
  FileText,
  Flame,
  Github,
  Linkedin,
  Map,
  Mail,
  MapPin,
  Mountain,
  Plane,
  Server,
  Tent,
  Users,
  Waves,
} from 'lucide-react';
import Link from 'next/link';
import Counter from '@/components/Counter';
import SatelliteOrbitDiagram from '@/components/SatelliteOrbitDiagram';
import { experiences, projects, type Bullet, type ProjectIcon } from '@/lib/work';
import { datasets, publications } from '@/lib/publications';

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

/*
 * Recent News and Awards & Grants used to be two sections that repeated the
 * AWS pitch and the ICAIC paper. One reverse-chronological log instead.
 */
const logEntries = [
  {
    date: 'May 2026',
    title: 'Completed MS and began doctoral research',
    body: 'Conferred the Master of Science in Computer Science at Lamar University on May 15, 2026, and began the Doctor of Engineering in Electrical & Computer Engineering on May 26, 2026. The doctoral research extends the LEO satellite work toward interplanetary deep space communication and Delay Tolerant Networking.',
  },
  {
    date: 'April 2026',
    title: '2nd Place — AWS AI Pitch Competition',
    tag: 'award',
    logo: { src: '/aws-logo.png', alt: 'Amazon Web Services' },
    href: 'https://www.linkedin.com/posts/mdmuntasirhossain98_aws-amazonwebservices-artificialintelligence-activity-7444969525290381313-KE_I',
    body: 'Awarded $35,000 in AWS credits for SatLink AI, a predictive connectivity intelligence platform for maritime and port operations, at the Small Business Development Center at Lamar University × Amazon Web Services competition. Recognized for bridging academic research with entrepreneurial commercialization for Gulf Coast port operators.',
  },
  {
    date: 'February 2026',
    title: 'IEEE ICAIC 2026 — paper accepted and presented',
    href: 'https://www.linkedin.com/posts/mdmuntasirhossain98_ieee-icaic-starlink-activity-7433392560175226880-bhmp',
    body: 'Presented “A Dual-Task Prediction Model for Starlink Maritime Performance” at the 5th IEEE International Conference on AI in Cybersecurity, University of Houston.',
  },
  {
    date: '2019',
    title: "Dean's List Award",
    tag: 'award',
    body: 'American International University-Bangladesh. Recognized for ranking among the top students in the Department of Computer Science, for consistent academic excellence and exemplary GPA achievement.',
  },
  {
    date: '2017 – 2021',
    title: 'Dr. Anwarul Abedin Scholarship Grant',
    tag: 'award',
    logo: { src: '/optimized/aiub-logo-448.png', alt: 'American International University-Bangladesh' },
    body: 'American International University-Bangladesh. Awarded for outstanding academic performance and consistent excellence during undergraduate studies in Computer Science and Engineering.',
  },
];

const hobbies = [
  { name: 'Camping', Icon: Tent },
  { name: 'Hiking', Icon: Mountain },
  { name: 'Cycling', Icon: Bike },
  { name: 'BBQ', Icon: Flame },
  { name: 'Traveling', Icon: Plane },
  { name: 'Swimming', Icon: Waves },
];

const projectIcons: Record<ProjectIcon, typeof Server> = {
  map: Map,
  server: Server,
  cpu: Cpu,
  database: Database,
};

/** Shared section heading: `$ cat <label>` above a mono title. */
function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <div className="space-y-2 border-b border-line pb-3">
      <p className="term-label">{label}</p>
      <h2 className="text-2xl md:text-3xl font-bold text-body">{title}</h2>
    </div>
  );
}

function BulletList({ items }: { items: Bullet[] }) {
  return (
    <ul className="space-y-3 text-muted">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="text-accent mt-1 font-mono text-xs shrink-0">›</span>
          <span className="leading-relaxed">
            {typeof item === 'string' ? (
              item
            ) : (
              <>
                <strong className="text-body font-semibold">{item.lead}</strong> {item.text}
              </>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-xs px-2.5 py-1 rounded border border-line bg-surface-2 text-muted">
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <div className="space-y-16 md:space-y-28">
      {/* Hero — terminal identity beside the live orbit visual. */}
      <section className="grid lg:grid-cols-2 gap-8 items-center pt-4 md:pt-12">
        <div className="rounded-xl border border-line bg-surface overflow-hidden">
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-line bg-surface-2">
            <span className="w-3 h-3 rounded-full bg-danger/70" />
            <span className="w-3 h-3 rounded-full bg-warn/70" />
            <span className="w-3 h-3 rounded-full bg-accent/70" />
            <span className="ml-3 font-mono text-xs text-muted">~/muntasir — zsh</span>
          </div>

          <div className="p-5 md:p-7 space-y-5">
            <p className="font-mono text-sm text-muted">
              <span className="text-accent">$ </span>whoami
            </p>
            <h1 className="text-2xl md:text-4xl font-bold text-body">
              Md Muntasir Hossain
              <span className="term-cursor" />
            </h1>
            <p className="text-muted leading-relaxed">
              Doctor of Engineering student and Graduate Research Assistant at{' '}
              <a href="https://www.lamar.edu/center-data-analytics-cybersecurity/" target="_blank" rel="noopener noreferrer">
                Lamar University
              </a>
              , Center for Data Analytics and Cybersecurity, working on the reliability and resilience of
              satellite communication systems — from maritime LEO broadband to interplanetary deep space networks.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {['Satellite Communication', 'Machine Learning', 'Cybersecurity', 'Maritime Networks', 'LEO Satellites', 'Deep Space Networks'].map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#work"
                className="font-mono text-sm px-4 py-2 rounded-md border border-accent-dim text-accent hover:bg-accent/10 transition-colors"
              >
                view work
              </a>
              <a
                href="#contact"
                className="font-mono text-sm px-4 py-2 rounded-md border border-line text-muted hover:border-accent-dim hover:text-accent transition-colors"
              >
                get in touch
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-line overflow-hidden">
          <SatelliteOrbitDiagram />
        </div>
      </section>

      {/* About */}
      <section id="about" className="space-y-6">
        <SectionHeading label="cat about.md" title="About" />
        <div className="grid md:grid-cols-[18rem_1fr] gap-6 md:gap-10 items-start">
          <div className="relative w-full max-w-xs rounded-xl overflow-hidden border border-line">
            <picture>
              <source type="image/avif" sizes="(min-width: 768px) 288px, 100vw" srcSet="/optimized/profile-704.avif 704w, /optimized/profile-1056.avif 1056w, /optimized/profile-1408.avif 1408w" />
              <source type="image/webp" sizes="(min-width: 768px) 288px, 100vw" srcSet="/optimized/profile-704.webp 704w, /optimized/profile-1056.webp 1056w, /optimized/profile-1408.webp 1408w" />
              <img
                src="/optimized/profile-1056.jpg"
                alt="Md Muntasir Hossain"
                width={1056}
                height={1408}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover object-top"
              />
            </picture>
          </div>
          <div className="space-y-4 text-muted leading-relaxed">
            <p>
              My research spans satellite-based communication, Delay Tolerant Networking for deep space and
              cislunar relays, wireless network resilience, machine learning for predictive analytics, and
              cybersecurity analysis of LEO satellite networks.
            </p>
            <p>
              Day to day that means NS-3 simulation models, real coastal measurement campaigns, and prediction
              models that have to hold up against live telemetry — alongside the security side of the same
              systems: spoofing, signal manipulation, and data integrity in intelligent maritime infrastructure.
            </p>
            <p>
              Degrees and certifications live on the{' '}
              <Link href="/education">education page</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="space-y-6">
        <SectionHeading label="cat work/experience.log" title="Experience" />

        <div className="space-y-5">
          {experiences.map((exp) => (
            <article key={exp.title + exp.date} className="interactive-card rounded-xl p-5 md:p-7 space-y-4">
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
                <h3 className="text-xl font-bold text-body">{exp.title}</h3>
                <span className="font-mono text-xs uppercase tracking-wider text-accent shrink-0">{exp.date}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                <span className="flex items-center gap-2 text-body">
                  <Briefcase className="w-4 h-4 text-muted" />
                  {exp.link ? (
                    <a href={exp.link} target="_blank" rel="noopener noreferrer">
                      {exp.company}
                    </a>
                  ) : (
                    exp.company
                  )}
                </span>
                <span className="hidden sm:inline text-line">•</span>
                <span className="font-mono text-xs text-muted">{exp.location}</span>
              </div>
              <BulletList items={exp.description} />
            </article>
          ))}
        </div>

      </section>

      {/* Projects */}
      <section id="projects" className="space-y-6">
        <SectionHeading label="ls projects/" title="Projects" />

        <div className="space-y-5">
          {projects.map((project) => {
            const Icon = projectIcons[project.icon];
            return (
              <article key={project.title} className="interactive-card rounded-xl p-5 md:p-7 space-y-4">
                <div className="flex items-start gap-4">
                  <span className="p-2 rounded-lg border border-line bg-surface-2 text-accent shrink-0">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-body leading-tight">{project.title}</h3>
                      {project.isOngoing && (
                        <span className="font-mono text-[0.65rem] uppercase tracking-widest px-2 py-0.5 rounded border border-warn/40 text-warn">
                          ongoing
                        </span>
                      )}
                    </div>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {project.linkLabel ?? 'Repository'}
                      </a>
                    )}
                  </div>
                </div>

                <BulletList items={project.description} />

                {project.image && (
                  <img
                    src={project.image}
                    alt={`${project.title} dashboard`}
                    loading="lazy"
                    decoding="async"
                    className="w-full rounded-lg border border-line"
                  />
                )}

                {(project.techStack || project.concepts) && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.techStack?.map((tech) => (
                      <Tag key={tech}>{tech}</Tag>
                    ))}
                    {project.concepts?.map((concept) => (
                      <span
                        key={concept}
                        className="font-mono text-xs px-2.5 py-1 rounded border border-accent-dim/40 text-accent"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* Publications — full detail; the separate route was the same material twice. */}
      <section id="publications" className="space-y-6">
        <SectionHeading label="cat publications.bib" title="Publications" />
        <div className="space-y-5">
          {publications.map((pub) => (
            <article key={pub.link} className="interactive-card rounded-xl p-5 md:p-7 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-bold text-body leading-snug">{pub.title}</h3>
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:underline shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  IEEE
                </a>
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                <p className="flex items-start gap-2 text-muted">
                  <Users className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{pub.authors}</span>
                </p>
                <p className="flex items-start gap-2 text-accent">
                  <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{pub.venue}</span>
                </p>
                {pub.location && (
                  <p className="flex items-start gap-2 text-muted">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{pub.location}</span>
                  </p>
                )}
                <p className="flex items-start gap-2 text-muted">
                  <Calendar className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{pub.date}</span>
                </p>
              </div>

              <p className="text-muted leading-relaxed">{pub.abstract}</p>

              <div className="flex flex-wrap gap-2">
                {pub.keywords.map((keyword) => (
                  <Tag key={keyword}>{keyword}</Tag>
                ))}
              </div>
            </article>
          ))}
        </div>

        <SectionHeading label="ls datasets/" title="Datasets" />
        <div className="space-y-5">
          {datasets.map((dataset) => (
            <a
              key={dataset.link}
              href={dataset.link}
              target="_blank"
              rel="noopener noreferrer"
              className="interactive-card block rounded-xl p-5 md:p-7 space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-bold text-body leading-snug">{dataset.title}</h3>
                <ExternalLink className="w-4 h-4 text-muted shrink-0 mt-1" />
              </div>
              <p className="font-mono text-xs text-muted flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                {dataset.date}
              </p>
              <p className="text-muted leading-relaxed">{dataset.description}</p>
              <div className="flex flex-wrap gap-2">
                {dataset.keywords.map((keyword) => (
                  <Tag key={keyword}>{keyword}</Tag>
                ))}
              </div>
            </a>
          ))}
        </div>

        <a
          href="https://scholar.google.com/citations?view_op=list_works&hl=en&user=guXY-gQAAAAJ"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-mono text-sm text-muted hover:text-accent transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Google Scholar
        </a>
      </section>

      {/* Skills */}
      <section id="skills" className="space-y-6">
        <SectionHeading label="cat skills.json" title="Skills &amp; Tools" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map(({ category, tools }) => (
            <div key={category} className="interactive-card rounded-xl p-5 space-y-3">
              <h3 className="font-mono text-xs uppercase tracking-widest text-accent">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <Tag key={tool}>{tool}</Tag>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Log — news and awards, merged and reverse-chronological. */}
      <section id="log" className="space-y-6">
        <SectionHeading label="tail -f changelog" title="News &amp; Awards" />
        <div className="space-y-4">
          {logEntries.map((entry) => {
            const inner = (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs uppercase tracking-wider text-accent">{entry.date}</span>
                  {entry.tag === 'award' && (
                    <span className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-widest px-2 py-0.5 rounded border border-warn/40 text-warn">
                      <Award className="w-3 h-3" />
                      award
                    </span>
                  )}
                  {entry.href && <ExternalLink className="w-4 h-4 text-muted ml-auto" />}
                </div>
                <h3 className="text-lg font-bold text-body">{entry.title}</h3>
                <div className="flex items-start gap-4">
                  {entry.logo && (
                    <img
                      src={entry.logo.src}
                      alt={entry.logo.alt}
                      loading="lazy"
                      decoding="async"
                      className="hidden sm:block w-20 h-20 object-contain rounded-lg border border-line bg-surface-2 p-2 shrink-0"
                    />
                  )}
                  <p className="text-muted leading-relaxed">{entry.body}</p>
                </div>
              </>
            );

            return entry.href ? (
              <a
                key={entry.title}
                href={entry.href}
                target="_blank"
                rel="noopener noreferrer"
                className="interactive-card block rounded-xl p-5 md:p-6 space-y-2"
              >
                {inner}
              </a>
            ) : (
              <div key={entry.title} className="interactive-card rounded-xl p-5 md:p-6 space-y-2">
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      {/* Metrics */}
      <section id="metrics" className="space-y-6">
        <SectionHeading label="stat --summary" title="By the numbers" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map(({ value, suffix, unit, caption }) => (
            <div key={caption} className="interactive-card rounded-xl p-5 md:p-6 text-center space-y-2">
              <p className="font-mono text-2xl md:text-3xl font-bold text-accent">
                <Counter value={value} suffix={suffix} />
              </p>
              <p className="font-mono text-xs uppercase tracking-widest text-body">{unit}</p>
              <p className="text-sm text-muted leading-snug">{caption}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl overflow-hidden border border-line">
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
              className="w-full h-56 md:h-72 object-cover object-center"
            />
          </picture>
        </div>
      </section>

      {/* Hobbies */}
      <section id="hobbies" className="space-y-6">
        <SectionHeading label="cat ~/.offline" title="Away from the terminal" />
        <p className="text-muted leading-relaxed max-w-3xl">
          Beyond the code and the lab, I am an explorer at heart. When I am not analyzing network topologies or
          writing NS-3 simulation models, you can usually find me outdoors — stepping away from the screen is
          the best way I know to solve a complex problem.
        </p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {hobbies.map(({ name, Icon }) => (
            <div key={name} className="interactive-card rounded-xl p-4 flex flex-col items-center gap-3 text-center">
              <Icon className="w-6 h-6 text-accent" />
              <span className="font-mono text-xs text-muted">{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="space-y-6">
        <SectionHeading label="./contact.sh" title="Get in touch" />
        <div className="rounded-xl border border-line bg-surface p-5 md:p-8 space-y-6 font-mono text-sm">
          <div className="space-y-3">
            <p className="text-muted">
              <span className="text-accent">$ </span>cat contacts
            </p>
            <div className="grid sm:grid-cols-[7rem_1fr] gap-x-6 gap-y-2">
              <span className="text-muted">work</span>
              <a href="mailto:mhossain54@lamar.edu" className="text-body hover:text-accent transition-colors break-all">
                mhossain54@lamar.edu
              </a>
              <span className="text-muted">personal</span>
              <a href="mailto:muntasir.hossain007@gmail.com" className="text-body hover:text-accent transition-colors break-all">
                muntasir.hossain007@gmail.com
              </a>
              <span className="text-muted">calendar</span>
              <a
                href="https://calendar.app.google/7bicmniscwJYaoA36"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Schedule a time to chat
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2 border-t border-line">
            <a
              href="https://github.com/Muhit1204"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-md border border-line text-muted hover:border-accent-dim hover:text-accent transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/mdmuntasirhossain98"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-md border border-line text-muted hover:border-accent-dim hover:text-accent transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
            <a
              href="mailto:mhossain54@lamar.edu"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-md border border-accent-dim text-accent hover:bg-accent/10 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Email me
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
