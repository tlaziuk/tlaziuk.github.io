import { Icon } from "@/components/icon.tsx";
import { socials } from "@/lib/config.ts";

export function SocialLinks() {
  return (
    <nav class="flex flex-wrap items-center justify-center gap-2">
      {socials.map((social) => (
        <a
          key={social.href}
          href={social.href}
          target={social.external ? "_blank" : undefined}
          rel={social.external ? "noreferrer" : undefined}
          class="inline-flex items-center gap-2 rounded px-3 py-2 text-sm font-medium uppercase tracking-wide text-neutral-700 transition-colors hover:bg-neutral-100 focus-visible:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800"
        >
          <Icon name={social.icon} />
          {social.label}
        </a>
      ))}
    </nav>
  );
}
