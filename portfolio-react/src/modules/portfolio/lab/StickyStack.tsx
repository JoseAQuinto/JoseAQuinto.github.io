import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  createRef,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

/**
 * Efecto B: paneles apilados. Cada panel se queda fijo y el siguiente se
 * desliza por encima; el de debajo retrocede un poco.
 *
 * Los paneles son más altos que la pantalla, así que el "top" del sticky se
 * calcula para que se fijen cuando su parte inferior llega al borde de la
 * ventana: así nunca se oculta contenido.
 */
function StackItem({
  children,
  ownRef,
  nextRef,
}: {
  children: ReactNode;
  ownRef: RefObject<HTMLDivElement | null>;
  nextRef?: RefObject<HTMLDivElement | null>;
}) {
  const [top, setTop] = useState(84);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    const element = ownRef.current;
    if (!element) return;
    const update = () => {
      const fits = window.innerHeight - element.offsetHeight - 24;
      setTop(Math.min(84, fits));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [ownRef]);

  // Progreso del panel siguiente mientras sube sobre este.
  const { scrollYProgress } = useScroll({
    target: nextRef ?? ownRef,
    offset: ["start end", "start start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const filter = useTransform(
    scrollYProgress,
    [0, 1],
    ["brightness(1)", "brightness(0.86)"]
  );
  const animated = Boolean(nextRef) && !reduceMotion;

  return (
    <div
      ref={ownRef}
      className="lab-stack__item"
      style={reduceMotion ? undefined : { position: "sticky", top }}
    >
      <motion.div
        style={
          animated ? { scale, filter, transformOrigin: "50% 0%" } : undefined
        }
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function StickyStack({ items }: { items: ReactNode[] }) {
  const count = items.length;
  const refs = useMemo(
    () => Array.from({ length: count }, () => createRef<HTMLDivElement>()),
    [count]
  );

  return (
    <div className="lab-stack">
      {items.map((item, index) => (
        <StackItem key={index} ownRef={refs[index]} nextRef={refs[index + 1]}>
          {item}
        </StackItem>
      ))}
    </div>
  );
}
