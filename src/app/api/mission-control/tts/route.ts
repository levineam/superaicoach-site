import { NextRequest, NextResponse } from 'next/server'

import { getServerSession } from '@/lib/mission-control/auth'

export async function POST(request: NextRequest) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'TTS not configured' }, { status: 503 })
  }

  const { text } = await request.json()
  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'text is required' }, { status: 400 })
  }

  // Use Adam voice (natural, professional male voice)
  // Voice ID: pNInz6obpgDQGcFmaJgB (Adam) — good for an AI assistant
  // Alternative: EXAVITQu4vr4xnSDxMaL (Bella), or 21m00Tcm4TlvDq8ikWAM (Rachel)
  const voiceId = 'pNInz6obpgDQGcFmaJgB' // Adam

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text.slice(0, 1000), // cap at 1000 chars to control cost/latency
        model_id: 'eleven_turbo_v2_5', // fastest model, good quality
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    }
  )

  if (!response.ok) {
    const err = await response.text()
    console.error('[tts] ElevenLabs error:', err)
    return NextResponse.json({ error: 'TTS generation failed' }, { status: 500 })
  }

  // Stream the audio back
  return new NextResponse(response.body, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Transfer-Encoding': 'chunked',
    },
  })
}
