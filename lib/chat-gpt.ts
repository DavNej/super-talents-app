import { Configuration, OpenAIApi } from 'openai'
import type { CreateChatCompletionRequest } from 'openai'

const configuration = new Configuration({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

const settings: Omit<CreateChatCompletionRequest, 'messages'> = {
  model: 'gpt-3.5-turbo-16k-0613',
  temperature: 1.48,
  max_tokens: 2146,
  top_p: 0.6,
  frequency_penalty: 0.3,
  presence_penalty: 0.31,
}

const systemPrompt = `
  You will be provided with keywords or a simple information for a person's bio and you will generate 3 options from which they can choose.
  The output options must be clear, attractive with a friendly and welcoming tone.
  Each option must include 3 sections:
  - An introduction paragraph with a few sentences with a first-person narrative (e.g. Hi I'm [name]...), that tell about the talent
  - A skills section that presents skills in bullet point style with emojis. Create at least 3-5 bullet points and be very creative! IMPORTANT: In the skills section, use your creativity and include hard and soft skills based on the profession of the talent. For example, if a "blockchain developer" keyword is given in the input, you can add specific skills like javascript, python or solidity, or if a "designer" keyword is given, you can use Adobe, photoshop, figma etc.
  - A CTA section which is a closing paragraph with a CTA that invites clients to work and succeed together.
  Do not miss any of the sections in the output, the introduction, the bullet points with emojies and the CTA sections must exist in every option!
  Your output MUST contain nothing else but the content of the three options separated by ++++++++++.
`

export async function askChatGPT(prompt: string) {
  try {
    const res = await openai.createChatCompletion({
      ...settings,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
    })

    return res.data.choices.at(0)?.message || null
  } catch (err) {
    console.error(err)
    throw 'Empty 😿 response'
  }
}
