export type ShowcaseProject = {
  id: string;
  title: string;
  tag: string;
  href: string;
  image?: string;
};

export const showcaseProjects: readonly ShowcaseProject[] = [
  {
    id: "01",
    title: "Profolio",
    tag: "TypeScript",
    href: "https://github.com/oiidawn/Profolio",
  },
  {
    id: "02",
    title: "consumables-ios-app",
    tag: "Swift",
    href: "https://github.com/oiidawn/consumables-ios-app",
  },
  {
    id: "03",
    title: "sleep-monitor",
    tag: "Python",
    href: "https://github.com/oiidawn/sleep-monitor",
  },
  {
    id: "04",
    title: "poker",
    tag: "TypeScript",
    href: "https://github.com/oiidawn/poker",
  },
];

export function projectSlug(title: string) {
  return encodeURIComponent(title.toLowerCase().replace(/\s+/g, "-"));
}
