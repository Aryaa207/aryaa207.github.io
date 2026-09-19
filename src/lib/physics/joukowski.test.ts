import { describe, it, expect } from 'vitest';
import { defaults, geometry, metrics, potential, velocityAtZeta, inverse, map } from './joukowski';
describe('Joukowski potential flow', () => {
  it('has zero lift at negative camber angle', () => { const p = { ...defaults }; p.alpha = -geometry(p).beta * 180 / Math.PI; expect(metrics(p).cl).toBeCloseTo(0, 10); });
  it('approaches the thin-airfoil 2π lift slope', () => { const p = { ...defaults, x0: -0.00001, y0: 0, alpha: 0.001 }; expect(metrics(p).cl / (p.alpha * Math.PI / 180)).toBeCloseTo(2 * Math.PI, 3); });
  it('has slightly larger lift slope for finite thickness', () => { const p = { ...defaults, y0: 0, alpha: 0.001 }; expect(metrics(p).cl / (p.alpha * Math.PI / 180)).toBeGreaterThan(2 * Math.PI); });
  it('keeps the surface on a streamline', () => { const { a } = geometry(defaults); const values = Array.from({length:100},(_,i)=>potential({re:defaults.x0+a*Math.cos(i/100*2*Math.PI),im:defaults.y0+a*Math.sin(i/100*2*Math.PI)},defaults).im); expect(Math.max(...values)-Math.min(...values)).toBeLessThan(1e-10); });
  it('has finite velocity at the trailing edge', () => { const v = velocityAtZeta({re:1,im:0},defaults); expect(Number.isFinite(v.re)&&Number.isFinite(v.im)).toBe(true); expect(Math.hypot(v.re,v.im)).toBeLessThan(5); });
  it('inverts exterior points on both sides of the branch cut', () => { for(const zeta of [{re:-3,im:0.01},{re:-3,im:-0.01},{re:2,im:1}]) { const r=inverse(map(zeta),defaults)!; expect(r.re).toBeCloseTo(zeta.re,8); expect(r.im).toBeCloseTo(zeta.im,8); } });
});
