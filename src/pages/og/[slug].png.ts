// Share images, 1200×630, drawn at build time: the brand's social card with the
// avatar, the page's title, and a Flowlines panel seeded by the page.
import type { APIRoute, GetStaticPaths } from "astro";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { flowPath } from "../../lib/flowlines";

export const CARDS: Record<string, { label: string; title: string }> = {
  default: { label: "Wassim Soltani", title: "Software engineer, mostly." },
  netherstone: { label: "Netherstone", title: "Your knowledge, set in stone." },
  syncify: { label: "Syncify", title: "Your Spicetify setup needs a savepoint." },
  yapora: { label: "Yapora", title: "Turn any image into an avatar that talks when you do." },
  lyrica: { label: "Lyrica", title: "Every word, right when it's sung." },
  switchflare: { label: "Switchflare", title: "Switch Cloudflare accounts in one click." },
  map: { label: "Map", title: "Every project on one map." },
  archive: { label: "Archive", title: "Older projects I've stopped working on." },
  resume: { label: "Résumé", title: "Experience, education and skills." },
  "about-this-site": { label: "About this site", title: "How this site is built, and the pattern behind it." },
  contact: { label: "Contact", title: "I'm in Tunisia and work remotely." },
};

export const getStaticPaths: GetStaticPaths = () => Object.keys(CARDS).map((slug) => ({ params: { slug } }));

const W = 1200, H = 630, PANEL = 420;
const font = (w: number) => readFile(resolve(`node_modules/@fontsource/instrument-sans/files/instrument-sans-latin-${w}-normal.woff`));
let assets: Promise<{ regular: Buffer; semibold: Buffer; avatar: string }> | undefined;
const load = () =>
  (assets ??= (async () => {
    const png = await sharp(resolve("src/assets/brand/avatar.webp")).resize(128, 128).png().toBuffer();
    return { regular: await font(400), semibold: await font(600), avatar: `data:image/png;base64,${png.toString("base64")}` };
  })());

// Satori takes a plain element tree; this keeps the card readable.
type Node = { type: string; props: Record<string, unknown> & { children?: unknown } };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node =>
  ({ type, props: { style, children, ...extra } });

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug!;
  const card = CARDS[slug];
  const { regular, semibold, avatar } = await load();

  const d = flowPath({ width: PANEL, height: H, seed: slug === "default" ? "Wassim Soltani" : slug });
  const flow = `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${PANEL}" height="${H}" viewBox="0 0 ${PANEL} ${H}"><rect width="100%" height="100%" fill="#0d0d0d"/><path fill="#94288c" fill-rule="evenodd" d="${d}"/></svg>`,
  ).toString("base64")}`;
  const size = card.title.length > 40 ? 52 : 60;

  const tree = h("div", { width: W, height: H, display: "flex", background: "#0d0d0d", color: "#f0f0f0", fontFamily: "Instrument Sans" }, [
    h("div", { flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 64px 60px" }, [
      h("div", { display: "flex", alignItems: "center", gap: 18 }, [
        h("img", { width: 56, height: 56, borderRadius: 28 }, undefined, { src: avatar, width: 56, height: 56 }),
        h("span", { fontSize: 24, color: "#adadad" }, "wsoltani.com"),
      ]),
      h("div", { display: "flex", flexDirection: "column", gap: 18 }, [
        h("span", { fontSize: 26, color: "#adadad" }, card.label),
        h("span", { fontSize: size, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.06, textWrap: "balance" }, card.title),
      ]),
    ]),
    h("img", { width: PANEL, height: H }, undefined, { src: flow, width: PANEL, height: H }),
  ]);

  const svg = await satori(tree as never, {
    width: W, height: H,
    fonts: [{ name: "Instrument Sans", data: regular, weight: 400 }, { name: "Instrument Sans", data: semibold, weight: 600 }],
  });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: W } }).render().asPng();
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
};
