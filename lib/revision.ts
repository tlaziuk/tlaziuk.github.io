const formatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

/**
 * Reads the current commit hash. `GIT_REVISION` is authoritative in containers,
 * where `.git` is not part of the image; outside of them we ask git, and fall
 * back to parsing `.git` directly for sandboxed runs without `--allow-run`.
 */
const readGitHash = (): string | null => {
  try {
    const { success, stdout } = new Deno.Command("git", {
      args: ["rev-parse", "HEAD"],
      stdout: "piped",
      stderr: "null",
    }).outputSync();
    if (success) return new TextDecoder().decode(stdout).trim();
  } catch {
    // git is unavailable; fall through to reading .git directly
  }

  try {
    const head = Deno.readTextFileSync(".git/HEAD").trim();
    const ref = head.match(/^ref: (.+)$/)?.[1];
    return ref ? Deno.readTextFileSync(`.git/${ref}`).trim() : head;
  } catch {
    return null;
  }
};

/** `BUILD_TIMESTAMP` accepts an ISO 8601 instant or epoch milliseconds. */
const parseTimestamp = (value: string | undefined): Temporal.Instant => {
  if (value) {
    try {
      return /^\d+$/.test(value)
        ? Temporal.Instant.fromEpochMilliseconds(Number(value))
        : Temporal.Instant.from(value);
    } catch {
      // ignore malformed input and report the current instant instead
    }
  }
  return Temporal.Now.instant();
};

const hash = Deno.env.get("GIT_REVISION")?.trim() || readGitHash() || "unknown";

export const revision = {
  hash: hash.slice(0, 7),
  builtAt: formatter.format(
    parseTimestamp(Deno.env.get("BUILD_TIMESTAMP")?.trim()),
  ),
};
