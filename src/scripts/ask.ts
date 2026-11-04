// The Answers panel's behaviour: opening and closing, the chat, the bot check, and the streamed answers.
// Everything a visitor or the Worker sends is shown as text, never as HTML.
import { gsap, T, reduced } from "./motion";
import { edgePath } from "../lib/edgelines";

type Turn = { role: "user" | "assistant"; content: string; sources?: string[] };
type Link = { label: string; href: string; accent?: string };
type Links = { pages: Record<string, Link>; orgs: Record<string, Link>; sections: Record<string, Link> };
type Saved = { turns: Turn[]; session?: string; open?: boolean };

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id: string) => void;
    };
  }
}

const STORE = "ask-chat-v1";
const HISTORY = 8;

function load(): Saved {
  try {
    const s = JSON.parse(sessionStorage.getItem(STORE) ?? "null");
    if (s && Array.isArray(s.turns)) return s;
  } catch {}
  return { turns: [] };
}
function save(s: Saved) {
  try {
    sessionStorage.setItem(STORE, JSON.stringify(s));
  } catch {}
}

/** A wiki path from the Worker (work/vantage-labs/writeahead) to a page on this site. */
export function linkFor(path: string, links: Links): Link | null {
  const parts = path.split("/");
  const last = parts[parts.length - 1];
  if (parts.length === 1) return links.sections[last] ?? null;
  if (links.pages[last]) return links.pages[last];
  if (parts[0] === "work" && parts.length === 2) return links.orgs[last] ?? links.sections.work;
  return null;
}

