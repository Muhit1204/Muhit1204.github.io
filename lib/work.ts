/*
 * Experience and project content, lifted out of the retired /experience and
 * /projects routes when the site collapsed to a single page. Kept as plain
 * data so app/page.tsx can stay a server component.
 */

/** A bullet, optionally with a bolded lead-in phrase. */
export type Bullet = string | { lead: string; text: string };

export type Experience = {
  title: string;
  company: string;
  link?: string;
  location: string;
  date: string;
  description: Bullet[];
};

export const experiences: Experience[] = [
  {
    title: 'Graduate Research Assistant',
    company: 'Lamar University, Center for Data Analytics and Cybersecurity',
    link: 'https://www.lamar.edu/center-data-analytics-cybersecurity/',
    location: 'Beaumont, United States',
    date: 'Oct 2024 – Present',
    description: [
      'Working under a federally funded project in collaboration with the Port of Beaumont to improve the reliability and resilience of Maritime Satellite Communications and intelligent networking systems.',
      'Conducting research on performance evaluation and adaptive optimization of satellite based and Delay tolerant Networks, emphasizing reliability under variable environmental and mobility conditions.',
      'Developing NS-3 simulation models to analyze link stability, routing efficiency and communication latency across heterogenous network topologies.',
      'Investigating cybersecurity risks in intelligent maritime systems, including signal manipulation, spoofing and data integrity threats.',
      'Delivered data-driven insights adopted by project stakeholders to strengthen connectivity and operational security for port activities.',
    ],
  },
  {
    title: 'Graduate Teaching Assistant',
    company: 'Lamar University',
    link: 'https://www.lamar.edu/arts-sciences/computer-science/',
    location: 'Beaumont, United States',
    date: 'Sep 2025 – Present',
    description: [
      'Assisting in undergraduate courses: Computer Networks (COSC 5328), Multimedia Processing (COSC 4330), and Introduction to Computer Architecture (COSC 4310).',
      'Supporting 50+ students per course through lab instruction, grading, and one-on-one academic guidance.',
      'Demonstrating tools such as Wireshark, NS-3, and Python-based network analysis to bridge theoretical and practical learning.',
      'Managing course operations via Blackboard and OneDrive, ensuring timely feedback, and maintaining academic integrity.',
    ],
  },
  {
    title: 'IT Student Assistant',
    company: 'Lamar University',
    link: 'https://www.lamar.edu/it-services-and-support/index.html',
    location: 'Beaumont, United States',
    date: 'Feb 2024 – Sep 2024',
    description: [
      'Delivered technical support to 500+ students, faculty, and staff, resolving hardware/software issues with a 95% success rate across on-site and remote requests.',
      'Managed inventory of 1,000+ IT assets and optimized databases, boosting performance by 20% and reducing troubleshooting time by 30%.',
      'Installed, configured, and maintained 200+ workstations, ensuring consistent system reliability and high availability for daily operations.',
    ],
  },
  {
    title: 'Web Developer',
    company: 'RPSI Limited: Tech Team',
    link: 'https://www.linkedin.com/company/rpsiltd/?originalSubdomain=uk',
    location: 'Dhaka, Bangladesh',
    date: 'Sep 2021 – Jan 2023',
    description: [
      'Designed and deployed 3+ e-commerce and NGO websites using JavaScript, React, PHP, and Laravel, cutting development costs by 15% and reducing deployment time by 20%.',
      'Collaborated with a 4-person development team, improving coordination and reducing delivery delays by 25% through better task allocation.',
      'Contributed to a logistics management system that streamlined order tracking, reduced manual processing time by 30%, and provided full-stack support and maintenance to ensure high availability, performance, and security.',
    ],
  },
];

/** Maps to a lucide icon in the renderer — keeps this file free of JSX. */
export type ProjectIcon = 'map' | 'server' | 'cpu' | 'database';

