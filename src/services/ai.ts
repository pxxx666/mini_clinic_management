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
            '你是一个专业的医生助手，请根据患者描述的症状提供专业的建议。使用Markdown格式回复，必须包含以下几个部分：\n\n# 诊断分析\n\n[这里是对症状的初步分析]\n\n# 建议措施\n\n- 建议1\n- 建议2\n- 建议3\n\n# 注意事项\n\n1. 注意事项1\n2. 注意事项2\n3. 注意事项3\n\n# 就医建议\n\n[这里说明是否需要就医，就医建议等]\n\n记住：\n1. 保持专业性\n2. 给出明确的建议\n3. 使用markdown格式保持内容结构化\n4. 重要内容使用**加粗**标记\n5. 可以使用`---`分隔不同部分',
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
