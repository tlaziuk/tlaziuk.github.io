import { icons } from "@iconify-json/mdi";
import type { IconName } from "@/lib/config.ts";

const PATH_TAG = /<path\b([^>]*)\/?>/g;
const ATTRIBUTE = /([\w-]+)="([^"]*)"/g;

const SVG_ATTRIBUTE_NAMES: Record<string, string> = {
  "clip-rule": "clipRule",
  "fill-rule": "fillRule",
};

/** Turns an MDI icon body into props for `<path>` elements. */
function pathAttributes(body: string): Array<Record<string, string>> {
  return [...body.matchAll(PATH_TAG)].map(([, attributes]) => {
    const props: Record<string, string> = {};
    for (const [, name, value] of attributes.matchAll(ATTRIBUTE)) {
      props[SVG_ATTRIBUTE_NAMES[name] ?? name] = value;
    }
    return props;
  });
}

/**
 * Renders an MDI icon during server rendering, so icons add no requests and no
 * JavaScript to the page.
 */
export function Icon(props: { name: IconName }) {
  const icon = icons.icons[props.name];
  if (!icon) return null;

  const left = icon.left ?? icons.left ?? 0;
  const top = icon.top ?? icons.top ?? 0;
  const width = icon.width ?? icons.width ?? 24;
  const height = icon.height ?? icons.height ?? 24;
  const paths = pathAttributes(icon.body);

  return (
    <svg
      viewBox={`${left} ${top} ${width} ${height}`}
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
    >
      {paths.map((path, index) => <path key={index} {...path} />)}
    </svg>
  );
}
