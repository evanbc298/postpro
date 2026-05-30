const UPLOAD_POST_BASE = 'https://api.upload-post.com/v1'

interface PublishOptions {
  apiKey: string
  platforms: ('instagram' | 'facebook')[]
  caption: string
  mediaUrls: string[]
  scheduleAt?: string // ISO date string
}

export async function publishContent(options: PublishOptions) {
  const { apiKey, platforms, caption, mediaUrls, scheduleAt } = options

  const body: Record<string, unknown> = {
    platforms,
    caption,
    media: mediaUrls.map(url => ({ url })),
  }

  if (scheduleAt) body.schedule_at = scheduleAt

  const res = await fetch(`${UPLOAD_POST_BASE}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || 'Erro ao publicar via Upload-Post')
  }

  return res.json()
}
