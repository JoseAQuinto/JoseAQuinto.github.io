export type PortfolioProject = {
  id: string;
  title: string;
  description: string;
  tags: readonly string[];
  href: string;
  cta: string;
  standalone?: boolean;
};

export type ProjectCardCopy = {
  projectFootnote: string;
  projectMetaLabel: string;
  projectMetaSubLabel: string;
  projectYear: string;
};
