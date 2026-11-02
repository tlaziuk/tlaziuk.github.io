const readEnv = (key: string): string | undefined => {
  const value = Deno.env.get(key)?.trim();
  return value ? value : undefined;
};

export type IconName = "email" | "github" | "linkedin" | "twitter";

export interface Social {
  readonly label: string;
  readonly href: string;
  readonly icon: IconName;
  readonly external: boolean;
}

/**
 * Site configuration. Every value comes from the environment so the same image
 * can be deployed with different identities, and links without a configured
 * URL are simply not rendered.
 */
export const config = {
  name: readEnv("APP_NAME") ?? "Tomek Łaziuk",
  email: readEnv("APP_EMAIL"),
  github: readEnv("APP_GITHUB_URL"),
  twitter: readEnv("APP_TWITTER_URL"),
  linkedin: readEnv("APP_LINKEDIN_URL"),
};

const candidates: ReadonlyArray<Social | null> = [
  config.email
    ? {
      label: "Email",
      href: `mailto:${config.email}`,
      icon: "email",
      external: false,
    }
    : null,
  config.github
    ? {
      label: "GitHub",
      href: config.github,
      icon: "github",
      external: true,
    }
    : null,
  config.twitter
    ? {
      label: "Twitter",
      href: config.twitter,
      icon: "twitter",
      external: true,
    }
    : null,
  config.linkedin
    ? {
      label: "LinkedIn",
      href: config.linkedin,
      icon: "linkedin",
      external: true,
    }
    : null,
];

export const socials: ReadonlyArray<Social> = candidates.filter(
  (social): social is Social => social !== null,
);
