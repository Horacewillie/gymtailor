import { type RefObject, useEffect } from "react";

const HEIGHT_VAR = "--member-vv-height";
const OFFSET_VAR = "--member-vv-offset";

/**
 * Keeps a fixed full-screen layer matched to the *visual* viewport (mobile keyboard / iOS Chrome).
 * Expects CSS on the element, e.g. `height: var(--member-vv-height, 100dvh); top: var(--member-vv-offset, 0);`
 */
export function useBindVisualViewportToElement(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const vv = window.visualViewport;
    const el = ref.current;
    if (!vv || !el) return;

    const apply = () => {
      el.style.setProperty(HEIGHT_VAR, `${vv.height}px`);
      el.style.setProperty(OFFSET_VAR, `${vv.offsetTop}px`);
    };

    apply();
    vv.addEventListener("resize", apply);
    vv.addEventListener("scroll", apply);
    return () => {
      vv.removeEventListener("resize", apply);
      vv.removeEventListener("scroll", apply);
      el.style.removeProperty(HEIGHT_VAR);
      el.style.removeProperty(OFFSET_VAR);
    };
  }, [ref]);
}
