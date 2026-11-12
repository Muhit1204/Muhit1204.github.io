export type SkillIconName =
  | 'python' | 'typescript' | 'javascript' | 'php' | 'pandas' | 'numpy'
  | 'react' | 'nextjs' | 'tailwindcss' | 'laravel' | 'git' | 'sqlite'
  | 'database' | 'tree' | 'chart' | 'network' | 'activity' | 'satellite'
  | 'route' | 'map' | 'camera' | 'box' | 'plane' | 'brain' | 'workflow'
  | 'server' | 'search' | 'blocks' | 'link' | 'terminal' | 'code'
  | 'shield' | 'radar' | 'scan' | 'video' | 'drafting';

type SkillCategory = {
  category: string;
  tools: { name: string; icon: SkillIconName }[];
};

export const skills: SkillCategory[] = [
  { category: 'Languages', tools: [
    { name: 'Python', icon: 'python' },
    { name: 'TypeScript', icon: 'typescript' },
    { name: 'JavaScript', icon: 'javascript' },
    { name: 'PHP', icon: 'php' },
    { name: 'SQL', icon: 'database' },
  ] },
  { category: 'Machine Learning & Data', tools: [
    { name: 'Random Forest', icon: 'tree' },
    { name: 'SVM', icon: 'chart' },
    { name: 'KNN', icon: 'network' },
    { name: 'Decision Trees', icon: 'workflow' },
    { name: 'Time-Series Forecasting', icon: 'activity' },
    { name: 'Pandas', icon: 'pandas' },
    { name: 'NumPy', icon: 'numpy' },
  ] },
  { category: 'Networking & Simulation', tools: [
    { name: 'NS-3', icon: 'network' },
    { name: 'Wireshark', icon: 'activity' },
    { name: 'Delay Tolerant Networking', icon: 'route' },
    { name: 'LEO Satellite Link Modeling', icon: 'satellite' },
    { name: 'Routing Analysis', icon: 'route' },
  ] },
  { category: 'Geospatial & UAS', tools: [
    { name: 'ArcGIS Pro', icon: 'map' },
    { name: 'ArcGIS Online', icon: 'map' },
    { name: 'Pix4Dmapper', icon: 'camera' },
    { name: 'Photogrammetry', icon: 'camera' },
    { name: 'Open3D', icon: 'box' },
    { name: 'UAS Flight Operations', icon: 'plane' },
  ] },
  { category: 'LLMs & Multi-Model Orchestration', tools: [
    { name: 'Large Language Models (LLMs)', icon: 'brain' },
    { name: 'OmniRoute', icon: 'route' },
    { name: 'Multi-model agent workflows', icon: 'workflow' },
    { name: 'Local & hosted inference', icon: 'server' },
    { name: 'Retrieval-Augmented Generation', icon: 'search' },
  ] },
  { category: 'AI & Agentic Systems', tools: [
    { name: 'LangGraph', icon: 'workflow' },
    { name: 'LangChain', icon: 'link' },
    { name: 'Ollama', icon: 'terminal' },
    { name: 'Model Context Protocol (MCP)', icon: 'blocks' },
    { name: 'ChromaDB', icon: 'database' },
    { name: 'tree-sitter', icon: 'code' },
    { name: 'Langfuse', icon: 'radar' },
  ] },
  { category: 'MCP Servers', tools: [
    { name: 'Higgsfield MCP', icon: 'video' },
    { name: 'Novamira MCP', icon: 'blocks' },
    { name: 'Autodesk MCP Server', icon: 'drafting' },
    { name: 'surgical-mcp-rag', icon: 'search' },
    { name: 'FastMCP', icon: 'server' },
    { name: 'langchain-mcp-adapters', icon: 'link' },
  ] },
  { category: 'Web & Tooling', tools: [
    { name: 'React', icon: 'react' },
    { name: 'Next.js', icon: 'nextjs' },
    { name: 'Tailwind CSS', icon: 'tailwindcss' },
    { name: 'Recharts', icon: 'chart' },
    { name: 'Laravel', icon: 'laravel' },
    { name: 'Git', icon: 'git' },
    { name: 'SQLite', icon: 'sqlite' },
  ] },
  { category: 'Security', tools: [
    { name: 'MITRE ATT&CK for ICS', icon: 'shield' },
    { name: 'ICS/SCADA Security', icon: 'shield' },
    { name: 'Threat Intelligence', icon: 'radar' },
    { name: 'Spoofing & Data Integrity Analysis', icon: 'scan' },
  ] },
];
