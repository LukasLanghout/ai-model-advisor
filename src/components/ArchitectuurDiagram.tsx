import { useLayoutEffect, useRef } from 'react';

type Arrow = {
  fromId: string;
  toId: string;
  label: string;
  color: string;
  curvature?: number;
};

const ARROWS: Arrow[] = [
  { fromId: 'n3', toId: 'e1', label: 'POST /api/chat: user vraag', color: '#1d4ed8' },
  { fromId: 'e1', toId: 'g1', label: 'Build prompt + messages', color: '#7c3aed' },
  { fromId: 'g1', toId: 'e1b', label: 'Stream chunks naar client', color: '#7c3aed' },
  { fromId: 'e1b', toId: 'n4', label: 'Client ontvangt stream', color: '#1d4ed8' },
  { fromId: 'n6', toId: 'e2', label: 'POST /api/recommend: scenario + modellen', color: '#1d4ed8' },
  { fromId: 'e2', toId: 'g2', label: 'Rank & reason 111 modellen', color: '#7c3aed' },
  { fromId: 'g2', toId: 'e2b', label: 'Return JSON scores', color: '#7c3aed' },
  { fromId: 'e2b', toId: 'n7', label: 'Toon aanbevelingen', color: '#1d4ed8' },
  { fromId: 'n9', toId: 'e3', label: '/api/getting-started', color: '#1d4ed8' },
  { fromId: 'e3', toId: 'g3', label: 'Use case + gids', color: '#7c3aed' },
  { fromId: 'n10', toId: 'e4', label: '/api/hf-models', color: '#1d4ed8' },
  { fromId: 'e4', toId: 'h1', label: 'Model search', color: '#0369a1' },
  { fromId: 'n11', toId: 'e5', label: '/api/playground', color: '#1d4ed8' },
  { fromId: 'e5', toId: 'g4', label: '3× parallel inference', color: '#7c3aed' },
  { fromId: 'n12', toId: 'e6', label: '/api/image-gen', color: '#1d4ed8' },
  { fromId: 'e6', toId: 'h2', label: 'FLUX.1 / SD3 inference', color: '#0369a1' },
  { fromId: 'n14', toId: 's1', label: 'INSERT via anon key', color: '#065f46' },
];

