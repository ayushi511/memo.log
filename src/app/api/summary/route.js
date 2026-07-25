export async function POST(request) {
  const { question, entries, timeframe } = await request.json();

  if (!entries || entries.length === 0) {
    return Response.json({ summary: `Start writing, and I'll summarize your ${timeframe || "week"} here.` });
  }

  const context = entries
    .map((e) => `[${e.category}, ${e.date}] ${Object.values(e.fields || {}).filter(Boolean).join(" | ")}`)
    .join("\n");

  const period = timeframe === "month" ? "month" : timeframe === "year" ? "year" : "week";
  const length = period === "year" ? "4-6 sentences" : period === "month" ? "3-4 sentences" : "2-3 sentences";

  const prompt = `Based on these personal journal entries from the last ${period}, write a warm, ${length} recap — like a gentle friend reflecting back what they noticed. Mention specific themes, growth, or moments if relevant.

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
  const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || "Couldn't generate a summary right now.";

  return Response.json({ summary });
}