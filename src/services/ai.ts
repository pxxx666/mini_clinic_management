const API_KEY = 'sk-77e89a64a59d491889c342a523cd3fa3';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

export const streamChat = async (
  userInput: string,
  onChunk: (chunk: string) => void,
  signal: AbortSignal,
) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content:
            '你是一个专业的医生助手，请根据患者描述的症状提供专业的建议。记住：1. 保持专业性 2. 给出具体建议 3. 提醒必要的注意事项 4. 建议是否需要就医',
        },
        {
          role: 'user',
          content: userInput,
        },
      ],
      stream: true,
    }),
    signal,
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ') && line !== 'data: [DONE]') {
        try {
          const data = JSON.parse(line.slice(6));
          const content = data.choices[0]?.delta?.content;
          if (content) {
            onChunk(content);
          }
        } catch (e) {
          console.error('Error parsing chunk:', e);
        }
      }
    }
  }
};
