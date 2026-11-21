type LabBadgeProps = {
  letter: string;
  name: string;
  tone?: "light" | "dark";
};

/**
 * Etiqueta del laboratorio de efectos: identifica qué efecto se está viendo
 * en cada sección para poder elegirlo. Solo existe en la rama de exploración.
 */
export default function LabBadge({ letter, name, tone = "light" }: LabBadgeProps) {
  return (
    <p className={`lab-badge lab-badge--${tone}`}>
      <span className="lab-badge__letter">{letter}</span>
      {name}
    </p>
  );
}
