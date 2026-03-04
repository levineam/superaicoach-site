import { ElevenLabsClient } from 'elevenlabs'
import { NextRequest } from 'next/server'

// Voice IDs:
// WWtyH2oxeOp9yZwK8ERD = "Jarvis - Robot" (community voice — use this for the demo)
// pNInz6obpgDQGcFmaJgB = "Adam" (neutral, clear fallback)
// nPczCjzI2devNBz1zQrb = "Brian" (British male alternative)
const VOICE_ID = 'WWtyH2oxeOp9yZwK8ERD' // Jarvis - Robot

// Lazy-initialize so the build doesn't fail when ELEVENLABS_API_KEY is absent
let _client: ElevenLabsClient | null = null
function getClient(): ElevenLabsClient {
  if (!_client) {
    _client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY! })
  }
  return _client
}

export async function POST(request: NextRequest) {
  const { text } = await request.json()

  if (!text?.trim()) {
    return new Response('No text provided', { status: 400 })
  }

  if (!process.env.ELEVENLABS_API_KEY) {
    return new Response('ElevenLabs API key not configured', { status: 503 })
  }

  const client = getClient()
  const audioStream = await client.textToSpeech.convertAsStream(VOICE_ID, {
    text,
    model_id: 'eleven_turbo_v2_5', // lowest latency model (~100–300ms to first byte)
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.0,
      use_speaker_boost: true,
    },
  })

  // Convert the async iterable to a ReadableStream
  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of audioStream) {
          controller.enqueue(chunk)
        }
        controller.close()
      } catch (err) {
        controller.error(err)
      }
    },
  })

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-store',
    },
  })
}
