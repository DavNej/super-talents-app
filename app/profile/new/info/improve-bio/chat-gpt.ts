import type {
  ChatCompletionRequestMessage,
  ChatCompletionResponseMessage,
} from 'openai'
import { Configuration, OpenAIApi } from 'openai'

export type MessageHistory = Array<ChatCompletionRequestMessage>

const configuration = new Configuration({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export async function askGPT(
  prompt: string
): Promise<ChatCompletionResponseMessage> {
  const res = await openai.createChatCompletion({
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

  const responseMessage = res.data.choices[0].message

  if (responseMessage) {
    return responseMessage satisfies ChatCompletionResponseMessage
  }

  throw new Error('Empty GPT response')
}
