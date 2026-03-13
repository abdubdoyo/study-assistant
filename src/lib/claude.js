export async function generateStudyMaterials(text) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-calls': 'true'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `You are a study assistant. Analyze these notes and return ONLY a JSON object with no extra text or markdown.

The JSON must follow this exact structure:
{
  "summary": "2-3 sentence overview of the topic",
  "flashcards": [
    { "front": "question", "back": "answer" }
  ],
  "quiz": [
    {
      "question": "question text",
      "options": ["A", "B", "C", "D"],
      "answer": "A"
    }
  ]
}

Generate 6 flashcards and 4 quiz questions.

Notes to analyze:
${text}`
        }
      ]
    })
  })

  const data = await response.json()
  const content = data.content[0].text
  return JSON.parse(content)
}