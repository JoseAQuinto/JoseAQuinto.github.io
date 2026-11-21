export type PortfolioProject = {
  id: string;
  title: string;
  description: string;
  tags: readonly string[];
  href: string;
  cta: string;
  standalone?: boolean;
};

export type CvLink = {
  href: string;
  fileName: string;
  ariaLabel: string;
};
