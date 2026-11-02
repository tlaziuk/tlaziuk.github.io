import { SocialLinks } from "@/components/social-links.tsx";
import { revision } from "@/lib/revision.ts";
import { define } from "@/utils.ts";

export default define.page(function Home() {
  return (
    <main class="relative flex min-h-dvh items-center justify-center p-6">
      <SocialLinks />
      <p class="absolute right-2 bottom-2 text-right text-xs text-neutral-500 dark:text-neutral-400">
        {revision.hash} {revision.builtAt}
      </p>
    </main>
  );
});
