export async function POST(request) {
  const { entries } = await request.json();

  if (!entries || entries.length === 0) {
    return Response.json({ summary: "Start writing, and I'll summarize your week here." });
  }

  const context = entries
    .map((e) => `[${e.category}, ${e.date}] ${Object.values(e.fields || {}).filter(Boolean).join(" | ")}`)
    .join("\n");

  const prompt = `Based on these personal journal entries from the last week, write a warm, brief 2-3 sentence recap — like a gentle friend reflecting back what they noticed. Mention specific themes or moments if relevant, but keep it short and natural.

ENTRIES:
${context}

Recap:`;

  const res = await fetch(
   `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );

  const data = await res.json();
  console.log("GEMINI RAW:", JSON.stringify(data).slice(0, 300));
  const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || "Couldn't generate a summary right now.";

  return Response.json({ summary });
}