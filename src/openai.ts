import * as vscode from 'vscode';
import fetch from 'node-fetch';

export async function sendMessageToGPT(prompt: string): Promise<string> {
  const apiKey = vscode.workspace.getConfiguration().get<string>('puregpt.openaiApiKey');

  if (!apiKey) {
    return '❌ OpenAI API 키가 설정되지 않았습니다. settings.json에서 puregpt.openaiApiKey 값을 설정하세요.';
  }

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    const data = await res.json();
    return data.choices?.[0]?.message?.content || '⚠️ 응답이 비어 있습니다';
  } catch (err: any) {
    return `❌ 에러 발생: ${err.message}`;
  }
}
