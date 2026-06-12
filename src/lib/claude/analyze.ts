import Anthropic from '@anthropic-ai/sdk'
import { MASTER_PROMPT } from '../prompts/master'
import { buildFootballPrompt } from '../prompts/football'
import { buildTennisPrompt } from '../prompts/tennis'
import { buildBasketPrompt } from '../prompts/basket'
import type { AnalysisInput } from '../types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

function buildUserPrompt(input: AnalysisInput): string {
  switch (input.sport) {
    case 'football': return buildFootballPrompt(input)
    case 'tennis':   return buildTennisPrompt(input)
    case 'basket':   return buildBasketPrompt(input)
  }
}

export async function streamAnalysis(input: AnalysisInput): Promise<ReadableStream<Uint8Array>> {
  const model = process.env.CLAUDE_MODEL || 'claude-sonnet-4-6'
  const userPrompt = buildUserPrompt(input)
  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      try {
        const stream = anthropic.messages.stream({
          model,
          max_tokens: 4096,
          system: MASTER_PROMPT,
          messages: [{ role: 'user', content: userPrompt }],
        })

        for await (const text of stream.textStream) {
          controller.enqueue(encoder.encode(text))
        }

        controller.close()
      } catch (error) {
        controller.error(error)
      }
    },
  })
}
