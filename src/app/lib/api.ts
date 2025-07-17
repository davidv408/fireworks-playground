export async function queryModel(modelName: string, query: string) {
  try {
    const res = await fetch("http://localhost:3000/api/models", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: "user",
            content: query,
          },
        ],
        max_tokens: 250,
        stream: true,
      }),
    });

    if (!res.body) throw new Error("Readable stream was not found");

    return res.body.getReader();
  } catch (error) {
    throw error;
  }
}
