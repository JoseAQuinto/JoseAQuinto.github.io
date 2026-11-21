/**
 * Navegación a secciones dentro de la portada.
 *
 * La app usa HashRouter: un href="#about" convertiría el hash en la ruta
 * "/about" y dependería de la redirección "*" → "/" para no romperse. Aquí
 * se intercepta el clic, se desplaza la vista y se mueve el foco a la
 * sección (accesible por teclado y lector de pantalla) sin tocar la ruta.
 */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";
  if (id === "hero" || id === "gallery-top") {
    window.scrollTo({ top: 0, behavior });
  } else {
    target.scrollIntoView({ behavior, block: "start" });
  }

  if (!target.hasAttribute("tabindex")) {
    target.setAttribute("tabindex", "-1");
  }
  target.focus({ preventScroll: true });
}
