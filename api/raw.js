const FIREBASE_URL = "https://project1-f57d6-default-rtdb.asia-southeast1.firebasedatabase.app";

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "GET") {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(405).send("-- Method not allowed");
  }

  const { slug } = req.query;

  if (!slug) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(400).send("-- Slug wajib diisi");
  }

  try {
    const fbRes = await fetch(`${FIREBASE_URL}/pastes/${slug}.json`);
    const data = await fbRes.json();

    if (!data || !data.code) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      return res.status(404).send("-- Paste not found");
    }

    // Increment views (fire & forget)
    fetch(`${FIREBASE_URL}/pastes/${slug}/views.json`, {
      method: "PUT",
      body: JSON.stringify((data.views || 0) + 1)
    }).catch(() => {});

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300");
    return res.status(200).send(data.code);
  } catch (e) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(500).send("-- Server error: " + e.message);
  }
                                      }
