import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
export default [
 {ignores:['archive/**','dist/**','node_modules/**','.astro/**','playwright-report/**','test-results/**','src/content/**','public/**']},
 js.configs.recommended,...tseslint.configs.recommended,...astro.configs.recommended,
 {files:['**/*.{ts,js,mjs,astro}'],languageOptions:{globals:{console:'readonly',process:'readonly',document:'readonly',window:'readonly',navigator:'readonly',HTMLElement:'readonly',customElements:'readonly',ResizeObserver:'readonly',IntersectionObserver:'readonly',devicePixelRatio:'readonly',requestAnimationFrame:'readonly',cancelAnimationFrame:'readonly',matchMedia:'readonly',location:'readonly',history:'readonly',URL:'readonly',URLSearchParams:'readonly'}},rules:{'no-undef':'off','@typescript-eslint/no-unused-vars':['error',{argsIgnorePattern:'^_',caughtErrorsIgnorePattern:'^_'}]}},
];
