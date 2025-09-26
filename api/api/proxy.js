// Edge Function per forzare la regione e semplificare il routing
export const config = { runtime: "edge", regions: ["sin1"] };

export default async function handler(req) {
  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("path") || "";
    url.searchParams.delete("path");
    const qs = url.search ? `?${url.searchParams.toString()}` : "";
    const upstream = `https://api.bybit.com/v5/${path}${qs}`;

    const r = await fetch(upstream, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Vercel-Edge)",
        "Accept": "application/json"
      }
    });

    return new Response(r.body, {
      status: r.status,
      headers: {
        "content-type": r.headers.get("content-type") || "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { "content-type": "application/json" }
    });
  }
}
