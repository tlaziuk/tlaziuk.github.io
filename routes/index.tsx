import { SocialLinks } from "@/components/social-links.tsx";
import { config } from "@/lib/config.ts";
import { revision } from "@/lib/revision.ts";
import { define } from "@/utils.ts";

export default define.page(function Home() {
  return (
    <div class="flex min-h-dvh flex-col">
      <header class="sr-only">
        <h1>{config.name}</h1>
      </header>
      <main class="flex flex-1 items-center justify-center p-6">
        <SocialLinks />
      </main>
      <footer class="p-2 text-right text-xs text-neutral-500 dark:text-neutral-400">
        <p>
          {revision.hash}{" "}
          <time datetime={revision.builtAtIso}>{revision.builtAt}</time>
        </p>
      </footer>
    </div>
  );
});
