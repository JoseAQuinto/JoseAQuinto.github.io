import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";

function seeded(index: number, salt: number) {
  const value = Math.sin(index * 91.17 + salt * 13.73) * 24634.6345;
  return value - Math.floor(value);
}

function Tag({
  label,
  strong,
  index,
  progress,
}: {
  label: string;
  strong: boolean;
  index: number;
  progress: MotionValue<number>;
}) {
  const x = useTransform(progress, [0, 1], [(seeded(index, 1) - 0.5) * 220, 0]);
  const y = useTransform(progress, [0, 1], [(seeded(index, 2) - 0.5) * 120, 0]);
  const rotate = useTransform(progress, [0, 1], [(seeded(index, 3) - 0.5) * 40, 0]);
  const opacity = useTransform(progress, [0, 0.5], [0, 1]);
  return (
    <motion.li
      className={`pf-tag${strong ? " pf-tag--strong" : ""}`}
      style={{ x, y, rotate, opacity }}
    >
      {label}
    </motion.li>
  );
}

/** Efecto E (etiquetas): las tecnologías llegan desordenadas y se colocan. */
export default function ScatterTags({
  core,
  extra,
  progress,
  offset,
}: {
  core: readonly string[];
  extra: readonly string[];
  progress: MotionValue<number>;
  offset: number;
}) {
  const reduceMotion = useReducedMotion();
  const all = [
    ...core.map((label) => ({ label, strong: true })),
    ...extra.map((label) => ({ label, strong: false })),
  ];

  if (reduceMotion) {
    return (
      <ul className="pf-tags">
        {all.map((tag) => (
          <li key={tag.label} className={`pf-tag${tag.strong ? " pf-tag--strong" : ""}`}>
            {tag.label}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="pf-tags">
      {all.map((tag, index) => (
        <Tag
          key={tag.label}
          label={tag.label}
          strong={tag.strong}
          index={offset + index}
          progress={progress}
        />
      ))}
    </ul>
  );
}
