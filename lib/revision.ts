/**
 * Resolves a git ref to a commit hash. `.git/HEAD` usually points at a file
 * under `.git/refs`; packed clones keep the same mapping in `packed-refs`.
 * Everything here is a plain file read, so no git binary is needed in images.
 */
const readRef = (ref: string): string | null => {
  try {
    return Deno.readTextFileSync(`.git/${ref}`).trim();
  } catch {
    // fall through to packed refs
  }

  try {
    const packed = Deno.readTextFileSync(".git/packed-refs").split("\n");
    const line = packed.find((entry) => entry.endsWith(` ${ref}`));
    return line?.split(" ")[0] ?? null;
  } catch {
    return null;
  }
};

/**
 * Reads the current commit hash. `GIT_REVISION` is authoritative when set;
 * otherwise git is asked, and as a last resort `.git/HEAD` is parsed directly
 * for images that ship the git metadata without the git binary.
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
    return ref ? readRef(ref) : head;
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
const builtAt = parseTimestamp(Deno.env.get("BUILD_TIMESTAMP")?.trim());

const formatters = new Map<string, Intl.DateTimeFormat>();

const formatterFor = (locale: string): Intl.DateTimeFormat => {
  let formatter = formatters.get(locale);
  if (formatter === undefined) {
    formatter = new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "UTC",
    });
    formatters.set(locale, formatter);
  }
  return formatter;
};

export const revision = {
  hash: hash.slice(0, 7),
  builtAtIso: builtAt.toString(),
};

/** Renders the build timestamp in the visitor's locale, in UTC. */
export const formatBuiltAt = (locale: string): string =>
  formatterFor(locale).format(builtAt);
