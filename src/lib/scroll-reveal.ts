// Progressive enhancement: content is visible without JavaScript and on focus.
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const elements = [...document.querySelectorAll<HTMLElement>('.section-heading, .project-card, .experiment-copy, .airfoil-lab, .about-grid > div, .skill-card, .research-note, .contact-section h2, .contact-section > .container > .eyebrow, .contact-section > .container > p:not(.copy-status)')];
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) {
    entry.target.classList.add('revealed');
    observer.unobserve(entry.target);
  }
}, { threshold: 0.06, rootMargin: '0px 0px -35px 0px' });
for (const element of elements) {
  if (!motion.matches && element.getBoundingClientRect().top > innerHeight - 35) {
    element.classList.add('scroll-reveal');
    observer.observe(element);
  }
  element.addEventListener('focusin', () => element.classList.add('revealed'));
}
motion.addEventListener('change', () => {
  if (motion.matches) { elements.forEach(el => el.classList.add('revealed')); observer.disconnect(); }
});
