import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";

type Copy = {
  title: string;
  hint: string;
  modules: readonly { name: string; detail: string }[];
  layers: readonly { name: string; tech: string }[];
};

type Props = {
  copy: Copy;
  /** 0 = hero en su sitio, 1 = hero fuera de la vista por arriba. */
  progress: MotionValue<number>;
};

/**
 * Efecto A: vista explosionada. Al bajar, los módulos suben y se separan,
 * la cinta del pasillo se estira y las capas técnicas bajan escalonadas,
 * como el despiece de un plano.
 */
function Module({
  module,
  index,
  total,
  progress,
}: {
  module: Copy["modules"][number];
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const centre = (total - 1) / 2;
  const y = useTransform(progress, [0, 0.8], [0, -46 - index * 6]);
  const x = useTransform(progress, [0, 0.8], [0, (index - centre) * 14]);
  const rotate = useTransform(progress, [0, 0.8], [0, (index - centre) * 2.5]);
  return (
    <motion.li className="pf-map__module" style={{ y, x, rotate }}>
      <span className="pf-map__module-name">{module.name}</span>
      <span className="pf-map__module-detail">{module.detail}</span>
    </motion.li>
  );
}

function Layer({
  layer,
  index,
  external,
  progress,
}: {
  layer: Copy["layers"][number];
  index: number;
  external: boolean;
  progress: MotionValue<number>;
}) {
  const y = useTransform(progress, [0, 0.8], [0, 18 + index * 22]);
  const x = useTransform(progress, [0, 0.8], [0, index * 10]);
  return (
    <motion.li
      className={`pf-map__layer${external ? " pf-map__layer--external" : ""}`}
      style={{ y, x }}
    >
      <span className="pf-map__layer-name">{layer.name}</span>
      <span className="pf-map__layer-tech">{layer.tech}</span>
    </motion.li>
  );
}

export default function ExplodedSystemMap({ copy, progress }: Props) {
  const reduceMotion = useReducedMotion();
  const still = useTransform(progress, () => 0);
  const p = reduceMotion ? still : progress;
  const tapeScale = useTransform(p, [0, 0.8], [1, 1.12]);
  const last = copy.layers.length - 1;

  return (
    <figure className="pf-map lab-map" aria-labelledby="pf-map-title">
      <figcaption className="pf-map__caption">
        <span id="pf-map-title" className="pf-map__title">
          {copy.title}
        </span>
        <span className="pf-map__hint">{copy.hint}</span>
      </figcaption>

      <ul className="pf-map__modules">
        {copy.modules.map((module, index) => (
          <Module
            key={module.name}
            module={module}
            index={index}
            total={copy.modules.length}
            progress={p}
          />
        ))}
      </ul>

      <motion.div
        className="pf-map__aisle"
        aria-hidden="true"
        style={{ scaleX: tapeScale }}
      />

      <ul className="pf-map__layers">
        {copy.layers.map((layer, index) => (
          <Layer
            key={layer.name}
            layer={layer}
            index={index}
            external={index === last}
            progress={p}
          />
        ))}
      </ul>
    </figure>
  );
}
