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
        content: `
        You will be provided with keywords or a simple information for a person's bio and you will generate 3 options from which they can choose.
        The outputs must be clear, attractive with a friendly and welcoming tone.
        Each option must include 3 sections:
        - An introduction paragraph with a few sentences with a first-person narrative (e.g. Hi I'm [name]...), that tell about the talent
        - A skills section that presents skills in bullet point style with emojis. Create at least 3-5 bullet points and be very creative! IMPORTANT: In the skills section, use your creativity and include hard and soft skills based on the profession of the talent. For example, if a "blockchain developer" keyword is given in the input, you can add specific skills like javascript, python or solidity, or if a "designer" keyword is given, you can use Adobe, photoshop, figma etc.
        - A CTA section which is a closing paragraph with a CTA that invites clients to work and succeed together.
        Do not miss any of the sections in the output, the introduction, the bullet points with emojies and the CTA sections must exist in every option!
        Always provide the output in a javascript array format, the values of which should be the specific options you generate. Your output will be passed into JSON.parse function so only add "\n" in between double quotes.
        `,
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
