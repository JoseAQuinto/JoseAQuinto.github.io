import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";

/**
 * Letras ligadas al scroll.
 * - "settle" (efecto E): cada letra empieza desplazada y girada al azar y se
 *   ordena en su sitio.
 * - "drop" (efecto G): las letras caen una tras otra y se apilan, como cajas
 *   sobre un palé.
 *
 * El texto completo queda disponible para lectores de pantalla; las letras
 * animadas van ocultas para ellos.
 */

// Pseudoaleatorio determinista: la misma letra siempre parte del mismo sitio.
function seeded(index: number, salt: number) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function Letter({
  char,
  index,
  total,
  mode,
  progress,
}: {
  char: string;
  index: number;
  total: number;
  mode: "settle" | "drop";
  progress: MotionValue<number>;
}) {
  const settleX = (seeded(index, 1) - 0.5) * 160;
  const settleY = (seeded(index, 2) - 0.5) * 140;
  const settleR = (seeded(index, 3) - 0.5) * 70;

  // En "drop" cada letra tiene su propio tramo del progreso.
  const start = (index / total) * 0.6;
  const end = start + 0.4;

  const x = useTransform(progress, [0, 1], mode === "settle" ? [settleX, 0] : [0, 0]);
  const y = useTransform(
    progress,
    mode === "settle" ? [0, 1] : [start, end],
    mode === "settle" ? [settleY, 0] : [-90, 0]
  );
  const rotate = useTransform(
    progress,
    mode === "settle" ? [0, 1] : [start, end],
    mode === "settle" ? [settleR, 0] : [(seeded(index, 4) - 0.5) * 24, 0]
  );
  const opacity = useTransform(
    progress,
    mode === "settle" ? [0, 0.4] : [start, start + 0.12],
    [0, 1]
  );

  return (
    <motion.span
      className="lab-letter"
      style={{ x, y, rotate, opacity }}
    >
      {char === " " ? " " : char}
    </motion.span>
  );
}

export default function ScrollLetters({
  text,
  mode,
  progress,
}: {
  text: string;
  mode: "settle" | "drop";
  progress: MotionValue<number>;
}) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <>{text}</>;

  const chars = Array.from(text);
  return (
    <>
      <span className="pf-sr-only">{text}</span>
      <span aria-hidden="true" className="lab-letters">
        {chars.map((char, index) => (
          <Letter
            key={index}
            char={char}
            index={index}
            total={chars.length}
            mode={mode}
            progress={progress}
          />
        ))}
      </span>
    </>
  );
}
