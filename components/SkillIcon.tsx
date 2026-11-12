import Image from 'next/image';
import {
  Activity, Blocks, Box, BrainCircuit, Camera, ChartNoAxesCombined,
  Code, Database, DraftingCompass, GitBranch, Link, Map, Network,
  Plane, Radar, Route, Satellite, ScanLine, Search, Server, Shield,
  Terminal, Trees, Video,
} from 'lucide-react';
import type { SkillIconName } from '@/lib/skills';

const symbols = {
  database: Database, tree: Trees, chart: ChartNoAxesCombined,
  network: Network, activity: Activity, satellite: Satellite, route: Route,
  map: Map, camera: Camera, box: Box, plane: Plane, brain: BrainCircuit,
  workflow: GitBranch, server: Server, search: Search, blocks: Blocks,
  link: Link, terminal: Terminal, code: Code, shield: Shield, radar: Radar,
  scan: ScanLine, video: Video, drafting: DraftingCompass,
};

export default function SkillIcon({ name }: { name: SkillIconName }) {
  if (name in symbols) {
    const Icon = symbols[name as keyof typeof symbols];
    return <Icon aria-hidden="true" className="w-8 h-8 md:w-10 md:h-10 shrink-0 text-accent" strokeWidth={1.5} />;
  }
  return (
    <Image
      src={`/icons/skills/${name}.svg`}
      alt=""
      aria-hidden="true"
      width={40}
      height={40}
      className="w-8 h-8 md:w-10 md:h-10 shrink-0 object-contain"
    />
  );
}
