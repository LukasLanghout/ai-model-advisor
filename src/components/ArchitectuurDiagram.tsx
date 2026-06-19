import { useLayoutEffect, useRef } from 'react';

type Arrow = {
  fromId: string;
  toId: string;
  label: string;
  color: string;
  curvature?: number;
};

const ARROWS: Arrow[] = [
  { fromId: 'n3', toId: 'e1', label: 'POST /api/chat + user msg', color: '#1d4ed8' },
  { fromId: 'e1', toId: 'g1', label: 'messages[] + system prompt', color: '#7c3aed' },
  { fromId: 'g1', toId: 'e1b', label: 'SSE stream chunks', color: '#7c3aed' },
  { fromId: 'e1b', toId: 'n4', label: 'ReadableStream', color: '#1d4ed8' },
  { fromId: 'n6', toId: 'e2', label: 'POST scenario + modellen', color: '#1d4ed8' },
  { fromId: 'e2', toId: 'g2', label: 'prompt: 111 modellen + 8 regels', color: '#7c3aed' },
  { fromId: 'g2', toId: 'e2b', label: 'JSON: rank, score, reasoning', color: '#7c3aed' },
  { fromId: 'e2b', toId: 'n7', label: 'JSON aanbevelingen', color: '#1d4ed8' },
  { fromId: 'n9', toId: 'e3', label: '/api/getting-started', color: '#1d4ed8' },
  { fromId: 'e3', toId: 'g3', label: 'model + use case', color: '#7c3aed' },
  { fromId: 'n10', toId: 'e4', label: '/api/hf-models', color: '#1d4ed8' },
  { fromId: 'e4', toId: 'h1', label: 'GET trending models', color: '#0369a1' },
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

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', `M${start.x},${start.y} C${midX + curvature},${start.y} ${midX - curvature},${end.y} ${end.x},${end.y}`);
  path.setAttribute('stroke', color);
  path.setAttribute('stroke-width', '1.6');
  path.setAttribute('fill', 'none');
  path.setAttribute('marker-end', 'url(#arrowhead)');
  path.setAttribute('stroke-linecap', 'round');
  svg.appendChild(path);

  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', String(midX));
  text.setAttribute('y', String((start.y + end.y) / 2 - 10));
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('font-size', '10');
  text.setAttribute('fill', '#334155');
  text.setAttribute('font-family', 'Segoe UI, sans-serif');
  text.textContent = label;
  svg.appendChild(text);

  const bbox = text.getBBox();
  const pad = 5;
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', String(bbox.x - pad));
  rect.setAttribute('y', String(bbox.y - pad));
  rect.setAttribute('width', String(bbox.width + pad * 2));
  rect.setAttribute('height', String(bbox.height + pad * 2));
  rect.setAttribute('fill', '#ffffff');
  rect.setAttribute('stroke', '#e2e8f0');
  rect.setAttribute('stroke-width', '1');
  rect.setAttribute('rx', '4');
  rect.setAttribute('ry', '4');
  svg.insertBefore(rect, text);
}