function createMarker(svg: SVGSVGElement) {
  const svgNS = 'http://www.w3.org/2000/svg';
  const defs = document.createElementNS(svgNS, 'defs');
  const marker = document.createElementNS(svgNS, 'marker');
  marker.setAttribute('id', 'arrowhead');
  marker.setAttribute('markerWidth', '8');
  marker.setAttribute('markerHeight', '6');
  marker.setAttribute('refX', '8');
  marker.setAttribute('refY', '3');
  marker.setAttribute('orient', 'auto');
  marker.setAttribute('markerUnits', 'strokeWidth');

  const poly = document.createElementNS(svgNS, 'polygon');
  poly.setAttribute('points', '0 0, 8 3, 0 6');
  poly.setAttribute('fill', '#64748b');
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
  rect.setAttribute('fill', 'rgba(255,255,255,0.9)');
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
  overlay.setAttribute('viewBox', `0 0 ${Math.max(containerRect.width, 2800)} ${Math.max(containerRect.height, 900)}`);

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
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
      <div className="relative min-w-[2800px] min-h-[760px] p-5" ref={containerRef}>
        <svg ref={overlayRef} className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" />

        <div className="grid min-w-[2800px] grid-cols-5 gap-8 text-sm text-slate-800">
          <div className="min-w-[360px] space-y-5">
            <div className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white">Browser / React</div>
            <div className="grid grid-cols-2 gap-4">
              <div id="n1" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm">
                <div className="text-sm font-semibold">App start</div>
                <div className="mt-2 text-sm text-slate-600">Laadt modellen, prijzen en GDPR-data</div>
              </div>
              <div id="n2" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm">
                <div className="text-sm font-semibold">Gebruiker kiest</div>
                <div className="mt-2 text-sm text-slate-600">Start advies, kies use case of model</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div id="n3" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm">
                <div className="text-sm font-semibold">POST /api/chat</div>
                <div className="mt-2 text-sm text-slate-600">Verstuurt de vraag + context naar Edge</div>
              </div>
              <div id="n4" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm">
                <div className="text-sm font-semibold">Streaming antwoord</div>
                <div className="mt-2 text-sm text-slate-600">UI toont chunks terwijl Groq streamt</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div id="n6" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm">
                <div className="text-sm font-semibold">POST /api/recommend</div>
                <div className="mt-2 text-sm text-slate-600">Stuurt scenario en modeldata naar Edge</div>
              </div>
              <div id="n7" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm">
                <div className="text-sm font-semibold">Toon aanbevelingen</div>
                <div className="mt-2 text-sm text-slate-600">UI toont ranking, score en reasoning</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div id="n9" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm">
                <div className="text-sm font-semibold">Getting started</div>
                <div className="mt-2 text-sm text-slate-600">Laadt use case gids en codevoorbeelden</div>
              </div>
              <div id="n10" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm">
                <div className="text-sm font-semibold">Model Explorer</div>
                <div className="mt-2 text-sm text-slate-600">Zoekt en toont trending modellen</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div id="n11" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm">
                <div className="text-sm font-semibold">Playground</div>
                <div className="mt-2 text-sm text-slate-600">Voert prompts uit met meerdere modellen</div>
              </div>
              <div id="n12" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm">
                <div className="text-sm font-semibold">Image gen</div>
                <div className="mt-2 text-sm text-slate-600">Genereert afbeeldingen via API</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div id="n13" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm">
                <div className="text-sm font-semibold">PDF export</div>
                <div className="mt-2 text-sm text-slate-600">Maakt rapporten en samenvattingen</div>
              </div>
              <div id="n14" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm">
                <div className="text-sm font-semibold">Feedback</div>
                <div className="mt-2 text-sm text-slate-600">Verstuurt gebruikersfeedback naar Supabase</div>
              </div>
            </div>
          </div>

          <div className="min-w-[360px] space-y-5">
            <div className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white">Vercel Edge</div>
            <div className="grid grid-cols-2 gap-4">
              <div id="e1" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm">
                <div className="text-sm font-semibold">/api/chat</div>
                <div className="mt-2 text-sm text-slate-600">Opbouw prompt en doorsturen naar Groq</div>
              </div>
              <div id="e1b" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm">
                <div className="text-sm font-semibold">Streaming</div>
                <div className="mt-2 text-sm text-slate-600">Stuur SSE chunks terug naar browser</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div id="e2" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm">
                <div className="text-sm font-semibold">/api/recommend</div>
                <div className="mt-2 text-sm text-slate-600">Rankt 111 modellen en geeft reasoning</div>
              </div>
              <div id="e2b" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm">
                <div className="text-sm font-semibold">JSON antwoord</div>
                <div className="mt-2 text-sm text-slate-600">Bevat score, ranking en aanbeveling</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div id="e3" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm">
                <div className="text-sm font-semibold">/api/getting-started</div>
                <div className="mt-2 text-sm text-slate-600">Bereidt use case gids voor</div>
              </div>
              <div id="e4" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm">
                <div className="text-sm font-semibold">/api/hf-models</div>
                <div className="mt-2 text-sm text-slate-600">Zoekt trending modellen bij HuggingFace</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div id="e5" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm">
                <div className="text-sm font-semibold">/api/playground</div>
                <div className="mt-2 text-sm text-slate-600">3 modellen parallel uitvoeren</div>
              </div>
              <div id="e6" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm">
                <div className="text-sm font-semibold">/api/image-gen</div>
                <div className="mt-2 text-sm text-slate-600">Start beeldgeneratie via API</div>
              </div>
            </div>
          </div>

          <div className="min-w-[360px] space-y-5">
            <div className="rounded-2xl bg-violet-600 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white">Groq API</div>
            <div className="grid grid-cols-2 gap-4">
              <div id="g1" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm">
                <div className="text-sm font-semibold">Llama 3.3 70B chat</div>
                <div className="mt-2 text-sm text-slate-600">Streamt antwoord en genereert prompt</div>
              </div>
              <div id="g2" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm">
                <div className="text-sm font-semibold">Llama 3.3 70B ranking</div>
                <div className="mt-2 text-sm text-slate-600">Rangt 111 modellen en geeft reasoning</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div id="g3" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm">
                <div className="text-sm font-semibold">Use case gids</div>
                <div className="mt-2 text-sm text-slate-600">Prepareert code & uitleg</div>
              </div>
              <div id="g4" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm">
                <div className="text-sm font-semibold">Parallel inference</div>
                <div className="mt-2 text-sm text-slate-600">3× tegelijk resultaten terug</div>
              </div>
            </div>
          </div>

          <div className="min-w-[360px] space-y-5">
            <div className="rounded-2xl bg-sky-900 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white">HuggingFace</div>
            <div className="grid grid-cols-2 gap-4">
              <div id="h1" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm">
                <div className="text-sm font-semibold">Model Search API</div>
                <div className="mt-2 text-sm text-slate-600">Haalt trending modellen op</div>
              </div>
              <div id="h2" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm">
                <div className="text-sm font-semibold">FLUX.1 / SD3</div>
                <div className="mt-2 text-sm text-slate-600">Image inference via HuggingFace</div>
              </div>
            </div>
          </div>

          <div className="min-w-[360px] space-y-5">
            <div className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white">Supabase</div>
            <div className="h-[240px]" />
            <div id="s1" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm">
              <div className="text-sm font-semibold">student_feedback</div>
              <div className="mt-2 text-sm text-slate-600">INSERT via anon key · alleen opnemen</div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-slate-900" />Browser / React</div>
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-sky-600" />Vercel Edge</div>
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-violet-600" />Groq API</div>
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-sky-900" />HuggingFace</div>
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-emerald-700" />Supabase</div>
        </div>
      </div>
    </div>
  );
}
