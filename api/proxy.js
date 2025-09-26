export default async function handler(req, res) {
  try {
    // es: /api/proxy?path=market/tickers&category=spot&symbol=BTCUSDT
    const { path, ...rest } = req.query;
    if (!path) return res.status(400).json({ error: "missing ?path=" });

    const qs = new URLSearchParams(rest).toString();
    const upstream = `https://api.bybit.com/v5/${path}${qs ? `?${qs}` : ""}`;

    const r = await fetch(upstream, {
      headers: { "User-Agent": "Mozilla/5.0 (Vercel)", "Accept": "application/json" }
    });

    const body = await r.text();
    res.status(r.status);
    res.setHeader("content-type", r.headers.get("content-type") || "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.send(body);
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
