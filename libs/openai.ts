import { Configuration, OpenAIApi } from "openai"

export const useOpenAI = (): OpenAIApi => {
  const config = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  })

  return new OpenAIApi(config)
}
