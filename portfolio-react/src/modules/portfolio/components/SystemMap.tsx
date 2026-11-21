import type { CSSProperties } from "react";

type SystemMapProps = {
  copy: {
    title: string;
    hint: string;
    modules: readonly { name: string; detail: string }[];
    layers: readonly { name: string; tech: string }[];
  };
};

type IndexStyle = CSSProperties & { "--pf-i": number };

/**
 * Pieza central del hero: un "plano" de los sistemas en los que trabajo.
 * Arriba, los módulos de negocio (como zonas de un almacén); debajo, separadas
 * por el pasillo de suelo, las capas técnicas que toco en cada uno. La última
 * capa (integración) va con borde discontinuo porque conecta con sistemas
 * externos (ERP, colas).
 */
export default function SystemMap({ copy }: SystemMapProps) {
  const lastLayer = copy.layers.length - 1;

  return (
    <figure className="pf-map" aria-labelledby="pf-map-title">
      <figcaption className="pf-map__caption">
        <span id="pf-map-title" className="pf-map__title">
          {copy.title}
        </span>
        <span className="pf-map__hint">{copy.hint}</span>
      </figcaption>

      <ul className="pf-map__modules">
        {copy.modules.map((module, index) => (
          <li
            key={module.name}
            className="pf-map__module"
            style={{ "--pf-i": index } as IndexStyle}
          >
            <span className="pf-map__module-name">{module.name}</span>
            <span className="pf-map__module-detail">{module.detail}</span>
          </li>
        ))}
      </ul>

      <div className="pf-map__aisle" aria-hidden="true" />

      <ul className="pf-map__layers">
        {copy.layers.map((layer, index) => (
          <li
            key={layer.name}
            className={`pf-map__layer${
              index === lastLayer ? " pf-map__layer--external" : ""
            }`}
            style={{ "--pf-i": copy.modules.length + index } as IndexStyle}
          >
            <span className="pf-map__layer-name">{layer.name}</span>
            <span className="pf-map__layer-tech">{layer.tech}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