/** Plain text in, paragraphs and lists out, built as DOM nodes. Light markdown marks are dropped. */
export function renderText(el: HTMLElement, text: string) {
  el.replaceChildren();
  const clean = (s: string) => s.replace(/\*\*|__|`/g, "").replace(/^#+\s*/, "");
  for (const block of text.trim().split(/\n{2,}/)) {
    const lines = block.split("\n").filter((l) => l.trim());
    if (!lines.length) continue;
    if (lines.every((l) => /^\s*([-*•]|\d+[.)])\s+/.test(l))) {
      const ul = document.createElement("ul");
      for (const l of lines) {
        const li = document.createElement("li");
        li.textContent = clean(l.replace(/^\s*([-*•]|\d+[.)])\s+/, ""));
        ul.append(li);
      }
      el.append(ul);
    } else {
      const p = document.createElement("p");
      p.textContent = clean(lines.join(" "));
      el.append(p);
    }
  }
}

/** Reads a server-sent event stream and calls back per event. */
async function readEvents(body: ReadableStream<Uint8Array>, on: (name: string, data: string) => void) {
  const reader = body.pipeThrough(new TextDecoderStream() as unknown as ReadableWritablePair<string, Uint8Array>).getReader();
  let buf = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += value.replace(/\r\n/g, "\n");
    let i: number;
    while ((i = buf.indexOf("\n\n")) !== -1) {
      const raw = buf.slice(0, i);
      buf = buf.slice(i + 2);
      let name = "message";
      const data: string[] = [];
      for (const line of raw.split("\n")) {
        if (line.startsWith("event:")) name = line.slice(6).trim();
        else if (line.startsWith("data:")) data.push(line.slice(5).trimStart());
      }
      if (data.length) on(name, data.join("\n"));
    }
  }
}

/** Wide screens push the page aside; below this the panel slides over it. Matches the CSS. */
const pushes = () => matchMedia("(min-width: 1100px)").matches;

/**
 * The edge lines. They wave into place when the panel opens and flow down the edge
 * while an answer is being looked up. Without motion they just sit still.
 */
function stripMotion(svg: SVGSVGElement | null) {
  const paths = svg ? [...svg.querySelectorAll("path")] : [];
  const state = { wave: 1, phase: 0, glow: 0 };
  const draw = () => paths.forEach((p, i) => p.setAttribute("d", edgePath(i, state.wave, state.phase)));
  const shine = () => svg && (svg.style.filter = state.glow > 0.05 ? `drop-shadow(0 0 ${state.glow.toFixed(2)}px color-mix(in srgb, currentColor 45%, transparent))` : "");
  let flow: gsap.core.Tween | null = null;
  let pulse: gsap.core.Tween | null = null;
  return {
    settle() {
      svg?.closest(".ask")?.classList.add("glow");
      setTimeout(() => svg?.closest(".ask")?.classList.remove("glow"), 1400);
      if (reduced() || !paths.length) return;
      state.wave = 0;
      gsap.to(state, { wave: 1, duration: 1.6, ease: "power3.out", onUpdate: draw });
      gsap.to(state, { phase: `+=${Math.PI * 2}`, duration: 1.6, ease: "power3.out" });
    },
    stir() {
      svg?.closest(".ask")?.classList.add("searching");
      if (reduced() || !paths.length) return;
      flow?.kill();
      pulse?.kill();
      // One full turn of the waves per loop, so each loop starts exactly where the last one ended.
      flow = gsap.to(state, { phase: `+=${Math.PI * 2}`, duration: 1.6, ease: "none", repeat: -1, onUpdate: draw });
      state.glow = 0;
      pulse = gsap.to(state, { glow: 1.5, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: -1, onUpdate: shine });
    },
    calm() {
      svg?.closest(".ask")?.classList.remove("searching");
      pulse?.kill();
      pulse = null;
      gsap.to(state, { glow: 0, duration: T.slow, ease: "power2.out", onUpdate: shine });
      if (!flow) return;
      flow.kill();
      flow = null;
      gsap.to(state, { phase: `+=${Math.PI / 2}`, duration: T.slow, ease: "power2.out", onUpdate: draw });
    },
  };
}

export function mountAsk() {
  const found = document.querySelector<HTMLElement>("[data-ask]");
  if (!found || found.dataset.mounted) return;
  const dlg = found;
  dlg.dataset.mounted = "1";

  const links: Links = JSON.parse(document.getElementById("ask-links")?.textContent ?? "{}");
  const $ = <T extends HTMLElement>(sel: string) => dlg.querySelector<T>(sel)!;
  const turnsEl = $("[data-turns]");
  const empty = $("[data-empty]");
  const form = $<HTMLFormElement>("[data-form]");
  const input = $<HTMLTextAreaElement>("[data-input]");
  const send = $<HTMLButtonElement>("[data-send]");
  const newBtn = $<HTMLButtonElement>("[data-new]");
  const log = $("[data-log]");
  const checkEl = $("[data-check]");

  let state = load();
  let busy = false;
  const strip = stripMotion(dlg.querySelector<SVGSVGElement>(".strip"));
  const triggers = document.querySelectorAll<HTMLElement>("[data-ask-open]");

  /** The strip and the source dot take the color of the first project an answer used. */
  function tone(link?: Link | null) {
    if (link?.accent) dlg.style.setProperty("--tone", link.accent);
    else dlg.style.removeProperty("--tone");
  }

  const scrollDown = () => (log.scrollTop = log.scrollHeight);
  const fromTemplate = (name: string) =>
    (dlg.querySelector<HTMLTemplateElement>(`template[data-state="${name}"]`)!.content.firstElementChild!.cloneNode(true) as HTMLElement);

  const linksOf = (paths: string[] = []) => {
    const seen = new Set<string>();
    return paths.map((p) => linkFor(p, links)).filter((l): l is Link => !!l && !seen.has(l.href) && !!seen.add(l.href));
  };

  function sourcesEl(items: Link[]) {
    if (!items.length) return null;
    const lit = items.find((l) => l.accent);
    const row = document.createElement("p");
    row.className = "from";
    if (lit) row.style.setProperty("--dot", lit.accent!);
    const label = document.createElement("span");
    label.className = "sr-only";
    label.textContent = "Sources:";
    const dot = document.createElement("span");
    dot.className = "dot";
    dot.setAttribute("aria-hidden", "true");
    row.append(label, dot);
    items.slice(0, 4).forEach((l, i) => {
      if (i) {
        const sep = document.createElement("span");
        sep.className = "sep";
        sep.setAttribute("aria-hidden", "true");
        sep.textContent = "/";
        row.append(sep);
      }
      const a = document.createElement("a");
      a.className = l === lit ? "src lit" : "src";
      a.href = l.href;
      a.textContent = l.label;
      // Beside the page, the panel stays open on the next page too. Over it, it gets out of the way.
      a.addEventListener("click", () => { if (!pushes()) close(false); });
      row.append(a);
    });
    return row;
  }

  function addTurn(question: string) {
    const turn = document.createElement("article");
    turn.className = "turn";
    const q = document.createElement("h3");
    q.className = "q";
    q.textContent = question;
    turn.append(q);
    turnsEl.append(turn);
    return turn;
  }

  function addAnswer(turn: HTMLElement, t: Turn) {
    const a = document.createElement("div");
    a.className = "a";
    const body = document.createElement("div");
    body.style.display = "contents";
    renderText(body, t.content);
    a.append(body);
    turn.append(a);
    return { a, body };
  }

  function addSources(view: { a: HTMLElement }, t: Turn) {
    const items = linksOf(t.sources);
    const src = sourcesEl(items);
    if (src) view.a.append(src);
    return items.find((l) => l.accent);
  }

  function paint() {
    turnsEl.replaceChildren();
    let turn: HTMLElement | null = null;
    let lit: Link | undefined;
    for (const t of state.turns) {
      if (t.role === "user") turn = addTurn(t.content);
      else if (turn) lit = addSources(addAnswer(turn, t), t) ?? lit;
    }
    tone(lit);
    empty.hidden = state.turns.length > 0;
    newBtn.hidden = state.turns.length === 0;
  }

  function setBusy(b: boolean) {
    busy = b;
    send.disabled = b;
  }

  // --- The bot check: Turnstile, loaded the first time the panel opens without a session.
  let widget: string | null = null;
  let token: string | null = null;
  let waiting: ((t: string) => void) | null = null;
  let loading: Promise<void> | null = null;

  function loadTurnstile() {
    loading ??= new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => {
        loading = null;
        reject(new Error("check"));
      };
      document.head.append(s);
    }).then(() => {
      widget = window.turnstile!.render(checkEl, {
        sitekey: dlg.dataset.sitekey,
        appearance: "interaction-only",
        theme: "dark",
        callback: (t: string) => {
          if (waiting) {
            waiting(t);
            waiting = null;
          } else token = t;
        },
        "expired-callback": () => (token = null),
      });
    });
    return loading;
  }

  async function freshToken(): Promise<string> {
    await loadTurnstile();
    if (token) {
      const t = token;
      token = null;
      window.turnstile!.reset(widget!);
      return t;
    }
    return new Promise((resolve) => (waiting = resolve));
  }

  // --- Asking.
  async function ask(question: string) {
    if (busy) return;
    setBusy(true);
    state.turns.push({ role: "user", content: question });
    empty.hidden = true;
    newBtn.hidden = false;
    const turn = addTurn(question);
    input.value = "";

    let status = fromTemplate(state.session ? "thinking" : "checking");
    turn.append(status);
    strip.stir();
    scrollDown();
    const setStatus = (name: string) => {
      const next = fromTemplate(name);
      status.replaceWith(next);
      status = next;
    };

    const fail = (kind: "failed" | "slow" | "resting", until?: string) => {
      state.turns.pop();
      turn.remove();
      strip.calm();
      const card = fromTemplate(kind);
      input.value = question;
      if (kind === "failed") {
        card.querySelector("[data-retry]")?.addEventListener("click", () => {
          card.remove();
          form.requestSubmit();
        });
      }
      if (kind === "resting" && until) {
        const when = new Date(until);
        if (when.getTime() - Date.now() > 36 * 3600 * 1000) {
          card.querySelector("[data-title]")!.textContent =
            `No more answers until ${when.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}`;
          card.querySelector("[data-body]")!.textContent = "There's a limit each month. The Work and Projects sections cover the same ground.";
        }
      }
      // A card stands alone: the next question removes it.
      const card0 = card;
      form.addEventListener("submit", () => card0.remove(), { once: true });
      turnsEl.append(card);
      scrollDown();
      save(state);
    };

    try {
      let res: Response | null = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        const body: Record<string, unknown> = {
          messages: state.turns.slice(-HISTORY).map(({ role, content }) => ({ role, content })),
        };
        if (state.session) body.session = state.session;
        else {
          body.turnstile = await freshToken();
          setStatus("thinking");
        }
        res = await fetch(dlg.dataset.endpoint!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.status === 401 && state.session) {
          state.session = undefined;
          continue;
        }
        break;
      }
      if (!res) return fail("failed");

      if (!res.ok || !res.body || !res.headers.get("Content-Type")?.includes("text/event-stream")) {
        const err = (await res.json().catch(() => ({}))) as { error?: string; until?: string; session?: string };
        if (err.session) state.session = err.session;
        if (err.error === "resting") return fail("resting", err.until);
        if (err.error === "slow_down") return fail("slow");
        return fail("failed");
      }

      if (status.isConnected) setStatus("thinking");
      const answer: Turn = { role: "assistant", content: "", sources: [] };
      let view: { a: HTMLElement; body: HTMLElement } | null = null;
      await readEvents(res.body, (name, data) => {
        if (name === "session") {
          try {
            state.session = JSON.parse(data);
          } catch {}
        } else if (name === "sources") {
          try {
            answer.sources = (JSON.parse(data) as { path: string }[]).map((s) => s.path);
          } catch {}
        } else if (data !== "[DONE]") {
          try {
            const delta = JSON.parse(data)?.choices?.[0]?.delta?.content;
            if (typeof delta === "string" && delta) {
              answer.content += delta;
              if (!view) {
                status.remove();
                view = addAnswer(turn, answer);
              }
              renderText(view.body, answer.content);
              scrollDown();
            }
          } catch {}
        }
      });
      if (!answer.content.trim() || !view) return fail("failed");
      state.turns.push(answer);
      tone(addSources(view, answer) ?? null);
      strip.calm();
      save(state);
      scrollDown();
    } catch {
      fail("failed");
    } finally {
      setBusy(false);
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (q) ask(q);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      form.requestSubmit();
    }
  });
  dlg.querySelectorAll<HTMLButtonElement>("[data-starter]").forEach((b) => b.addEventListener("click", () => ask(b.dataset.starter!)));
  newBtn.addEventListener("click", () => {
    if (busy) return;
    state = { turns: [], session: state.session };
    save(state);
    paint();
    input.focus();
  });
  $("[data-close]").addEventListener("click", () => close());

  // --- Opening and closing.
  const isOpen = () => !dlg.hidden && html.classList.contains("ask-open");
  const isOpenState = () => html.classList.contains("ask-open");
  const html = document.documentElement;
  let returnTo: HTMLElement | null = null;

  function setOpen(open: boolean) {
    state.open = open;
    save(state);
    triggers.forEach((b) => b.setAttribute("aria-expanded", String(open)));
  }

  function open(animate = true) {
    if (isOpen()) return input.focus();
    returnTo = document.activeElement as HTMLElement | null;
    setOpen(true);
    paint();
    if (!animate) {
      // Reopened on a new page: no slide, no color fade, just as it was.
      dlg.classList.add("instant");
      html.classList.add("ask-still");
    }
    dlg.hidden = false;
    dlg.getBoundingClientRect(); // start the slide from off screen
    html.classList.add("ask-open");
    scrollDown();
    if (animate) {
      strip.settle();
      input.focus({ preventScroll: true });
    } else {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        dlg.classList.remove("instant");
        html.classList.remove("ask-still");
      }));
    }
    if (!state.session) loadTurnstile().catch(() => {});
  }

  function close(restoreFocus = true) {
    if (!isOpen()) return;
    setOpen(false);
    html.classList.remove("ask-open");
    const hide = () => { if (!isOpenState()) dlg.hidden = true; };
    if (reduced()) hide();
    else {
      const end = (e: TransitionEvent) => {
        if (e.target !== dlg || e.propertyName !== "transform") return;
        dlg.removeEventListener("transitionend", end);
        hide();
      };
      dlg.addEventListener("transitionend", end);
    }
    if (restoreFocus && dlg.contains(document.activeElement)) (returnTo ?? triggers[0])?.focus();
  }

  triggers.forEach((b) => b.addEventListener("click", () => (isOpen() ? close() : open())));
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (isOpen() && !dlg.contains(document.activeElement)) input.focus();
      else isOpen() ? close() : open();
    } else if (e.key === "Escape" && isOpen() && !document.querySelector(":popover-open")) {
      close();
    }
  });
  // Show the shortcut the way this keyboard spells it.
  if (!/Mac|iPhone|iPad/.test(navigator.platform)) document.querySelectorAll("[data-ask-key]").forEach((k) => (k.textContent = "Ctrl K"));

  // Beside the page, the panel stays open from page to page.
  if (state.open && pushes()) open(false);
}
