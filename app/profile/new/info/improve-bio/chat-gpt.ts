import type {
  ChatCompletionRequestMessage,
  ChatCompletionResponseMessage,
} from 'openai'
import { Configuration, OpenAIApi } from 'openai'

import type { ApiError } from '@/lib/error-utils'
import { parseApiError } from '@/lib/error-utils'

export type MessageHistory = Array<ChatCompletionRequestMessage>

const configuration = new Configuration({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export interface AskGPTResponse {
  message: ChatCompletionResponseMessage | null
  error: ApiError | null
}

export async function askGPT(prompt: string): Promise<AskGPTResponse> {
  try {
    const defaultResponse = {
      message: null,
      error: null,
    }

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an excellent talent advocate and mentor. You will help talents with creating an extraordinarily attractive bio for their profiles based on their skills and the basic information they provide. The bio must be concise and clear. Make it bullet point style with emojis. The user will provide you with keywords or a simple bio and you will generate 3 options from which they can select.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const responseMessage = response.data.choices[0].message

    if (!responseMessage)
      return {
        ...defaultResponse,
        error: { message: 'AI Service not available for the moment' },
      }

    return { message: responseMessage, error: null }
  } catch (_error) {
    const error = parseApiError(_error)
    return { error, message: null }
  }
}
