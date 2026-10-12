// The site's motion, following the Motion board: smooth and continuous, one signature
// moment per page, everything else nearly invisible. Text is readable from the first
// frame, nothing loops for attention, and with reduced motion everything is instant.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { flowPath } from "../lib/flowlines";

gsap.registerPlugin(ScrollTrigger, SplitText);

/** Motion tokens from the board, in seconds. */
export const T = { fast: 0.15, base: 0.3, slow: 0.6, signature: 1.1, stagger: 0.045 };
export const EASE = { enter: "expo.out", move: "power2.inOut" };

export const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger, SplitText };

/** Page titles: revealed line by line from behind a mask, once. */
function titles() {
  document.querySelectorAll<HTMLElement>("[data-title]").forEach((el) => {
    SplitText.create(el, {
      type: "lines",
      mask: "lines",
      linesClass: "title-line",
      autoSplit: true,
      onSplit: (self) => gsap.from(self.lines, { yPercent: 100, duration: T.slow, ease: EASE.enter, stagger: 0.06, delay: 0.05 }),
    });
    gsap.set(el, { opacity: 1 });
  });
}

/** Sections ease in once as they reach the viewport: 16px of travel and a fade. */
function reveals() {
  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
    // Opacity only: visibility would hide the section from screen readers until it's scrolled to.
    gsap.fromTo(el, { opacity: 0, y: 16 }, {
      opacity: 1, y: 0, duration: T.slow, ease: EASE.enter, clearProps: "transform",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });
}

/**
 * Flowlines that settle: the stripes start straight and swirl into place, by
 * redrawing the pattern with the swirl turned up from 0 to its full strength.
 */
export function settle(svg: SVGSVGElement, opts: { duration?: number; from?: number; delay?: number } = {}) {
  const path = svg.querySelector("path");
  const { seed, w, h, period } = svg.dataset;
  if (!path || !seed || !w || !h) return;
  const base = { width: +w, height: +h, seed, period: period ? +period : undefined };
  const state = { s: opts.from ?? 0.15 };
  const draw = () => path.setAttribute("d", flowPath({ ...base, swirl: state.s }));
  draw();
  return gsap.to(state, { s: 1, duration: opts.duration ?? T.signature, delay: opts.delay ?? 0, ease: EASE.enter, onUpdate: draw });
}

/** A slow drift on hover: the swirl tightens a little, and lets go on leave. */
function drift(svg: SVGSVGElement, host: HTMLElement) {
  const path = svg.querySelector("path");
  const { seed, w, h } = svg.dataset;
  if (!path || !seed || !w || !h) return;
  const state = { s: 1 };
  const draw = () => path.setAttribute("d", flowPath({ width: +w, height: +h, seed, swirl: state.s }));
  host.addEventListener("mouseenter", () => gsap.to(state, { s: 1.14, duration: T.slow * 1.5, ease: EASE.move, onUpdate: draw, overwrite: true }));
  host.addEventListener("mouseleave", () => gsap.to(state, { s: 1, duration: T.slow * 1.5, ease: EASE.move, onUpdate: draw, overwrite: true }));
}

function flowlines() {
  document.querySelectorAll<SVGSVGElement>("svg[data-settle]").forEach((svg) => {
    ScrollTrigger.create({ trigger: svg, start: "top 95%", once: true, onEnter: () => settle(svg) });
  });
  document.querySelectorAll<SVGSVGElement>("svg[data-drift]").forEach((svg) => drift(svg, svg.closest("a") ?? (svg.parentElement as HTMLElement)));
}

if (!reduced()) {
  titles();
  reveals();
  flowlines();
}
document.documentElement.classList.add("motion-ready");
