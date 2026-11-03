import { Icon } from "@/components/icon.tsx";
import { socials } from "@/lib/config.ts";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100";

const relFor = (external: boolean, profile: boolean): string | undefined => {
  const rel = [profile ? "me" : null, external ? "noreferrer" : null]
    .filter(Boolean)
    .join(" ");
  return rel || undefined;
};

export function SocialLinks() {
  return (
    <nav
      aria-label="Contact"
      class="flex flex-wrap items-center justify-center gap-2"
    >
      {socials.map((social) => (
        <a
          key={social.href}
          href={social.href}
          target={social.external ? "_blank" : undefined}
          rel={relFor(social.external, social.profile)}
          class={`inline-flex items-center gap-2 rounded px-3 py-2 text-sm font-medium uppercase tracking-wide text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800 ${FOCUS_RING}`}
        >
          <Icon name={social.icon} />
          {social.label}
          {social.external && <span class="sr-only">(opens in a new tab)</span>}
        </a>
      ))}
    </nav>
  );
}
