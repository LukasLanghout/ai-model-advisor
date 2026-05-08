export const config = { runtime: 'edge' };

export interface HFModel {
  id: string;
  downloads: number;
  likes: number;
  gated: boolean | string;
  private: boolean;
  pipeline_tag?: string;
  inference?: string;
  tags?: string[];
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const { searchParams } = new URL(request.url);
  const search  = searchParams.get('search') || '';
  const sort    = searchParams.get('sort')   || 'downloads';
  const limit   = Math.min(Number(searchParams.get('limit') || '24'), 50);
  const warmOnly = searchParams.get('warm') !== 'false';

  const hfToken = process.env.HUGGINGFACE_TOKEN;

  const params = new URLSearchParams({
    pipeline_tag: 'text-generation',
    sort,
    direction: '-1',
    limit: String(limit),
    full: 'false',
    config: 'false',
    ...(search   ? { search }             : {}),
    ...(warmOnly ? { inference: 'warm' }  : {}),
  });

  const res = await fetch(`https://huggingface.co/api/models?${params}`, {
    headers: {
      ...(hfToken ? { Authorization: `Bearer ${hfToken}` } : {}),
      'User-Agent': 'ai-model-advisor/1.0',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    return new Response(
      JSON.stringify({ error: `HuggingFace API fout (${res.status})`, detail: text }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const raw = await res.json() as HFModel[];

  // Return only the fields we need — keep payload small
  const models = raw.map((m) => ({
    id:           m.id,
    downloads:    m.downloads,
    likes:        m.likes,
    gated:        !!m.gated,
    inference:    m.inference ?? 'unknown',
    pipeline_tag: m.pipeline_tag,
    tags:         (m.tags ?? []).filter((t) =>
      ['llama', 'mistral', 'gemma', 'qwen', 'deepseek', 'phi', 'falcon',
       'code', 'chat', 'instruct', 'gguf'].includes(t.toLowerCase())
    ).slice(0, 4),
  }));

  return new Response(JSON.stringify(models), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' },
  });
}
