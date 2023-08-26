import { openai, settings, systemPrompt } from './config'

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
