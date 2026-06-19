import { useEffect, useRef } from 'react';

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

function drawArrow(svg: SVGSVGElement, fromEl: HTMLElement, toEl: HTMLElement, label: string, color: string, curvature = 0) {
  const container = svg.parentElement;
  if (!container) return;

  const containerRect = container.getBoundingClientRect();
  const fromRect = fromEl.getBoundingClientRect();
  const toRect = toEl.getBoundingClientRect();

  const x1 = fromRect.right - containerRect.left;
  const y1 = fromRect.top + fromRect.height / 2 - containerRect.top;
  const x2 = toRect.left - containerRect.left;
  const y2 = toRect.top + toRect.height / 2 - containerRect.top;

  const mx = (x1 + x2) / 2;
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', `M${x1},${y1} C${mx + curvature},${y1} ${mx - curvature},${y2} ${x2},${y2}`);
  path.setAttribute('stroke', color);
  path.setAttribute('stroke-width', '1.6');
  path.setAttribute('fill', 'none');
  path.setAttribute('marker-end', 'url(#arrowhead)');
  svg.appendChild(path);

  const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  txt.setAttribute('x', String(mx));
  txt.setAttribute('y', String((y1 + y2) / 2 - 8));
  txt.setAttribute('text-anchor', 'middle');
  txt.setAttribute('font-size', '10');
  txt.setAttribute('fill', '#334155');
  txt.setAttribute('font-family', 'Segoe UI, sans-serif');
  txt.textContent = label;
  svg.appendChild(txt);

  const bbox = txt.getBBox();
  const pad = 5;
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('x', String(bbox.x - pad));
  bg.setAttribute('y', String(bbox.y - pad));
  bg.setAttribute('width', String(bbox.width + pad * 2));
  bg.setAttribute('height', String(bbox.height + pad * 2));
  bg.setAttribute('fill', '#ffffff');
  bg.setAttribute('stroke', '#e2e8f0');
  bg.setAttribute('stroke-width', '1');
  bg.setAttribute('rx', '4');
  bg.setAttribute('ry', '4');
  svg.insertBefore(bg, txt);
}

function drawAllArrows(overlay: SVGSVGElement, container: HTMLElement) {
  overlay.innerHTML = '';
  createMarker(overlay);

  const containerRect = container.getBoundingClientRect();
  overlay.setAttribute('viewBox', `0 0 ${Math.max(containerRect.width, 1000)} ${Math.max(containerRect.height, 1000)}`);

  for (const arrow of ARROWS) {
    const fromEl = document.getElementById(arrow.fromId);
    const toEl = document.getElementById(arrow.toId);
    if (!fromEl || !toEl) continue;
    drawArrow(overlay, fromEl, toEl, arrow.label, arrow.color, arrow.curvature ?? 0);
  }
}