export type Project = {
  title: string;
  icon: ProjectIcon;
  link?: string;
  linkLabel?: string;
  isOngoing?: boolean;
  image?: string;
  description: Bullet[];
  techStack?: string[];
  concepts?: string[];
};

export const projects: Project[] = [
  {
    title: 'Unmanned Aircraft System Mapping of the LNVA Canal Site',
    icon: 'map',
    link: '/UAS_LNVA_Project_Closing_Summary.pdf',
    linkLabel: 'Summary Deck',
    description: [
      'Produced a georeferenced 3D surface model of an approximately 8-acre canal site (project designation CAWAQ_LNVA) from UAS imagery, as Research Assistant to Dr. Feilin Lai in the Geology Department at Lamar University. Flown at 35 m above ground level and 3.16 m/s for a 0.59 cm ground sample distance.',
      {
        lead: 'Field Data Collection:',
        text: 'Recovered 182 overlapping nadir images totalling 9.1 GB on a 15-minute reflight after the first flight’s image set proved unreadable due to a format mismatch — the resulting procedure change is an on-site format and readability check immediately after landing, converting a lost flight day into a 5-minute verification.',
      },
      {
        lead: 'Photogrammetric Processing:',
        text: 'Ran the full Pix4Dmapper 3D Maps pipeline (keypoint extraction and calibration, densification, digital surface model and orthomosaic generation), achieving a mean reprojection error of 0.131 pixels with outputs as GeoTIFF rasters and a dense LAS point cloud.',
      },
      {
        lead: '3D Scene Construction:',
        text: 'Built a local ArcGIS Pro 3.6 scene in WGS 84 / UTM zone 15N with the digital surface model as ground elevation source and the orthomosaic draped over it, removing the WorldElevation3D basemap surface that would otherwise drape imagery over Esri terrain and produce a plausible but incorrect scene.',
      },
      {
        lead: 'Hydro-Flattening:',
        text: 'Corrected the canal water surface within the elevation model using Zonal Statistics to derive a median water elevation, Polygon to Raster for a constant water surface, Raster Calculator substitution, and Feature Preserving Smoothing to reduce residual noise.',
      },
      {
        lead: 'Automated 3D Export:',
        text: 'Established a 7-step geoprocessing chain (Raster Calculator, Raster To TIN, Raster Domain, Interpolate Polygon To Multipatch, Project Raster, Add 3D Formats To Multipatch, Export 3D Objects) to write the corrected surface to OBJ format, and published the scene to ArcGIS Online as a supporting deliverable.',
      },
    ],
    techStack: ['ArcGIS Pro 3.6', 'Pix4Dmapper', 'ArcGIS Online', 'Open3D', 'Sony ILX-LR1 (61 MP)', 'WGS 84 / UTM 15N'],
    concepts: ['Photogrammetry', 'Digital Surface Modeling', 'Hydro-flattening', 'Geoprocessing Automation', '3D Scene Construction'],
  },
  {
    title: 'Starlink Maritime Performance Prediction & Decision-Support Dashboard',
    icon: 'server',
    isOngoing: true,
    image: '/starlink-dashboard.png',
    description: [
      'Developed a real-time, predictive decision-support web application for maritime Starlink users, ingesting live network telemetry to forecast throughput and latency up to 15 minutes ahead.',
      {
        lead: 'Predictive Forecasting & Confidence Intervals:',
        text: 'Implemented a forecasting engine (based on Random Forest regression logic) that projects network throughput and latency across a 15-minute horizon, visualizing the trend curve alongside dynamic confidence intervals that expand with time.',
      },
      {
        lead: 'Early Warning & Anomaly Detection:',
        text: 'Engineered an analytical system that monitors the relationship between latency and throughput to preemptively detect satellite handoffs and issue early warnings when rising latency indicates an impending drop in bandwidth.',
      },
      {
        lead: 'Actionable Decision Support:',
        text: 'Designed a “Task Readiness” algorithm that translates raw network forecasts into practical recommendations, calculating the exact “Safe Duration” (in minutes) for specific operations like Video Calling, VoIP, and Large File Transfers.',
      },
      {
        lead: 'Real-Time Accuracy Tracking:',
        text: 'Built a continuous feedback loop that stores short-term predictions and evaluates them against actual incoming telemetry, displaying a live Exponential Moving Average (EMA) of the model’s accuracy.',
      },
      {
        lead: 'Live Data & Contextual Integration:',
        text: 'Developed features for both live telemetry simulation and historical CSV data ingestion, alongside a REST API integration (Open-Meteo) to fetch real-time weather data for environmental context.',
      },
      {
        lead: 'Interactive Data Visualization:',
        text: 'Created a responsive, dark-themed maritime UI using Next.js and Tailwind CSS, featuring complex Recharts visualizations that seamlessly combine historical data, future trend lines, and shaded uncertainty ranges.',
      },
    ],
    techStack: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Recharts', 'PapaParse', 'date-fns'],
    concepts: ['Time-series forecasting', 'Anomaly Detection', 'EMA', 'REST API', 'UI/UX Design'],
  },
  {
    title: 'AI Agentic Workflow Orchestration for System Development',
    icon: 'server',
    isOngoing: true,
    link: '/ai-systems-portfolio.pdf',
    linkLabel: 'AI Systems Portfolio',
    description: [
      'A fully local, multi-agent system that orchestrates the software development lifecycle on a single workstation, coordinating planning, coding, testing, and deployment agents through a LangGraph state machine.',
      'Designed a four-agent LangGraph orchestration (Planner, Developer, Tester, Deploy) that decomposes a development task and routes it through a shared state graph, running entirely on local hardware (NVIDIA DGX Spark, GB10, 128 GB unified memory).',
      'Runs open-weight coding models locally through Ollama, with Open WebUI as the interface and Langfuse for end-to-end tracing and observability, all on loopback with no external data exposure during inference.',
      'Built a write-capable tool layer over the Model Context Protocol so agents can read, edit, and execute against a target repository, exposing function-level edit and diff-application tools alongside a test runner.',
      'Designed surgical-mcp-rag, a custom MCP server that performs AST-aware, function-level code retrieval using tree-sitter and ChromaDB, replacing naive whole-file reading with targeted code-chunk retrieval to accelerate codebase comprehension and bug localization.',
      'Kept the pipeline local-first by using on-device embedding models (nomic-embed-text or mxbai-embed-large via Ollama) instead of hosted embedding APIs, preserving the privacy of the codebase.',
      'Integrated the retrieval server as an external tool layer through langchain-mcp-adapters rather than fine-tuning, so the system stays adaptable as the target codebase evolves.',
    ],
    techStack: ['Python', 'LangGraph', 'LangChain', 'Ollama', 'Model Context Protocol (MCP)', 'surgical-mcp-rag', 'FastMCP', 'ChromaDB', 'tree-sitter', 'Langfuse', 'Open WebUI'],
    concepts: ['Multi-agent orchestration', 'Agentic coding', 'Retrieval-Augmented Generation', 'AST parsing', 'Local-first inference', 'Observability'],
  },
  {
    title: 'Jetson Post-Boot — Setup Assistant for NVIDIA Jetson Orin Nano',
    icon: 'cpu',
    link: 'https://github.com/Muhit1204/jetson-postboot',
    description: [
      'A zero-dependency Python assistant that takes a brand-new Jetson Orin Nano Developer Kit from first boot to a production-ready AI workstation, diagnosing the configuration gaps a fresh JetPack 6.x install leaves behind.',
      {
        lead: 'Safe by Default:',
        text: 'Runs read-only inspection first, with an opt-in apply mode for reversible changes only. The tool performs no flashing, firmware, QSPI, or UEFI modification — risky fixes are reported with the exact commands to run manually rather than applied automatically.',
      },
      {
        lead: 'Storage & Boot Diagnostics:',
        text: 'Detects disk space left unreclaimed after an SD-card-to-SSD migration and the boot-order problems that migration commonly introduces, printing the corrective commands for each.',
      },
      {
        lead: 'Memory & Swap Tuning:',
        text: 'Adjusts the factory memory and swap settings that otherwise cap the size of models the board can hold, keeping every change reversible.',
      },
      {
        lead: 'ML Stack Validation:',
        text: 'Confirms the health of the NVIDIA CUDA and AI stack, and can install Ollama while recommending chat models sized to the hardware actually available.',
      },
      {
        lead: 'Reporting & Testing:',
        text: 'Emits categorized reports across system, storage, swap, boot, and ML-stack checks with PASS / WARN / ACTION status per item, and ships a simulation mode plus test suite so the full flow can be exercised without a board attached.',
      },
    ],
    techStack: ['Python 3.8+', 'NVIDIA Jetson Orin Nano', 'JetPack 6.x', 'CUDA', 'Ollama'],
    concepts: ['Edge AI provisioning', 'System diagnostics', 'Safe-by-default tooling', 'Zero-dependency CLI', 'Hardware simulation testing'],
  },
  {
    title: 'ICS-ThreatLens',
    icon: 'database',
    link: 'https://github.com/Muhit1204/ics_threatlens',
    description: [
      'Built a local-first Python CLI that parses public ICS/SCADA security advisories and maps them to MITRE ATT&CK for ICS techniques.',
      'Matches parsed advisories against a private local asset inventory to identify which assets are exposed to a given vulnerability, without exposing the inventory itself.',
      'Generates prioritized Markdown reports ranking advisories by relevance to the operator’s actual asset footprint.',
      'Enforced a strict trust boundary: only public advisory text may be sent to an approved AI parser, while asset inventory, network zones, matching results, and reports stay on the local machine.',
      'Implemented an offline mode using bundled fixtures with no network calls, alongside a configurable live-parsing mode for public advisory text.',
    ],
    techStack: ['Python', 'MITRE ATT&CK for ICS', 'YAML'],
    concepts: ['Local-first security tooling', 'Threat intelligence', 'Asset inventory matching', 'Trust boundary design'],
  },
  {
    title: 'Token Anatomy — Local Claude Code Analytics Dashboard',
    icon: 'server',
    link: 'https://github.com/Muhit1204/token-anatomy',
    description: [
      'Built a pure Python, zero-dependency local dashboard that reads Claude Code session logs and reports exactly where tokens and cost are going.',
      'Implemented daily and all-time cost tracking, cache hit rate analysis, hourly usage heatmaps, per-project cost breakdown, and a searchable chat cost browser.',
      'Added a retrospective layer that clusters sessions by topic and working style, plus a plain-English insights advisor that surfaces usage patterns and suggests improvements.',
      'Kept the tool fully local: it parses session files directly from disk and serves the dashboard on localhost, with no data leaving the machine.',
      'Designed a sticky jump-navigation UI with auto-refresh, so the dashboard updates live without a page reload while a session is active.',
    ],
    techStack: ['Python', 'HTML/CSS/JS', 'SQLite'],
    concepts: ['Log parsing', 'Cost analytics', 'Local-first tooling', 'Data visualization'],
  },
  {
    title: 'Banknote Authentication Using Machine Learning',
    icon: 'database',
    link: 'https://github.com/Muhit1204/BankNote-Authentication-Model',
    description: [
      'Built a classification pipeline simulating edge-device scenarios (like ATMs) to detect counterfeit banknotes with 100% precision.',
      'Extracted 2-D Discrete Wavelet Transform textural features (Variance, Skewness, Kurtosis, Entropy) from high-resolution grayscale captures.',
      'Implemented and compared Decision Tree, KNN, Random Forest, and SVM (RBF) algorithms from scratch in Python to ensure transparency.',
      'Achieved perfect 1.000 F1-scores with KNN and SVM on the UCI held-out test set.',
    ],
  },
];
