const readEnv = (key: string): string | undefined => {
  const value = Deno.env.get(key)?.trim();
  return value ? value : undefined;
};

export type IconName = "email" | "github" | "linkedin" | "twitter";

export interface Social {
  readonly label: string;
  readonly href: string;
  readonly icon: IconName;
  /** Opens outside this site, so it gets `target="_blank"`. */
  readonly external: boolean;
  /** Added to the link's `rel` so the profile can be verified as mine. */
  readonly profile: boolean;
}

/**
 * Site configuration. Every value comes from the environment so the same image
 * can be deployed with different identities, and links without a configured
 * URL are simply not rendered.
 */
export const config = {
  name: readEnv("APP_NAME") ?? "Tomek Łaziuk",
  description: readEnv("APP_DESCRIPTION") ??
    "Tomek Łaziuk — links to email, GitHub, Twitter and LinkedIn.",
  url: readEnv("APP_URL"),
  email: readEnv("APP_EMAIL"),
  github: readEnv("APP_GITHUB_URL"),
  twitter: readEnv("APP_TWITTER_URL"),
  linkedin: readEnv("APP_LINKEDIN_URL"),
};

/**
 * Absolute base URL for canonical links, `robots.txt` and the sitemap.
 * `APP_URL` wins so the values stay correct behind proxies; otherwise the
 * origin the request came in on is used.
 */
export const siteUrl = (origin: URL): string =>
  (config.url ?? origin.origin).replace(/\/+$/, "");

const candidates: ReadonlyArray<Social | null> = [
  config.email
    ? {
      label: "Email",
      href: `mailto:${config.email}`,
      icon: "email",
      external: false,
      profile: false,
    }
    : null,
  config.github
    ? {
      label: "GitHub",
      href: config.github,
      icon: "github",
      external: true,
      profile: true,
    }
    : null,
  config.twitter
    ? {
      label: "Twitter",
      href: config.twitter,
      icon: "twitter",
      external: true,
      profile: true,
    }
    : null,
  config.linkedin
    ? {
      label: "LinkedIn",
      href: config.linkedin,
      icon: "linkedin",
      external: true,
      profile: true,
    }
    : null,
];

export const socials: ReadonlyArray<Social> = candidates.filter(
  (social): social is Social => social !== null,
);