export default function ArchitectuurDiagram() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    if (!container || !overlay) return;

    const render = () => drawAllArrows(overlay, container);
    render();

    const observer = new ResizeObserver(() => render());
    observer.observe(container);
    window.addEventListener('resize', render);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', render);
    };
  }, []);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
      <div className="diagram-wrap relative min-w-[1200px]" ref={containerRef}>
        <svg ref={overlayRef} className="overlay-svg absolute inset-0 w-full h-full pointer-events-none" />

        <div className="flex items-stretch gap-0">
          <div className="min-w-[220px] p-4 border-r border-slate-200 flex flex-col gap-3">
            <div className="lane-head lh-browser">Browser / React</div>
            <div className="node node-start mx-auto" />
            <div id="n1" className="node n-browser">
              App laden
              <div className="text-[11px] text-slate-600 mt-1">Introscherm + lokale data (111 modellen, prijzen, GDPR)</div>
            </div>
            <div className="arrow-down" style={{ height: '14px' }} />
            <div id="n2" className="node n-browser">
              Gebruiker klikt
              <div className="text-[11px] text-slate-600 mt-1">"Start Advisor"</div>
            </div>
            <div className="arrow-down" style={{ height: '14px' }} />
            <div className="phase-label">Discovery</div>
            <div id="n3" className="node n-browser">
              Vraag versturen
              <div className="text-[11px] text-slate-600 mt-1">7× herhaling</div>
            </div>
            <div className="arrow-down" style={{ height: '14px' }} />
            <div id="n4" className="node n-browser">
              Antwoord tonen
              <div className="text-[11px] text-slate-600 mt-1">stream chunk voor chunk</div>
            </div>
            <div className="arrow-down" style={{ height: '14px' }} />
            <div className="phase-label">Aanbeveling</div>
            <div id="n5" className="node n-browser">
              Scenario-object opbouwen
            </div>
            <div className="arrow-down" style={{ height: '14px' }} />
            <div id="n6" className="node n-browser">
              POST /api/recommend
              <div className="text-[11px] text-slate-600 mt-1">+ 111 modellen + 8 regels</div>
            </div>
            <div className="arrow-down" style={{ height: '14px' }} />
            <div id="n7" className="node n-browser">
              Resultaten tonen
              <div className="text-[11px] text-slate-600 mt-1">6 tabbladen</div>
            </div>
            <div className="arrow-down" style={{ height: '16px' }} />
            <div className="phase-label">Acties na resultaat</div>
            <div id="n8" className="node n-decision">Actie?</div>
            <div className="sp" />
            <div id="n9" className="node n-browser text-[11px]">Getting-started gids laden</div>
            <div className="sp-sm" />
            <div id="n10" className="node n-browser text-[11px]">Model Explorer zoeken</div>
            <div className="sp-sm" />
            <div id="n11" className="node n-browser text-[11px]">Playground tekst uitvoeren</div>
            <div className="sp-sm" />
            <div id="n12" className="node n-browser text-[11px]">Afbeelding genereren</div>
            <div className="sp-sm" />
            <div id="n13" className="node n-browser text-[11px]">PDF exporteren</div>
            <div className="sp-sm" />
            <div id="n14" className="node n-browser text-[11px]">Feedback insturen</div>
            <div className="sp" />
            <div className="arrow-down" style={{ height: '14px' }} />
            <div className="node node-end mx-auto" />
          </div>

          <div className="min-w-[220px] p-4 border-r border-slate-200 flex flex-col gap-3">
            <div className="lane-head lh-edge">Vercel Edge</div>
            <div style={{ height: '68px' }} />
            <div id="e1" className="node n-edge">
              /api/chat
              <div className="text-[11px] text-slate-600 mt-1">Edge · 25s timeout · prompt opbouwen</div>
            </div>
            <div className="arrow-down" style={{ height: '14px' }} />
            <div id="e1b" className="node n-edge text-[11px]">Streaming chunks terug naar client</div>
            <div style={{ height: '70px' }} />
            <div id="e2" className="node n-edge">
              /api/recommend
              <div className="text-[11px] text-slate-600 mt-1">Edge · 25s timeout · 111 modellen + 8 regels</div>
            </div>
            <div className="arrow-down" style={{ height: '14px' }} />
            <div id="e2b" className="node n-edge text-[11px]">JSON aanbevelingen terug naar client</div>
            <div style={{ height: '60px' }} />
            <div id="e3" className="node n-edge text-[11px]">/api/getting-started · Edge · 25s</div>
            <div className="sp" />
            <div id="e4" className="node n-edge text-[11px]">/api/hf-models · Edge · 25s</div>
            <div className="sp" />
            <div id="e5" className="node n-edge text-[11px]">/api/playground · Edge · 3 modellen parallel</div>
            <div className="sp" />
            <div id="e6" className="node n-edge text-[11px]">/api/image-gen · Node · 60s timeout</div>
          </div>

          <div className="min-w-[220px] p-4 border-r border-slate-200 flex flex-col gap-3">
            <div className="lane-head lh-groq">Groq API</div>
            <div style={{ height: '90px' }} />
            <div id="g1" className="node n-groq">
              Llama 3.3 70B
              <div className="text-[11px] text-slate-600 mt-1">Streaming response · ~300 tokens/sec</div>
            </div>
            <div style={{ height: '80px' }} />
            <div id="g2" className="node n-groq">
              Llama 3.3 70B
              <div className="text-[11px] text-slate-600 mt-1">Scoort 111 modellen · past 8 regels toe · JSON output</div>
            </div>
            <div style={{ height: '100px' }} />
            <div id="g3" className="node n-groq text-[11px]">Llama 3.3 70B · use-case gids + code</div>
            <div style={{ height: '80px' }} />
            <div id="g4" className="node n-groq text-[11px]">3× Llama parallel · stream responses</div>
          </div>

          <div className="min-w-[220px] p-4 border-r border-slate-200 flex flex-col gap-3">
            <div className="lane-head lh-hf">HuggingFace</div>
            <div style={{ height: '320px' }} />
            <div id="h1" className="node n-hf">
              Model Search API
              <div className="text-[11px] text-slate-600 mt-1">live trending modellen</div>
            </div>
            <div style={{ height: '70px' }} />
            <div id="h2" className="node n-hf">
              FLUX.1-schnell<br />Stable Diffusion 3
              <div className="text-[11px] text-slate-600 mt-1">Inference API</div>
            </div>
          </div>

          <div className="min-w-[220px] p-4 flex flex-col gap-3">
            <div className="lane-head lh-supa">Supabase</div>
            <div style={{ height: '420px' }} />
            <div id="s1" className="node n-supa">
              student_feedback
              <div className="text-[11px] text-slate-600 mt-1">INSERT via anon key · RLS: alleen invoegen</div>
            </div>
          </div>
        </div>

        <div className="legend mt-6">
          <div className="leg-item"><span className="leg-dot" style={{ background: '#334155' }} />Browser / React</div>
          <div className="leg-item"><span className="leg-dot" style={{ background: '#1d4ed8' }} />Vercel Edge Function</div>
          <div className="leg-item"><span className="leg-dot" style={{ background: '#7c3aed' }} />Groq API (Llama 3.3 70B)</div>
          <div className="leg-item"><span className="leg-dot" style={{ background: '#0369a1' }} />HuggingFace API</div>
          <div className="leg-item"><span className="leg-dot" style={{ background: '#065f46' }} />Supabase (PostgreSQL)</div>
        </div>
      </div>
    </div>
  );
}
