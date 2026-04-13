import OpenAI from "openai";

let _deepseek: OpenAI | null = null;

export default function getDeepseek(): OpenAI {
  if (!_deepseek) {
    _deepseek = new OpenAI({
      baseURL: "https://api.deepseek.com/v1",
      apiKey: process.env.DEEPSEEK_API_KEY || "sk-placeholder",
    });
  }
  return _deepseek;
}
