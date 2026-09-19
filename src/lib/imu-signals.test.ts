import { describe,it,expect } from 'vitest';
import { AngleFilter,orientation } from './imu-signals';
describe('IMU demonstration',()=>{
 it('tracks a constant angular rate in degrees per second without unit drift',()=>{const filter=new AngleFilter();let value=0;for(let i=1;i<=300;i++)value=filter.update(i/30*6,6,1/30);expect(value).toBeCloseTo(60,5);});
 it('stays finite through all demonstration motion modes',()=>{for(const mode of ['combined','roll','pitch','yaw'] as const){const filter=new AngleFilter();let previous=orientation(0,mode)[0];for(let i=1;i<=1800;i++){const current=orientation(i/30,mode)[0];const output=filter.update(current+Math.sin(i)*3,(current-previous)*30,1/30);expect(Number.isFinite(output)).toBe(true);expect(Math.abs(output-current)).toBeLessThan(2);previous=current;}}});
 it('ignores a zero elapsed interval',()=>{const filter=new AngleFilter();expect(filter.update(20,10,0)).toBe(0);});
});