function renderArrows(overlay: SVGSVGElement, container: HTMLElement) {
  overlay.innerHTML = '';
  createMarker(overlay);

  const containerRect = container.getBoundingClientRect();
  overlay.setAttribute('viewBox', `0 0 ${Math.max(containerRect.width, 2400)} ${Math.max(containerRect.height, 800)}`);

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
      <div className="relative min-w-[2400px] min-h-[620px] p-4" ref={containerRef}>
        <svg ref={overlayRef} className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" />

        <div className="grid min-w-[2400px] grid-cols-5 gap-8 text-sm text-slate-800">
          <div className="min-w-[320px] space-y-4">
            <div className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">Browser / React</div>
            <div className="grid grid-cols-2 gap-3">
              <div id="n1" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm">
                <div className="font-semibold">App laden</div>
                <div className="mt-2 text-xs text-slate-600">Introscherm + lokale data (111 modellen, prijzen, GDPR)</div>
              </div>
              <div id="n2" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm">
                <div className="font-semibold">Gebruiker klikt</div>
                <div className="mt-2 text-xs text-slate-600">"Start Advisor"</div>
              </div>
            </div>
            <div className="rounded-2xl border-l-4 border-blue-500 bg-blue-50 p-3 text-xs text-slate-700">Discovery</div>
            <div className="grid grid-cols-2 gap-3">
              <div id="n3" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm">
                <div className="font-semibold">Vraag versturen</div>
                <div className="mt-2 text-xs text-slate-600">7× herhaling</div>
              </div>
              <div id="n4" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm">
                <div className="font-semibold">Antwoord tonen</div>
                <div className="mt-2 text-xs text-slate-600">stream chunk voor chunk</div>
              </div>
            </div>
            <div className="rounded-2xl border-l-4 border-emerald-500 bg-emerald-50 p-3 text-xs text-slate-700">Aanbeveling</div>
            <div className="grid grid-cols-2 gap-3">
              <div id="n5" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm">Scenario-object opbouwen</div>
              <div id="n6" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm">
                <div className="font-semibold">POST /api/recommend</div>
                <div className="mt-2 text-xs text-slate-600">+ 111 modellen + 8 regels</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div id="n7" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm">
                <div className="font-semibold">Resultaten tonen</div>
                <div className="mt-2 text-xs text-slate-600">6 tabbladen</div>
              </div>
              <div id="n8" className="rounded-full border border-amber-300 bg-amber-100 p-3 text-center text-xs font-semibold text-amber-800">Actie?</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div id="n9" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm text-xs">Getting-started gids laden</div>
              <div id="n10" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm text-xs">Model Explorer zoeken</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div id="n11" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm text-xs">Playground tekst uitvoeren</div>
              <div id="n12" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm text-xs">Afbeelding genereren</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div id="n13" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm text-xs">PDF exporteren</div>
              <div id="n14" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm text-xs">Feedback insturen</div>
            </div>
          </div>

          <div className="min-w-[320px] space-y-4">
            <div className="rounded-2xl bg-sky-600 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">Vercel Edge</div>
            <div className="grid grid-cols-2 gap-3">
              <div id="e1" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm">
                <div className="font-semibold">/api/chat</div>
                <div className="mt-2 text-xs text-slate-600">Edge · 25s timeout · prompt opbouwen</div>
              </div>
              <div id="e1b" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm text-xs">Streaming chunks terug naar client</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div id="e2" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm">
                <div className="font-semibold">/api/recommend</div>
                <div className="mt-2 text-xs text-slate-600">Edge · 25s timeout · 111 modellen + 8 regels</div>
              </div>
              <div id="e2b" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm text-xs">JSON aanbevelingen terug naar client</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div id="e3" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm text-xs">/api/getting-started · Edge · 25s</div>
              <div id="e4" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm text-xs">/api/hf-models · Edge · 25s</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div id="e5" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm text-xs">/api/playground · Edge · 3 modellen parallel</div>
              <div id="e6" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm text-xs">/api/image-gen · Node · 60s timeout</div>
            </div>
          </div>

          <div className="min-w-[320px] space-y-4">
            <div className="rounded-2xl bg-violet-600 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">Groq API</div>
            <div className="grid grid-cols-2 gap-3">
              <div id="g1" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm">
                <div className="font-semibold">Llama 3.3 70B</div>
                <div className="mt-2 text-xs text-slate-600">Streaming response · ~300 tokens/sec</div>
              </div>
              <div id="g2" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm">
                <div className="font-semibold">Llama 3.3 70B</div>
                <div className="mt-2 text-xs text-slate-600">Scoort 111 modellen · past 8 regels toe · JSON output</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div id="g3" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm text-xs">Llama 3.3 70B · use-case gids + code</div>
              <div id="g4" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm text-xs">3× Llama parallel · stream responses</div>
            </div>
          </div>

          <div className="min-w-[320px] space-y-4">
            <div className="rounded-2xl bg-sky-900 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">HuggingFace</div>
            <div className="grid grid-cols-2 gap-3">
              <div id="h1" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm">
                <div className="font-semibold">Model Search API</div>
                <div className="mt-2 text-xs text-slate-600">live trending modellen</div>
              </div>
              <div id="h2" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm">
                <div className="font-semibold">FLUX.1-schnell</div>
                <div className="text-xs text-slate-600 mt-1">Stable Diffusion 3 · Inference API</div>
              </div>
            </div>
          </div>

          <div className="min-w-[320px] space-y-4">
            <div className="rounded-2xl bg-emerald-700 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">Supabase</div>
            <div className="h-[240px]" />
            <div id="s1" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm">
              <div className="font-semibold">student_feedback</div>
              <div className="mt-2 text-xs text-slate-600">INSERT via anon key · RLS: alleen invoegen</div>
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
