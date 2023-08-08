import type { ChatCompletionResponseMessage } from 'openai'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export async function askGPT(
  prompt: string
): Promise<ChatCompletionResponseMessage> {
  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo-16k-0613',
    temperature: 1.48,
    max_tokens: 2146,
    top_p: 0.6,
    frequency_penalty: 0.3,
    presence_penalty: 0.31,
    messages: [
      {
        role: 'system',
        content: `You are an excellent talent advocate and mentor. You will help talents with creating an extraordinarily attractive bio for their profiles based on their skills and the basic information they provide. The bio must be clear and attractive with an introductory short paragraph and then present skills in bullet point style with emojis. The user will provide you with keywords or a simple bio and you will generate 3 options from which they can choose. Always provide the output in a javascript array format the values of which should be the specific options you generate. Your output will be passed into JSON.parse function so only add "\\n" in between double quotes.`,
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
