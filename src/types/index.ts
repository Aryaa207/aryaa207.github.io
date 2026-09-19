export type Lens = 'all' | 'gnc' | 'cfd' | 'embedded';
export interface ProofPoint { value: string; label: string; project: string; lenses: Lens[] }
export interface FigureProps { src: string; alt: string; caption: string; width?: number; height?: number }
export interface ModelViewerProps { src: string; poster?: string; label: string; bytes: number }
export interface ResumeViewerProps { src: string; title: string }
export interface AirfoilParameters { alpha: number; x0: number; y0: number; b: number; speed: number }
export interface ProjectMeta { title: string; summary: string; role: string; period: string; lenses: Exclude<Lens, 'all'>[]; tools: string[]; status: string; source: string; missing: string[]; specs: { label: string; value: string }[] }
