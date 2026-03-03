interface SendResultsPayload {
  email?: string
  globalScore?: number
  verdict?: {
    label?: string
  }
  checkpointScores?: Array<{
    title: string
    score: number
  }>
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export default defineEventHandler(async (event) => {
  const body = await readBody<SendResultsPayload>(event)
  const email = body.email?.trim()

  if (!email) {
    throw createError({ statusCode: 400, statusMessage: 'Email requis.' })
  }

  const config = useRuntimeConfig(event)

  if (!config.resendApiKey) {
    return {
      success: true,
      message: "Recap pret. Configure RESEND_API_KEY pour activer l'envoi automatique."
    }
  }

  const scoreRows = (body.checkpointScores || [])
    .map((item) => `<li>${escapeHtml(item.title)}: <strong>${item.score}/100</strong></li>`)
    .join('')

  const html = `
    <h2>Ton recap de validation SaaS</h2>
    <p><strong>Score global:</strong> ${body.globalScore ?? 0}/100</p>
    <p><strong>Verdict:</strong> ${escapeHtml(body.verdict?.label || 'N/A')}</p>
    <ul>${scoreRows}</ul>
    <p>- Orange Bleu</p>
  `

  await $fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`
    },
    body: {
      from: 'Orange Bleu <noreply@orangebleu.dev>',
      to: [email],
      subject: 'Ton recap de validation SaaS',
      html
    }
  })

  return {
    success: true,
    message: 'Recap envoye par email.'
  }
})
