import type { AirfoilParameters } from '../../types';
export interface Complex { re: number; im: number }
const c = (re: number, im = 0): Complex => ({ re, im });
const add = (a: Complex, b: Complex) => c(a.re + b.re, a.im + b.im);
const sub = (a: Complex, b: Complex) => c(a.re - b.re, a.im - b.im);
const mul = (a: Complex, b: Complex) => c(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
const div = (a: Complex, b: Complex) => { const d = b.re ** 2 + b.im ** 2; return c((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d); };
const abs = (a: Complex) => Math.hypot(a.re, a.im);
const exp = (angle: number) => c(Math.cos(angle), Math.sin(angle));
const sqrt = (a: Complex) => { const r = abs(a); return c(Math.sqrt(Math.max(0, (r + a.re) / 2)), (a.im < 0 ? -1 : 1) * Math.sqrt(Math.max(0, (r - a.re) / 2))); };
export const defaults: AirfoilParameters = { alpha: 5, x0: -0.12, y0: 0.08, b: 1, speed: 1 };
export function geometry(p: AirfoilParameters) {
  const a = Math.hypot(p.b - p.x0, p.y0), beta = Math.asin(p.y0 / a), alpha = p.alpha * Math.PI / 180;
  return { a, beta, alpha, gamma: 4 * Math.PI * p.speed * a * Math.sin(alpha + beta) };
}
export function map(zeta: Complex, b = 1): Complex { return add(zeta, div(c(b * b), zeta)); }
export function inverse(z: Complex, p: AirfoilParameters): Complex | null {
  const discriminant = sqrt(sub(mul(z, z), c(4 * p.b * p.b)));
  const roots = [mul(add(z, discriminant), c(0.5)), mul(sub(z, discriminant), c(0.5))];
  const { a } = geometry(p);
  // Explicitly test both roots across the principal square root's branch cut.
  return roots.find(r => abs(sub(r, c(p.x0, p.y0))) >= a * (1 - 1e-9)) ?? null;
}
export function surface(p: AirfoilParameters, count = 300): Complex[] {
  const { a, beta } = geometry(p);
  return Array.from({ length: count + 1 }, (_, i) => map(add(c(p.x0, p.y0), mul(c(a), exp(2 * Math.PI * i / count - beta))), p.b));
}
export function potential(zeta: Complex, p: AirfoilParameters): Complex {
  const { a, alpha, gamma } = geometry(p), q = sub(zeta, c(p.x0, p.y0));
  return add(mul(c(p.speed), add(mul(q, exp(-alpha)), div(mul(c(a * a), exp(alpha)), q))), mul(c(0, gamma / (2 * Math.PI)), c(Math.log(abs(q)), Math.atan2(q.im, q.re))));
}
export function velocityAtZeta(input: Complex, p: AirfoilParameters): Complex {
  let zeta = input;
  if (abs(sub(zeta, c(p.b))) < 1e-6) zeta = add(zeta, c(1e-6, 1e-6));
  const { a, alpha, gamma } = geometry(p), q = sub(zeta, c(p.x0, p.y0));
  const numerator = add(mul(c(p.speed), sub(exp(-alpha), div(mul(c(a * a), exp(alpha)), mul(q, q)))), div(c(0, gamma / (2 * Math.PI)), q));
  return div(numerator, sub(c(1), div(c(p.b * p.b), mul(zeta, zeta))));
}
export function velocity(z: Complex, p: AirfoilParameters): Complex | null {
  const zeta = inverse(z, p); if (!zeta) return null;
  const w = velocityAtZeta(zeta, p); return c(w.re, -w.im);
}
export function metrics(p: AirfoilParameters) {
  const points = surface(p, 800), chord = Math.max(...points.map(z => z.re)) - Math.min(...points.map(z => z.re));
  const { a, beta, gamma } = geometry(p);
  const cp = Array.from({ length: 500 }, (_, i) => {
    const zeta = add(c(p.x0, p.y0), mul(c(a), exp(2 * Math.PI * (i + 0.5) / 500 - beta)));
    return 1 - abs(velocityAtZeta(zeta, p)) ** 2 / p.speed ** 2;
  });
  return { chord, cl: 2 * gamma / (p.speed * chord), cpMin: Math.min(...cp) };
}
export function rk4(point: Complex, dt: number, p: AirfoilParameters): Complex | null {
  const k1 = velocity(point, p); if (!k1) return null;
  const k2 = velocity(add(point, mul(k1, c(dt / 2))), p); if (!k2) return null;
  const k3 = velocity(add(point, mul(k2, c(dt / 2))), p); if (!k3) return null;
  const k4 = velocity(add(point, mul(k3, c(dt))), p); if (!k4) return null;
  return add(point, mul(add(add(k1, mul(k2, c(2))), add(mul(k3, c(2)), k4)), c(dt / 6)));
}
