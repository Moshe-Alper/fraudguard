export async function getRecommendation(path, answers, redirected) {
  const response = await fetch('/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, answers, redirected })
  })
  if (!response.ok) throw new Error('Request failed')
  return response.json()
}
