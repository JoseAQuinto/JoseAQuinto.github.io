import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { scrollToSection } from "../sectionNav";

type SectionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  onNavigate?: () => void;
};

export function SectionLink({
  to,
  onNavigate,
  onClick,
  children,
  ...rest
}: SectionLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    // Primero se cierra lo que haya que cerrar (p. ej. el menú móvil) y se
    // desplaza en el siguiente frame, cuando el layout ya es el definitivo.
    onNavigate?.();
    window.requestAnimationFrame(() => scrollToSection(to));
  };

  return (
    <a href={`#${to}`} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
