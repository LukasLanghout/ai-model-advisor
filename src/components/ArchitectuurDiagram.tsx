import { useLayoutEffect, useRef } from 'react';

type Arrow = {
  fromId: string;
  toId: string;
  label: string;
  color: string;
  curvature?: number;
};

const ARROWS: Arrow[] = [
  { fromId: 'supabase-load', toId: 'browser-start', label: 'Laad modellen & gidsen', color: '#16a34a' },
  { fromId: 'browser-use-case', toId: 'edge-recommend', label: 'POST /api/recommend', color: '#60a5fa', curvature: 60 },
  { fromId: 'browser-chat', toId: 'edge-chat', label: 'POST /api/chat', color: '#60a5fa', curvature: 60 },
  { fromId: 'edge-chat', toId: 'groq-prompt', label: 'Prompt bouwen', color: '#7c3aed' },
  { fromId: 'groq-prompt', toId: 'groq-stream', label: 'Stream antwoord', color: '#7c3aed' },
  { fromId: 'groq-stream', toId: 'browser-result-chat', label: 'Toon antwoord', color: '#1e3a8a' },
  { fromId: 'edge-recommend', toId: 'supabase-guides', label: 'Haalt gids op', color: '#60a5fa', curvature: 40 },
  { fromId: 'edge-recommend', toId: 'groq-rank', label: 'Rank modellen', color: '#7c3aed' },
  { fromId: 'groq-rank', toId: 'browser-result-recommend', label: 'Toon aanbevelingen', color: '#1e3a8a' },
  { fromId: 'edge-models', toId: 'hf-trending', label: 'Trending ophalen', color: '#60a5fa' },
  { fromId: 'hf-trending', toId: 'browser-result-models', label: 'Toon modellen', color: '#1e3a8a' },
  { fromId: 'edge-image', toId: 'hf-image', label: 'Genereer afbeelding', color: '#60a5fa' },
  { fromId: 'hf-image', toId: 'browser-result-image', label: 'Toon afbeelding', color: '#1e3a8a' },
];

function createMarker(svg: SVGSVGElement) {
  const svgNS = 'http://www.w3.org/2000/svg';
  const defs = document.createElementNS(svgNS, 'defs');
  const marker = document.createElementNS(svgNS, 'marker');
  marker.setAttribute('id', 'arrowhead');
  marker.setAttribute('markerWidth', '10');
  marker.setAttribute('markerHeight', '8');
  marker.setAttribute('refX', '9');
  marker.setAttribute('refY', '4');
  marker.setAttribute('orient', 'auto');
  marker.setAttribute('markerUnits', 'strokeWidth');

  const poly = document.createElementNS(svgNS, 'polygon');
  poly.setAttribute('points', '0 0, 10 4, 0 8');
  poly.setAttribute('fill', '#334155');
  marker.appendChild(poly);
  defs.appendChild(marker);
  svg.appendChild(defs);
}

function getCenter(element: HTMLElement, container: HTMLElement) {
  const bounding = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return {
    x: bounding.left - containerRect.left + bounding.width / 2,
    y: bounding.top - containerRect.top + bounding.height / 2,
  };
}

function drawArrow(svg: SVGSVGElement, container: HTMLElement, fromEl: HTMLElement, toEl: HTMLElement, label: string, color: string, curvature = 0) {
  const start = getCenter(fromEl, container);
  const end = getCenter(toEl, container);
  const midX = (start.x + end.x) / 2;
  const labelY = (start.y + end.y) / 2 + (start.y < end.y ? -16 : 16);

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', `M${start.x},${start.y} C${midX + curvature},${start.y} ${midX - curvature},${end.y} ${end.x},${end.y}`);
  path.setAttribute('stroke', color);
  path.setAttribute('stroke-width', '2');
  path.setAttribute('fill', 'none');
  path.setAttribute('marker-end', 'url(#arrowhead)');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(path);

  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', String(midX));
  text.setAttribute('y', String(labelY));
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('font-size', '12');
  text.setAttribute('fill', '#334155');
  text.setAttribute('font-family', 'Segoe UI, sans-serif');
  text.textContent = label;
  svg.appendChild(text);

  const bbox = text.getBBox();
  const pad = 6;
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', String(bbox.x - pad));
  rect.setAttribute('y', String(bbox.y - pad));
  rect.setAttribute('width', String(bbox.width + pad * 2));
  rect.setAttribute('height', String(bbox.height + pad * 2));
  rect.setAttribute('fill', 'rgba(255,255,255,0.95)');
  rect.setAttribute('stroke', '#e2e8f0');
  rect.setAttribute('stroke-width', '1');
  rect.setAttribute('rx', '6');
  rect.setAttribute('ry', '6');
  svg.insertBefore(rect, text);
}

function renderArrows(overlay: SVGSVGElement, container: HTMLElement) {
  overlay.innerHTML = '';
  createMarker(overlay);

  const containerRect = container.getBoundingClientRect();
  overlay.setAttribute('viewBox', `0 0 ${containerRect.width} ${containerRect.height}`);

  for (const arrow of ARROWS) {
    const fromEl = document.getElementById(arrow.fromId);
    const toEl = document.getElementById(arrow.toId);
    if (!fromEl || !toEl) continue;
    drawArrow(overlay, container, fromEl, toEl, arrow.label, arrow.color, arrow.curvature ?? 0);
  }
}

