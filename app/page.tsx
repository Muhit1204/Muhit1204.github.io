import {
  Award,
  Bike,
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
import Image from 'next/image';
import HeroVisual from '@/components/HeroVisual';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import CiteButton from '@/components/CiteButton';
import Pane from '@/components/Pane';
import Reveal from '@/components/Reveal';
import ScrambleText from '@/components/ScrambleText';
import TracedList from '@/components/TracedList';
import WindowModal from '@/components/WindowModal';
import TerminalPrompt from '@/components/TerminalPrompt';
import { experiences, projects, type Bullet, type ProjectIcon } from '@/lib/work';
import { datasets, publications } from '@/lib/publications';
import { toBibTeX } from '@/lib/bibtex';

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
    body: 'MS conferred May 15. D.E. in Electrical & Computer Engineering started May 26, extending the LEO work toward deep space and Delay Tolerant Networking.',
  },
  {
    date: 'April 2026',
    title: '2nd Place — AWS AI Pitch Competition',
    tag: 'award',
    logo: { src: '/aws-logo.png', alt: 'Amazon Web Services' },
    href: 'https://www.linkedin.com/posts/mdmuntasirhossain98_aws-amazonwebservices-artificialintelligence-activity-7444969525290381313-KE_I',
    body: '$35,000 in AWS credits for SatLink AI — predictive connectivity intelligence for maritime and port operations.',
  },
  {
    date: 'February 2026',
    title: 'IEEE ICAIC 2026 — paper accepted and presented',
    href: 'https://www.linkedin.com/posts/mdmuntasirhossain98_ieee-icaic-starlink-activity-7433392560175226880-bhmp',
    body: '“A Dual-Task Prediction Model for Starlink Maritime Performance” — 5th IEEE ICAIC, University of Houston.',
  },
  {
    date: '2019',
    title: "Dean's List Award",
    tag: 'award',
    body: 'American International University-Bangladesh — top of the Computer Science department.',
  },
  {
    date: '2017 – 2021',
    title: 'Dr. Anwarul Abedin Scholarship Grant',
    tag: 'award',
    logo: { src: '/optimized/aiub-logo-448.png', alt: 'American International University-Bangladesh' },
    body: 'American International University-Bangladesh — four-year merit scholarship.',
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

/** Sub-heading for a block nested inside a pane. */
function SubHeading({ label, title }: { label: string; title: string }) {
  return (
    <div className="space-y-2 border-b border-line pb-3 pt-2">
      <p className="term-label">{label}</p>
      <h3 className="text-xl font-bold text-body">{title}</h3>
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

function Details({
  label,
  children,
  open = false,
}: {
  label: string;
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <details open={open} className="border-t border-line pt-3">
      <summary className="text-xs text-muted hover:text-accent transition-colors select-none">{label}</summary>
      <div className="pt-4">{children}</div>
    </details>
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
      {/* Hero — identity, the live constellation, and a working prompt. */}
      <section className="space-y-6 pt-4 md:pt-10">
        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          <div className="space-y-5 flex flex-col justify-center">
            <p className="text-sm text-muted">
              <span className="text-accent">$ </span>whoami
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-body glow [overflow-wrap:anywhere]">
              Md Muntasir Hossain
              <span className="term-cursor" />
            </h1>
            <p className="font-mono text-sm text-accent tracking-wide">
              Doctoral Researcher · Satellite Networks · Cybersecurity · Intelligent Networking
            </p>
            <p className="text-lg text-body leading-relaxed max-w-xl">
              Building predictive and resilient communication systems for LEO, maritime, and deep-space networks.
            </p>
            <p className="text-muted leading-relaxed max-w-xl">
              Doctor of Engineering student and Graduate Research Assistant at{' '}
              <a href="https://www.lamar.edu/center-data-analytics-cybersecurity/" target="_blank" rel="noopener noreferrer">
                Lamar University&rsquo;s Center of Data, AI and Cybersecurity
              </a>
              , researching AI-enabled cybersecurity for satellite communications.
            </p>
            <p className="text-sm text-body border-l-2 border-accent-dim pl-3">
              Looking for internship positions in satellite communications, network security and applied
              ML — and open to research collaborations.
            </p>
            <div className="flex flex-wrap gap-2">
              {['LEO satellites', 'DTN', 'ICS/SCADA security', 'MITRE ATT&CK', 'ML forecasting', 'agentic AI'].map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3 pt-1 text-sm">
              <a
                href="#projects"
                className="flex-1 sm:flex-none text-center px-4 py-2.5 sm:py-2 border border-accent-dim text-accent hover:bg-accent/10 transition-colors"
              >
                projects
              </a>
              <a
                href="#publications"
                className="flex-1 sm:flex-none text-center px-4 py-2.5 sm:py-2 border border-line text-muted hover:border-accent-dim hover:text-accent transition-colors"
              >
                papers
              </a>
              <a
                href="/resume.pdf"
                download
                className="flex-1 sm:flex-none text-center px-4 py-2.5 sm:py-2 border border-line text-muted hover:border-accent-dim hover:text-accent transition-colors"
              >
                resume
              </a>
            </div>
          </div>

          <div className="rounded-none border border-line overflow-hidden">
            <HeroVisual />
          </div>
        </div>

        <nav
          aria-label="Research highlights"
          className="grid grid-cols-2 lg:grid-cols-4 border border-line bg-surface font-mono text-xs"
        >
          {[
            { label: '2 IEEE Papers', href: '#publications' },
            { label: 'Public Experimental Dataset', href: '#publications' },
            { label: 'Federally Funded Research', href: '#experience' },
            { label: '2nd Place · AWS AI Pitch', href: '#log' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-3 py-3 text-center text-muted hover:text-accent hover:bg-surface-2 border-line border-b odd:border-r lg:border-b-0 lg:border-r last:border-r-0 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Everything this reaches is also reachable by scrolling. */}
        <TerminalPrompt />
      </section>

      {/* About */}
      <Pane
        id="about"
        index={1}
        total={8}
        path="~/about"
        command="cat about.md"
        title="About"
        status="identity"
      >
        <div className="grid md:grid-cols-[18rem_1fr] gap-6 md:gap-10 items-stretch">
          <div className="relative w-full min-h-[18rem] md:min-h-full rounded-none overflow-hidden border border-line">
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
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </picture>
          </div>
          <div className="space-y-4 text-muted leading-relaxed">
            <p>
              Federally funded work with the Port of Beaumont on maritime satellite reliability: NS-3 models,
              real coastal measurement campaigns, and forecasting that has to survive live telemetry.
            </p>
            <p>
              The security half is the same systems from the other side — spoofing, signal manipulation, and
              data integrity in intelligent maritime infrastructure, plus ICS/SCADA advisory work mapped to
              MITRE ATT&amp;CK.
            </p>
            <p>
              Degrees and certifications: <Link href="/education">education</Link>.
            </p>
          </div>
        </div>
      </Pane>

      {/* Experience */}
      <Pane
        id="experience"
        index={2}
        total={8}
        path="~/work/experience"
        command="cat work/experience.log"
        title="Experience"
        status="4 roles"
      >

        <ExperienceTimeline experiences={experiences} />

      </Pane>

      {/* Publications — full detail; the separate route was the same material twice. */}
      <Pane
        id="publications"
        index={3}
        total={8}
        path="~/research"
        command="cat publications.bib"
        title="Publications"
        status="2 papers, 1 dataset"
      >
        <TracedList footer={`${publications.length} papers`}>
          {publications.map((pub) => (
            <article key={pub.link} className="interactive-card rounded-none p-5 md:p-7 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg sm:text-xl font-bold text-body leading-snug [overflow-wrap:anywhere]">{pub.title}</h3>
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

              <div className="space-y-1.5 text-xs [overflow-wrap:anywhere]">
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
                <p className="flex items-start gap-2 text-muted">
                  <span className="text-accent shrink-0">doi</span>
                  <a
                    href={'https://doi.org/' + pub.doi}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-accent hover:underline"
                  >
                    {pub.doi}
                  </a>
                </p>
              </div>

              {pub.outcome && (
                <p className="border-l-2 border-accent pl-3 text-sm text-body">
                  <span className="font-mono text-xs uppercase tracking-wider text-accent">result </span>
                  {pub.outcome}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {pub.keywords.map((keyword) => (
                  <Tag key={keyword}>{keyword}</Tag>
                ))}
              </div>

              <Details label="abstract" open>
                <p className="text-muted leading-relaxed">{pub.abstract}</p>
              </Details>

              <CiteButton bibtex={toBibTeX(pub)} />
            </article>
          ))}
        </TracedList>

        <SubHeading label="ls datasets/" title="Datasets" />
        <TracedList>
          {datasets.map((dataset) => (
            <a
              key={dataset.link}
              href={dataset.link}
              target="_blank"
              rel="noopener noreferrer"
              className="interactive-card block rounded-none p-5 md:p-7 space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg sm:text-xl font-bold text-body leading-snug [overflow-wrap:anywhere]">{dataset.title}</h3>
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
        </TracedList>

        <a
          href="https://scholar.google.com/citations?view_op=list_works&hl=en&user=guXY-gQAAAAJ"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-mono text-sm text-muted hover:text-accent transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Google Scholar
        </a>
      </Pane>

      {/* Projects */}
      <Pane
        id="projects"
        index={4}
        total={8}
        path="~/work/projects"
        command="ls projects/"
        title="Projects"
        status="7 repositories"
      >

        <TracedList footer={`${projects.length} builds`}>
          {projects.map((project, projectIndex) => {
            const Icon = projectIcons[project.icon];
            return (
              <article key={project.title} className="interactive-card rounded-none p-5 md:p-7 space-y-4">
                <div className="flex items-start gap-4">
                  <span className="p-2 rounded-none border border-line bg-surface-2 text-accent shrink-0">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg sm:text-xl font-bold text-body leading-tight [overflow-wrap:anywhere]">{project.title}</h3>
                      {project.isOngoing && (
                        <span className="font-mono text-[0.65rem] uppercase tracking-widest px-2 py-0.5 rounded border border-warn/40 text-warn">
                          ongoing
                        </span>
                      )}
                    </div>
                    {project.link &&
                      (project.link.endsWith('.pdf') ? (
                        <WindowModal
                          label={project.linkLabel ?? 'Document'}
                          title={`${project.title} — ${project.linkLabel ?? 'document'}`}
                          src={project.link}
                          kind="pdf"
                        />
                      ) : (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          {project.linkLabel ?? 'Repository'}
                        </a>
                      ))}
                  </div>
                </div>

                <BulletList items={project.description.slice(0, 1)} />

                {project.image && (
                  <WindowModal
                    label="screenshot"
                    title={`${project.title} — dashboard`}
                    src={project.image}
                    kind="image"
                  />
                )}

                {project.description.length > 1 && (
                  <Details label={`${project.description.length - 1} more`} open={projectIndex === 0}>
                    <BulletList items={project.description.slice(1)} />
                  </Details>
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
        </TracedList>
      </Pane>

      {/* Skills */}
      <Pane
        id="skills"
        index={5}
        total={8}
        path="~/.config/skills"
        command="cat skills.json"
        title="Skills &amp; Tools"
        status="9 categories"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map(({ category, tools }, i) => (
            <Reveal key={category} delay={i * 40}>
              <div className="interactive-card rounded-none p-5 space-y-3 h-full">
                <h3 className="text-xs uppercase tracking-widest text-accent">
                  <ScrambleText text={category} />
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tools.map((tool) => (
                    <Tag key={tool}>{tool}</Tag>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Pane>

      {/* Log — news and awards, merged and reverse-chronological. */}
      <Pane
        id="log"
        index={6}
        total={8}
        path="/var/log/portfolio"
        command="tail -f changelog"
        title="News &amp; Awards"
        status="newest first"
      >
        <TracedList footer={`${logEntries.length} entries`}>
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
                <h3 className="text-base sm:text-lg font-bold text-body [overflow-wrap:anywhere]">{entry.title}</h3>
                <div className="flex items-start gap-4">
                  {entry.logo && (
                    <Image
                      src={entry.logo.src}
                      alt={entry.logo.alt}
                      loading="lazy"
                      width={80}
                      height={80}
                      className="hidden sm:block w-20 h-20 object-contain rounded-none border border-line bg-surface-2 p-2 shrink-0"
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
                className="interactive-card block rounded-none p-5 md:p-6 space-y-2"
              >
                {inner}
              </a>
            ) : (
              <div key={entry.title} className="interactive-card rounded-none p-5 md:p-6 space-y-2">
                {inner}
              </div>
            );
          })}
        </TracedList>
      </Pane>

      {/* Hobbies */}
      <Pane
        id="hobbies"
        index={7}
        total={8}
        path="~/.offline"
        command="cat ~/.offline"
        title="Away from the terminal"
        status="no signal required"
      >
        <p className="text-muted leading-relaxed max-w-3xl">
          Best debugging happens away from the keyboard.
        </p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {hobbies.map(({ name, Icon }, i) => (
            <Reveal key={name} delay={i * 60}>
              <div className="interactive-card rounded-none p-4 flex flex-col items-center gap-3 text-center h-full">
                <Icon className="w-6 h-6 text-accent" />
                <span className="text-xs text-muted">{name}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Pane>

      {/* Contact */}
      <Pane
        id="contact"
        index={8}
        total={8}
        path="~/contact"
        command="./contact.sh"
        title="Get in touch"
        status="open for collaboration"
      >
        <div className="rounded-none border border-line bg-surface p-5 md:p-8 space-y-6 font-mono text-sm">
          <div className="space-y-3">
            <p className="text-muted">
              <span className="text-accent">$ </span>cat contacts
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-[7rem_1fr] gap-x-6 gap-y-1 sm:gap-y-2">
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
              className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-none border border-line text-muted hover:border-accent-dim hover:text-accent transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/mdmuntasirhossain98"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-none border border-line text-muted hover:border-accent-dim hover:text-accent transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
            <a
              href="mailto:mhossain54@lamar.edu"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-none border border-accent-dim text-accent hover:bg-accent/10 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Email me
            </a>
          </div>
        </div>
      </Pane>
    </div>
  );
}
