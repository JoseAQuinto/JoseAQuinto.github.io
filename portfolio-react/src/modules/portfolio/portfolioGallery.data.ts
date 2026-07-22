export type GalleryLanguage = "es" | "en";

type LocalizedText = Record<GalleryLanguage, string>;

export type PortfolioShowcase = {
  id: string;
  number: string;
  title: string;
  category: LocalizedText;
  description: LocalizedText;
  url: string;
  domain: string;
  previewImage?: string;
};

export const PORTFOLIO_SHOWCASES: readonly PortfolioShowcase[] = [
  {
    id: "cabin-crew",
    number: "01",
    title: "Cabin Crew",
    category: {
      es: "Portfolio profesional · Aviación",
      en: "Professional portfolio · Aviation",
    },
    description: {
      es: "Una presentación profesional para un perfil de tripulante de cabina, pensada para ordenar experiencia, competencias e idiomas con una navegación clara y directa.",
      en: "A professional presentation for a cabin crew profile, designed to organize experience, skills and languages through clear, direct navigation.",
    },
    url: "https://portfoliowebcabincrew.netlify.app/",
    domain: "portfoliowebcabincrew.netlify.app",
    previewImage: "https://portfoliowebcabincrew.netlify.app/assets/images/og-image.png",
  },
  {
    id: "event-planner",
    number: "02",
    title: "Event Planner",
    category: {
      es: "Portfolio profesional · Eventos",
      en: "Professional portfolio · Events",
    },
    description: {
      es: "Portfolio para una coordinadora internacional de eventos, con una narrativa centrada en planificación, hospitalidad y experiencias memorables.",
      en: "A portfolio for an international event coordinator, with a narrative focused on planning, hospitality and memorable experiences.",
    },
    url: "https://portfoliowebeventplanner.netlify.app/",
    domain: "portfoliowebeventplanner.netlify.app",
  },
  {
    id: "event-planner-proposal-2",
    number: "03",
    title: "Event Planner · Proposal 2",
    category: {
      es: "Dirección alternativa · Eventos",
      en: "Alternative direction · Events",
    },
    description: {
      es: "Una segunda propuesta para el mismo perfil que explora otra jerarquía, ritmo editorial y dirección visual sin cambiar el objetivo profesional del contenido.",
      en: "A second proposal for the same profile, exploring a different hierarchy, editorial rhythm and visual direction while preserving the content's professional goal.",
    },
    url: "https://proposal2--portfoliowebeventplanner.netlify.app/",
    domain: "proposal2--portfoliowebeventplanner.netlify.app",
  },
  {
    id: "wedding",
    number: "04",
    title: "Boda",
    category: {
      es: "Web de celebración · Boda",
      en: "Celebration website · Wedding",
    },
    description: {
      es: "Una web de boda que reúne la historia, los datos esenciales y la celebración en una experiencia elegante, cercana y fácil de recorrer.",
      en: "A wedding website that brings together the story, essential details and celebration in an elegant, warm and easy-to-navigate experience.",
    },
    url: "https://webweddingplanner.netlify.app/",
    domain: "webweddingplanner.netlify.app",
  },
  {
    id: "bosque-etereo",
    number: "05",
    title: "Redesign · Bosque Etéreo",
    category: {
      es: "Rediseño conceptual · Boda",
      en: "Concept redesign · Wedding",
    },
    description: {
      es: "Una reinterpretación orgánica y envolvente de la web de boda, construida alrededor de una atmósfera natural y una composición más sensorial.",
      en: "An organic, immersive reinterpretation of the wedding website, built around a natural atmosphere and a more sensory composition.",
    },
    url: "https://redesign-bosque-etereo--webweddingplanner.netlify.app/",
    domain: "redesign-bosque-etereo--webweddingplanner.netlify.app",
  },
  {
    id: "jardin-lunar",
    number: "06",
    title: "Redesign · Jardín Lunar",
    category: {
      es: "Rediseño conceptual · Boda",
      en: "Concept redesign · Wedding",
    },
    description: {
      es: "Una variante nocturna y contemporánea que utiliza el contraste y una estética atmosférica para dar a la misma celebración una identidad distinta.",
      en: "A nocturnal, contemporary variation using contrast and an atmospheric aesthetic to give the same celebration a distinct identity.",
    },
    url: "https://redesign-jardin-lunar--webweddingplanner.netlify.app/",
    domain: "redesign-jardin-lunar--webweddingplanner.netlify.app",
  },
] as const;

export const PORTFOLIO_GALLERY_COPY = {
  es: {
    back: "Volver al portfolio",
    changeLanguage: "Cambiar idioma",
    eyebrow: "Web portfolio collection · 2026",
    title: "Portfolios con una identidad propia.",
    intro:
      "Una colección de webs creadas para perfiles y momentos diferentes. Cada propuesta adapta estructura, tono y dirección visual a la historia que necesita contar.",
    index: "Índice de proyectos",
    preview: "Vista previa interactiva",
    open: "Visitar portfolio",
    live: "Proyecto publicado",
    footer: "Diseño y desarrollo por Jose Ángel Quinto",
    backToTop: "Volver arriba",
  },
  en: {
    back: "Back to portfolio",
    changeLanguage: "Change language",
    eyebrow: "Web portfolio collection · 2026",
    title: "Portfolios with an identity of their own.",
    intro:
      "A collection of websites created for different profiles and moments. Each proposal adapts its structure, tone and visual direction to the story it needs to tell.",
    index: "Project index",
    preview: "Interactive preview",
    open: "Visit portfolio",
    live: "Published project",
    footer: "Design and development by Jose Ángel Quinto",
    backToTop: "Back to top",
  },
} as const;
