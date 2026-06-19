import { useLayoutEffect, useRef } from 'react';

type Arrow = {
  fromId: string;
  toId: string;
  label: string;
  color: string;
  curvature?: number;
  flow?: 'chat' | 'recommend' | 'models' | 'image' | 'connector';
};

const ARROWS: Arrow[] = [
  // connectors from the top summary into the main columns
  { fromId: 'summary-frontend', toId: 'browser-start', label: '', color: '#0f172a', flow: 'connector' },
  { fromId: 'summary-edge', toId: 'edge-chat', label: '', color: '#0f172a', flow: 'connector' },
  { fromId: 'summary-groq', toId: 'groq-prompt', label: '', color: '#0f172a', flow: 'connector' },
  { fromId: 'summary-hf', toId: 'hf-trending', label: '', color: '#0f172a', flow: 'connector' },
  { fromId: 'summary-supabase', toId: 'supabase-db', label: '', color: '#0f172a', flow: 'connector' },

  { fromId: 'supabase-db', toId: 'browser-start', label: 'Laad modellen / gidsen', color: '#16a34a', flow: 'recommend' },
  { fromId: 'browser-start', toId: 'browser-use-case', label: 'Start session', color: '#0f172a' },
  { fromId: 'browser-use-case', toId: 'edge-recommend', label: 'POST /api/recommend', color: '#0ea5a4', curvature: 40, flow: 'recommend' },
  { fromId: 'browser-chat', toId: 'edge-chat', label: 'POST /api/chat', color: '#60a5fa', curvature: 40, flow: 'chat' },
  { fromId: 'browser-models', toId: 'edge-models', label: 'GET /api/hf-models', color: '#0f766e', flow: 'models' },
  { fromId: 'browser-image', toId: 'edge-image', label: 'POST /api/image-gen', color: '#fb923c', flow: 'image' },
  { fromId: 'edge-chat', toId: 'groq-prompt', label: 'Build prompt', color: '#7c3aed', flow: 'chat' },
  { fromId: 'groq-prompt', toId: 'groq-stream', label: 'Generate answer', color: '#7c3aed', flow: 'chat' },
  { fromId: 'groq-stream', toId: 'browser-result-chat', label: 'Stream antwoord', color: '#1e3a8a', flow: 'chat' },
  { fromId: 'edge-recommend', toId: 'supabase-guides', label: 'Haalt gids & metadata', color: '#16a34a', curvature: 50, flow: 'recommend' },
  { fromId: 'edge-recommend', toId: 'groq-rank', label: 'Model ranking', color: '#7c3aed', flow: 'recommend' },
  { fromId: 'groq-rank', toId: 'browser-result-recommend', label: 'Selecteer top modellen', color: '#1e3a8a', flow: 'recommend' },
  { fromId: 'edge-models', toId: 'hf-trending', label: 'Oproep naar HuggingFace', color: '#0f766e', flow: 'models' },
  { fromId: 'hf-trending', toId: 'browser-result-models', label: 'Resultaten tonen', color: '#1e3a8a', flow: 'models' },
  { fromId: 'edge-image', toId: 'hf-image', label: 'Start FLUX.1 / SD3', color: '#0f766e', flow: 'image' },
  { fromId: 'hf-image', toId: 'browser-result-image', label: 'Afbeelding terug', color: '#1e3a8a', flow: 'image' },
  { fromId: 'browser-result-chat', toId: 'final-result', label: 'Chatantwoord', color: '#334155', flow: 'connector' },
  { fromId: 'browser-result-recommend', toId: 'final-result', label: 'Modelaanbeveling', color: '#334155', flow: 'connector' },
  { fromId: 'browser-result-models', toId: 'final-result', label: 'Trending modellen', color: '#334155', flow: 'connector' },
  { fromId: 'browser-result-image', toId: 'final-result', label: 'Gegenereerde afbeelding', color: '#334155', flow: 'connector' },
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
  const midY = (start.y + end.y) / 2;
  const labelY = midY + (start.y < end.y ? -16 : 16);

  // simple lane offsets to reduce crossing: heuristics based on label and color
  let laneOffset = 0;
  if (label.includes('POST /api/chat') || label.toLowerCase().includes('chat') || color === '#60a5fa') laneOffset = -80;
  else if (label.toLowerCase().includes('recommend') || color === '#0ea5a4') laneOffset = -20;
  else if (color === '#0f766e') laneOffset = 60;
  else if (color === '#fb923c') laneOffset = 120;

  const c1x = midX + curvature;
  const c1y = start.y + laneOffset;
  const c2x = midX - curvature;
  const c2y = end.y + laneOffset;

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', `M${start.x},${start.y} C${c1x},${c1y} ${c2x},${c2y} ${end.x},${end.y}`);
  path.setAttribute('stroke', '#374151');
  path.setAttribute('stroke-width', '3');
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
  text.setAttribute('fill', '#0f172a');
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
  rect.setAttribute('fill', 'rgba(255,255,255,0.98)');
  rect.setAttribute('stroke', '#e6eef6');
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
      <div className="relative w-full min-h-[920px] p-5" ref={containerRef}>
        <svg ref={overlayRef} className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" />

        <div className="space-y-3">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 shadow-sm">
            <div className="font-semibold text-slate-900 mb-2">Architectuursamenvatting</div>
            <div className="grid gap-2 text-center text-xs sm:grid-cols-6 sm:text-sm">
              <div id="summary-user" className="rounded-2xl bg-slate-900 px-3 py-1 text-white text-[11px]">Gebruiker</div>
              <div className="flex items-center justify-center text-slate-400">↓</div>
              <div id="summary-frontend" className="rounded-2xl bg-sky-900 px-3 py-1 text-white text-[11px]">React Frontend</div>
              <div className="flex items-center justify-center text-slate-400">↓</div>
              <div id="summary-edge" className="rounded-2xl bg-sky-300 px-3 py-1 text-slate-900 text-[11px]">Vercel Edge API</div>
              <div className="flex items-center justify-center text-slate-400">↓</div>
              <div id="summary-groq" className="rounded-2xl bg-violet-500 px-3 py-1 text-white text-[11px]">Groq / HuggingFace</div>
              <div className="flex items-center justify-center text-slate-400">↓</div>
              <div id="summary-supabase" className="rounded-2xl bg-emerald-600 px-3 py-1 text-white text-[11px]">Supabase</div>
              <div className="flex items-center justify-center text-slate-400">↓</div>
              <div id="summary-result" className="rounded-2xl bg-slate-900 px-3 py-1 text-white text-[11px]">Resultaat</div>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-5 items-start">
            <div className="space-y-3">
              <div className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-white">Browser / React</div>
              <div id="browser-start" className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-base shadow-sm">
                <div className="font-semibold text-slate-900">App start</div>
                <div className="mt-1 text-slate-700 text-sm">Initieert UI en laadt data</div>
              </div>
              <div id="browser-use-case" className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-base shadow-sm">
                <div className="font-semibold text-slate-900">Use case kiezen</div>
                <div className="mt-1 text-slate-700 text-sm">Gebruiker selecteert scenario</div>
              </div>
              <div id="browser-chat" className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-base shadow-sm">
                <div className="font-semibold text-slate-900">Vraag stellen</div>
                <div className="mt-1 text-slate-700 text-sm">Gebruiker verzendt chatvraag</div>
              </div>
              <div id="browser-models" className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-base shadow-sm">
                <div className="font-semibold text-slate-900">Model discovery</div>
                <div className="mt-1 text-slate-700 text-sm">Toont trending modellen</div>
              </div>
              <div id="browser-image" className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-base shadow-sm">
                <div className="font-semibold text-slate-900">Image request</div>
                <div className="mt-1 text-slate-700 text-sm">Gebruiker vraagt afbeelding</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-sky-300 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-900">Vercel Edge</div>
              <div id="edge-chat" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">POST /api/chat</div>
                <div className="mt-2 text-slate-600">Verwerkt chatverzoek</div>
              </div>
              <div id="edge-recommend" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">POST /api/recommend</div>
                <div className="mt-2 text-slate-600">Verstrekt scenario aan ranking</div>
              </div>
              <div id="edge-models" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">GET /api/hf-models</div>
                <div className="mt-2 text-slate-600">Opent model discovery</div>
              </div>
              <div id="edge-image" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">POST /api/image-gen</div>
                <div className="mt-2 text-slate-600">Start inferentie pipeline</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-violet-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white">Groq API</div>
              <div id="groq-prompt" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">Prompt bouwen</div>
                <div className="mt-2 text-slate-600">Maakt contextrijke prompt</div>
              </div>
              <div id="groq-stream" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">Streaming antwoord</div>
                <div className="mt-2 text-slate-600">Realtime antwoord terugsturen</div>
              </div>
              <div id="groq-rank" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">Model ranking</div>
                <div className="mt-2 text-slate-600">Llama 3.3 70B selecteert top opties</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-teal-800 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white">HuggingFace</div>
              <div id="hf-trending" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">Trending ophalen</div>
                <div className="mt-2 text-slate-600">HuggingFace zoekt topmodellen</div>
              </div>
              <div id="hf-image" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">FLUX.1 / SD3 inferentie</div>
                <div className="mt-2 text-slate-600">Genereert de afbeelding</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white">Supabase</div>
              <div id="supabase-db" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">Supabase databron</div>
                <div className="mt-2 space-y-1 text-slate-600">
                  <div>• Modellen</div>
                  <div>• Prijzen</div>
                  <div>• Use-case gidsen</div>
                  <div>• Metadata</div>
                </div>
              </div>
              <div id="supabase-guides" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                <div className="font-semibold text-slate-900">Use-case gidsen</div>
                <div className="mt-2 text-slate-600">Levert context voor ranking</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700 shadow-sm">
            <div id="final-result" className="rounded-3xl bg-emerald-50 p-5 text-center text-slate-900 shadow-sm">
              <div className="text-base font-semibold">Resultaat</div>
              <div className="mt-3 text-slate-700">Eindresultaat dat alle flows samenbrengt</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4 text-left text-sm text-slate-700">
                <div className="rounded-3xl border border-emerald-200 bg-white px-3 py-3 shadow-sm">Chatantwoord</div>
                <div className="rounded-3xl border border-emerald-200 bg-white px-3 py-3 shadow-sm">Modelaanbeveling</div>
                <div className="rounded-3xl border border-emerald-200 bg-white px-3 py-3 shadow-sm">Trending modellen</div>
                <div className="rounded-3xl border border-emerald-200 bg-white px-3 py-3 shadow-sm">Gegenereerde afbeelding</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
