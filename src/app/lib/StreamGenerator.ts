export async function* StreamGenerator(
  stream: ReadableStreamDefaultReader<Uint8Array<ArrayBufferLike>>,
) {
  try {
    const decoder = new TextDecoder();
    while (true) {
      const { value, done } = await stream.read();

      if (done) break;

      const text = decoder.decode(value, { stream: true });
      const lines = text
        .split("\n")
        .filter((line) => line.startsWith("data: ") && line !== "data: [DONE]");

      for (const line of lines) {
        const jsonStr = line.replace(/^data:\s*/, "").trim(); // Remove 'data: ' prefix
        const parsed = JSON.parse(jsonStr);

        const deltaContent = parsed.choices?.[0]?.delta?.content;
        const completionTokens = parsed.usage?.completion_tokens;

        yield { deltaContent, completionTokens };
      }
    }
  } catch (error) {
    console.warn(error);
  }
}
