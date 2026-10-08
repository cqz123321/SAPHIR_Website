// Site-wide singletons (identity, contact, social, navigation).
// Kept here rather than in a content collection so layout components can
// import them directly.
//
// ⚙️  EDIT THIS FIRST: replace every placeholder below with your lab's details.
//    (Tip: ask Claude to "fill in src/data/site.ts for my lab" and paste your
//    name, institution, and a one-line mission.)

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  pi: string;
  institution: string;
  university: string;
  url: string;
  description: string;
  email: string;
  phone: string;
  address: string[];
  mapQuery: string;
  social: {
    scholar?: string;
    twitter?: string;
    github?: string;
  };
  nav: NavItem[];
}

export const site: SiteConfig = {
  name: "Saphir Robotics",
  shortName: "Saphir Robotics",
  pi: "Professor Kaspar Althoefer",
  institution: "School of Engineering and Materials Science",
  university: "Queen Mary University of London",
  // Your production URL (used for canonical links + sitemap). Set your domain.
  url: "https://saphir-robotics.github.io/saphir-robotics/",
  description:
    "We combine soft materials, sensing and intelligent control to create robots that interact with the physical world.",
  email: "",
  phone: "",
  address: [
    "SAPHIR · Queen Mary University of London",
    "School of Engineering and Materials Science",
    "Mile End Road",
    "London E1 4NS, United Kingdom",
  ],
  mapQuery: "Queen Mary University of London, Mile End Road, London E1 4NS",
  social: {
    github: "https://github.com/saphir-robotics",
    // twitter: "https://twitter.com/yourhandle",
    // github: "https://github.com/yourorg",
  },
  nav: [
    { label: "People", href: "/people" },
    { label: "Research", href: "/research" },
    { label: "Publications", href: "/publications" },
    { label: "Figures", href: "/figures" },
    { label: "Lab Life", href: "/lab-life" },
    { label: "Contact", href: "/contact" },
  ],
};
