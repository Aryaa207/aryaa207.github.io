import { atom } from 'nanostores';
import type { Lens } from '../types';
export const lenses: Lens[] = ['all', 'gnc', 'cfd', 'embedded'];
export const parseLens = (value: string | null): Lens => lenses.includes(value as Lens) ? value as Lens : 'all';
export const lens = atom<Lens>('all');
export const positioning: Record<Lens, string> = {
  all: 'B.S. Aerospace Engineering · Florida Tech · GPA 3.8 / 4.0 · Class of 2027.',
  gnc: 'Guidance, navigation & control · MATLAB · PN / APN · Monte Carlo analysis.',
  cfd: 'Computational fluid dynamics · ANSYS Fluent · External aerodynamics.',
  embedded: 'Embedded systems · Python · Raspberry Pi · Sensor acquisition · Computer vision.',
};
