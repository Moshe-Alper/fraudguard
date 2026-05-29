export async function getRecommendation(answers) {
  const response = await fetch('/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers })
  })
  if (!response.ok) throw new Error('Request failed')
  return response.json()
}
