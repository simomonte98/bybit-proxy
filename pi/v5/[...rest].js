export default async function handler(req, res) {
  try {
    const rest = Array.isArray(req.query.rest)
      ? req.query.rest.join("/")
      : (req.query.rest || "");
    const qsIndex = req.url.indexOf("?");
    const qs = qsIndex !== -1 ? req.url.slice(qsIndex) : "";
    const upstream = `https://api.bybit.com/v5/${rest}${qs}`;

    const r = await fetch(upstream, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Vercel)",
        "Accept": "application/json"
      }
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
