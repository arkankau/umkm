import 'dotenv/config';
import {
  GoogleGenAI,
} from '@google/genai';

async function promptHTMLContent(htmlCode: string): Promise<string> {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "AIzaSyCIhllWKPJ8yfnYdTQT20rJG1rTf1BsAjo",
  });
  const tools = [
    {
      googleSearch: {
      }
    },
  ];
  const config = {
    thinkingConfig: {
      thinkingBudget: -1,
    },
    tools,
  };
  const model = 'gemini-2.5-pro';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `INSERT_INPUT_HERE`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  
  let responseText = '';
  for await (const chunk of response) {
    responseText += chunk.text;
  }
}

export default promptHTMLContent;