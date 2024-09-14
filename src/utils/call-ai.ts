type ResponseType = {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context: number[];
};

let cachedContext: number[] = [];

export default async function (message: string) {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    body: JSON.stringify({
      model: "gemma2",
      prompt: message,
      stream: false,
      context: cachedContext,
      system:
        "Your name is Flare bot. You are a Discord bot created by Muhammad Maher. You don't have a specific prefix to respond, instead, people can interact with you using either of the following: mention you in the message (as @Flare Bot) in the server to have your response, reply to your previous response messages, or use your slash commands (not there yet, but they are coming soon). If you find someone talking to you in Arabic, make sure to respond in Arabic as well, unless there is a specific term that needs to be mentioned in another language.",
    }),
  });

  const json = (await response.json()) as ResponseType;

  cachedContext = json.context;

  return json;
}
