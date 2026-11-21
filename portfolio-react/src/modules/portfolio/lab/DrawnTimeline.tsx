import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";

type Area = { name: string; text: string };
type Role = { period: string; title: string; org: string; areas: readonly Area[] };

/**
 * Efecto D: línea temporal que se dibuja. Una línea ámbar baja junto a los
 * puestos siguiendo el scroll y cada área se "enciende" cuando la línea la
 * alcanza.
 */
function RevealArea({ area }: { area: Area }) {
  const ref = useRef<HTMLLIElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.55"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.15, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [18, 0]);
  const border = useTransform(
    scrollYProgress,
    [0, 1],
    ["rgba(240,162,2,0)", "rgba(240,162,2,1)"]
  );

  return (
    <motion.li
      ref={ref}
      className="pf-area"
      style={reduceMotion ? undefined : { opacity, x, borderLeftColor: border }}
    >
      <h4 className="pf-area__name">{area.name}</h4>
      <p className="pf-area__text">{area.text}</p>
    </motion.li>
  );
}

function RoleDot({ progress, at }: { progress: MotionValue<number>; at: number }) {
  const background = useTransform(
    progress,
    [Math.max(0, at - 0.02), at],
    ["#c9d2d5", "#f0a202"]
  );
  return (
    <motion.span className="lab-timeline__dot" aria-hidden="true" style={{ background }} />
  );
}

export default function DrawnTimeline({ roles }: { roles: readonly Role[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.6", "end 0.6"],
  });

  return (
    <div ref={ref} className="pf-xp__timeline lab-timeline">
      <span className="lab-timeline__rail" aria-hidden="true">
        <motion.span
          className="lab-timeline__progress"
          style={{ scaleY: reduceMotion ? 1 : scrollYProgress }}
        />
      </span>
      <ol>
      {roles.map((role, index) => (
        <li key={role.period} className="pf-role lab-timeline__role">
          <RoleDot progress={scrollYProgress} at={index === 0 ? 0.02 : 0.97} />
          <p className="pf-role__period">{role.period}</p>
          <div>
            <h3 className="pf-h3">{role.title}</h3>
            <p className="pf-role__org">{role.org}</p>
            {role.areas.length > 0 && (
              <ul className="pf-areas">
                {role.areas.map((area) => (
                  <RevealArea key={area.name} area={area} />
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
      </ol>
    </div>
  );
}
