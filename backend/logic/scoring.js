function avg(answers, indices) {
  return indices.reduce((sum, i) => sum + answers[i], 0) / indices.length
}

const RATIONALE = {
  'Late Fusion':
    'Your profile prioritises operational efficiency — real-time performance, cost control, noise tolerance, and synchronisation. Late Fusion combines modality-specific models independently before merging decisions, keeping latency low while remaining resilient to noisy or out-of-sync streams. (Krishnamurthy et al., 2024)',
  'Deep Feature Fusion':
    'Your profile prioritises accuracy and trust — explainability, transparency, and high detection quality. Deep Feature Fusion jointly trains on audio-visual representations, enabling richer cross-modal reasoning and more interpretable confidence scores. (Krishnamurthy et al., 2024)',
}

const BONUS_TEXTS = {
  knowledgeDistillation:
    'Given your tight compute/cost constraints, consider Knowledge Distillation: compress the full fusion model into a lightweight student network that preserves most accuracy at a fraction of the inference cost. (Karimi et al., 2022)',
  openSourceLLM:
    'Given your need for technological independence and internal data control, consider grounding your system in open-source LLMs (e.g. Mistral, LLaMA) to avoid vendor lock-in and keep all data on-premises.',
}

function calculateRecommendation(answers) {
  const operationalEfficiency = avg(answers, [0, 1, 4, 5, 6, 7])
  const accuracyAndTrust = avg(answers, [2, 3, 10, 11])
  const economic = avg(answers, [4, 5])
  const strategic = avg(answers, [8, 9])

  const recommendation =
    operationalEfficiency > accuracyAndTrust ? 'Late Fusion' : 'Deep Feature Fusion'

  const bonuses = []
  if (economic >= 4) {
    bonuses.push({ type: 'knowledgeDistillation', text: BONUS_TEXTS.knowledgeDistillation })
  }
  if (strategic >= 4) {
    bonuses.push({ type: 'openSourceLLM', text: BONUS_TEXTS.openSourceLLM })
  }

  return {
    recommendation,
    rationale: RATIONALE[recommendation],
    scores: {
      operationalEfficiency: Math.round(operationalEfficiency * 100) / 100,
      accuracyAndTrust: Math.round(accuracyAndTrust * 100) / 100,
      economic: Math.round(economic * 100) / 100,
      strategic: Math.round(strategic * 100) / 100,
    },
    bonuses,
  }
}

module.exports = { calculateRecommendation }