export default function ArchitectuurDiagram() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<SVGSVGElement | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    if (!container || !overlay) return;

    const render = () => renderArrows(overlay, container);
    render();

    const observer = new ResizeObserver(render);
    observer.observe(container);
    window.addEventListener('resize', render);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', render);
    };
  }, []);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="relative w-full min-h-[820px] p-5" ref={containerRef}>
        <svg ref={overlayRef} className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" />

        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 shadow-sm">
            <div className="font-semibold text-slate-900 mb-3">Samenvattende flow</div>
            <div className="grid gap-3 text-center text-xs sm:grid-cols-6 sm:text-sm">
              <div className="rounded-2xl bg-slate-900 px-3 py-2 text-white">Gebruiker</div>
              <div className="flex items-center justify-center text-slate-400">↓</div>
              <div className="rounded-2xl bg-sky-900 px-3 py-2 text-white">React Frontend</div>
              <div className="flex items-center justify-center text-slate-400">↓</div>
              <div className="rounded-2xl bg-sky-300 px-3 py-2 text-slate-900">Vercel Edge API</div>
              <div className="flex items-center justify-center text-slate-400">↓</div>
              <div className="rounded-2xl bg-violet-500 px-3 py-2 text-white">AI Services</div>
              <div className="flex items-center justify-center text-slate-400">↓</div>
              <div className="rounded-2xl bg-emerald-600 px-3 py-2 text-white">Supabase Data</div>
              <div className="flex items-center justify-center text-slate-400">↓</div>
              <div className="rounded-2xl bg-slate-900 px-3 py-2 text-white">Resultaat</div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-5">
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white">Browser / React</div>
              <div id="browser-start" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">App start</div>
                <div className="mt-2 text-slate-600">Laadt modellen, prijzen en gidsen</div>
              </div>
              <div id="browser-use-case" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">Use case kiezen</div>
                <div className="mt-2 text-slate-600">Gebruiker selecteert scenario</div>
              </div>
              <div id="browser-chat" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">Vraag stellen</div>
                <div className="mt-2 text-slate-600">Gebruiker voert input in</div>
              </div>
              <div id="browser-result-chat" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">Toon chatantwoord</div>
                <div className="mt-2 text-slate-600">Streaming reactie in UI</div>
              </div>
              <div id="browser-result-recommend" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">Toon aanbevelingen</div>
                <div className="mt-2 text-slate-600">Top modellen met score</div>
              </div>
              <div id="browser-result-models" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">Toon modellen</div>
                <div className="mt-2 text-slate-600">Trending resultaten tonen</div>
              </div>
              <div id="browser-result-image" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">Toon afbeelding</div>
                <div className="mt-2 text-slate-600">Gegenereerde beeldresultaten</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-sky-300 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-900">Vercel Edge</div>
              <div id="edge-chat" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">POST /api/chat</div>
                <div className="mt-2 text-slate-600">Verstuurt vraag naar AI service</div>
              </div>
              <div id="edge-recommend" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">POST /api/recommend</div>
                <div className="mt-2 text-slate-600">Verwerkt use case en filters</div>
              </div>
              <div id="edge-models" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">GET /api/hf-models</div>
                <div className="mt-2 text-slate-600">Zoekt trending modellen</div>
              </div>
              <div id="edge-image" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">POST /api/image-gen</div>
                <div className="mt-2 text-slate-600">Start beeldgeneratie</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-violet-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white">Groq API</div>
              <div id="groq-prompt" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">Prompt bouwen</div>
                <div className="mt-2 text-slate-600">Combineert vraag met context</div>
              </div>
              <div id="groq-rank" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">Ranking</div>
                <div className="mt-2 text-slate-600">Llama 3.3 70B selecteert top modellen</div>
              </div>
              <div id="groq-stream" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">Streaming antwoord</div>
                <div className="mt-2 text-slate-600">Beantwoordt vraag realtime</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-teal-800 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white">HuggingFace</div>
              <div id="hf-trending" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">Trending ophalen</div>
                <div className="mt-2 text-slate-600">Zoekt trending modellen via HF</div>
              </div>
              <div id="hf-image" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">FLUX.1 / SD3</div>
                <div className="mt-2 text-slate-600">Genereert afbeelding</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white">Supabase</div>
              <div id="supabase-load" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">Laad data</div>
                <div className="mt-2 text-slate-600">Modellen, prijzen en gidsen</div>
              </div>
              <div id="supabase-guides" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">Use case gidsen</div>
                <div className="mt-2 text-slate-600">Gecombineerd met ranking</div>
              </div>
            </div>
          </div>

          <div className="grid gap-2 text-xs text-slate-600 sm:grid-cols-2 md:grid-cols-5">
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-slate-900" />Browser / React</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-sky-300" />Vercel Edge</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-violet-500" />Groq API</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-teal-800" />HuggingFace</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-emerald-600" />Supabase</div>
          </div>
        </div>
      </div>
    </div>
  );
}
