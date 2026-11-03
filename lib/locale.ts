/** Locale used when the request does not ask for anything we can format. */
export const DEFAULT_LOCALE = "en";

interface Preference {
  readonly tag: string;
  readonly quality: number;
}

const parsePreferences = (header: string | null): Preference[] =>
  (header ?? "")
    .split(",")
    .map((entry) => {
      const [tag, ...parameters] = entry.trim().split(";");
      const qualityParameter = parameters.find((parameter) =>
        parameter.trim().startsWith("q=")
      );
      const quality = qualityParameter
        ? Number(qualityParameter.split("=")[1])
        : 1;
      return {
        tag: tag.trim(),
        quality: Number.isFinite(quality) ? quality : 0,
      };
    })
    .filter((preference) =>
      preference.tag !== "" && preference.tag !== "*" && preference.quality > 0
    )
    .sort((a, b) => b.quality - a.quality);

/**
 * Picks the visitor's preferred locale for formatting dates, using the
 * `Accept-Language` header. `Intl` drops anything it cannot format, so an
 * unsupported language falls back to English instead of throwing.
 */
export function resolveLocale(header: string | null): string {
  const preferences = parsePreferences(header).map((entry) => entry.tag);
  const [matching] = Intl.DateTimeFormat.supportedLocalesOf(preferences);
  return matching ?? DEFAULT_LOCALE;
}
